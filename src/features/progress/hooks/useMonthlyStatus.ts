'use client';

import { useState, useEffect, useCallback } from 'react';
import { dailyTestAPI } from '@/features/daily-test/api/dailyTestAPI';
import type { MonthlyStatusResponse } from '@/features/daily-test/api/types';

interface UseMonthlyStatusReturn {
  monthlyStatus: MonthlyStatusResponse | null;
  activeDates: Date[];
  isLoading: boolean;
  error: string | null;
  year: number;
  month: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch monthly status for the calendar display
 *
 * Returns:
 * - monthlyStatus: Raw response from API
 * - activeDates: Array of Date objects for completed days
 * - isLoading: Loading state
 * - error: Error message if any
 * - year/month: Current selected year/month
 * - setYear/setMonth: Functions to change year/month
 * - refetch: Function to manually refetch data
 */
export function useMonthlyStatus(): UseMonthlyStatusReturn {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [monthlyStatus, setMonthlyStatus] = useState<MonthlyStatusResponse | null>(null);
  const [activeDates, setActiveDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await dailyTestAPI.getMonthlyStatus(year, month);
      setMonthlyStatus(response);

      // Convert completedDates strings to Date objects
      const dates = response.completedDates.map((dateStr) => {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d); // month is 0-indexed in JS Date
      });
      setActiveDates(dates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load monthly status';
      setError(errorMessage);
      console.error('useMonthlyStatus error:', err);
      setMonthlyStatus(null);
      setActiveDates([]);
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchMonthlyStatus();
  }, [fetchMonthlyStatus]);

  return {
    monthlyStatus,
    activeDates,
    isLoading,
    error,
    year,
    month,
    setYear,
    setMonth,
    refetch: fetchMonthlyStatus,
  };
}
