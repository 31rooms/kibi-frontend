import apiClient from '@/features/authentication/api/config';
import type { SubjectHierarchyResponse } from '../types/lesson.types';

/**
 * Lesson API Service
 * Handles all lesson-related API calls
 */
export const lessonAPI = {
  /**
   * Fetch subject hierarchy with topics and lessons
   * @param subjectId - The ID of the subject to fetch hierarchy for
   * @returns Subject hierarchy data including topics and lessons
   */
  async getSubjectHierarchy(subjectId: string): Promise<SubjectHierarchyResponse> {
    try {
      console.log(`📚 API: Calling GET /subjects/${subjectId}/hierarchy`);
      console.log('📍 API URL:', apiClient.defaults.baseURL);

      const response = await apiClient.get<SubjectHierarchyResponse>(
        `/subjects/${subjectId}/hierarchy`
      );

      console.log('✅ API: Subject hierarchy fetched successfully');
      console.log('📊 Topics count:', response.data.topics?.length || 0);

      return response.data;
    } catch (error: any) {
      console.error('❌ API: Failed to fetch subject hierarchy');
      console.error('Status:', error.response?.status);
      console.error('Response:', error.response?.data);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error('Failed to load subject hierarchy. Please try again.');
    }
  },
};
