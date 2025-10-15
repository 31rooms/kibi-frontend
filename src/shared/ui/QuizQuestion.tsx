'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface QuizQuestionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The question text to display */
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
          'rounded-lg p-6 bg-white',
          className
        )}
        style={{ border: '1px solid #DEE2E6' }}
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

        <p className="text-base md:text-lg font-medium text-primary-blue leading-relaxed">
          {question}
        </p>
      </div>
    );
  }
);

QuizQuestion.displayName = 'QuizQuestion';
