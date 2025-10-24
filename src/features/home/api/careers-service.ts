import apiClient from '@/features/authentication/api/config';
import type { MySubjectsResponse } from '../types/careers.types';

/**
 * Careers API Service
 * Handles API calls related to careers and subjects
 */
export const careersAPI = {
  /**
   * Get user's career and subjects
   * GET /careers/my-subjects
   *
   * @returns Promise with career info, subjects array, and total questions
   * @throws Error if the API call fails
   */
  async getMySubjects(): Promise<MySubjectsResponse> {
    try {
      const response = await apiClient.get<MySubjectsResponse>('/careers/my-subjects');
      return response.data;
    } catch (error) {
      const errorResponse = error as { response?: { data?: { message?: string } } };
      if (errorResponse.response?.data?.message) {
        throw new Error(errorResponse.response.data.message);
      }
      throw new Error('Failed to fetch subjects. Please try again.');
    }
  },
};
