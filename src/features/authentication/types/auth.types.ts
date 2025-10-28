// Authentication Types

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM',
}

export interface LoginFormData {
  username: string; // Used as email for backend
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  email: string;
  phone: string;
  password: string;
  desiredCareer: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

// DTOs matching backend
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  desiredCareer: string;
  theme?: Theme;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  profilePhotoUrl?: string;
  desiredCareer?: string | { _id: string; name: string; category: string };
  role?: string;
  subscriptionPlan?: string;
  emailVerified?: boolean;
  onboardingCompleted?: boolean;
  diagnosticCompleted?: boolean;
  profileComplete?: boolean;
  theme: Theme;
  referralCode?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Career {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CareersResponse {
  careers: Career[];
  total: number;
  page: string;
  limit: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface LogoutDto {
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface VerifyEmailDto {
  token: string;
}

export interface SuccessResponse {
  message: string;
}

// Social login providers
export type SocialProvider = 'google' | 'apple' | 'facebook';
