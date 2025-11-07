/**
 * Account Feature Types
 * TypeScript types for account management
 */

/**
 * DTO for changing password
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

/**
 * Response for successful password change
 */
export interface SuccessResponse {
  message: string;
}

/**
 * DTO for updating subscription plan
 */
export interface UpdateSubscriptionDto {
  subscriptionPlan: 'FREE' | 'GOLD' | 'DIAMOND';
}
