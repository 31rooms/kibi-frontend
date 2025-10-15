/**
 * Diagnostic Test Feature - Public API
 *
 * This barrel export provides the public interface for the diagnostic test feature.
 * Only export what other parts of the application need to use.
 */

// Types and Enums
export type {
  Question,
  QuestionOption,
  QuizConfig,
  QuizAnswer,
  QuizState,
  QuestionResult,
  QuizResults,
  TimerState,
  QuizNavigation,
} from './types/quiz.types';

export { QuestionType, QuestionDifficultyLevel } from './types/quiz.types';

export type {
  CourseOption,
  CourseSelectionData,
  CourseSelectionErrors,
  CourseSelectionState,
} from './types/course-selection.types';

// Hooks
export { useQuizTimer } from './hooks/useQuizTimer';
export type { UseQuizTimerOptions, UseQuizTimerReturn } from './hooks/useQuizTimer';

export { useQuizState } from './hooks/useQuizState';
export type { UseQuizStateOptions, UseQuizStateReturn } from './hooks/useQuizState';

export { useQuizNavigation } from './hooks/useQuizNavigation';
export type { UseQuizNavigationOptions } from './hooks/useQuizNavigation';

export { useFeedback } from './hooks/useFeedback';
export type { UseFeedbackReturn, FeedbackState, FeedbackVariant } from './hooks/useFeedback';

export { useCourseSelection } from './hooks/useCourseSelection';

// UI Components
export { QuizContainer } from './ui/QuizContainer';
export type { QuizContainerProps } from './ui/QuizContainer';

export { DiagnosticTestLayout } from './ui/DiagnosticTestLayout';
export type { DiagnosticTestLayoutProps } from './ui/DiagnosticTestLayout';

export { QuizResults as QuizResultsDisplay } from './ui/QuizResults';
export type { QuizResultsProps } from './ui/QuizResults';

export { CourseSelectionForm } from './ui/CourseSelectionForm';
export type { CourseSelectionFormProps } from './ui/CourseSelectionForm';

export { ResultsSummary } from './ui/ResultsSummary';
export type { ResultsSummaryProps } from './ui/ResultsSummary';

// Utilities
export {
  isAnswerProvided,
  isAnswerCorrect,
  areAllQuestionsAnswered,
  validateQuizConfig,
  getUnansweredQuestions,
} from './utils/quizValidation';

export {
  calculateQuestionScore,
  calculateQuestionResults,
  calculateQuizResults,
  isPassingScore,
  getPerformanceLevel,
  calculateAverageTimePerQuestion,
  getQuizStatistics,
} from './utils/quizScoring';
