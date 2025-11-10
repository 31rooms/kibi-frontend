/**
 * Public API for exam-simulation feature
 *
 * Refactored to match diagnostic-test structure
 * Uses shared Quiz components from @/shared/ui
 */

// Hooks
export { useExamSimulation } from './hooks/useExamSimulation';
export type { UseExamSimulationOptions, UseExamSimulationReturn } from './hooks/useExamSimulation';

// UI Components
export { ExamQuestionView } from './ui/ExamQuestionView';
export type { ExamQuestionViewProps } from './ui/ExamQuestionView';
export { ExamSummaryView } from './ui/ExamSummaryView';
export { ExamResultsView } from './ui/ExamResultsView';
export { ExitConfirmationModal } from './ui/ExitConfirmationModal';
export { ExamSimulationLayout } from './ui/ExamSimulationLayout';
export type { ExamSimulationLayoutProps } from './ui/ExamSimulationLayout';
export { ExamSimulationSection } from './ui/ExamSimulationSection';

// Types
export type {
  Question,
  QuestionOption,
  QuizAnswer,
  ExamConfig,
  ExamState,
  ExamResults,
  QuestionType,
  QuestionDifficultyLevel,
} from './types';

// Mocks (for development/testing)
export { mockExamQuestions } from './mocks/questions';
