/**
 * Free Class Feature
 * Public API for free practice mode
 */

// UI Components
export { ClaseLibreSection } from './ui/ClaseLibreSection';
export { FreeLessonView } from './ui/FreeLessonView';

// Hooks
export { useDebounce, useLessonSearch, useMySubjects } from './hooks';

// Types
export type {
  DifficultyLevel,
  Subject,
  MySubjectsResponse,
  LessonSearchResult,
  SearchLessonsResponse,
  SearchLessonsParams,
  Lesson,
  LessonQuestion,
  LessonFullResponse,
  QuestionState,
} from './types';

// API
export {
  getMySubjects,
  searchLessons,
  getLessonFull,
  startLesson,
  answerQuestion,
  completeLesson,
} from './api';
