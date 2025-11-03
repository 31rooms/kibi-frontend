// Achievements Types
export type AchievementType = 'STREAK' | 'QUESTIONS' | 'SCORE' | 'MASTERY' | 'SPECIAL' | 'EXAM' | 'REVIEW';

export type AchievementRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Achievement {
  id: string;
  code: string;
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  points: number;
  unlockedAt?: Date;
  progress?: number;
  target?: number;
  seen: boolean;
  category: string;
  requirements?: string[];
}

export interface UserAchievements {
  unlocked: Achievement[];
  locked: Achievement[];
  recent: Achievement[];
  statistics: AchievementStatistics;
  categories: AchievementCategory[];
}

export interface AchievementStatistics {
  total: number;
  unlocked: number;
  percentage: number;
  points: number;
  totalPoints: number;
  rank: UserRank;
  nextRank?: UserRank;
  pointsToNextRank?: number;
}

export interface UserRank {
  name: string;
  level: number;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
}

export interface AchievementCategory {
  name: string;
  icon: string;
  achievements: number;
  unlocked: number;
  percentage: number;
  points: number;
}

export interface AchievementProgress {
  achievementId: string;
  current: number;
  target: number;
  percentage: number;
  lastUpdate: Date;
}

export interface AchievementNotification {
  achievement: Achievement;
  unlockedAt: Date;
  message: string;
  celebrationType: 'SIMPLE' | 'SPECIAL' | 'LEGENDARY';
}

export interface MarkAsSeenRequest {
  achievementIds: string[];
}

export interface MarkAsSeenResponse {
  success: boolean;
  markedCount: number;
}