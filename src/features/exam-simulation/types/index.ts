/**
 * Exam Simulation Types
 *
 * Aligned with diagnostic-test feature for consistency
 * Uses the same quiz types from diagnostic-test
 */

import type { Question, QuestionOption, QuizAnswer } from '@/features/diagnostic-test/types/quiz.types';

/**
 * Re-export types from diagnostic-test for compatibility
 */
export type { Question, QuestionOption, QuizAnswer };

/**
 * Question type enum (aligned with backend)
 */
export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  TEXT_RESPONSE = 'TEXT_RESPONSE',
}

/**
 * Question difficulty levels (aligned with backend)
 */
export enum QuestionDifficultyLevel {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

/**
 * Exam simulation specific configuration
 */
export interface ExamConfig {
  /** Array of questions to display */
  questions: Question[];

  /** Default time per question if not specified individually (in seconds) */
  defaultTimePerQuestion?: number;

  /** Whether to show the timer component */
  showTimer?: boolean;

  /** Whether to show progress indicator */
  showProgress?: boolean;

  /** Exam title */
  title?: string;

  /** Subject name to display */
  subjectName?: string;
}

/**
 * Exam simulation state
 */
export interface ExamState {
  /** Current question index (0-based) */
  currentQuestionIndex: number;

  /** All user answers collected so far */
  answers: QuizAnswer[];

  /** Whether the exam has been completed */
  isCompleted: boolean;

  /** Total time spent on the exam (in seconds) */
  totalTimeSpent: number;
}

/**
 * Exam results after completion
 */
export interface ExamResults {
  /** Total score (0-100) */
  score: number;

  /** Number of correct answers */
  correctCount: number;

  /** Total number of questions */
  totalQuestions: number;

  /** Total time spent (in seconds) */
  totalTimeSpent: number;

  /** Individual question answers */
  answers: QuizAnswer[];
}

/**
 * State of a single question in the exam summary
 */
export interface ExamQuestionState {
  /** Question ID */
  questionId: string;

  /** Selected answer (for single choice) */
  selectedAnswer: string | null;

  /** Whether the question has been answered */
  isAnswered: boolean;

  /** Whether the question was skipped */
  isSkipped: boolean;

  /** Whether the answer is correct */
  isCorrect: boolean;
}
