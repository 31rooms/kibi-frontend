import { api } from '@/shared/api/apiClient';
import type {
  RecommendationsResponse,
  LessonFullResponse,
  StartLessonRequest,
  StartLessonResponse,
  AnswerQuestionRequest,
  AnswerQuestionResponse,
  CompleteLessonRequest,
  CompleteLessonResponse,
} from './types';

export const dailySessionAPI = {
  /**
   * Get personalized study recommendations
   * @returns {Promise<RecommendationsResponse>}
   */
  async getRecommendations(): Promise<RecommendationsResponse> {
    const response = await api.get<RecommendationsResponse>('/progress/recommendations');
    return response.data;
  },

  /**
   * Get complete lesson with categorized questions
   * @param {string} lessonId - The lesson ID
   * @returns {Promise<LessonFullResponse>}
   */
  async getLessonFull(lessonId: string): Promise<LessonFullResponse> {
    const response = await api.get<LessonFullResponse>(`/lessons/${lessonId}/full`);
    return response.data;
  },

  /**
   * Start a lesson session
   * @param {string} lessonId - The lesson ID
   * @param {StartLessonRequest} data - Session type
   * @returns {Promise<StartLessonResponse>}
   */
  async startLesson(lessonId: string, data: StartLessonRequest): Promise<StartLessonResponse> {
    const response = await api.post<StartLessonResponse>(`/lessons/${lessonId}/start`, data);
    return response.data;
  },

  /**
   * Answer a question in a lesson
   * @param {string} lessonId - The lesson ID
   * @param {string} questionId - The question ID
   * @param {AnswerQuestionRequest} data - Answer data
   * @returns {Promise<AnswerQuestionResponse>}
   */
  async answerQuestion(
    lessonId: string,
    questionId: string,
    data: AnswerQuestionRequest
  ): Promise<AnswerQuestionResponse> {
    const response = await api.post<AnswerQuestionResponse>(
      `/lessons/${lessonId}/questions/${questionId}/answer`,
      data
    );
    return response.data;
  },

  /**
   * Complete a lesson session
   * @param {string} lessonId - The lesson ID
   * @param {CompleteLessonRequest} data - Completion data
   * @returns {Promise<CompleteLessonResponse>}
   */
  async completeLesson(lessonId: string, data: CompleteLessonRequest): Promise<CompleteLessonResponse> {
    const response = await api.post<CompleteLessonResponse>(`/lessons/${lessonId}/complete`, data);
    return response.data;
  },
};
