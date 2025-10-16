/**
 * Quiz and Diagnostic Test Types
 *
 * Type definitions for the reusable quiz/diagnostic test feature.
 * Aligned with backend schema from questions.schema.ts
 */

/**
 * Question types supported by the system (from backend)
 */
export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  TEXT_RESPONSE = 'TEXT_RESPONSE',
}

/**
 * Question difficulty levels (from backend)
 */
export enum QuestionDifficultyLevel {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

/**
 * Represents a single answer option for a question
 * Matches backend QuestionOption interface
 */
export interface QuestionOption {
  /** Option ID ('a', 'b', 'c', 'd', etc.) */
  id: string;
  /** Option text to display */
  text: string;
}

/**
 * Represents a single question in the quiz
 * Aligned with backend QuestionEntity schema
 */
export interface Question {
  /** Unique identifier for the question (MongoDB ObjectId as string) */
  id: string;

  /** Question statement/text to display */
  statement: string;

  /** Question type (SINGLE_CHOICE, MULTIPLE_CHOICE, etc.) */
  type: QuestionType;

  /** Available answer options */
  options: QuestionOption[];

  /** Array of correct answer IDs (e.g., ['a'] or ['a', 'c']) */
  correctAnswers: string[];

  /** Question difficulty level */
  difficultyLevel: QuestionDifficultyLevel;

  /** Subject ID this question belongs to */
  subjectId: string;

  /** Optional time limit for this specific question (in seconds) - frontend only */
  timeLimit?: number;

  /** Optional step-by-step explanation (HTML/Markdown) */
  stepByStepExplanation?: string;

  /** Optional URL of question image */
  imageUrl?: string;

  /** Optional topic ID */
  topicId?: string;

  /** Optional subtopic ID */
  subtopicId?: string;

  /** Optional lesson ID */
  lessonId?: string;

  /** Optional help description for the help modal */
  helpDescription?: string;
}

/**
 * Configuration for the entire quiz
 */
export interface QuizConfig {
  /** Array of questions to display */
  questions: Question[];

  /** Default time per question if not specified individually (in seconds) */
  defaultTimePerQuestion?: number;

  /** Whether users can navigate back to previous questions */
  allowReview?: boolean;

  /** Whether to show the timer component */
  showTimer?: boolean;

  /** Whether to show progress indicator */
  showProgress?: boolean;

  /** Quiz title (optional) */
  title?: string;

  /** Quiz description (optional) */
  description?: string;
}

/**
 * Represents a user's answer to a question
 */
export interface QuizAnswer {
  /** Question ID this answer belongs to */
  questionId: string;

  /** Selected answer(s) - always an array (single item for SINGLE_CHOICE) */
  selectedAnswer: string[];

  /** Time spent on this question (in seconds) */
  timeSpent: number;

  /** Timestamp when the answer was submitted */
  timestamp: Date;
}

/**
 * Complete quiz state management
 */
export interface QuizState {
  /** Current question index (0-based) */
  currentQuestionIndex: number;

  /** All user answers collected so far */
  answers: QuizAnswer[];

  /** Whether the quiz has been completed */
  isCompleted: boolean;

  /** Time remaining for current question (in seconds) */
  timeRemaining: number;

  /** Whether the timer is currently running */
  isTimerRunning: boolean;

  /** Total time spent on the quiz (in seconds) */
  totalTimeSpent: number;
}

/**
 * Result for a single question after submission
 */
export interface QuestionResult {
  /** Question ID */
  questionId: string;

  /** The question that was answered */
  question: Question;

  /** User's answer (array of selected option IDs) */
  userAnswer: string[];

  /** Correct answer(s) (array of correct option IDs) */
  correctAnswer: string[];

  /** Whether the answer was correct */
  isCorrect: boolean;

  /** Time spent on this question */
  timeSpent: number;
}

/**
 * Complete quiz results after submission
 */
export interface QuizResults {
  /** Individual results for each question */
  questionResults: QuestionResult[];

  /** Total score (0-100) */
  score: number;

  /** Number of correct answers */
  correctCount: number;

  /** Total number of questions */
  totalQuestions: number;

  /** Total time spent on the quiz (in seconds) */
  totalTimeSpent: number;

  /** Completion timestamp */
  completedAt: Date;
}

/**
 * Timer state and controls
 */
export interface TimerState {
  /** Time remaining in seconds */
  timeRemaining: number;

  /** Whether timer is active */
  isRunning: boolean;

  /** Initial time in seconds */
  initialTime: number;

  /** Progress percentage (0-100) */
  progress: number;
}

/**
 * Navigation controls for the quiz
 */
export interface QuizNavigation {
  /** Whether user can go to previous question */
  canGoPrevious: boolean;

  /** Whether user can go to next question */
  canGoNext: boolean;

  /** Whether this is the last question */
  isLastQuestion: boolean;

  /** Whether this is the first question */
  isFirstQuestion: boolean;

  /** Current question number (1-based for display) */
  currentQuestionNumber: number;

  /** Total number of questions */
  totalQuestions: number;
}
