'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { MarkdownRenderer } from './MarkdownRenderer';

export interface QuizQuestionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The question text to display (supports Markdown) */
  question: string;

  /** Question number (optional, for display) */
  questionNumber?: number;

  /** Card variant style */
  variant?: 'default' | 'elevated' | 'bordered';
}

export const QuizQuestion = React.forwardRef<HTMLDivElement, QuizQuestionProps>(
  (
    {
      className,
      question,
      questionNumber,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg p-6 bg-white dark:bg-[#171B22] border border-[#DEE2E6] dark:border-[#374151]',
          className
        )}
        role="region"
        aria-label="Question"
        {...props}
      >
        {questionNumber !== undefined && (
          <div className="mb-3">
            <span className="inline-flex items-center justify-center h-6 px-3 rounded-full bg-primary-green/10 text-primary-green text-xs font-semibold">
              Pregunta {questionNumber}
            </span>
          </div>
        )}

        <MarkdownRenderer
          content={question}
          className="text-base md:text-lg font-medium text-primary-blue dark:text-white leading-relaxed [&>p]:mb-0"
        />
      </div>
    );
  }
);

QuizQuestion.displayName = 'QuizQuestion';
