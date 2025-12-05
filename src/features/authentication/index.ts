// ============================================
// AUTHENTICATION FEATURE - PUBLIC API
// ============================================

// UI Components
export { LoginForm } from './ui/LoginForm';
export type { LoginFormProps } from './ui/LoginForm';

export { SocialLoginButtons } from './ui/SocialLoginButtons';
export type { SocialLoginButtonsProps } from './ui/SocialLoginButtons';

export { AuthLayout } from './ui/AuthLayout';
export type { AuthLayoutProps } from './ui/AuthLayout';

export { GoogleSignInButton } from './ui/GoogleSignInButton';
export type { GoogleSignInButtonProps } from './ui/GoogleSignInButton';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useLoginForm } from './hooks/useLoginForm';

// Context & Provider
export { AuthProvider } from './context/AuthContext';

// Types
export type * from './types/auth.types';

// Enums (exported as values)
export { Theme } from './types/auth.types';

// API Service (for internal use or specific cases)
export { authAPI } from './api/auth-service';

// Google Sign-In utilities (for advanced use cases)
export {
  initGoogleSignIn,
  isGoogleSignInAvailable,
  revokeGoogleAccess,
} from './utils/googleSignIn';

// Note: internal utils and config are intentionally NOT exported (private to the feature)
