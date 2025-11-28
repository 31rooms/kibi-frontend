'use client';

import { useState, useEffect, useCallback } from 'react';
import { dailyTestAPI } from '@/features/daily-test/api/dailyTestAPI';
import type { WeeklyStatusResponse, WeeklyDayStatus } from '@/features/daily-test/api/types';

interface UseWeeklyStatusReturn {
  weekDays: WeeklyDayStatus[];
  currentStreak: number;
  maxStreak: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch weekly status for the calendar display
 *
 * Returns:
 * - weekDays: Array of 7 days (Monday to Sunday) with completion status
 * - currentStreak: Current consecutive days streak
 * - maxStreak: Maximum streak achieved
 * - isLoading: Loading state
 * - error: Error message if any
 * - refetch: Function to manually refetch data
 */
export function useWeeklyStatus(): UseWeeklyStatusReturn {
  const [weekDays, setWeekDays] = useState<WeeklyDayStatus[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeeklyStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response: WeeklyStatusResponse = await dailyTestAPI.getWeeklyStatus();

      setWeekDays(response.weekDays);
      setCurrentStreak(response.currentStreak);
      setMaxStreak(response.maxStreak);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load weekly status';
      setError(errorMessage);
      console.error('useWeeklyStatus error:', err);

      // Set default values on error
      setWeekDays([]);
      setCurrentStreak(0);
      setMaxStreak(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeeklyStatus();
  }, [fetchWeeklyStatus]);

  return {
    weekDays,
    currentStreak,
    maxStreak,
    isLoading,
    error,
    refetch: fetchWeeklyStatus,
  };
}
