import apiClient from '@/features/authentication/api/config';
import type {
  DailyTestCheck,
  DailyTestSession,
  AnswerQuestionRequest,
  AnswerQuestionResponse,
  CompleteDailyTestResponse,
  GenerateDailySessionResponse,
  WeeklyStatusResponse,
  MonthlyStatusResponse
} from './types';

const DAILY_TEST_BASE_URL = '/daily-test';

export const dailyTestAPI = {
  /**
   * GET /daily-test/check
   * Check if user has a daily test available for today
   */
  checkDailyTest: async (): Promise<DailyTestCheck> => {
    const response = await apiClient.get(`${DAILY_TEST_BASE_URL}/check`);
    return response.data;
  },

  /**
   * POST /daily-test/generate
   * Generate a new daily test session with personalized questions
   * Uses the full cycle algorithm: Subject → Topic → Subtopic → Lesson → Question
   */
  generateDailyTest: async (): Promise<DailyTestSession> => {
    const response = await apiClient.post(`${DAILY_TEST_BASE_URL}/generate`);
    return response.data;
  },

  /**
   * POST /daily-test/:testId/answer
   * Answer a question in the daily test
   * Returns immediate feedback (correct/incorrect) unlike mock exams
   */
  answerQuestion: async (
    testId: string,
    data: AnswerQuestionRequest
  ): Promise<AnswerQuestionResponse> => {
    const response = await apiClient.post(
      `${DAILY_TEST_BASE_URL}/${testId}/answer`,
      data
    );
    return response.data;
  },

  /**
   * POST /daily-test/:testId/complete
   * Complete the daily test and get results
   * Unlocks the daily study session
   */
  completeDailyTest: async (testId: string): Promise<CompleteDailyTestResponse> => {
    const response = await apiClient.post(
      `${DAILY_TEST_BASE_URL}/${testId}/complete`
    );
    return response.data;
  },

  /**
   * POST /daily-test/session/generate
   * Generate the daily study session with recommended lessons
   * Requires daily test to be completed first
   */
  generateDailySession: async (): Promise<GenerateDailySessionResponse> => {
    const response = await apiClient.post(`${DAILY_TEST_BASE_URL}/session/generate`);
    return response.data;
  },

  /**
   * GET /daily-test/weekly-status
   * Get weekly status for calendar display
   * Returns which days of the current week have completed daily tests and streak info
   */
  getWeeklyStatus: async (): Promise<WeeklyStatusResponse> => {
    const response = await apiClient.get(`${DAILY_TEST_BASE_URL}/weekly-status`);
    return response.data;
  },

  /**
   * GET /daily-test/monthly-status/:year/:month
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
