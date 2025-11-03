import { api } from '@/shared/api/apiClient';
import type {
  DailyTestCheck,
  DailyTestSession,
  AnswerQuestionRequest,
  AnswerQuestionResponse,
  CompleteDailyTestResponse
} from './types';

const DAILY_TEST_BASE_URL = '/daily-test';

export const dailyTestAPI = {
  /**
   * Check if user has a daily test available
   */
  checkDailyTest: async (): Promise<DailyTestCheck> => {
    const response = await api.get(`${DAILY_TEST_BASE_URL}/check`);
    return response.data;
  },

  /**
   * Generate a new daily test session
   */
  generateDailyTest: async (): Promise<DailyTestSession> => {
    const response = await api.post(`${DAILY_TEST_BASE_URL}/generate`);
    return response.data;
  },

  /**
   * Answer a question in the daily test
   */
  answerQuestion: async (
    sessionId: string,
    data: AnswerQuestionRequest
  ): Promise<AnswerQuestionResponse> => {
    const response = await api.post(
      `${DAILY_TEST_BASE_URL}/sessions/${sessionId}/answer`,
      data
    );
    return response.data;
  },

  /**
   * Complete the daily test session
   */
  completeDailyTest: async (sessionId: string): Promise<CompleteDailyTestResponse> => {
    const response = await api.post(
      `${DAILY_TEST_BASE_URL}/sessions/${sessionId}/complete`
    );
    return response.data;
  },

  /**
   * Get current daily test session if exists
   */
  getCurrentSession: async (): Promise<DailyTestSession | null> => {
    try {
      const response = await api.get(`${DAILY_TEST_BASE_URL}/current-session`);
      return response.data;
    } catch (error) {
      return null;
    }
  }
};