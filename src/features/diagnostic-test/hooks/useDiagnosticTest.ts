/**
 * useDiagnosticTest Hook
 *
 * Manages the complete diagnostic test flow:
 * - Starting test and loading questions by phases
 * - Submitting answers to backend
 * - Handling phase transitions
 * - Completing test and getting results
 */

import { useState, useCallback } from 'react';
import { diagnosticAPI } from '../api/diagnosticAPI';
import type {
  StartDiagnosticResponse,
  DiagnosticQuestion,
  CompleteDiagnosticResponse,
  AnswerDiagnosticQuestionResponse,
} from '../api/types';
import type { Question, QuizConfig } from '../types/quiz.types';
import { QuestionType, QuestionDifficultyLevel } from '../types/quiz.types';

export interface UseDiagnosticTestReturn {
  // State
  isLoading: boolean;
  error: string | null;
  testId: string | null;
  currentPhase: number;
  totalQuestionsExpected: number;
  questions: DiagnosticQuestionExtended[];
  quizConfig: QuizConfig | null;
  results: CompleteDiagnosticResponse['results'] | null;
  isCompleted: boolean;
  phaseInfo: StartDiagnosticResponse['phaseInfo'] | null;

  // Actions
  startTest: () => Promise<void>;
  submitAnswer: (questionId: string, selectedAnswer: string[], timeSpentSeconds: number) => Promise<AnswerDiagnosticQuestionResponse>;
  loadNextPhase: () => Promise<boolean>; // Returns true if phase has questions, false if empty (need to call again)
  completeTest: () => Promise<void>;
  checkStatus: () => Promise<boolean>;
}

/**
 * Extended Question type with subjectName and order for display
 */
export interface DiagnosticQuestionExtended extends Question {
  subjectName?: string;
  order: number;
}

/**
 * Convert backend question to frontend Question type
 */
function mapBackendQuestion(q: DiagnosticQuestion): DiagnosticQuestionExtended {
  return {
    id: q._id,
    statement: q.statement,
    type: q.type as QuestionType,
    options: q.options,
    correctAnswers: [], // Backend doesn't send correct answers
    difficultyLevel: q.difficultyLevel as QuestionDifficultyLevel,
    subjectId: q.subjectId,
    subjectName: q.subjectName,
    imageUrl: q.questionImage,
    order: q.order,
  };
}

/**
 * Create QuizConfig from diagnostic questions
 */
function createQuizConfig(
  questions: Question[],
  phaseInfo: StartDiagnosticResponse['phaseInfo']
): QuizConfig {
  return {
    questions,
    title: `Test Diagnóstico - Fase ${phaseInfo.phase}`,
    description: phaseInfo.description,
    defaultTimePerQuestion: 60,
    allowReview: false,
    showTimer: true,
    showProgress: true,
  };
}

export function useDiagnosticTest(): UseDiagnosticTestReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testId, setTestId] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [totalQuestionsExpected, setTotalQuestionsExpected] = useState(20);
  const [questions, setQuestions] = useState<DiagnosticQuestionExtended[]>([]);
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [results, setResults] = useState<CompleteDiagnosticResponse['results'] | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [phaseInfo, setPhaseInfo] = useState<StartDiagnosticResponse['phaseInfo'] | null>(null);

  /**
   * Check if user has already completed the diagnostic
   */
  const checkStatus = useCallback(async (): Promise<boolean> => {
    try {
      const response = await diagnosticAPI.checkDiagnostic();
      return response.completed;
    } catch (err) {
      console.error('Error checking diagnostic status:', err);
      return false;
    }
  }, []);

  /**
   * Start the diagnostic test
   */
  const startTest = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await diagnosticAPI.startDiagnostic();

      setTestId(response.testId);
      setCurrentPhase(response.currentPhase);
      setTotalQuestionsExpected(response.totalQuestionsExpected);
      setPhaseInfo(response.phaseInfo);

      const mappedQuestions = response.questions.map(mapBackendQuestion);
      setQuestions(mappedQuestions);
      setQuizConfig(createQuizConfig(mappedQuestions, response.phaseInfo));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar el test';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Submit an answer for the current question
   */
  const submitAnswer = useCallback(
    async (
      questionId: string,
      selectedAnswer: string[],
      timeSpentSeconds: number
    ): Promise<AnswerDiagnosticQuestionResponse> => {
      if (!testId) {
        throw new Error('No test in progress');
      }

      try {
        const response = await diagnosticAPI.answerQuestion(testId, {
          questionId,
          selectedAnswer: selectedAnswer.length === 1 ? selectedAnswer[0] : selectedAnswer,
          timeSpentSeconds,
        });
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al enviar respuesta';
        setError(message);
        throw err;
      }
    },
    [testId]
  );

  /**
   * Load questions for the next phase
   * Returns true if phase has questions, false if empty (Phase II can have 0 questions)
   */
  const loadNextPhase = useCallback(async (): Promise<boolean> => {
    if (!testId) {
      throw new Error('No test in progress');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await diagnosticAPI.getNextPhase(testId);

      setCurrentPhase(response.currentPhase);
      setPhaseInfo(response.phaseInfo);

      const mappedQuestions = response.questions.map(mapBackendQuestion);
      setQuestions(mappedQuestions);
      setQuizConfig(createQuizConfig(mappedQuestions, response.phaseInfo));

      // Return whether this phase has questions
      return mappedQuestions.length > 0;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar siguiente fase';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [testId]);

  /**
   * Complete the diagnostic test and get results
   */
  const completeTest = useCallback(async () => {
    if (!testId) {
      throw new Error('No test in progress');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await diagnosticAPI.completeDiagnostic(testId);
      setResults(response.results);
      setIsCompleted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al completar el test';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [testId]);

  return {
    isLoading,
    error,
    testId,
    currentPhase,
    totalQuestionsExpected,
    questions,
    quizConfig,
    results,
    isCompleted,
    phaseInfo,
    startTest,
    submitAnswer,
    loadNextPhase,
    completeTest,
    checkStatus,
  };
}
