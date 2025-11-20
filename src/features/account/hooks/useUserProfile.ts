import { useState, useEffect, useCallback } from 'react';
import { accountAPI } from '../api/account-service';
import { useAuth } from '@/features/authentication';
import type { User } from '@/features/authentication/types/auth.types';

/**
 * Hook to fetch and manage user profile data
 * Syncs with AuthContext to keep user data updated
 */
export const useUserProfile = () => {
  const { user: contextUser, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user profile from API and update context
   */
  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userData = await accountAPI.getUserProfile();

      // Update auth context with fresh data
      updateUser(userData);

      return userData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      console.error('Failed to fetch user profile:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedUser = await accountAPI.updateProfile(profileData);

      // Update auth context with updated data
      updateUser(updatedUser);

      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      console.error('Failed to update user profile:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  // Don't auto-fetch on mount - let components decide when to fetch
  // This prevents overwriting local changes (like avatar selection)
  // with stale backend data on every component mount

  return {
    user: contextUser,
    isLoading,
    error,
    fetchUserProfile,
    updateProfile,
  };
};
