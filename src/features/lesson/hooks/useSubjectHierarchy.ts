'use client';

import { useState, useEffect, useCallback } from 'react';
import { lessonAPI } from '../api/lesson-service';
import type { SubjectHierarchyResponse } from '../types/lesson.types';

/**
 * Return type for useSubjectHierarchy hook
 */
interface UseSubjectHierarchyReturn {
  hierarchy: SubjectHierarchyResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage subject hierarchy data
 *
 * Fetches subject hierarchy including topics and lessons from the API
 * Provides loading states, error handling, and refetch capability
 *
 * @param subjectId - The ID of the subject to fetch hierarchy for
 * @returns Object with hierarchy data, loading state, error, and refetch function
 */
export function useSubjectHierarchy(subjectId: string): UseSubjectHierarchyReturn {
  const [hierarchy, setHierarchy] = useState<SubjectHierarchyResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHierarchy = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await lessonAPI.getSubjectHierarchy(subjectId);
      setHierarchy(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load subject hierarchy';
      setError(errorMessage);
      console.error('useSubjectHierarchy error:', err);
      setHierarchy(null);
    } finally {
      setIsLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    if (subjectId) {
      fetchHierarchy();
    }
  }, [subjectId, fetchHierarchy]);

  return {
    hierarchy,
    isLoading,
    error,
    refetch: fetchHierarchy,
  };
}
