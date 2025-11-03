import { api } from '@/shared/api/apiClient';
import type {
  UserAchievements,
  Achievement,
  AchievementProgress,
  MarkAsSeenRequest,
  MarkAsSeenResponse
} from './types';

const ACHIEVEMENTS_BASE_URL = '/progress/achievements';

export const achievementsAPI = {
  /**
   * Get all user achievements
   */
  getUserAchievements: async (): Promise<UserAchievements> => {
    const response = await api.get(ACHIEVEMENTS_BASE_URL);
    return response.data;
  },

  /**
   * Get specific achievement details
   */
  getAchievementDetails: async (achievementId: string): Promise<Achievement> => {
    const response = await api.get(`${ACHIEVEMENTS_BASE_URL}/${achievementId}`);
    return response.data;
  },

  /**
   * Mark achievement as seen
   */
  markAsSeen: async (achievementId: string): Promise<void> => {
    await api.patch(`${ACHIEVEMENTS_BASE_URL}/${achievementId}/seen`);
  },

  /**
   * Mark multiple achievements as seen
   */
  markMultipleAsSeen: async (achievementIds: string[]): Promise<MarkAsSeenResponse> => {
    const response = await api.patch(`${ACHIEVEMENTS_BASE_URL}/mark-seen`, {
      achievementIds
    } as MarkAsSeenRequest);
    return response.data;
  },

  /**
   * Get achievement progress for ongoing achievements
   */
  getAchievementProgress: async (): Promise<AchievementProgress[]> => {
    const response = await api.get(`${ACHIEVEMENTS_BASE_URL}/progress`);
    return response.data;
  },

  /**
   * Get recent unlocked achievements
   */
  getRecentAchievements: async (limit = 5): Promise<Achievement[]> => {
    const response = await api.get(`${ACHIEVEMENTS_BASE_URL}/recent`, {
      params: { limit }
    });
    return response.data;
  }
};