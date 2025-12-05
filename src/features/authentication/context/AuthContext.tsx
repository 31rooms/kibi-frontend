'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../api/auth-service';
import type { User, AuthResponse, RegisterDto } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (googleIdToken: string) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('access_token');

        if (storedUser && accessToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleAuthSuccess = useCallback((response: AuthResponse) => {
    // Store tokens and user data
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.user));

    setUser(response.user);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.loginUser(email, password);
      handleAuthSuccess(response);

      // Redirect based on diagnosticCompleted status
      if (response.user.diagnosticCompleted) {
        router.push('/home');
      } else {
        router.push('/form-diagnostic-test');
      }
    } catch (error) {
      throw error; // Re-throw to handle in component
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthSuccess, router]);

  const loginWithGoogle = useCallback(async (googleIdToken: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.loginWithGoogle(googleIdToken);
      handleAuthSuccess(response);

      // Redirect based on diagnosticCompleted status
      // For Google login, new users will have diagnosticCompleted = false
      if (response.user.diagnosticCompleted) {
        router.push('/home');
      } else {
        router.push('/form-diagnostic-test');
      }
    } catch (error) {
      throw error; // Re-throw to handle in component
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthSuccess, router]);

  const register = useCallback(async (data: RegisterDto) => {
    try {
      setIsLoading(true);
      const response = await authAPI.registerUser(data);
      handleAuthSuccess(response);

      // Redirect to onboarding after successful registration
      router.push('/onboarding');
    } catch (error) {
      throw error; // Re-throw to handle in component
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthSuccess, router]);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        await authAPI.logoutUser(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');

      setUser(null);

      // Redirect to login
      router.push('/auth/login');
    }
  }, [router]);

  const refreshToken = useCallback(async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refresh_token');

      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authAPI.refreshAccessToken(storedRefreshToken);
      localStorage.setItem('access_token', response.access_token);
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      await logout();
    }
  }, [logout]);

  const updateUser = useCallback((updatedUser: User) => {
    // Create a new object to ensure React detects the change
    const newUser = { ...updatedUser };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, []); // Remove user dependency to avoid unnecessary re-renders

  // Set up token refresh interval
  useEffect(() => {
    if (!user) return;

    // Refresh token every 10 minutes (access token expires in 15 min)
    const interval = setInterval(() => {
      refreshToken();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, refreshToken]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    refreshToken,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}