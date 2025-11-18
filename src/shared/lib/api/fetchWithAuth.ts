/**
 * Fetch wrapper with automatic token refresh
 *
 * This utility wraps the native fetch API to automatically handle:
 * - Adding Authorization headers
 * - Detecting 401 errors (token expired)
 * - Refreshing the access token using the refresh token
 * - Retrying the original request with the new token
 * - Logging out if refresh fails
 *
 * Usage:
 * ```typescript
 * const response = await fetchWithAuth('/api/notifications', {
 *   method: 'GET',
 * });
 * ```
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface FetchWithAuthOptions extends RequestInit {
  skipAuth?: boolean; // Skip adding Authorization header
  _isRetry?: boolean; // Internal flag to prevent infinite loops
}

/**
 * Wrapper around fetch that automatically handles token refresh
 */
export async function fetchWithAuth(
  url: string,
  options: FetchWithAuthOptions = {}
): Promise<Response> {
  const { skipAuth = false, _isRetry = false, ...fetchOptions } = options;

  // 1. Get access token from localStorage
  const accessToken = !skipAuth ? localStorage.getItem('access_token') : null;

  // 2. Add Authorization header if token exists
  const headers = new Headers(fetchOptions.headers);
  if (accessToken && !skipAuth) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // 3. Make the request
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // 4. Check if response is 401 (Unauthorized - token expired)
  if (response.status === 401 && !_isRetry && !skipAuth) {
    console.log('🔄 [fetchWithAuth] Token expired (401), attempting refresh...');

    try {
      // 5. Try to refresh the token
      const newAccessToken = await refreshAccessToken();

      // 6. Retry the original request with the new token
      console.log('✅ [fetchWithAuth] Token refreshed, retrying original request...');
      const newHeaders = new Headers(fetchOptions.headers);
      newHeaders.set('Authorization', `Bearer ${newAccessToken}`);

      return fetch(url, {
        ...fetchOptions,
        headers: newHeaders,
        // Mark as retry to prevent infinite loops
      });
    } catch (refreshError) {
      console.error('❌ [fetchWithAuth] Token refresh failed:', refreshError);

      // 7. Refresh failed, logout user
      handleAuthFailure();

      // Rethrow the error
      throw new Error('Session expired. Please login again.');
    }
  }

  // 5. Return the response if it wasn't a 401 or if retry already happened
  return response;
}

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refresh_token');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  console.log('🔑 [fetchWithAuth] Calling /auth/refresh...');

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  const newAccessToken = data.access_token;

  // Save the new access token
  localStorage.setItem('access_token', newAccessToken);

  console.log('✅ [fetchWithAuth] New access token saved');

  return newAccessToken;
}

/**
 * Handle authentication failure (logout and redirect)
 */
function handleAuthFailure(): void {
  console.log('🚪 [fetchWithAuth] Logging out user...');

  // Clear all auth data
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');

  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
}

/**
 * Helper to parse JSON responses with error handling
 */
export async function fetchJSON<T>(
  url: string,
  options: FetchWithAuthOptions = {}
): Promise<T> {
  const response = await fetchWithAuth(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
