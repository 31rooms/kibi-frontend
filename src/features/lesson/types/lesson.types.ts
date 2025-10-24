/**
 * Lesson Feature Types
 * Types for the lesson viewing feature
 */

/**
 * Question option structure
 */
export interface QuestionOption {
  id: string;
  text: string;
}

/**
 * Question types
 */
export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

/**
 * Question difficulty levels
 */
export enum DifficultyLevel {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

/**
 * Question purpose
 */
export type QuestionPurpose = 'LESSON_CONTENT' | 'DAILY_TEST' | 'EXAM';

/**
 * Question data structure
 */
export interface Question {
  _id: string;
  statement: string;
  type: QuestionType;
  options: QuestionOption[];
  correctAnswers: string[];
  stepByStepExplanation?: string;
  difficultyLevel?: DifficultyLevel;
  purpose?: QuestionPurpose[];
}

/**
 * Lesson data structure within a module
 */
export interface Lesson {
  _id: string;
  title: string;
  description?: string;
  whatYouWillLearn: string;
  whatMattersForExam: string;
  tips?: string;
  summary?: string;
  learnMoreResources?: string;
  questions: Question[];
}

/**
 * Module data structure containing lessons
 */
export interface Module {
  _id: string;
  name: string;
  description: string;
  order?: number;
  lessons: Lesson[];
  // Legacy support for old structure
  questions?: Question[];
  questionsCount?: number;
}

/**
 * Subtopic data structure containing modules
 */
export interface Subtopic {
  _id: string;
  name: string;
  difficultyLevel: DifficultyLevel;
  order: number;
  modules: Module[];
  modulesCount: number;
}

/**
 * Topic data structure containing subtopics
 */
export interface Topic {
  _id: string;
  name: string;
  order: number;
  subtopics: Subtopic[];
  subtopicsCount: number;
}

/**
 * Subject information
 */
export interface Subject {
  _id: string;
  name: string;
  description: string;
  examWeight: number;
}

/**
 * Subject hierarchy response from API
 * GET /subjects/:subjectId/hierarchy
 */
export interface SubjectHierarchyResponse {
  subject: Subject;
  topics: Topic[];
  topicsCount: number;
  totalSubtopicsCount: number;
  totalModulesCount: number;
  totalQuestionsCount: number;
}

/**
 * Props for LessonView component
 */
export interface LessonViewProps {
  subjectId: string;
}

/**
 * Props for lesson UI components
 */
export interface LessonContentProps {
  hierarchy: SubjectHierarchyResponse;
}

/**
 * User answer for a question
 */
export interface UserAnswer {
  questionId: string;
  selectedOptions: string[];
  isCorrect?: boolean;
}
