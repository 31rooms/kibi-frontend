import apiClient from '@/features/authentication/api/config';
import type {
  DashboardData,
  ProjectedScore,
  SubjectsEffectiveness,
  SubjectDetail,
  UserAchievements
} from './types';

const PROGRESS_BASE_URL = '/progress';

export const progressAPI = {
  /**
   * Get dashboard data with all progress metrics
   */
  getDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get(`${PROGRESS_BASE_URL}/dashboard`);
    return response.data;
  },

  /**
   * Get projected score with breakdown
   */
  getProjectedScore: async (): Promise<ProjectedScore> => {
    const response = await apiClient.get(`${PROGRESS_BASE_URL}/projected-score`);
    return response.data;
  },

  /**
   * Get effectiveness by subjects
   */
  getSubjectsEffectiveness: async (): Promise<SubjectsEffectiveness> => {
    const response = await apiClient.get(`${PROGRESS_BASE_URL}/subjects-effectiveness`);
    return response.data;
  },

  /**
   * Get detailed progress for a specific subject
   */
  getSubjectDetail: async (subjectId: string): Promise<SubjectDetail> => {
    const response = await apiClient.get(`${PROGRESS_BASE_URL}/subjects/${subjectId}/detail`);
    return response.data;
  },

  /**
   * Get user achievements
   */
  getUserAchievements: async (): Promise<UserAchievements> => {
    const response = await apiClient.get(`${PROGRESS_BASE_URL}/achievements`);
    return response.data;
  },

  /**
   * Mark achievement as seen
   */
  markAchievementAsSeen: async (achievementId: string): Promise<void> => {
    await apiClient.patch(`${PROGRESS_BASE_URL}/achievements/${achievementId}/seen`);
  },

  /**
   * Mark multiple achievements as seen
   */
  markAchievementsAsSeen: async (achievementIds: string[]): Promise<void> => {
    await apiClient.patch(`${PROGRESS_BASE_URL}/achievements/mark-seen`, {
      achievementIds
    });
  }
};