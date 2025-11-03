// Mock Exams Types
export interface MockExamAvailability {
  canTakeExam: boolean;
  remainingExams: number;
  nextAvailableDate?: string;
  userPlan: 'FREE' | 'PREMIUM';
  message?: string;
}

export interface MockExamAttempt {
  id: string;
  userId: string;
  examNumber: number;
  questions: MockExamQuestion[];
  startTime: Date;
  endTime?: Date;
  timeLimit: number; // in minutes
  completed: boolean;
  score?: number;
  correctAnswers?: number;
  totalQuestions: number;
  scoresBySubject?: SubjectScore[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MockExamQuestion {
  id: string;
  orderInExam: number;
  question: {
    id: string;
    text: string;
    imageUrl?: string;
    explanation?: string;
    subject: {
      id: string;
      name: string;
    };
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
  markedForReview?: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  isCorrect?: boolean;
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  effectiveness: number;
}

export interface StartMockExamRequest {
  confirmStart: boolean;
}

export interface StartMockExamResponse {
  attemptId: string;
  examNumber: number;
  questions: MockExamQuestion[];
  timeLimit: number;
  startTime: string;
}

export interface AnswerMockExamRequest {
  questionId: string;
  selectedOptionId: string;
  timeSpent: number;
  markForReview?: boolean;
}

export interface AnswerMockExamResponse {
  success: boolean;
  progress: {
    answered: number;
    total: number;
    markedForReview: number;
  };
}

export interface CompleteMockExamRequest {
  confirmComplete: boolean;
  timeUp?: boolean;
}

export interface CompleteMockExamResponse {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  scoresBySubject: SubjectScore[];
  percentile?: number;
  projectedScore: number;
  achievements?: Achievement[];
  detailedResults: MockExamAttempt;
}

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  unlockedAt: Date;
  seen: boolean;
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
  examNumber: number;
  score: number;
  completedAt: Date;
  timeSpent: number;
}