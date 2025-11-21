/**
 * Diagnostic Test API Service
 *
 * Service for interacting with the diagnostic test endpoints
 */

import { apiClient } from '@/features/authentication/api/config';
import type {
  CheckDiagnosticResponse,
  StartDiagnosticResponse,
  AnswerDiagnosticQuestionDto,
  AnswerDiagnosticQuestionResponse,
  CompleteDiagnosticResponse,
} from './types';

export const diagnosticAPI = {
  /**
   * Check if user has completed diagnostic test
   */
  async checkDiagnostic(): Promise<CheckDiagnosticResponse> {
    const response = await apiClient.get<CheckDiagnosticResponse>('/diagnostic/check');
    return response.data;
  },

  /**
   * Start a new diagnostic test
   * Returns testId and first phase questions
   */
  async startDiagnostic(): Promise<StartDiagnosticResponse> {
    const response = await apiClient.post<StartDiagnosticResponse>('/diagnostic/start');
    return response.data;
  },

  /**
   * Get questions for the next phase
   */
  async getNextPhase(testId: string): Promise<StartDiagnosticResponse> {
    const response = await apiClient.get<StartDiagnosticResponse>(
      `/diagnostic/${testId}/next-phase`
    );
    return response.data;
  },

  /**
   * Submit answer for a diagnostic question
   */
  async answerQuestion(
    testId: string,
    answer: AnswerDiagnosticQuestionDto
  ): Promise<AnswerDiagnosticQuestionResponse> {
    const response = await apiClient.post<AnswerDiagnosticQuestionResponse>(
      `/diagnostic/${testId}/answer`,
      answer
    );
    return response.data;
  },

  /**
   * Complete diagnostic test and get results
   */
  async completeDiagnostic(testId: string): Promise<CompleteDiagnosticResponse> {
    const response = await apiClient.post<CompleteDiagnosticResponse>(
      `/diagnostic/${testId}/complete`
    );
    return response.data;
  },
};
