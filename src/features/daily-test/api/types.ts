// Daily Test Types - Aligned with backend API

// === Enums ===
export type DifficultyLevel = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';

export enum LessonStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// === Check Daily Test ===
export interface DailyTestCheck {
  available: boolean;
  completedToday: boolean;
  testId?: string;
}

// Backward compatible alias
export interface CheckDailyTestResponse extends DailyTestCheck {}

// === Question Types ===
export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface DailyTestQuestion {
  _id: string;
  statement: string;
  type: string;
  options: QuestionOption[];
  subjectId: string;
  subjectName?: string;
  difficultyLevel: DifficultyLevel;
  order: number;
  questionImage?: string;
}

// === Daily Test Session ===
export interface DailyTestSession {
  testId: string;
  questions: DailyTestQuestion[];
  date: Date | string;
  totalQuestions: number;
}

// Backward compatible alias
export interface GenerateDailyTestResponse extends DailyTestSession {}

// === Answer Question ===
export interface AnswerQuestionRequest {
  questionId: string;
  selectedAnswer: string | string[];
  timeSpentSeconds: number;
}

export interface AnswerQuestionResponse {
  isCorrect: boolean;
  questionId: string;
  correctOptionId: string;
  explanation?: string;
  feedback?: string;
  nextQuestion?: number;
}

// === Complete Daily Test ===
export interface SubjectBreakdown {
  subjectName: string;
  correct: number;
  total: number;
}

export interface DailyTestResults {
  totalQuestions: number;
  correctAnswers: number;
  effectiveness: number;
  totalTimeSeconds: number;
  subjectBreakdown: SubjectBreakdown[];
}

export interface CompleteDailyTestResponse {
  results: DailyTestResults;
  sessionUnlocked: boolean;
  streakUpdated: boolean;
  currentStreak: number;
  message: string;
}

// === Daily Session (Recommended Lessons) ===
export interface RecommendedLesson {
  _id: string;
  title: string;
  description?: string;
  subtopicId: string;
  subtopicName: string;
  subjectId: string;
  subjectName: string;
  subjectIconUrl?: string;
  difficultyLevel: DifficultyLevel;
  estimatedTimeMinutes: number;
  reason: string;
  status: LessonStatus;
  progress: number;
  order: number;
}

export interface GenerateDailySessionResponse {
  recommendedLessons: RecommendedLesson[];
  totalLessons: number;
  estimatedTotalTime: number;
  message: string;
}

// === Weekly Status Types ===
export interface WeeklyDayStatus {
  date: string;
  dayLabel: string;
  dailyTestCompleted: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export interface WeeklyStatusResponse {
  weekDays: WeeklyDayStatus[];
  currentStreak: number;
  maxStreak: number;
}

// === Monthly Status Types ===
export interface MonthlyStatusResponse {
  year: number;
  month: number;
  completedDates: string[];
  totalCompleted: number;
  currentStreak: number;
  maxStreak: number;
}

// === Achievement ===
export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  unlockedAt: Date;
  seen: boolean;
}
