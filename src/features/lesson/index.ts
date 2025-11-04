// ============================================
// LESSON FEATURE - PUBLIC API
// ============================================

// UI Components
export { LessonView } from './ui/LessonView';
export { EnhancedLessonView } from './ui/EnhancedLessonView';
export { LessonSection } from './ui/LessonSection';
export { LessonContent } from './ui/LessonContent';
export { LessonQuestions } from './ui/LessonQuestions';
export type { LessonViewProps } from './types/lesson.types';
export type { LessonContentProps } from './ui/LessonContent';
export type { LessonQuestionsProps } from './ui/LessonQuestions';

// New Components
export { RecommendationCard } from './components/RecommendationCard';
export { ReviewsListCard } from './components/ReviewsListCard';
export { SubjectStats } from './components/SubjectStats';

// Legacy components (kept for backwards compatibility)
export { QuestionCard } from './ui/QuestionCard';
export { ModuleAccordion } from './ui/ModuleAccordion';
export type { QuestionCardProps } from './ui/QuestionCard';
export type { ModuleAccordionProps } from './ui/ModuleAccordion';

// Hooks
export { useSubjectHierarchy } from './hooks/useSubjectHierarchy';

// Types
export type * from './types/lesson.types';

// API Service (for internal use or specific cases)
export { lessonAPI } from './api/lesson-service';

// Note: api and utils are intentionally NOT exported (private to the feature)
