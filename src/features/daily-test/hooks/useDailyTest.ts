'use client';

import { useState, useCallback } from 'react';
import { dailyTestAPI } from '../api/dailyTestAPI';
import type {
  DailyTestCheck,
  DailyTestSession,
  AnswerQuestionResponse,
  CompleteDailyTestResponse,
  GenerateDailySessionResponse,
  RecommendedLesson,
} from '../api/types';

interface UseDailyTestReturn {
  // State
  check: DailyTestCheck | null;
  session: DailyTestSession | null;
  results: CompleteDailyTestResponse | null;
  dailySession: GenerateDailySessionResponse | null;
  loading: boolean;
  error: string | null;

  // Actions
  checkAvailability: () => Promise<DailyTestCheck>;
  startTest: () => Promise<DailyTestSession>;
  answerQuestion: (
    testId: string,
    questionId: string,
    selectedAnswer: string | string[],
    timeSpentSeconds: number
  ) => Promise<AnswerQuestionResponse>;
  completeTest: (testId: string) => Promise<CompleteDailyTestResponse>;
  generateDailySession: () => Promise<GenerateDailySessionResponse>;
  clearSession: () => void;
  clearError: () => void;
}

export function useDailyTest(): UseDailyTestReturn {
  const [check, setCheck] = useState<DailyTestCheck | null>(null);
  const [session, setSession] = useState<DailyTestSession | null>(null);
  const [results, setResults] = useState<CompleteDailyTestResponse | null>(null);
  const [dailySession, setDailySession] = useState<GenerateDailySessionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = useCallback(async (): Promise<DailyTestCheck> => {
    setLoading(true);
    setError(null);
    try {
      const data = await dailyTestAPI.checkDailyTest();
      setCheck(data);
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error verificando disponibilidad';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const startTest = useCallback(async (): Promise<DailyTestSession> => {
    setLoading(true);
    setError(null);
    try {
      const newSession = await dailyTestAPI.generateDailyTest();
      setSession(newSession);
      setResults(null); // Clear previous results
      return newSession;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error generando test');
      } else {
        setError('Error generando test');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const answerQuestion = useCallback(async (
    testId: string,
    questionId: string,
    selectedAnswer: string | string[],
    timeSpentSeconds: number
  ): Promise<AnswerQuestionResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await dailyTestAPI.answerQuestion(testId, {
        questionId,
        selectedAnswer,
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
    } finally {
      setLoading(false);
    }
  }, []);

  const completeTest = useCallback(async (testId: string): Promise<CompleteDailyTestResponse> => {
    setLoading(true);
    setError(null);
    try {
      const completionResults = await dailyTestAPI.completeDailyTest(testId);
      setResults(completionResults);

      // Update check state to reflect completion
      setCheck((prev) => prev ? {
        ...prev,
        available: false,
        completedToday: true,
        testId,
      } : null);

      return completionResults;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error completando test');
      } else {
        setError('Error completando test');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateDailySession = useCallback(async (): Promise<GenerateDailySessionResponse> => {
    setLoading(true);
    setError(null);
    try {
      const sessionData = await dailyTestAPI.generateDailySession();
      setDailySession(sessionData);
      return sessionData;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error generando sesión diaria');
      } else {
        setError('Error generando sesión diaria');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSession = useCallback(() => {
    setSession(null);
    setResults(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    check,
    session,
    results,
    dailySession,
    loading,
    error,
    checkAvailability,
    startTest,
    answerQuestion,
    completeTest,
    generateDailySession,
    clearSession,
    clearError,
  };
}
