import apiClient from '@/features/authentication/api/config';
import type {
  MockExamAvailability,
  MockExamAttempt,
  StartMockExamRequest,
  StartMockExamResponse,
  AnswerMockExamRequest,
  AnswerMockExamResponse,
  CompleteMockExamRequest,
  CompleteMockExamResponse,
  MockExamHistory
} from './types';

const MOCK_EXAMS_BASE_URL = '/mock-exams';

export const mockExamsAPI = {
  /**
   * Check if user can take a mock exam
   */
  checkAvailability: async (): Promise<MockExamAvailability> => {
    const response = await apiClient.get(`${MOCK_EXAMS_BASE_URL}/check-availability`);
    return response.data;
  },

  /**
   * Start a new mock exam
   */
  startMockExam: async (data: StartMockExamRequest): Promise<StartMockExamResponse> => {
    const response = await apiClient.post(`${MOCK_EXAMS_BASE_URL}/start`, data);
    return response.data;
  },

  /**
   * Answer a question in the mock exam
   */
  answerQuestion: async (
    attemptId: string,
    data: AnswerMockExamRequest
  ): Promise<AnswerMockExamResponse> => {
    const response = await apiClient.post(
      `${MOCK_EXAMS_BASE_URL}/attempts/${attemptId}/answer`,
      data
    );
    return response.data;
  },

  /**
   * Complete the mock exam
   */
  completeMockExam: async (
    attemptId: string,
    data: CompleteMockExamRequest
  ): Promise<CompleteMockExamResponse> => {
    const response = await apiClient.post(
      `${MOCK_EXAMS_BASE_URL}/attempts/${attemptId}/complete`,
      data
    );
    return response.data;
  },

  /**
   * Get current mock exam attempt if exists
   */
  getCurrentAttempt: async (): Promise<MockExamAttempt | null> => {
    try {
      const response = await apiClient.get(`${MOCK_EXAMS_BASE_URL}/current-attempt`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  /**
   * Get mock exam history
   */
  getHistory: async (): Promise<MockExamHistory> => {
    const response = await apiClient.get(`${MOCK_EXAMS_BASE_URL}/history`);
    return response.data;
  },

  /**
   * Get specific mock exam attempt details
   */
  getAttemptDetails: async (attemptId: string): Promise<MockExamAttempt> => {
    const response = await apiClient.get(`${MOCK_EXAMS_BASE_URL}/attempts/${attemptId}`);
    return response.data;
  }
};