import apiClient from './config';
import type {
  LoginDto,
  RegisterDto,
  User,
  Career,
  CareersResponse,
  AuthResponse,
  RefreshTokenDto,
  LogoutDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  SuccessResponse,
  Theme,
} from '../types/auth.types';

// API functions
export const authAPI = {
  /**
   * Login user with email and password
   */
  async loginUser(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('🔐 API: Calling POST /auth/login');
      console.log('📍 API URL:', apiClient.defaults.baseURL);

      const payload: LoginDto = { email, password };
      console.log('📦 Request payload:', { email, password: '***HIDDEN***' });

      const response = await apiClient.post<AuthResponse>('/auth/login', payload);

      console.log('✅ API: Login successful, received tokens');
      return response.data;
    } catch (error) {
      console.error('❌ API: Login failed');
      const errorResponse = error as { response?: { status?: number; data?: { message?: string } } };
      console.error('Status:', errorResponse.response?.status);
      console.error('Response:', errorResponse.response?.data);

      if (errorResponse.response?.data?.message) {
        throw new Error(errorResponse.response.data.message);
      }
      throw new Error('Failed to login. Please check your credentials.');
    }
  },

  /**
   * Register a new user
   */
  async registerUser(data: RegisterDto): Promise<AuthResponse> {
    try {
      console.log('📝 API: Calling POST /auth/register');
      console.log('📍 API URL:', apiClient.defaults.baseURL);
      console.log('📦 Request payload:', {
        ...data,
        password: '***HIDDEN***'
      });

      const response = await apiClient.post<AuthResponse>('/auth/register', data);

      console.log('✅ API: Registration successful, received tokens');
      return response.data;
    } catch (error) {
      console.error('❌ API: Registration failed');
      const errorResponse = error as { response?: { status?: number; data?: { message?: string | string[] } } };
      console.error('Status:', errorResponse.response?.status);
      console.error('Response:', errorResponse.response?.data);

      if (errorResponse.response?.data?.message) {
        if (Array.isArray(errorResponse.response.data.message)) {
          throw new Error(errorResponse.response.data.message.join(', '));
        }
        throw new Error(errorResponse.response.data.message);
      }
      throw new Error('Failed to register. Please try again.');
    }
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const response = await apiClient.post<{ access_token: string }>('/auth/refresh', {
        refreshToken: refreshToken,
      } as RefreshTokenDto);

      return response.data;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  },

  /**
   * Logout user
   */
  async logoutUser(refreshToken: string): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {
        refreshToken: refreshToken,
      } as LogoutDto);
    } catch (error) {
      // Even if logout fails on server, we clear local storage
      console.error('Logout error:', error);
    }
  },

  /**
   * Get available careers (for registration)
   */
  async getCareers(): Promise<Career[]> {
    try {
      console.log('🔄 Fetching careers from API...');
      const response = await apiClient.get<CareersResponse>('/careers');
      console.log('✅ Careers fetched successfully:', response.data);

      // Extract careers array from response object
      return response.data.careers || [];
    } catch (error) {
      console.error('❌ Failed to fetch careers:', error);
      const errorResponse = error as { response?: { data?: unknown }; message?: string };
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error details:', errorResponse.response?.data || errorMessage);
      return [];
    }
  },

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<SuccessResponse> {
    try {
      console.log('📧 API: Calling POST /auth/forgot-password');
      console.log('📍 API URL:', apiClient.defaults.baseURL);
      console.log('📦 Email:', email);

      const payload: ForgotPasswordDto = { email };
      const response = await apiClient.post<SuccessResponse>('/auth/forgot-password', payload);

      console.log('✅ API: Password reset email request successful');
      return response.data;
    } catch (error) {
      console.error('❌ API: Forgot password failed');
      const errorResponse = error as { response?: { status?: number; data?: { message?: string } } };
      console.error('Status:', errorResponse.response?.status);
      console.error('Response:', errorResponse.response?.data);

      if (errorResponse.response?.data?.message) {
        throw new Error(errorResponse.response.data.message);
      }
      throw new Error('Failed to request password reset. Please try again.');
    }
  },

  /**
   * Reset password using token
   */
  async resetPassword(token: string, newPassword: string): Promise<SuccessResponse> {
    try {
      console.log('🔑 API: Calling POST /auth/reset-password');
      console.log('📍 API URL:', apiClient.defaults.baseURL);

      const payload: ResetPasswordDto = { token, newPassword };
      const response = await apiClient.post<SuccessResponse>('/auth/reset-password', payload);

      console.log('✅ API: Password reset successful');
      return response.data;
    } catch (error) {
      console.error('❌ API: Reset password failed');
      const errorResponse = error as { response?: { status?: number; data?: { message?: string } } };
      console.error('Status:', errorResponse.response?.status);
      console.error('Response:', errorResponse.response?.data);

      if (errorResponse.response?.data?.message) {
        throw new Error(errorResponse.response.data.message);
      }
      throw new Error('Failed to reset password. The link may be expired.');
    }
  },

  /**
   * Verify email using token
   */
  async verifyEmail(token: string): Promise<SuccessResponse> {
    try {
      console.log('✉️ API: Calling POST /auth/verify-email');
      console.log('📍 API URL:', apiClient.defaults.baseURL);

      const payload: VerifyEmailDto = { token };
      const response = await apiClient.post<SuccessResponse>('/auth/verify-email', payload);

      console.log('✅ API: Email verification successful');
      return response.data;
    } catch (error) {
      console.error('❌ API: Email verification failed');
      const errorResponse = error as { response?: { status?: number; data?: { message?: string } } };
      console.error('Status:', errorResponse.response?.status);
      console.error('Response:', errorResponse.response?.data);

      if (errorResponse.response?.data?.message) {
        throw new Error(errorResponse.response.data.message);
      }
      throw new Error('Failed to verify email. The link may be expired.');
    }
  },

  /**
   * Update user profile (including theme)
   */
  async updateProfile(updates: { theme?: Theme }): Promise<User> {
    try {
      const response = await apiClient.patch<User>('/users/me', updates);
      return response.data;
    } catch (error) {
      const errorResponse = error as { response?: { status?: number; data?: { message?: string } } };

      if (errorResponse.response?.data?.message) {
        throw new Error(errorResponse.response.data.message);
      }
      throw new Error('Failed to update profile. Please try again.');
    }
  },
};