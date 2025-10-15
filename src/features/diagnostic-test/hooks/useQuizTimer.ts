'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerState } from '../types/quiz.types';

export interface UseQuizTimerOptions {
  /** Initial time in seconds */
  initialTime: number;

  /** Whether to start the timer immediately */
  autoStart?: boolean;

  /** Callback when time runs out */
  onTimeUp?: () => void;

  /** Callback on each tick (optional) */
  onTick?: (timeRemaining: number) => void;
}

export interface UseQuizTimerReturn extends TimerState {
  /** Start the timer */
  start: () => void;

  /** Pause the timer */
  pause: () => void;

  /** Reset the timer to initial time */
  reset: () => void;

  /** Reset and start with a new time */
  restart: (newTime: number) => void;
}

/**
 * Custom hook for managing quiz timer functionality
 *
 * Features:
 * - Countdown timer with start/pause/reset controls
 * - Automatic callback when time runs out
 * - Progress calculation
 * - Optional tick callback for side effects
 *
 * @example
 * ```tsx
 * const timer = useQuizTimer({
 *   initialTime: 60,
 *   autoStart: true,
 *   onTimeUp: () => handleSubmit(),
 * });
 *
 * return (
 *   <div>
 *     <p>Time: {timer.timeRemaining}s</p>
 *     <button onClick={timer.pause}>Pause</button>
 *     <button onClick={timer.start}>Start</button>
 *   </div>
 * );
 * ```
 */
export function useQuizTimer({
  initialTime,
  autoStart = false,
  onTimeUp,
  onTick,
}: UseQuizTimerOptions): UseQuizTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  const onTickRef = useRef(onTick);

  // Keep refs updated
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
    onTickRef.current = onTick;
  }, [onTimeUp, onTick]);

  // Calculate progress percentage
  const progress = initialTime > 0 ? (timeRemaining / initialTime) * 100 : 0;

  // Start timer
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Pause timer
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset timer to initial time
  const reset = useCallback(() => {
    setTimeRemaining(initialTime);
    setIsRunning(false);
  }, [initialTime]);

  // Restart with new time
  const restart = useCallback((newTime: number) => {
    setTimeRemaining(newTime);
    setIsRunning(true);
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;

          // Call onTick if provided
          if (onTickRef.current) {
            onTickRef.current(newTime);
          }

          // Check if time is up
          if (newTime <= 0) {
            setIsRunning(false);
            if (onTimeUpRef.current) {
              onTimeUpRef.current();
            }
            return 0;
          }

          return newTime;
        });
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }

    // Clean up interval when paused or time is up
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning, timeRemaining]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeRemaining,
    isRunning,
    initialTime,
    progress,
    start,
    pause,
    reset,
    restart,
  };
}
