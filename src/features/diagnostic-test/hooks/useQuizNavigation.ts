'use client';

import { useMemo } from 'react';
import type { QuizNavigation } from '../types/quiz.types';

export interface UseQuizNavigationOptions {
  /** Current question index (0-based) */
  currentIndex: number;

  /** Total number of questions */
  totalQuestions: number;

  /** Whether navigation backwards is allowed */
  allowReview?: boolean;
}

/**
 * Custom hook for quiz navigation state and calculations
 *
 * Provides navigation information without managing state itself.
 * Useful for determining what navigation controls to show.
 *
 * @example
 * ```tsx
 * const nav = useQuizNavigation({
 *   currentIndex: 2,
 *   totalQuestions: 10,
 *   allowReview: true,
 * });
 *
 * return (
 *   <div>
 *     <p>Question {nav.currentQuestionNumber} of {nav.totalQuestions}</p>
 *     {nav.canGoPrevious && <button>Previous</button>}
 *     {!nav.isLastQuestion && <button>Next</button>}
 *     {nav.isLastQuestion && <button>Submit</button>}
 *   </div>
 * );
 * ```
 */
export function useQuizNavigation({
  currentIndex,
  totalQuestions,
  allowReview = true,
}: UseQuizNavigationOptions): QuizNavigation {
  return useMemo(() => {
    const isFirstQuestion = currentIndex === 0;
    const isLastQuestion = currentIndex === totalQuestions - 1;
    const canGoPrevious = !isFirstQuestion && allowReview;
    const canGoNext = !isLastQuestion;
    const currentQuestionNumber = currentIndex + 1; // 1-based for display

    return {
      canGoPrevious,
      canGoNext,
      isLastQuestion,
      isFirstQuestion,
      currentQuestionNumber,
      totalQuestions,
    };
  }, [currentIndex, totalQuestions, allowReview]);
}
