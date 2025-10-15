'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import Image from 'next/image';

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

  /** Custom color for the timer (defaults to green) */
  color?: 'green' | 'orange' | 'red';
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
      color = 'green',
      ...props
    },
    ref
  ) => {
    // Calculate progress percentage
    const progress = initialTime > 0 ? (timeRemaining / initialTime) * 100 : 0;

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

    // Determine color based on time remaining
    // Color: always #373737 except when ≤15 seconds (use strong red #DC2626)
    const getTimerColor = () => {
      if (timeRemaining <= 15) return '#DC2626'; // Strong red
      return '#373737'; // Default dark gray
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 rounded-lg',
          className
        )}
        style={{ backgroundColor: '#E7FFE7' }}
        {...props}
      >
        {/* Timer Display */}
        <Image
          src="/icons/timer.svg"
          alt="Timer"
          width={20}
          height={20}
        />
        <span
          className={cn(
            'text-base font-rubik tabular-nums',
            !isRunning && 'opacity-50'
          )}
          style={{
            color: getTimerColor(),
            fontWeight: 'bold'
          }}
        >
          {formatTime(timeRemaining)}
        </span>
      </div>
    );
  }
);

QuizTimer.displayName = 'QuizTimer';
