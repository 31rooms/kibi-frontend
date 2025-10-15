'use client';

import { useState, useCallback } from 'react';
import type {
  QuizConfig,
  QuizState,
  QuizAnswer,
  Question,
} from '../types/quiz.types';

export interface UseQuizStateOptions {
  /** Quiz configuration */
  config: QuizConfig;

  /** Callback when quiz is completed */
  onComplete?: (answers: QuizAnswer[]) => void;
}

export interface UseQuizStateReturn extends QuizState {
  /** Current question object */
  currentQuestion: Question;

  /** Get answer for a specific question */
  getAnswer: (questionId: string) => QuizAnswer | undefined;

  /** Set answer for current question (always an array) */
  setCurrentAnswer: (answer: string[]) => void;

  /** Check if current question is answered */
  isCurrentQuestionAnswered: boolean;

  /** Move to next question */
  goToNext: () => void;

  /** Move to previous question */
  goToPrevious: () => void;

  /** Jump to a specific question index */
  goToQuestion: (index: number) => void;

  /** Complete the quiz */
  completeQuiz: () => void;

  /** Reset quiz state */
  resetQuiz: () => void;

  /** Get all questions */
  questions: Question[];

  /** Total number of questions */
  totalQuestions: number;
}

/**
 * Custom hook for managing quiz state and navigation
 *
 * Features:
 * - Track current question and answers
 * - Navigation between questions
 * - Answer submission and validation
 * - Time tracking per question
 * - Quiz completion handling
 *
 * @example
 * ```tsx
 * const quiz = useQuizState({
 *   config: quizConfig,
 *   onComplete: (answers) => console.log(answers),
 * });
 *
 * return (
 *   <div>
 *     <h2>{quiz.currentQuestion.statement}</h2>
 *     <button onClick={() => quiz.setCurrentAnswer(['optionId'])}>
 *       Select
 *     </button>
 *     <button onClick={quiz.goToNext}>Next</button>
 *   </div>
 * );
 * ```
 */
export function useQuizState({
  config,
  onComplete,
}: UseQuizStateOptions): UseQuizStateReturn {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const questions = config.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  // Get answer for a specific question
  const getAnswer = useCallback(
    (questionId: string) => {
      return answers.find((a) => a.questionId === questionId);
    },
    [answers]
  );

  // Check if current question is answered
  const currentAnswer = getAnswer(currentQuestion.id);
  const isCurrentQuestionAnswered = currentAnswer !== undefined;

  // Set answer for current question
  const setCurrentAnswer = useCallback(
    (answer: string[]) => {
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

      setAnswers((prev) => {
        // Remove existing answer for this question if any
        const filtered = prev.filter((a) => a.questionId !== currentQuestion.id);

        // Add new answer (always as array)
        return [
          ...filtered,
          {
            questionId: currentQuestion.id,
            selectedAnswer: answer,
            timeSpent,
            timestamp: new Date(),
          },
        ];
      });
    },
    [currentQuestion.id, questionStartTime]
  );

  // Move to next question
  const goToNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, totalQuestions]);

  // Move to previous question
  const goToPrevious = useCallback(() => {
    if (currentQuestionIndex > 0 && config.allowReview !== false) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, config.allowReview]);

  // Jump to a specific question
  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalQuestions) {
        setCurrentQuestionIndex(index);
        setQuestionStartTime(Date.now());
      }
    },
    [totalQuestions]
  );

  // Complete the quiz
  const completeQuiz = useCallback(() => {
    setIsCompleted(true);
    if (onComplete) {
      onComplete(answers);
    }
  }, [answers, onComplete]);

  // Reset quiz state
  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsCompleted(false);
    setQuestionStartTime(Date.now());
  }, []);

  return {
    currentQuestionIndex,
    currentQuestion,
    answers,
    isCompleted,
    timeRemaining: 0, // Managed separately by useQuizTimer
    isTimerRunning: false, // Managed separately by useQuizTimer
    totalTimeSpent: answers.reduce((sum, a) => sum + a.timeSpent, 0),
    questions,
    totalQuestions,
    getAnswer,
    setCurrentAnswer,
    isCurrentQuestionAnswered,
    goToNext,
    goToPrevious,
    goToQuestion,
    completeQuiz,
    resetQuiz,
  };
}
