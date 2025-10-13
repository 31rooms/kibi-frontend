# Features - Screaming Architecture Guide

This directory contains all business domain features for the Kibi platform, organized following **Screaming Architecture** principles.

## What is Screaming Architecture?

Screaming Architecture means your codebase structure "screams" what the application does, not what framework it uses. When you look at `/src/features`, you immediately see:

- 🔐 **authentication** - User login, registration, password management
- 🚀 **onboarding** - New user onboarding flow
- 📊 **dashboard** - Student dashboard

Not: "controllers", "services", "models" (technical layers).

## Directory Structure

Each feature follows this standard structure:

```
/src/features/[feature-name]
  /ui                   # UI components specific to this feature
    ComponentName.tsx
  /hooks                # Custom React hooks for feature logic
    useFeatureName.ts
  /api                  # API calls and service layer
    feature-service.ts
  /types                # TypeScript interfaces and types
    feature.types.ts
  /utils                # Feature-specific utilities
    helpers.ts
  /config               # Configuration and constants
    constants.ts
  /context              # React Context (if needed)
    FeatureContext.tsx
  index.ts              # Public API (barrel export)
```

## Current Features

### 🔐 Authentication (`/authentication`)

Complete authentication system including:
- Login, Register, Forgot Password, Reset Password flows
- JWT token management
- AuthContext for global auth state
- Social login UI (Google, Apple, Facebook)
- Form validation utilities

**Public API:**
```typescript
import {
  useAuth,              // Hook for auth operations
  LoginForm,            // Login form component
  RegisterForm,         // Registration form
  AuthLayout,           // Auth page layout
  AuthProvider,         // Context provider
} from '@/features/authentication';
```

**Pages using this feature:**
- `/app/auth/login`
- `/app/auth/register`
- `/app/auth/forgot-password`
- `/app/auth/reset-password`

### 🚀 Onboarding (`/onboarding`)

Interactive onboarding flow for new users:
- Multi-step slide presentation
- Keyboard navigation support
- Progress indicators
- Configurable slides content

**Public API:**
```typescript
import {
  OnboardingLayout,      // Main layout
  OnboardingSheet,       // Bottom sheet component
  useOnboardingFlow,     // Hook for navigation logic
  useKeyboardNav,        // Hook for keyboard controls
} from '@/features/onboarding';
```

**Pages using this feature:**
- `/app/onboarding`

### 📊 Dashboard (`/dashboard`)

Student dashboard interface:
- User profile information
- Course progress tracking
- Placeholder cards for future features

**Public API:**
```typescript
import {
  DashboardLayout,       // Main layout
  DashboardHeader,       // Header with logout
  UserInfoCard,          // User info display
  PlaceholderCard,       // Generic card component
} from '@/features/dashboard';
```

**Pages using this feature:**
- `/app/dashboard`

## How to Create a New Feature

### Step 1: Plan Your Feature

Answer these questions:
1. What business domain does it represent? (e.g., "courses", "exams", "chat")
2. What are the main user actions? (e.g., view courses, take exam, send message)
3. What data does it manage? (e.g., course list, exam results, messages)
4. Does it need authentication? (most likely yes)

### Step 2: Create Feature Structure

```bash
# Replace [feature-name] with your feature (e.g., courses)
mkdir -p src/features/[feature-name]/{ui,hooks,api,types,utils,config}
```

### Step 3: Build From Inside Out

#### 3.1 Define Types (`/types`)

```typescript
// src/features/courses/types/course.types.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
}

export interface CourseListResponse {
  courses: Course[];
  total: number;
}
```

#### 3.2 Create API Service (`/api`)

```typescript
// src/features/courses/api/course-service.ts
import { apiClient } from '@/shared/lib/api/config';
import type { Course, CourseListResponse } from '../types/course.types';

export const courseService = {
  async getAll(): Promise<CourseListResponse> {
    const response = await apiClient.get('/courses');
    return response.data;
  },

  async getById(id: string): Promise<Course> {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },
};
```

#### 3.3 Create Custom Hook (`/hooks`)

```typescript
// src/features/courses/hooks/useCourses.ts
import { useState, useEffect } from 'react';
import { courseService } from '../api/course-service';
import type { Course } from '../types/course.types';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const data = await courseService.getAll();
        setCourses(data.courses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading courses');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  return { courses, isLoading, error };
};
```

#### 3.4 Create UI Components (`/ui`)

```typescript
// src/features/courses/ui/CourseCard.tsx
import { Button } from '@/shared/ui';
import type { Course } from '../types/course.types';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
}

export const CourseCard = ({ course, onEnroll }: CourseCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
      <p className="text-grey-600 mb-4">{course.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-grey-500">{course.progress}% complete</span>
        <Button onClick={() => onEnroll?.(course.id)}>
          Continue
        </Button>
      </div>
    </div>
  );
};
```

```typescript
// src/features/courses/ui/CourseList.tsx
import { useCourses } from '../hooks/useCourses';
import { CourseCard } from './CourseCard';

export const CourseList = () => {
  const { courses, isLoading, error } = useCourses();

  if (isLoading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};
```

#### 3.5 Create Public API (`index.ts`)

```typescript
// src/features/courses/index.ts

// UI Components (public)
export { CourseList } from './ui/CourseList';
export { CourseCard } from './ui/CourseCard';

// Hooks (public)
export { useCourses } from './hooks/useCourses';

// Types (public)
export type { Course, CourseListResponse } from './types/course.types';

// API service is PRIVATE - not exported
// Utils are PRIVATE - not exported
// Config is PRIVATE - not exported
```

### Step 4: Create Route in /app

```typescript
// app/courses/page.tsx
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CourseList } from '@/features/courses';

export default function CoursesPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>
        <CourseList />
      </div>
    </ProtectedRoute>
  );
}
```

### Step 5: Update TypeScript Aliases (if needed)

If you created a new feature, the alias should already work (`@/features/courses`), but verify in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/features/*": ["./src/features/*"]
    }
  }
}
```

## Architecture Rules

### ✅ DO:

1. **Keep features self-contained** - All related code in one place
2. **Use shared UI components** - Import from `@/shared/ui`
3. **Export minimal API** - Only export what's needed externally
4. **Follow the folder structure** - Consistency helps navigation
5. **Write types first** - Define your data structures early
6. **Use custom hooks** - Encapsulate logic away from UI
7. **Add JSDoc comments** - Document complex functions

### ❌ DON'T:

1. **Import from other features** - Features should be independent
   ```typescript
   // ❌ BAD
   import { validateEmail } from '@/features/authentication/utils/validation';

   // ✅ GOOD - Move to shared if needed by multiple features
   import { validateEmail } from '@/shared/lib/utils/validation';
   ```

2. **Export everything** - Keep internals private
   ```typescript
   // ❌ BAD - Exporting internal helpers
   export { formatDate } from './utils/helpers';

   // ✅ GOOD - Only export public API
   export { CourseList } from './ui/CourseList';
   ```

3. **Put business logic in UI components** - Use hooks instead
   ```typescript
   // ❌ BAD
   export const CourseList = () => {
     const [courses, setCourses] = useState([]);
     useEffect(() => {
       fetch('/api/courses').then(/* ... */); // Logic in component
     }, []);
   };

   // ✅ GOOD
   export const CourseList = () => {
     const { courses, isLoading } = useCourses(); // Logic in hook
   };
   ```

4. **Create god features** - Split large features into smaller ones
   - Instead of `/features/learning` with everything
   - Split into `/features/courses`, `/features/lessons`, `/features/quizzes`

5. **Mix feature and shared code** - Keep clear boundaries
   - Feature code in `/src/features/[name]`
   - Shared code in `/src/shared`

## Feature Communication

If two features need to share data:

### Option 1: Use Shared Context (Recommended for Auth)

```typescript
// The authentication feature provides AuthContext
// Other features consume it
import { useAuth } from '@/features/authentication';

export const CourseList = () => {
  const { user } = useAuth(); // Access shared auth state
  // ...
};
```

### Option 2: Lift State to App Level

```typescript
// app/page.tsx
export default function HomePage() {
  const [sharedState, setSharedState] = useState(null);

  return (
    <>
      <FeatureA onUpdate={setSharedState} />
      <FeatureB data={sharedState} />
    </>
  );
}
```

### Option 3: Move to Shared

If multiple features need the same utility:

```bash
# Move from feature to shared
mv src/features/courses/utils/date-formatter.ts src/shared/lib/utils/
```

## Testing Features

1. **Unit tests** - Test hooks and utilities
2. **Component tests** - Test UI components in isolation
3. **Integration tests** - Test feature as a whole
4. **E2E tests** - Test feature in real app context

## Examples to Study

Look at existing features for reference:

- **Simple feature:** `/features/dashboard` - Good starting point
- **Complex feature:** `/features/authentication` - Multiple flows, context, validation
- **Flow feature:** `/features/onboarding` - State management, navigation

## Questions?

If you're unsure:
1. Look at existing features for patterns
2. Ask: "Does this belong to a specific feature or is it truly shared?"
3. Start small - you can always refactor later
4. Follow the principle: "Make it easy to find related code"

---

**Remember:** The goal is to make your codebase "scream" what it does. When someone opens `/src/features`, they should immediately understand your application's purpose. 🎯
