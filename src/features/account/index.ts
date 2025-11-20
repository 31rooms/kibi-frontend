/**
 * Account Feature
 * Public API for user account management
 */

export { AccountSection } from './ui/AccountSection';
export { useChangePassword } from './hooks/useChangePassword';
export { useUserProfile } from './hooks/useUserProfile';
export { accountAPI } from './api/account-service';
export type * from './types/account.types';
