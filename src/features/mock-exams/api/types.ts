// Mock Exams Types - Aligned with backend API (EXANI II format)

// === Enums ===
export type PaymentMethod = 'CARD' | 'TRANSFER' | 'CASH';
export type AttemptStatus = 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
export type UserPlan = 'FREE' | 'GOLD' | 'DIAMOND';

// === Question Types ===
export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface MockExamQuestion {
  _id: string;
  statement: string;
  type: string;
  options: QuestionOption[];
  subjectId: string;
  subjectName?: string;
  difficultyLevel: string;
  order: number;
  questionImage?: string;
}

// === Mock Exam List ===
export interface MockExamListItem {
  _id: string;
  name: string;
  description: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  price: number;
  isPurchased: boolean;
  attemptsUsed?: number;
  maxAttempts: number;
}

export interface GetMockExamsResponse {
  mockExams: MockExamListItem[];
  total: number;
}

// === Mock Exam Details ===
export interface SubjectDistribution {
  subjectName: string;
  questionCount: number;
}

export interface UserAttemptSummary {
  attemptId: string;
  status: AttemptStatus;
  score?: number;
  startedAt: Date | string;
  completedAt?: Date | string;
}

export interface GetMockExamDetailsResponse {
  mockExam: {
    _id: string;
    name: string;
    description: string;
    totalQuestions: number;
    timeLimitMinutes: number;
    price: number;
    maxAttempts: number;
    subjectDistribution: SubjectDistribution[];
  };
  isPurchased: boolean;
  userAttempts: UserAttemptSummary[];
  attemptsRemaining: number;
}

// === Purchase Mock Exam ===
export interface PurchaseMockExamRequest {
  paymentMethod: PaymentMethod;
}

export interface PurchaseMockExamResponse {
  purchaseId: string;
  mockExamId: string;
  mockExamName: string;
  price: number;
  paymentMethod: string;
  transactionId: string;
  maxAttempts: number;
  message: string;
}

// === Start Mock Exam ===
export interface StartMockExamRequest {
  mockExamPurchasedId: string;
}

export interface StartMockExamResponse {
  attemptId: string;
  mockExamId: string;
  mockExamName: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  timeRemainingSeconds: number;
  questions: MockExamQuestion[];
  startedAt: Date | string;
}

// === Answer Question ===
export interface AnswerMockExamRequest {
  questionId: string;
  selectedAnswer: string | string[];
  timeSpentSeconds: number;
}

export interface AnswerMockExamResponse {
  questionId: string;
  answerRecorded: boolean;
  message: string;
}

// === Get Attempt Summary ===
export interface GetMockExamSummaryResponse {
  attemptId: string;
  mockExamName: string;
  status: AttemptStatus;
  totalQuestions: number;
  answeredQuestions: number;
  pendingQuestions: number;
  currentQuestionIndex: number;
  timeRemainingSeconds: number;
  startedAt: Date | string;
}

// === Complete Mock Exam ===
export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface IncorrectQuestion {
  questionId: string;
  statement: string;
  subjectName: string;
  givenAnswer: string[];
  correctAnswer: string[];
  explanation?: string;
}

export interface StudyRecommendation {
  subjectName: string;
  topicsToReview: string[];
  recommendedLessons: string[];
  reason: string;
}

export interface MockExamResults {
  attemptId: string;
  mockExamName: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
  score: number;
  percentage: number;
  passed: boolean;
  totalTimeSeconds: number;
  subjectScores: SubjectScore[];
  incorrectQuestions: IncorrectQuestion[];
}

export interface ScoreComparison {
  averageScore: number;
  yourScore: number;
  percentile: number;
}

export interface CompleteMockExamResponse {
  results: MockExamResults;
  comparison: ScoreComparison;
  studyRecommendations: StudyRecommendation[];
  attemptsRemaining: number;
  message: string;
}

// === Backward Compatibility Types ===
// These match the old interface names for existing components

export interface MockExamAvailability {
  canTakeExam: boolean;
  remainingExams: number;
  nextAvailableDate?: string;
  userPlan: UserPlan;
  message?: string;
}

export interface MockExamAttempt {
  id: string;
  mockExamId: string;
  examNumber?: number;
  questions: MockExamQuestion[];
  startTime: Date | string;
  endTime?: Date | string;
  timeLimit: number;
  completed: boolean;
  score?: number;
  correctAnswers?: number;
  totalQuestions: number;
  scoresBySubject?: SubjectScore[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  status?: AttemptStatus;
  timeRemainingSeconds?: number;
}

export interface MockExamHistory {
  attempts: MockExamAttemptSummary[];
  totalAttempts: number;
  bestScore: number;
  averageScore: number;
  improvementTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
}

export interface MockExamAttemptSummary {
  id: string;
  examNumber?: number;
  mockExamId: string;
  mockExamName: string;
  score: number;
  completedAt: Date | string;
  timeSpent: number;
  passed: boolean;
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
