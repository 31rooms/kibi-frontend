'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface QuizProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current question number (1-based) */
  current: number;

  /** Total number of questions */
  total: number;

  /** Show as fraction (1/10) or percentage (10%) */
  format?: 'fraction' | 'percentage';

  /** Custom separator for fraction format */
  separator?: string;
}

export const QuizProgress = React.forwardRef<HTMLDivElement, QuizProgressProps>(
  (
    {
      className,
      current,
      total,
      format = 'fraction',
      separator = '/',
      ...props
    },
    ref
  ) => {
    const getDisplayText = () => {
      if (format === 'percentage') {
        const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
        return `${percentage}%`;
      }
      return `${current}${separator}${total}`;
    };

    const progress = total > 0 ? (current / total) * 100 : 0;

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-3', className)}
        {...props}
      >
        {/* Progress Bar */}
        <div className="flex-1 h-2 bg-[#f0f2f4] dark:bg-[#272E3A] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#95c16b] dark:bg-[#95C16B] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Question ${current} of ${total}`}
          />
        </div>

        {/* Progress Text at the right */}
        <span className="text-base font-semibold text-primary-blue dark:text-white font-rubik tabular-nums whitespace-nowrap">
          {getDisplayText()}
        </span>
      </div>
    );
  }
);

QuizProgress.displayName = 'QuizProgress';
