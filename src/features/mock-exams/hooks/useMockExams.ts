'use client';

import { useState, useCallback } from 'react';
import { mockExamsAPI } from '../api/mockExamsAPI';
import type {
  MockExamListItem,
  GetMockExamDetailsResponse,
  StartMockExamResponse,
  AnswerMockExamResponse,
  GetMockExamSummaryResponse,
  CompleteMockExamResponse,
  MockExamHistory,
  PaymentMethod,
} from '../api/types';

interface UseMockExamsReturn {
  // State
  mockExams: MockExamListItem[];
  currentExamDetails: GetMockExamDetailsResponse | null;
  currentAttempt: StartMockExamResponse | null;
  attemptSummary: GetMockExamSummaryResponse | null;
  results: CompleteMockExamResponse | null;
  history: MockExamHistory | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchMockExams: () => Promise<void>;
  getExamDetails: (examId: string) => Promise<GetMockExamDetailsResponse>;
  purchaseExam: (examId: string, paymentMethod: PaymentMethod) => Promise<void>;
  startAttempt: (examId: string, purchaseId: string) => Promise<StartMockExamResponse>;
  submitAnswer: (
    attemptId: string,
    questionId: string,
    answer: string | string[],
    timeSpentSeconds: number
  ) => Promise<AnswerMockExamResponse>;
  getAttemptSummary: (attemptId: string) => Promise<GetMockExamSummaryResponse>;
  completeAttempt: (attemptId: string) => Promise<CompleteMockExamResponse>;
  fetchHistory: () => Promise<MockExamHistory>;
  clearCurrentAttempt: () => void;
  clearError: () => void;
}

export function useMockExams(): UseMockExamsReturn {
  const [mockExams, setMockExams] = useState<MockExamListItem[]>([]);
  const [currentExamDetails, setCurrentExamDetails] = useState<GetMockExamDetailsResponse | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<StartMockExamResponse | null>(null);
  const [attemptSummary, setAttemptSummary] = useState<GetMockExamSummaryResponse | null>(null);
  const [results, setResults] = useState<CompleteMockExamResponse | null>(null);
  const [history, setHistory] = useState<MockExamHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMockExams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockExamsAPI.getMockExams();
      setMockExams(response.mockExams);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando simulacros';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getExamDetails = useCallback(async (examId: string): Promise<GetMockExamDetailsResponse> => {
    setLoading(true);
    setError(null);
    try {
      const details = await mockExamsAPI.getMockExamDetails(examId);
      setCurrentExamDetails(details);
      return details;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando detalles del simulacro';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const purchaseExam = useCallback(async (examId: string, paymentMethod: PaymentMethod) => {
    setLoading(true);
    setError(null);
    try {
      await mockExamsAPI.purchaseMockExam(examId, { paymentMethod });

      // Refresh exam list and details
      await fetchMockExams();
      await getExamDetails(examId);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error comprando simulacro');
      } else {
        setError('Error comprando simulacro');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMockExams, getExamDetails]);

  const startAttempt = useCallback(async (
    examId: string,
    purchaseId: string
  ): Promise<StartMockExamResponse> => {
    setLoading(true);
    setError(null);
    try {
      const attempt = await mockExamsAPI.startMockExam(examId, {
        mockExamPurchasedId: purchaseId,
      });
      setCurrentAttempt(attempt);
      setResults(null); // Clear previous results
      return attempt;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error iniciando simulacro');
      } else {
        setError('Error iniciando simulacro');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async (
    attemptId: string,
    questionId: string,
    answer: string | string[],
    timeSpentSeconds: number
  ): Promise<AnswerMockExamResponse> => {
    // Don't set loading for individual answers to avoid UI flickering
    setError(null);
    try {
      const response = await mockExamsAPI.answerQuestion(attemptId, {
        questionId,
        selectedAnswer: answer,
        timeSpentSeconds,
      });
      return response;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error enviando respuesta');
      } else {
        setError('Error enviando respuesta');
      }
      throw err;
    }
  }, []);

  const getAttemptSummary = useCallback(async (attemptId: string): Promise<GetMockExamSummaryResponse> => {
    setLoading(true);
    setError(null);
    try {
      const summary = await mockExamsAPI.getAttemptSummary(attemptId);
      setAttemptSummary(summary);
      return summary;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando resumen del intento';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeAttempt = useCallback(async (attemptId: string): Promise<CompleteMockExamResponse> => {
    setLoading(true);
    setError(null);
    try {
      const completionResults = await mockExamsAPI.completeMockExam(attemptId);
      setResults(completionResults);
      setCurrentAttempt(null);
      return completionResults;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error completando simulacro');
      } else {
        setError('Error completando simulacro');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (): Promise<MockExamHistory> => {
    setLoading(true);
    setError(null);
    try {
      const historyData = await mockExamsAPI.getHistory();
      setHistory(historyData);
      return historyData;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando historial';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCurrentAttempt = useCallback(() => {
    setCurrentAttempt(null);
    setAttemptSummary(null);
    setResults(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    mockExams,
    currentExamDetails,
    currentAttempt,
    attemptSummary,
    results,
    history,
    loading,
    error,
    fetchMockExams,
    getExamDetails,
    purchaseExam,
    startAttempt,
    submitAnswer,
    getAttemptSummary,
    completeAttempt,
    fetchHistory,
    clearCurrentAttempt,
    clearError,
  };
}
