import apiClient from '@/features/authentication/api/config';
import type {
  DailyTestCheck,
  DailyTestSession,
  AnswerQuestionRequest,
  AnswerQuestionResponse,
  CompleteDailyTestResponse,
  WeeklyStatusResponse,
  MonthlyStatusResponse
} from './types';

const DAILY_TEST_BASE_URL = '/daily-test';

export const dailyTestAPI = {
  /**
   * Check if user has a daily test available
   */
  checkDailyTest: async (): Promise<DailyTestCheck> => {
    const response = await apiClient.get(`${DAILY_TEST_BASE_URL}/check`);
    return response.data;
  },

  /**
   * Generate a new daily test session
   */
  generateDailyTest: async (): Promise<DailyTestSession> => {
    const response = await apiClient.post(`${DAILY_TEST_BASE_URL}/generate`);
    return response.data;
  },

  /**
   * Answer a question in the daily test
   */
  answerQuestion: async (
    sessionId: string,
    data: AnswerQuestionRequest
  ): Promise<AnswerQuestionResponse> => {
    const response = await apiClient.post(
      `${DAILY_TEST_BASE_URL}/sessions/${sessionId}/answer`,
      data
    );
    return response.data;
  },

  /**
   * Complete the daily test session
   */
  completeDailyTest: async (sessionId: string): Promise<CompleteDailyTestResponse> => {
    const response = await apiClient.post(
      `${DAILY_TEST_BASE_URL}/sessions/${sessionId}/complete`
    );
    return response.data;
  },

  /**
   * Get current daily test session if exists
   */
  getCurrentSession: async (): Promise<DailyTestSession | null> => {
    try {
      const response = await apiClient.get(`${DAILY_TEST_BASE_URL}/current-session`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  /**
   * Get weekly status for calendar display
   * Returns which days of the current week have completed daily tests and streak info
   */
  getWeeklyStatus: async (): Promise<WeeklyStatusResponse> => {
    const response = await apiClient.get(`${DAILY_TEST_BASE_URL}/weekly-status`);
    return response.data;
  },

  /**
   * Get monthly status for calendar display
   * Returns which days of a specific month have completed daily tests
   * @param year - Year (e.g., 2025)
   * @param month - Month (1-12)
   */
  getMonthlyStatus: async (year: number, month: number): Promise<MonthlyStatusResponse> => {
    const response = await apiClient.get(`${DAILY_TEST_BASE_URL}/monthly-status/${year}/${month}`);
    return response.data;
  }
};