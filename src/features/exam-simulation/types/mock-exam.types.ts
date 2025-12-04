/**
 * Mock Exams (Simulacros) Types
 * Based on backend API: /mock-exams
 *
 * EXANI II Format:
 * - 168 questions total
 * - 270 minutes (4.5 hours)
 * - 60% passing score
 * - Max 3 purchases per user
 */

// === Enums ===
export type PaymentMethod = 'CARD' | 'TRANSFER' | 'CASH';
export type AttemptStatus = 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';

// === Request DTOs ===
export interface PurchaseMockExamDto {
  paymentMethod: PaymentMethod;
}

export interface StartMockExamDto {
  mockExamPurchasedId: string;
}

export interface AnswerMockExamDto {
  questionId: string;
  selectedAnswer: string | string[];
  timeSpentSeconds: number;
  /** Current remaining time for pause/resume feature */
  timeRemainingSeconds?: number;
}

// === Response Types ===

/** Mock exam list item */
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

/** Response from GET /mock-exams */
export interface MockExamsListResponse {
  mockExams: MockExamListItem[];
  total: number;
}

/** Subject distribution for exam detail */
export interface SubjectDistribution {
  subjectName: string;
  questionCount: number;
}

/** User attempt summary */
export interface UserAttemptSummary {
  attemptId: string;
  status: AttemptStatus;
  score?: number;
  startedAt: string;
  completedAt?: string;
}

/** Response from GET /mock-exams/:id */
export interface MockExamDetailResponse {
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
  /** Purchase ID needed to start attempt (only if purchased) */
  purchaseId?: string;
}

/** Response from POST /mock-exams/:id/purchase */
export interface PurchaseMockExamResponse {
  purchaseId: string;
  mockExamId: string;
  mockExamName: string;
  price: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  maxAttempts: number;
  message: string;
}

/** Question option */
export interface MockExamQuestionOption {
  id: string;
  text: string;
}

/** Question from backend */
export interface MockExamQuestion {
  _id: string;
  statement: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
  options: MockExamQuestionOption[];
  subjectId: string;
  subjectName?: string;
  difficultyLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  order: number;
  questionImage?: string | null;
}

/** Response from POST /mock-exams/:id/start */
export interface StartMockExamResponse {
  attemptId: string;
  mockExamId: string;
  mockExamName: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  timeRemainingSeconds: number;
  questions: MockExamQuestion[];
  startedAt: string;
}

/** Response from POST /mock-exams/start-dynamic */
export interface StartDynamicMockExamResponse {
  attemptId: string;
  mockExamName: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  timeRemainingSeconds: number;
  questions: MockExamQuestion[];
  startedAt: string;
  remainingSimulations: number;
  subjectDistribution: Array<{
    subjectName: string;
    questionCount: number;
    isSpecial: boolean;
  }>;
}

/** Answer info for resume response */
export interface AnswerInfo {
  questionId: string;
  givenAnswer: string[];
  isSkipped: boolean;
}

/** Response from GET /mock-exams/attempts/:attemptId/resume */
export interface ResumeAttemptResponse {
  attemptId: string;
  mockExamName: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  timeRemainingSeconds: number;
  questions: MockExamQuestion[];
  startedAt: string;
  currentQuestionIndex: number;
  /** @deprecated Use answeredQuestions instead */
  answeredQuestionIds: string[];
  /** Full answer info including givenAnswer */
  answeredQuestions: AnswerInfo[];
}

/** Info about a completed attempt (for viewing previous results) */
export interface LastCompletedAttemptInfo {
  attemptId: string;
  mockExamName: string;
  completedAt: string;
  score: number;
}

/** Response from GET /mock-exams/active-attempt */
export interface ActiveAttemptCheckResponse {
  hasActiveAttempt: boolean;
  attemptId?: string;
  mockExamName?: string;
  timeRemainingSeconds?: number;
  answeredQuestions?: number;
  totalQuestions?: number;
  /** Info about the last completed attempt (for "view previous results" feature) */
  lastCompletedAttempt?: LastCompletedAttemptInfo;
}

/** Response from POST /mock-exams/attempts/:attemptId/answer */
export interface AnswerMockExamResponse {
  questionId: string;
  answerRecorded: boolean;
  message: string;
}

/** Response from GET /mock-exams/attempts/:attemptId/summary */
export interface AttemptSummaryResponse {
  attemptId: string;
  mockExamName: string;
  status: AttemptStatus;
  totalQuestions: number;
  answeredQuestions: number;
  pendingQuestions: number;
  currentQuestionIndex: number;
  timeRemainingSeconds: number;
  startedAt: string;
  /** Map of questionId to selected answer (for resuming) */
  answers?: Record<string, string | string[]>;
}

/** Subject score in results */
export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  correct: number;
  total: number;
  percentage: number;
}

/** Incorrect question with explanation */
export interface IncorrectQuestion {
  questionId: string;
  statement: string;
  subjectName: string;
  givenAnswer: string[];
  correctAnswer: string[];
  explanation?: string;
}

/** Study recommendation */
export interface StudyRecommendation {
  subjectName: string;
  topicsToReview: string[];
  recommendedLessons: string[];
  reason: string;
}

/** Score comparison with other users */
export interface ScoreComparison {
  averageScore: number;
  yourScore: number;
  percentile: number;
}

/** Exam results */
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

/** Response from POST /mock-exams/attempts/:attemptId/complete */
export interface CompleteMockExamResponse {
  results: MockExamResults;
  comparison: ScoreComparison;
  studyRecommendations: StudyRecommendation[];
  attemptsRemaining: number;
  message: string;
}

/** Extended results with completedAt for GET /mock-exams/attempts/:attemptId/results */
export interface MockExamResultsWithDate extends MockExamResults {
  completedAt: string;
}

/** Response from GET /mock-exams/attempts/:attemptId/results */
export interface GetAttemptResultsResponse {
  results: MockExamResultsWithDate;
  comparison: ScoreComparison;
  studyRecommendations: StudyRecommendation[];
}

// === Frontend State Types ===

/** Local answer tracking (before sending to backend) */
export interface LocalAnswer {
  questionId: string;
  selectedAnswer: string[];
  timeSpentSeconds: number;
  submittedToBackend: boolean;
}

/** Active attempt state for frontend */
export interface ActiveAttemptState {
  attemptId: string;
  mockExamId: string;
  mockExamName: string;
  questions: MockExamQuestion[];
  currentQuestionIndex: number;
  answers: Map<string, LocalAnswer>;
  timeRemainingSeconds: number;
  startedAt: Date;
  status: AttemptStatus;
}
