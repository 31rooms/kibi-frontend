/**
 * useMySubjects Hook
 * Fetches subjects for the authenticated user based on their career
 */

import { useState, useEffect, useCallback } from 'react';
import { getMySubjects } from '../api';
import type { Subject } from '../types';

interface UseMySubjectsResult {
  subjects: Subject[];
  careerName: string | undefined;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useMySubjects(): UseMySubjectsResult {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [careerName, setCareerName] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMySubjects();
      setSubjects(response.subjects);
      setCareerName(response.careerName);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar materias';
      setError(message);
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return {
    subjects,
    careerName,
    isLoading,
    error,
    refresh: fetchSubjects,
  };
}
