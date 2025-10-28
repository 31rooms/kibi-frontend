'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface QuizTimerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Time remaining in seconds */
  timeRemaining: number;

  /** Initial time in seconds for calculating progress */
  initialTime: number;

  /** Whether the timer is running */
  isRunning?: boolean;

  /** Callback when time runs out */
  onTimeUp?: () => void;

  /** Show progress bar below timer */
  showProgress?: boolean;
}

export const QuizTimer = React.forwardRef<HTMLDivElement, QuizTimerProps>(
  (
    {
      className,
      timeRemaining,
      initialTime,
      isRunning = true,
      onTimeUp,
      showProgress = false, // Changed default to false
      ...props
    },
    ref
  ) => {
    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Trigger onTimeUp when time reaches 0
    React.useEffect(() => {
      if (timeRemaining === 0 && onTimeUp) {
        onTimeUp();
      }
    }, [timeRemaining, onTimeUp]);

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#E7FFE7] dark:bg-[#1E242D]',
          className
        )}
        {...props}
      >
        {/* Timer Display */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <path
            d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
            className="stroke-[#47830E] dark:stroke-[#95C16B]"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 6V10L13 13"
            className="stroke-[#47830E] dark:stroke-[#95C16B]"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className={cn(
            'text-base font-rubik tabular-nums font-bold',
            timeRemaining <= 15 ? 'text-[#DC2626]' : 'text-[#373737] dark:text-white',
            !isRunning && 'opacity-50'
          )}
        >
          {formatTime(timeRemaining)}
        </span>
      </div>
    );
  }
);

QuizTimer.displayName = 'QuizTimer';
