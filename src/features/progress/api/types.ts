// Progress Types
export interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    currentLevel: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
    plan: 'FREE' | 'GOLD' | 'DIAMOND';
  };
  progress: {
    overallEffectiveness: number;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    totalQuestionsSolved: number;
    correctAnswers: number;
    studyTimeMinutes: number;
    lastActivityDate: string;
  };
  streak: {
    current: number;
    maximum: number;
    lastTestDate?: string;
    isActive: boolean;
  };
  projectedScore: {
    score: number;
    confidence: number;
    lastUpdated: string;
    trend: 'UP' | 'DOWN' | 'STABLE';
    changeFromLast: number;
  };
  todayActivity: {
    questionsSolved: number;
    studyTimeMinutes: number;
    testsCompleted: number;
    reviewsCompleted: number;
  };
  achievements: {
    total: number;
    unlocked: number;
    recent: Achievement[];
  };
  pendingReviews: {
    count: number;
    urgent: number;
    nextReviewDate?: string;
  };
}

export interface ProjectedScore {
  currentScore: number;
  confidence: number;
  breakdown: SubjectProjection[];
  historicalScores: HistoricalScore[];
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  projectedImprovement: {
    in7Days: number;
    in30Days: number;
    targetDate: string;
    targetScore: number;
  };
}

export interface SubjectProjection {
  subjectId: string;
  subjectName: string;
  projectedScore: number;
  weight: number;
  effectiveness: number;
  questionsAnswered: number;
}

export interface HistoricalScore {
  date: string;
  score: number;
  type: 'DIAGNOSTIC' | 'MOCK_EXAM' | 'PROJECTED';
}

export interface SubjectsEffectiveness {
  subjects: SubjectEffectiveness[];
  overall: {
    effectiveness: number;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    strongSubjects: string[];
    weakSubjects: string[];
  };
}

export interface SubjectEffectiveness {
  id: string;
  name: string;
  effectiveness: number;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  questionsAnswered: number;
  correctAnswers: number;
  lastActivity: string;
  topics: TopicEffectiveness[];
  level: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
  nextRecommendedTopic?: string;
}

export interface TopicEffectiveness {
  id: string;
  name: string;
  effectiveness: number;
  questionsAnswered: number;
  correctAnswers: number;
  subtopics: SubtopicEffectiveness[];
}

export interface SubtopicEffectiveness {
  id: string;
  name: string;
  effectiveness: number;
  questionsAnswered: number;
  correctAnswers: number;
  lastReviewDate?: string;
  nextReviewDate?: string;
  masteryLevel: number; // 0-5
}

export interface SubjectDetail {
  subject: {
    id: string;
    name: string;
    description: string;
  };
  effectiveness: number;
  level: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
  progress: {
    questionsAnswered: number;
    correctAnswers: number;
    averageTimePerQuestion: number;
    studyTimeMinutes: number;
    lastActivity: string;
  };
  topics: TopicDetail[];
  recommendations: string[];
  projectedScore: number;
}

export interface TopicDetail {
  id: string;
  name: string;
  effectiveness: number;
  progress: {
    completed: boolean;
    questionsAnswered: number;
    correctAnswers: number;
  };
  subtopics: SubtopicDetail[];
}

export interface SubtopicDetail {
  id: string;
  name: string;
  effectiveness: number;
  masteryLevel: number;
  questionsAnswered: number;
  correctAnswers: number;
  lastReviewDate?: string;
  nextReviewDate?: string;
  needsReview: boolean;
}

export interface Achievement {
  id: string;
  type: 'STREAK' | 'QUESTIONS' | 'SCORE' | 'MASTERY' | 'SPECIAL';
  title: string;
  description: string;
  icon?: string;
  unlockedAt?: Date;
  progress?: number;
  target?: number;
  seen: boolean;
}

export interface UserAchievements {
  unlocked: Achievement[];
  locked: Achievement[];
  recent: Achievement[];
  statistics: {
    total: number;
    unlocked: number;
    percentage: number;
    points: number;
  };
}

// Projected Exam Score Types
export interface ProjectedExamScoreSubjectBreakdown {
  subjectId: string;
  subjectName: string;
  subjectLetter: string;
  maxPoints: number;
  earnedPoints: number;
  effectiveness: number;
  totalAnswered: number;
  correctAnswers: number;
  hasData: boolean;
}

export interface ProjectedExamScore {
  projectedScore: number;
  maxScore: number;
  percentage: number;
  subjectBreakdown: ProjectedExamScoreSubjectBreakdown[];
  dataSources: string[];
  message: string;
  lastUpdated: string;
}

// Effectiveness History Types
export type EffectivenessHistoryPeriod = 'week' | 'month' | 'quarter';
export type EffectivenessHistorySource = 'DAILY_TEST' | 'MOCK_EXAM' | 'ALL';
export type EffectivenessTrend = 'IMPROVING' | 'STABLE' | 'DECLINING';

export interface EffectivenessDataPoint {
  date: string;
  effectiveness: number;
  source: string;
}

export interface EffectivenessSubject {
  subjectId: string;
  subjectName: string;
  dataPoints: EffectivenessDataPoint[];
  currentEffectiveness: number;
  trend: EffectivenessTrend;
}

export interface EffectivenessHistoryResponse {
  period: EffectivenessHistoryPeriod;
  source: EffectivenessHistorySource;
  subjects: EffectivenessSubject[];
  globalTrend: EffectivenessTrend;
}

// Activity Time Chart Types
export interface ActivityTimeChartDataPoint {
  category: string;
  value: number;
}

export interface ActivityTimeChartResponse {
  period: 'today' | 'week' | 'month';
  data: ActivityTimeChartDataPoint[];
  totalMinutes: number;
  averagePerDay: number;
  /** Solo presente cuando period='today'. Indica que los datos vienen del tracking real por bloque horario */
  isRealTimeData?: boolean;
}