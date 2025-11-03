import { api } from '@/shared/api/apiClient';
import type {
  PendingReviewsResponse,
  ReviewSession,
  GenerateReviewRequest,
  AnswerReviewRequest,
  AnswerReviewResponse,
  CompleteReviewResponse,
  ReviewHistory
} from './types';

const REVIEW_BASE_URL = '/review';

export const reviewAPI = {
  /**
   * Get all pending reviews for the user
   */
  getPendingReviews: async (): Promise<PendingReviewsResponse> => {
    const response = await api.get(`${REVIEW_BASE_URL}/pending`);
    return response.data;
  },

  /**
   * Generate a review session for a specific subtopic
   */
  generateReviewSession: async (
    subtopicId: string,
    options?: GenerateReviewRequest
  ): Promise<ReviewSession> => {
    const response = await api.post(
      `${REVIEW_BASE_URL}/generate/${subtopicId}`,
      options || {}
    );
    return response.data;
  },

  /**
   * Answer a question in the review session
   */
  answerQuestion: async (
    sessionId: string,
    data: AnswerReviewRequest
  ): Promise<AnswerReviewResponse> => {
    const response = await api.post(
      `${REVIEW_BASE_URL}/sessions/${sessionId}/answer`,
      data
    );
    return response.data;
  },

  /**
   * Complete the review session
   */
  completeReviewSession: async (sessionId: string): Promise<CompleteReviewResponse> => {
    const response = await api.post(
      `${REVIEW_BASE_URL}/sessions/${sessionId}/complete`
    );
    return response.data;
  },

  /**
   * Get current review session if exists
   */
  getCurrentSession: async (): Promise<ReviewSession | null> => {
    try {
      const response = await api.get(`${REVIEW_BASE_URL}/current-session`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  /**
   * Get review history
   */
  getReviewHistory: async (limit = 20): Promise<ReviewHistory> => {
    const response = await api.get(`${REVIEW_BASE_URL}/history`, {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Skip a review (postpone to next day)
   */
  skipReview: async (subtopicId: string): Promise<{ nextReviewDate: Date }> => {
    const response = await api.post(`${REVIEW_BASE_URL}/skip/${subtopicId}`);
    return response.data;
  }
};