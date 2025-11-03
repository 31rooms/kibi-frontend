import { useState, useEffect } from 'react';
import { dailyTestAPI } from '../api/dailyTestAPI';
import type { DailyTestCheck, DailyTestSession } from '../api/types';

export function useDailyTest() {
  const [check, setCheck] = useState<DailyTestCheck | null>(null);
  const [session, setSession] = useState<DailyTestSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const checkAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dailyTestAPI.checkDailyTest();
      setCheck(data);
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const startTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const newSession = await dailyTestAPI.generateDailyTest();
      setSession(newSession);
      return newSession;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const answerQuestion = async (sessionId: string, questionId: string, selectedOptionId: string, timeSpent: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await dailyTestAPI.answerQuestion(sessionId, {
        questionId,
        selectedOptionId,
        timeSpent
      });
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeTest = async (sessionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await dailyTestAPI.completeDailyTest(sessionId);
      return results;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    check,
    session,
    loading,
    error,
    checkAvailability,
    startTest,
    answerQuestion,
    completeTest
  };
}