'use client';

import { useState, useCallback } from 'react';

export type FeedbackVariant = 'success' | 'failed';

export interface FeedbackState {
  /** Whether feedback is currently showing */
  isShowing: boolean;

  /** Feedback variant (success or failed) */
  variant: FeedbackVariant;

  /** Feedback message to display */
  message: string;

  /** Duration to show the feedback in milliseconds */
  duration: number;
}

export interface UseFeedbackReturn {
  /** Current feedback state */
  feedback: FeedbackState;

  /** Show success feedback */
  showSuccess: (message?: string) => Promise<void>;

  /** Show failed feedback with correct answer */
  showFailed: (correctAnswerIndex: string | string[], customMessage?: string) => Promise<void>;

  /** Hide feedback manually */
  hideFeedback: () => void;

  /** Whether feedback is currently showing */
  isShowingFeedback: boolean;
}

/**
 * Custom hook for managing feedback toast display
 *
 * Features:
 * - Show success/failed feedback
 * - Auto-hide after animation completes
 * - Promise-based API for sequential operations
 *
 * @example
 * ```tsx
 * const feedback = useFeedback();
 *
 * const handleSubmit = async () => {
 *   if (isCorrect) {
 *     await feedback.showSuccess();
 *   } else {
 *     await feedback.showFailed(['a']);
 *   }
 *   // Continue to next question after feedback hides
 *   goToNext();
 * };
 * ```
 */
export function useFeedback(): UseFeedbackReturn {
  const [feedback, setFeedback] = useState<FeedbackState>({
    isShowing: false,
    variant: 'success',
    message: '',
    duration: 1000,
  });

  /**
   * Hide feedback
   */
  const hideFeedback = useCallback(() => {
    setFeedback((prev) => ({ ...prev, isShowing: false }));
  }, []);

  /**
   * Show success feedback
   * Returns a promise that resolves after feedback animation completes
   */
  const showSuccess = useCallback((message = '¡Correcto!') => {
    return new Promise<void>((resolve) => {
      setFeedback({
        isShowing: true,
        variant: 'success',
        message,
        duration: 1000, // 1 second for success
      });

      // Wait for FeedbackToast to auto-hide (1 second + 300ms fade out)
      setTimeout(() => {
        resolve();
      }, 1300);
    });
  }, []);

  /**
   * Show failed feedback with correct answer
   * Returns a promise that resolves after feedback animation completes
   */
  const showFailed = useCallback((
    correctAnswerIndex: string | string[],
    customMessage?: string
  ) => {
    return new Promise<void>((resolve) => {
      // Format correct answer(s) - convert to uppercase
      const correctAnswers = Array.isArray(correctAnswerIndex)
        ? correctAnswerIndex.map(ans => ans.toUpperCase()).join(', ')
        : correctAnswerIndex.toUpperCase();

      const message = customMessage ||
        `¡Casi... la respuesta correcta es ${correctAnswers}. ¡Sigue practicando, lo estás haciendo bien!!`;

      setFeedback({
        isShowing: true,
        variant: 'failed',
        message,
        duration: 2000, // 2 seconds for failed
      });

      // Wait for FeedbackToast to auto-hide (2 seconds + 300ms fade out)
      setTimeout(() => {
        resolve();
      }, 2300);
    });
  }, []);

  return {
    feedback,
    showSuccess,
    showFailed,
    hideFeedback,
    isShowingFeedback: feedback.isShowing,
  };
}
