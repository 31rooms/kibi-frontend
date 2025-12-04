/**
 * Free Class Feature Types
 */

export type DifficultyLevel = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';

export interface Subject {
  _id: string;
  name: string;
  description: string;
  iconUrl?: string;
  examWeight: number;
}

export interface MySubjectsResponse {
  subjects: Subject[];
  careerName?: string;
}

export interface LessonSearchResult {
  _id: string;
  title: string;
  description?: string;
  summary: string;
  difficultyLevel: DifficultyLevel;
  estimatedMinutes: number;
  subject: {
    _id: string;
    name: string;
    iconUrl?: string;
  } | null;
  subtopicName?: string;
  topicName?: string;
}

export interface SearchLessonsResponse {
  lessons: LessonSearchResult[];
  total: number;
  limit: number;
  offset: number;
}

export interface SearchLessonsParams {
  search?: string;
  subjectId?: string;
  difficultyLevel?: DifficultyLevel;
  limit?: number;
  offset?: number;
}

// ============================================================================
// LESSON TYPES (for lesson view)
// ============================================================================

export interface LessonQuestionOption {
  _id?: string;
  id?: string;
  text: string;
  imageUrl?: string;
}

export interface LessonQuestion {
  _id: string;
  questionText?: string;
  statement?: string;
  imageUrl?: string;
  options: LessonQuestionOption[];
  explanation?: string;
  stepByStepExplanation?: string;
  correctAnswers?: string[];
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  difficultyLevel?: string;
  type?: string;
  purpose?: string[];
}

export interface CategorizedQuestions {
  examPractice: LessonQuestion[];
  diagnosticTest: LessonQuestion[];
  dailyTest: LessonQuestion[];
  lessonContent: LessonQuestion[];
  generalBank: LessonQuestion[];
}

export interface Lesson {
  _id: string;
  title: string;
  description?: string;
  whatYouWillLearn: string;
  mainContent: string;
  whatMattersForExam?: string;
  tips?: string;
  summary: string;
  learnMoreResources?: string;
  images?: unknown[];
  videoUrl?: string;
  keyConcepts?: string[];
  difficultyLevel: DifficultyLevel;
  order?: number;
  estimatedMinutes: number;
  categorizedQuestions?: CategorizedQuestions;
}

export interface LessonFullResponse {
  lesson: Lesson;
}

export interface StartLessonRequest {
  type: 'DAILY_SESSION' | 'FREE_CLASS';
}

export interface StartLessonResponse {
  sessionId: string;
  lesson: Lesson;
}

export interface AnswerQuestionRequest {
  sessionId: string;
  givenAnswer: string | string[];
  timeSpentSeconds: number;
}

export interface AnswerQuestionResponse {
  isCorrect: boolean;
  explanation?: string;
  nextQuestion?: LessonQuestion;
}

export interface CompleteLessonRequest {
  sessionId: string;
  questionsAnswered: number;
  correctAnswers: number;
  timeSpentSeconds: number;
}

export interface CompleteLessonResponse {
  sessionCompleted: boolean;
  progress: unknown;
}

export interface QuestionState {
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  answered: boolean;
  timeSpent: number;
  showTemporaryFeedback: boolean;
  isValidated: boolean;
}
