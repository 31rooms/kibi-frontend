// Review Types
export interface PendingReview {
  subtopicId: string;
  subtopicName: string;
  topicName: string;
  subjectName: string;
  dueDate: Date;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  overdue: boolean;
  daysSinceLastReview: number;
  currentInterval: number;
  masteryLevel: number;
  questionsAvailable: number;
}

export interface PendingReviewsResponse {
  reviews: PendingReview[];
  statistics: {
    total: number;
    overdue: number;
    dueToday: number;
    dueThisWeek: number;
  };
  nextReviewDate?: string;
}

export interface ReviewSession {
  id: string;
  userId: string;
  subtopicId: string;
  subtopicName: string;
  questions: ReviewQuestion[];
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  correctAnswers?: number;
  totalQuestions: number;
  effectiveness?: number;
  nextReviewDate?: Date;
  intervalDays?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewQuestion {
  id: string;
  question: {
    id: string;
    text: string;
    imageUrl?: string;
    explanation?: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  };
  options: QuestionOption[];
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpent?: number;
  attemptNumber: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  isCorrect?: boolean;
}

export interface GenerateReviewRequest {
  questionCount?: number; // default: 5
  difficulty?: 'MIXED' | 'EASY' | 'MEDIUM' | 'HARD';
}

export interface AnswerReviewRequest {
  questionId: string;
  selectedOptionId: string;
  timeSpent: number;
}

export interface AnswerReviewResponse {
  isCorrect: boolean;
  correctOptionId: string;
  explanation?: string;
  progress: {
    answered: number;
    correct: number;
    total: number;
  };
  masteryUpdate: {
    previousLevel: number;
    currentLevel: number;
    changed: boolean;
  };
}

export interface CompleteReviewResponse {
  sessionId: string;
  correctAnswers: number;
  totalQuestions: number;
  effectiveness: number;
  masteryLevel: number;
  nextReviewDate: Date;
  intervalDays: number;
  performanceMessage: string;
  achievements?: Achievement[];
}

export interface ReviewHistory {
  sessions: ReviewSessionSummary[];
  statistics: {
    totalSessions: number;
    averageEffectiveness: number;
    questionsReviewed: number;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  };
}

export interface ReviewSessionSummary {
  id: string;
  subtopicName: string;
  completedAt: Date;
  effectiveness: number;
  questionsAnswered: number;
  correctAnswers: number;
}

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  unlockedAt: Date;
  seen: boolean;
}