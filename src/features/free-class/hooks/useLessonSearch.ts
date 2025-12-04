/**
 * useLessonSearch Hook
 * Manages lesson search with debouncing, filtering, and pagination
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { searchLessons } from '../api';
import type { LessonSearchResult, DifficultyLevel, SearchLessonsParams } from '../types';

interface UseLessonSearchOptions {
  pageSize?: number;
  debounceDelay?: number;
}

interface UseLessonSearchResult {
  // State
  lessons: LessonSearchResult[];
  total: number;
  isLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;

  // Filters
  searchValue: string;
  setSearchValue: (value: string) => void;
  subjectId: string;
  setSubjectId: (value: string) => void;
  difficultyLevel: DifficultyLevel | '';
  setDifficultyLevel: (value: DifficultyLevel | '') => void;

  // Actions
  refresh: () => void;
}

export function useLessonSearch(options: UseLessonSearchOptions = {}): UseLessonSearchResult {
  const {
    pageSize = 5,
    debounceDelay = 400,
  } = options;

  // Filter states
  const [searchValue, setSearchValue] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel | ''>('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Data states
  const [lessons, setLessons] = useState<LessonSearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounced search value
  const debouncedSearch = useDebounce(searchValue, debounceDelay);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, subjectId, difficultyLevel]);

  // Fetch lessons
  const fetchLessons = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const offset = (currentPage - 1) * pageSize;
      const params: SearchLessonsParams = {
        limit: pageSize,
        offset,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (subjectId) {
        params.subjectId = subjectId;
      }

      if (difficultyLevel) {
        params.difficultyLevel = difficultyLevel;
      }

      const response = await searchLessons(params);
      setLessons(response.lessons);
      setTotal(response.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al buscar lecciones';
      setError(message);
      setLessons([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, subjectId, difficultyLevel, currentPage, pageSize]);

  // Fetch lessons when filters or page changes
  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // Set page with validation
  const setPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  // Manual refresh
  const refresh = useCallback(() => {
    fetchLessons();
  }, [fetchLessons]);

  return {
    // State
    lessons,
    total,
    isLoading,
    error,

    // Pagination
    currentPage,
    totalPages,
    setPage,

    // Filters
    searchValue,
    setSearchValue,
    subjectId,
    setSubjectId,
    difficultyLevel,
    setDifficultyLevel,

    // Actions
    refresh,
  };
}
