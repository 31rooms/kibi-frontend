'use client';

import { useState, useEffect, useCallback } from 'react';
import { mockExamsAPI } from '../api/mock-exams-service';
import type {
  MockExamListItem,
  MockExamDetailResponse,
} from '../types/mock-exam.types';

export interface UseMockExamsListReturn {
  /** List of available mock exams */
  mockExams: MockExamListItem[];
  /** Loading state */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Total count of mock exams */
  total: number;
  /** Calculated quota info */
  quota: {
    totalPurchased: number;
    totalUsed: number;
    remaining: number;
  };
  /** Refetch the list */
  refetch: () => Promise<void>;
  /** Get details of a specific mock exam */
  getExamDetails: (examId: string) => Promise<MockExamDetailResponse | null>;
  /** Get the first available (purchased with remaining attempts) mock exam */
  getFirstAvailableExam: () => MockExamListItem | null;
}

/**
 * Hook for managing the list of mock exams
 * Replaces useSimulationQuota for the new mock-exams system
 */
export function useMockExamsList(): UseMockExamsListReturn {
  const [mockExams, setMockExams] = useState<MockExamListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchMockExams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mockExamsAPI.listMockExams();
      setMockExams(response.mockExams);
      setTotal(response.total);
    } catch (err: any) {
      console.error('Error fetching mock exams:', err);
      setError(err.response?.data?.message || 'Error al cargar simulacros');
      setMockExams([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMockExams();
  }, [fetchMockExams]);

  // Calculate quota from mock exams list
  const quota = mockExams.reduce(
    (acc, exam) => {
      if (exam.isPurchased) {
        acc.totalPurchased += exam.maxAttempts;
        acc.totalUsed += exam.attemptsUsed || 0;
        acc.remaining += (exam.maxAttempts - (exam.attemptsUsed || 0));
      }
      return acc;
    },
    { totalPurchased: 0, totalUsed: 0, remaining: 0 }
  );

  const getExamDetails = useCallback(async (examId: string): Promise<MockExamDetailResponse | null> => {
    try {
      return await mockExamsAPI.getMockExamDetail(examId);
    } catch (err: any) {
      console.error('Error fetching exam details:', err);
      setError(err.response?.data?.message || 'Error al cargar detalles del examen');
      return null;
    }
  }, []);

  const getFirstAvailableExam = useCallback((): MockExamListItem | null => {
    // Find first purchased exam with remaining attempts
    return mockExams.find(
      (exam) => exam.isPurchased && (exam.maxAttempts - (exam.attemptsUsed || 0)) > 0
    ) || null;
  }, [mockExams]);

  return {
    mockExams,
    loading,
    error,
    total,
    quota,
    refetch: fetchMockExams,
    getExamDetails,
    getFirstAvailableExam,
  };
}
