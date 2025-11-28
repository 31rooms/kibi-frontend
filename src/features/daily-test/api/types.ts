// Daily Test Types
export interface DailyTestCheck {
  hasTestAvailable: boolean;
  lastTestDate?: string;
  nextTestAvailable?: string;
  currentStreak: number;
  message?: string;
}

export interface DailyTestSession {
  id: string;
  userId: string;
  questions: DailyTestQuestion[];
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  score?: number;
  correctAnswers?: number;
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyTestQuestion {
  id: string;
  question: {
    id: string;
    text: string;
    imageUrl?: string;
    explanation?: string;
    topic: {
      id: string;
      name: string;
    };
    subtopic: {
      id: string;
      name: string;
    };
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  };
  options: QuestionOption[];
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpent?: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  isCorrect?: boolean;
}

export interface AnswerQuestionRequest {
  questionId: string;
  selectedOptionId: string;
  timeSpent: number;
}

export interface AnswerQuestionResponse {
  isCorrect: boolean;
  correctOptionId: string;
  explanation?: string;
  progress: {
    answered: number;
    total: number;
  };
}

export interface CompleteDailyTestResponse {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  streakUpdated: boolean;
  newStreak: number;
  achievements?: Achievement[];
  experienceGained: number;
}

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  unlockedAt: Date;
  seen: boolean;
}

// Weekly Status Types
export interface WeeklyDayStatus {
  date: string; // ISO date string YYYY-MM-DD
  dayLabel: string; // L, M, M, J, V, S, D
  dailyTestCompleted: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export interface WeeklyStatusResponse {
  weekDays: WeeklyDayStatus[];
  currentStreak: number;
  maxStreak: number;
}

// Monthly Status Types
export interface MonthlyStatusResponse {
  year: number;
  month: number; // 1-12
  completedDates: string[]; // Array of ISO date strings YYYY-MM-DD
  totalCompleted: number;
  currentStreak: number;
  maxStreak: number;
}