import apiClient from '@/features/authentication/api/config';
import type { ChangePasswordDto, SuccessResponse, UpdateSubscriptionDto } from '../types/account.types';

/**
 * Account API Service
 * Handles account-related API calls
 */
export const accountAPI = {
  /**
   * Change user password
   * Requires authentication (JWT token automatically added by apiClient interceptor)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<SuccessResponse> {
    try {
      console.log('🔐 API: Calling PATCH /users/me/password');
      console.log('📍 API URL:', apiClient.defaults.baseURL);

      const payload: ChangePasswordDto = {
        currentPassword,
        newPassword,
      };

      const response = await apiClient.patch<SuccessResponse>('/users/me/password', payload);

      console.log('✅ API: Password changed successfully');
      return response.data;
    } catch (error) {
      console.error('❌ API: Password change failed');
      const errorResponse = error as {
        response?: {
          status?: number;
          data?: { message?: string | string[] }
        }
      };
      console.error('Status:', errorResponse.response?.status);
      console.error('Response:', errorResponse.response?.data);

      if (errorResponse.response?.data?.message) {
        const message = errorResponse.response.data.message;
        if (Array.isArray(message)) {
          throw new Error(message.join(', '));
        }
        throw new Error(message);
      }
      throw new Error('Failed to change password. Please try again.');
    }
  },

  /**
   * Update user subscription plan
   * Requires authentication (JWT token automatically added by apiClient interceptor)
   */
  async updateSubscription(subscriptionPlan: 'FREE' | 'GOLD' | 'DIAMOND'): Promise<SuccessResponse> {
    try {
      console.log('💳 API: Calling PATCH /users/me');
      console.log('📍 API URL:', apiClient.defaults.baseURL);
      console.log('📦 Payload:', { subscriptionPlan });

      const payload: UpdateSubscriptionDto = {
        subscriptionPlan,
      };

      const response = await apiClient.patch<SuccessResponse>('/users/me', payload);

      console.log('✅ API: Subscription updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ API: Subscription update failed');
      const errorResponse = error as {
        response?: {
          status?: number;
          data?: { message?: string | string[] }
        }
      };
      console.error('Status:', errorResponse.response?.status);
      console.error('Response:', errorResponse.response?.data);

      if (errorResponse.response?.data?.message) {
        const message = errorResponse.response.data.message;
        if (Array.isArray(message)) {
          throw new Error(message.join(', '));
        }
        throw new Error(message);
      }
      throw new Error('Failed to update subscription. Please try again.');
    }
  },
};
