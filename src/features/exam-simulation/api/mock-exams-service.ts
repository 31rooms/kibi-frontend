/**
 * Mock Exams API Service
 * Handles all communication with the /mock-exams backend endpoints
 */

import { apiClient } from '@/features/authentication/api/config';
import type {
  MockExamsListResponse,
  MockExamDetailResponse,
  PurchaseMockExamDto,
  PurchaseMockExamResponse,
  StartMockExamDto,
  StartMockExamResponse,
  StartDynamicMockExamResponse,
  ResumeAttemptResponse,
  ActiveAttemptCheckResponse,
  AnswerMockExamDto,
  AnswerMockExamResponse,
  AttemptSummaryResponse,
  CompleteMockExamResponse,
  GetAttemptResultsResponse,
  MockExamQuestion,
} from '../types/mock-exam.types';

export const mockExamsAPI = {
  /**
   * List all available mock exams
   * GET /mock-exams
   */
  listMockExams: async (): Promise<MockExamsListResponse> => {
    const response = await apiClient.get('/mock-exams');
    return response.data;
  },

  /**
   * Get detailed information about a specific mock exam
   * GET /mock-exams/:id
   */
  getMockExamDetail: async (examId: string): Promise<MockExamDetailResponse> => {
    const response = await apiClient.get(`/mock-exams/${examId}`);
    return response.data;
  },

  /**
   * Purchase a mock exam
   * POST /mock-exams/:id/purchase
   */
  purchaseMockExam: async (
    examId: string,
    data: PurchaseMockExamDto
  ): Promise<PurchaseMockExamResponse> => {
    const response = await apiClient.post(`/mock-exams/${examId}/purchase`, data);
    return response.data;
  },

  /**
   * Start a new attempt for a mock exam
   * POST /mock-exams/:id/start
   * Returns all questions and starts the timer on backend
   */
  startAttempt: async (
    examId: string,
    data: StartMockExamDto
  ): Promise<StartMockExamResponse> => {
    const response = await apiClient.post(`/mock-exams/${examId}/start`, data);
    return response.data;
  },

  /**
   * Start a dynamically generated mock exam
   * POST /mock-exams/start-dynamic
   * Generates 168 questions on-the-fly based on user's career
   * Uses simulation credits from /simulations system
   */
  startDynamicExam: async (): Promise<StartDynamicMockExamResponse> => {
    const response = await apiClient.post('/mock-exams/start-dynamic');
    return response.data;
  },

  /**
   * Submit an answer for a question
   * POST /mock-exams/attempts/:attemptId/answer
   * Note: Does NOT reveal if answer is correct (unlike daily test)
   */
  submitAnswer: async (
    attemptId: string,
    data: AnswerMockExamDto
  ): Promise<AnswerMockExamResponse> => {
    const response = await apiClient.post(
      `/mock-exams/attempts/${attemptId}/answer`,
      data
    );
    return response.data;
  },

  /**
   * Get current attempt summary/status
   * GET /mock-exams/attempts/:attemptId/summary
   * Use this to check for in-progress attempts and resume
   */
  getAttemptSummary: async (attemptId: string): Promise<AttemptSummaryResponse> => {
    const response = await apiClient.get(`/mock-exams/attempts/${attemptId}/summary`);
    return response.data;
  },

  /**
   * Complete/finish the exam attempt
   * POST /mock-exams/attempts/:attemptId/complete
   * Returns full results with scores, comparisons, and recommendations
   * Note: This can take a while (up to 2 minutes) for 168 questions
   */
  completeAttempt: async (attemptId: string): Promise<CompleteMockExamResponse> => {
    const response = await apiClient.post(
      `/mock-exams/attempts/${attemptId}/complete`,
      {},
      { timeout: 120000 } // 2 minutes timeout for processing 168 questions
    );
    return response.data;
  },

  /**
   * Resume an in-progress attempt (get all questions)
   * GET /mock-exams/attempts/:attemptId/resume
   * Use this when the frontend loses the questions (e.g., page refresh)
   */
  resumeAttempt: async (attemptId: string): Promise<ResumeAttemptResponse> => {
    const response = await apiClient.get(
      `/mock-exams/attempts/${attemptId}/resume`
    );
    return response.data;
  },

  /**
   * Check if user has any active (in-progress) attempt
   * GET /mock-exams/active-attempt
   * Works for both dynamic and static exams
   */
  checkActiveAttempt: async (): Promise<ActiveAttemptCheckResponse> => {
    const response = await apiClient.get('/mock-exams/active-attempt');
    return response.data;
  },

  /**
   * Check if user has an active (in-progress) attempt for a specific exam
   * This is a helper that checks the exam detail for IN_PROGRESS attempts
   */
  getActiveAttempt: async (
    examId: string
  ): Promise<{ hasActiveAttempt: boolean; attemptId?: string; summary?: AttemptSummaryResponse }> => {
    try {
      const detail = await mockExamsAPI.getMockExamDetail(examId);

      const activeAttempt = detail.userAttempts.find(
        (attempt) => attempt.status === 'IN_PROGRESS'
      );

      if (activeAttempt) {
        // Get full summary for the active attempt
        const summary = await mockExamsAPI.getAttemptSummary(activeAttempt.attemptId);
        return {
          hasActiveAttempt: true,
          attemptId: activeAttempt.attemptId,
          summary,
        };
      }

      return { hasActiveAttempt: false };
    } catch (error) {
      console.error('Error checking for active attempt:', error);
      return { hasActiveAttempt: false };
    }
  },

  /**
   * Get results of a completed attempt
   * GET /mock-exams/attempts/:attemptId/results
   * Use this to retrieve results after the exam has already been completed
   */
  getAttemptResults: async (attemptId: string): Promise<GetAttemptResultsResponse> => {
    const response = await apiClient.get(
      `/mock-exams/attempts/${attemptId}/results`
    );
    return response.data;
  },
};

export default mockExamsAPI;
