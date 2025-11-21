/**
 * Diagnostic Test API Types
 *
 * Types aligned with backend diagnostic controller responses
 */

/**
 * Response type for check diagnostic endpoint
 */
export interface CheckDiagnosticResponse {
  completed: boolean;
  diagnosticResultId?: string;
}

/**
 * Diagnostic question structure (without correct answers)
 */
export interface DiagnosticQuestion {
  _id: string;
  statement: string;
  type: string;
  options: Array<{ id: string; text: string }>;
  subjectId: string;
  subjectName?: string;
  difficultyLevel: string;
  phase: 1 | 2 | 3;
  order: number;
  questionImage?: string;
}

/**
 * Response type for start diagnostic endpoint
 */
export interface StartDiagnosticResponse {
  testId: string;
  totalQuestionsExpected: number;
  currentPhase: 1 | 2 | 3;
  phaseInfo: {
    phase: number;
    questionsInPhase: number;
    description: string;
  };
  questions: DiagnosticQuestion[];
}

/**
 * DTO for answering a diagnostic question
 */
export interface AnswerDiagnosticQuestionDto {
  questionId: string;
  selectedAnswer: string | string[];
  timeSpentSeconds: number;
}

/**
 * Response type for answering a diagnostic question
 */
export interface AnswerDiagnosticQuestionResponse {
  isCorrect: boolean;
  questionId: string;
  message?: string;
}

/**
 * Subject score in diagnostic results
 */
export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  subjectWeight: number;
  totalQuestions: {
    basic: number;
    intermediate: number;
    advanced: number;
  };
  correctAnswers: {
    basic: number;
    intermediate: number;
    advanced: number;
  };
  basicScore: number;
  intermediateScore: number;
  advancedScore: number;
  totalScore: number;
  effectiveness: number;
}

/**
 * Response type for completing diagnostic test
 */
export interface CompleteDiagnosticResponse {
  results: {
    totalQuestions: number;
    correctAnswers: number;
    overallScore: number;
    determinedLevel: string;
    phases: Array<{
      phase: number;
      questionsCount: number;
      correctAnswers: number;
    }>;
    subjectScores: SubjectScore[];
    strengths: string[];
    weaknesses: string[];
    overallEffectiveness: number;
  };
  diagnosticCompleted: true;
  message: string;
}
