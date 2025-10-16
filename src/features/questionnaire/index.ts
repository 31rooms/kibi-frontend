/**
 * Questionnaire Feature - Public API
 *
 * This barrel export provides the public interface for the questionnaire feature.
 * Only exports what other parts of the application need to use.
 */

// Types
export type {
  Subject,
  SubjectQuestionnaire,
  QuestionnaireResults as QuestionnaireResultsData,
  Achievement,
} from './types/questionnaire.types';

// Configuration
export { QUESTIONNAIRE_CONFIG, ACHIEVEMENT_THRESHOLDS, getLevelName } from './config/questionnaire.config';

// Hooks
export { useSubjectQuestionnaire } from './hooks/useSubjectQuestionnaire';
export type { UseSubjectQuestionnaireReturn } from './hooks/useSubjectQuestionnaire';

// UI Components
export { QuestionnaireLayout } from './ui/QuestionnaireLayout';
export type { QuestionnaireLayoutProps } from './ui/QuestionnaireLayout';

export { QuestionnaireResults } from './ui/QuestionnaireResults';
export type { QuestionnaireResultsProps } from './ui/QuestionnaireResults';

// Data (for development/testing only - in production this would come from API)
export {
  QUESTIONNAIRES_BY_SUBJECT,
  getQuestionnaireBySubjectId,
  hasQuestionnaire,
} from './data/subject-questionnaires.mock';
