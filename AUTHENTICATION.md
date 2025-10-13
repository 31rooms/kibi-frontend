# Authentication Integration Documentation

This document describes the authentication system integration between the Kibi frontend (Next.js) and backend (NestJS).

## Overview

The authentication system uses JWT tokens with the following flow:
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens
- **Token Storage**: Tokens stored in browser localStorage

## Architecture

### Backend API Endpoints (NestJS)

Running at `http://localhost:3000` (configurable via `NEXT_PUBLIC_API_URL`)

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "desiredCareer": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profileComplete": false,
    ...
  }
}
```

#### POST `/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** Same as registration

#### POST `/auth/refresh`
Refresh the access token using a refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc..."
}
```

#### POST `/auth/logout`
Invalidate a refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGc..."
}
```

### Frontend Architecture

#### File Structure

```
kibi-frontend/
├── lib/
│   ├── api/
│   │   ├── config.ts          # Axios instance and interceptors
│   │   └── auth.ts            # Authentication API functions
│   ├── context/
│   │   └── AuthContext.tsx    # Global auth state management
│   └── utils/
│       └── storage.ts         # Token storage utilities
├── components/
│   ├── ui/
│   │   └── Alert.tsx          # Error/success messages
│   └── ProtectedRoute.tsx     # Route protection wrapper
└── app/
    ├── auth/
    │   ├── login/
    │   │   └── page.tsx       # Login page
    │   └── register/
    │       └── page.tsx       # Registration page
    └── layout.tsx             # Root layout with AuthProvider
```

#### Key Components

**1. API Configuration (`lib/api/config.ts`)**
- Creates axios instance with base URL
- Request interceptor: Adds JWT token to headers
- Response interceptor: Handles token refresh on 401 errors

**2. Auth API (`lib/api/auth.ts`)**
- `loginUser(email, password)` - Login function
- `registerUser(data)` - Registration function
- `refreshAccessToken(token)` - Token refresh
- `logoutUser(token)` - Logout function

**3. Auth Context (`lib/context/AuthContext.tsx`)**
- Provides global authentication state
- Functions: `login()`, `register()`, `logout()`
- State: `user`, `isAuthenticated`, `isLoading`
- Auto-refresh tokens every 10 minutes

**4. Storage Utilities (`lib/utils/storage.ts`)**
- `setTokens()` - Store access and refresh tokens
- `getAccessToken()` - Retrieve access token
- `getRefreshToken()` - Retrieve refresh token
- `clearTokens()` - Remove all tokens

**5. Protected Route (`components/ProtectedRoute.tsx`)**
- Wraps pages requiring authentication
- Redirects to login if not authenticated
- Shows loading state while checking auth

## Usage

### Using Authentication in Pages

```tsx
'use client';

import { useAuth } from '@/lib/context/AuthContext';

export default function MyPage() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome {user?.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting Routes

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

### Making Authenticated API Calls

The axios instance automatically adds the JWT token to requests:

```tsx
import apiClient from '@/lib/api/config';

// Token is automatically added to Authorization header
const response = await apiClient.get('/users/profile');
```

## Configuration

### Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Security Features

1. **Password Requirements**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number

2. **Token Security**
   - Access tokens expire in 15 minutes
   - Refresh tokens expire in 7 days
   - Automatic token refresh before expiration
   - Tokens cleared on logout

3. **Input Validation**
   - Email format validation
   - Password complexity validation
   - Required field validation
   - Phone number format validation

4. **Error Handling**
   - User-friendly error messages
   - Network error detection
   - Invalid credentials handling
   - Duplicate account detection

## User Flow

### Registration Flow

1. User fills registration form (email, name, phone, password)
2. Frontend validates input
3. Frontend calls `/auth/register`
4. Backend creates user account
5. Backend returns tokens and user data
6. Frontend stores tokens in localStorage
7. Frontend redirects to `/onboarding`

### Login Flow

1. User enters email and password
2. Frontend validates input
3. Frontend calls `/auth/login`
4. Backend verifies credentials
5. Backend returns tokens and user data
6. Frontend stores tokens in localStorage
7. Frontend redirects to `/onboarding` or `/dashboard`

### Token Refresh Flow

1. Access token expires (15 minutes)
2. API request returns 401 error
3. Axios interceptor catches 401
4. Interceptor calls `/auth/refresh` with refresh token
5. Backend returns new access token
6. Original request retries with new token

### Logout Flow

1. User clicks logout button
2. Frontend calls `/auth/logout` with refresh token
3. Backend invalidates refresh token
4. Frontend clears localStorage
5. Frontend redirects to `/auth/login`

## Known Issues & TODOs

1. **Hardcoded Career ID**
   - Currently using placeholder: `507f1f77bcf86cd799439011`
   - TODO: Fetch careers from `/careers` endpoint
   - TODO: Add career selection to registration form

2. **Social Login**
   - Google, Apple, Facebook buttons are placeholders
   - TODO: Implement OAuth integration when backend ready

3. **Profile Photo Upload**
   - Camera icon is placeholder
   - TODO: Implement photo upload functionality

4. **Forgot Password**
   - Link redirects to `/auth/forgot-password`
   - TODO: Implement password reset flow

5. **Remember Me**
   - Checkbox exists but doesn't affect token storage
   - TODO: Implement session vs persistent storage

## Testing Checklist

- [x] Register new user successfully
- [x] Validate registration form fields
- [x] Show error for duplicate email
- [x] Login with valid credentials
- [x] Show error for invalid credentials
- [x] Tokens stored in localStorage
- [x] User data available in AuthContext
- [x] Loading states during API calls
- [x] Redirect after successful auth
- [ ] Token auto-refresh works
- [ ] Logout clears tokens
- [ ] Protected routes redirect to login
- [ ] Return URL works after login

## Troubleshooting

### "Network Error" or "Connection Refused"

**Cause:** Backend is not running or API URL is incorrect

**Solution:**
1. Start backend: `cd kibi-backend && npm run start:dev`
2. Verify backend is running on `http://localhost:3000`
3. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`

### "Invalid Credentials" Error

**Cause:** Email or password is incorrect, or user doesn't exist

**Solution:**
1. Verify email is correct
2. Check password meets requirements
3. Try registering a new account

### Tokens Not Persisting

**Cause:** localStorage is disabled or being cleared

**Solution:**
1. Check browser localStorage is enabled
2. Verify no browser extensions clearing storage
3. Check for private/incognito mode

### Infinite Redirect Loop

**Cause:** Protected route can't read auth state

**Solution:**
1. Ensure `AuthProvider` wraps entire app in `layout.tsx`
2. Check localStorage for valid tokens
3. Clear localStorage and login again

## Development Tips

1. **Clear Tokens During Development**
   ```javascript
   // In browser console
   localStorage.clear();
   ```

2. **View Current Tokens**
   ```javascript
   // In browser console
   console.log('Access:', localStorage.getItem('access_token'));
   console.log('Refresh:', localStorage.getItem('refresh_token'));
   ```

3. **Test Token Expiration**
   - Manually modify token expiration in backend
   - Or wait 15 minutes to test auto-refresh

4. **Backend Logging**
   - Check NestJS console for API errors
   - MongoDB logs show database operations

## Additional Resources

- [NestJS Authentication Docs](https://docs.nestjs.com/security/authentication)
- [JWT.io](https://jwt.io/) - Decode and inspect JWT tokens
- [Next.js Client-Side Auth](https://nextjs.org/docs/app/building-your-application/authentication)
