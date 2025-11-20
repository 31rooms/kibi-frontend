import apiClient from '@/features/authentication/api/config';
import type { ChangePasswordDto, SuccessResponse, UpdateSubscriptionDto } from '../types/account.types';
import type { User } from '@/features/authentication/types/auth.types';

/**
 * Account API Service
 * Handles account-related API calls
 */
export const accountAPI = {
  /**
   * Get current user profile
   * Requires authentication (JWT token automatically added by apiClient interceptor)
   */
  async getUserProfile(): Promise<User> {
    try {
      console.log('👤 API: Calling GET /users/me');
      console.log('📍 API URL:', apiClient.defaults.baseURL);

      const response = await apiClient.get<User>('/users/me');

      console.log('✅ API: Profile retrieved successfully');
      return response.data;
    } catch (error) {
      console.error('❌ API: Profile retrieval failed');
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
      throw new Error('Failed to retrieve profile. Please try again.');
    }
  },

  /**
   * Update user profile
   * Requires authentication (JWT token automatically added by apiClient interceptor)
   */
  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      console.log('📝 API: Calling PATCH /users/me');
      console.log('📍 API URL:', apiClient.defaults.baseURL);
      console.log('📦 Payload:', profileData);

      const response = await apiClient.patch<User>('/users/me', profileData);

      console.log('✅ API: Profile updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ API: Profile update failed');
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
      throw new Error('Failed to update profile. Please try again.');
    }
  },
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
