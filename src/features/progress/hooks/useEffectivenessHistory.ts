'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { progressAPI } from '../api/progressAPI';
import type {
  EffectivenessHistoryResponse,
  EffectivenessHistoryPeriod,
  EffectivenessHistorySource
} from '../api/types';

interface ChartDataPoint {
  category: string;
  value: number;
}

interface UseEffectivenessHistoryReturn {
  data: EffectivenessHistoryResponse | null;
  chartData: ChartDataPoint[];
  hasData: boolean;
  isLoading: boolean;
  error: Error | null;
  period: EffectivenessHistoryPeriod;
  setPeriod: (period: EffectivenessHistoryPeriod) => void;
  refetch: () => Promise<void>;
}

export function useEffectivenessHistory(
  initialPeriod: EffectivenessHistoryPeriod = 'week',
  source: EffectivenessHistorySource = 'DAILY_TEST'
): UseEffectivenessHistoryReturn {
  const [data, setData] = useState<EffectivenessHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [period, setPeriod] = useState<EffectivenessHistoryPeriod>(initialPeriod);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await progressAPI.getEffectivenessHistory(period, source);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching effectiveness history'));
    } finally {
      setIsLoading(false);
    }
  }, [period, source]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Transform API response to chart data format
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!data?.subjects || data.subjects.length === 0) return [];

    return data.subjects.map(subject => ({
      category: subject.subjectName,
      value: Math.round(subject.currentEffectiveness * 100) / 100
    }));
  }, [data]);

  // Check if there's meaningful data (at least one subject with data)
  const hasData = useMemo(() => {
    return chartData.length > 0;
  }, [chartData]);

  return {
    data,
    chartData,
    hasData,
    isLoading,
    error,
    period,
    setPeriod,
    refetch: fetchData
  };
}
