import apiClient from '@/features/authentication/api/config';
import type {
  GetMockExamsResponse,
  GetMockExamDetailsResponse,
  PurchaseMockExamRequest,
  PurchaseMockExamResponse,
  StartMockExamRequest,
  StartMockExamResponse,
  AnswerMockExamRequest,
  AnswerMockExamResponse,
  GetMockExamSummaryResponse,
  CompleteMockExamResponse,
  MockExamHistory,
  MockExamAttempt,
} from './types';

const MOCK_EXAMS_BASE_URL = '/mock-exams';

export const mockExamsAPI = {
  /**
   * GET /mock-exams
   * List all available mock exams with purchase status
   */
  getMockExams: async (): Promise<GetMockExamsResponse> => {
    const response = await apiClient.get(MOCK_EXAMS_BASE_URL);
    return response.data;
  },

  /**
   * GET /mock-exams/:id
   * Get detailed information about a specific mock exam
   * Includes subject distribution and user attempts
   */
  getMockExamDetails: async (examId: string): Promise<GetMockExamDetailsResponse> => {
    const response = await apiClient.get(`${MOCK_EXAMS_BASE_URL}/${examId}`);
    return response.data;
  },

  /**
   * POST /mock-exams/:id/purchase
   * Purchase a mock exam to unlock attempts
   */
  purchaseMockExam: async (
    examId: string,
    data: PurchaseMockExamRequest
  ): Promise<PurchaseMockExamResponse> => {
    const response = await apiClient.post(
      `${MOCK_EXAMS_BASE_URL}/${examId}/purchase`,
      data
    );
    return response.data;
  },

  /**
   * POST /mock-exams/:id/start
   * Start a new mock exam attempt
   * Returns all 168 questions and starts the 270-minute timer
   */
  startMockExam: async (
    examId: string,
    data: StartMockExamRequest
  ): Promise<StartMockExamResponse> => {
    const response = await apiClient.post(
      `${MOCK_EXAMS_BASE_URL}/${examId}/start`,
      data
    );
    return response.data;
  },

  /**
   * POST /mock-exams/attempts/:attemptId/answer
   * Submit an answer for a mock exam question
   * Note: Unlike daily test, correctness is NOT revealed until completion
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
   * GET /mock-exams/attempts/:attemptId/summary
   * Get current state of a mock exam attempt
   * Useful for resuming or checking progress
   */
  getAttemptSummary: async (attemptId: string): Promise<GetMockExamSummaryResponse> => {
    const response = await apiClient.get(
      `${MOCK_EXAMS_BASE_URL}/attempts/${attemptId}/summary`
    );
    return response.data;
  },

  /**
   * POST /mock-exams/attempts/:attemptId/complete
   * Complete the mock exam and get comprehensive results
   * Includes score, subject breakdown, incorrect questions, and recommendations
   */
  completeMockExam: async (attemptId: string): Promise<CompleteMockExamResponse> => {
    const response = await apiClient.post(
      `${MOCK_EXAMS_BASE_URL}/attempts/${attemptId}/complete`
    );
    return response.data;
  },

  /**
   * GET /mock-exams/history
   * Get user's mock exam attempt history
   */
  getHistory: async (): Promise<MockExamHistory> => {
    const response = await apiClient.get(`${MOCK_EXAMS_BASE_URL}/history`);
    return response.data;
  },

  /**
   * GET /mock-exams/attempts/:attemptId
   * Get specific mock exam attempt details
   * Used for reviewing past attempts
   */
  getAttemptDetails: async (attemptId: string): Promise<MockExamAttempt> => {
    const response = await apiClient.get(`${MOCK_EXAMS_BASE_URL}/attempts/${attemptId}`);
    return response.data;
  },

  // === Backward Compatibility Methods ===
  // These methods maintain compatibility with existing components

  /**
   * @deprecated Use getMockExams instead
   */
  checkAvailability: async () => {
    const response = await mockExamsAPI.getMockExams();
    const purchasedExam = response.mockExams.find(exam => exam.isPurchased);

    return {
      canTakeExam: response.mockExams.some(exam => exam.isPurchased && (exam.attemptsUsed || 0) < exam.maxAttempts),
      remainingExams: purchasedExam ? purchasedExam.maxAttempts - (purchasedExam.attemptsUsed || 0) : 0,
      userPlan: 'FREE' as const, // Will be updated based on actual user plan
      message: response.mockExams.length > 0 ? undefined : 'No hay simulacros disponibles',
    };
  },

  /**
   * @deprecated Use getAttemptSummary instead
   */
  getCurrentAttempt: async (): Promise<MockExamAttempt | null> => {
    try {
      // Try to get the most recent in-progress attempt
      const history = await mockExamsAPI.getHistory();
      const inProgressAttempt = history.attempts.find(a => !a.completedAt);

      if (inProgressAttempt) {
        return mockExamsAPI.getAttemptDetails(inProgressAttempt.id);
      }

      return null;
    } catch {
      return null;
    }
  },
};
