'use client';

import { useState, useEffect, useCallback } from 'react';
import { progressAPI } from '../api/progressAPI';
import type { ActivityTimeChartResponse, ActivityTimeChartDataPoint } from '../api/types';

export type Period = 'today' | 'week' | 'month';

interface UseActivityTimeChartResult {
  data: ActivityTimeChartDataPoint[];
  totalMinutes: number;
  averagePerDay: number;
  period: Period;
  setPeriod: (period: Period) => void;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener datos de tiempo de actividad para gráficos
 * @param initialPeriod - Período inicial ('today' | 'week' | 'month')
 */
export function useActivityTimeChart(initialPeriod: Period = 'week'): UseActivityTimeChartResult {
  const [data, setData] = useState<ActivityTimeChartDataPoint[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [averagePerDay, setAveragePerDay] = useState(0);
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await progressAPI.getActivityTimeChart(period);
      setData(response.data);
      setTotalMinutes(response.totalMinutes);
      setAveragePerDay(response.averagePerDay);
    } catch (err) {
      setError(err as Error);
      console.error('[useActivityTimeChart] Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    totalMinutes,
    averagePerDay,
    period,
    setPeriod,
    isLoading,
    error,
    refetch: fetchData,
  };
}
