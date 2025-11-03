// Daily Session Types (Lecciones y Cápsulas de Ciencia)

export interface DailySessionRecommendation {
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  subtopicId: string;
  subtopicName: string;
  lessonId: string;
  lessonTitle: string;
  reason: string;
  potentialImprovement: string;
  priority: number;
  iconUrl?: string;
  hasContent: boolean; // Indica si la materia tiene contenido disponible
}

export interface RecommendationsResponse {
  recommendations: DailySessionRecommendation[];
}

export interface LessonQuestion {
  _id: string;
  questionText?: string; // For compatibility
  statement?: string; // New field from backend
  imageUrl?: string;
  options: {
    _id: string;
    text: string;
    imageUrl?: string;
  }[];
  explanation?: string;
  stepByStepExplanation?: string; // From backend for LESSON_CONTENT
  correctAnswers?: string[]; // From backend for LESSON_CONTENT
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  difficultyLevel?: string; // From backend
  type?: string;
  purpose?: string[];
}

export interface CategorizedQuestions {
  examPractice: LessonQuestion[];
  diagnosticTest: LessonQuestion[];
  dailyTest: LessonQuestion[];
  lessonContent: LessonQuestion[]; // Now includes correctAnswers and stepByStepExplanation
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
  images?: any[];
  videoUrl?: string;
  keyConcepts?: string[];
  difficultyLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
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
  progress: any;
}

// Question state for tracking answers
export interface QuestionState {
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  answered: boolean;
  timeSpent: number;
  feedback?: string;
}
