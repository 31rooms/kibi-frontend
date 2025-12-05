'use client';

import { useState, useEffect, useCallback } from 'react';
import { progressAPI } from '../api/progressAPI';
import type { ProjectedExamScore } from '../api/types';

interface UseProjectedExamScoreReturn {
  data: ProjectedExamScore | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useProjectedExamScore(): UseProjectedExamScoreReturn {
  const [data, setData] = useState<ProjectedExamScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await progressAPI.getProjectedExamScore();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching projected exam score'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
