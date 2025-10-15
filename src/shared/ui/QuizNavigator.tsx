'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from './Button';
import { ArrowRight, ArrowLeft, Send } from 'lucide-react';

export interface QuizNavigatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the current question is answered */
  isAnswered: boolean;

  /** Whether this is the last question */
  isLastQuestion: boolean;

  /** Whether this is the first question */
  isFirstQuestion: boolean;

  /** Whether navigation is allowed backwards */
  canGoPrevious?: boolean;

  /** Callback when next/submit is clicked */
  onNext?: () => void;

  /** Callback when previous is clicked */
  onPrevious?: () => void;

  /** Loading state for submission */
  loading?: boolean;

  /** Custom text for submit button */
  submitText?: string;

  /** Custom text for next button */
  nextText?: string;

  /** Custom text for previous button */
  previousText?: string;

  /** Layout direction */
  direction?: 'row' | 'column';
}

export const QuizNavigator = React.forwardRef<HTMLDivElement, QuizNavigatorProps>(
  (
    {
      className,
      isAnswered,
      isLastQuestion,
      isFirstQuestion,
      canGoPrevious = true,
      onNext,
      onPrevious,
      loading = false,
      submitText = 'Enviar respuesta',
      nextText = 'Siguiente',
      previousText = 'Anterior',
      direction = 'row',
      ...props
    },
    ref
  ) => {
    const handleNext = () => {
      if (!loading && isAnswered && onNext) {
        onNext();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex justify-center items-center',
          className
        )}
        {...props}
      >
        {/* Single Submit Button - Always shows "Enviar respuesta" */}
        <Button
          variant="primary"
          color="green"
          size="medium"
          onClick={handleNext}
          disabled={!isAnswered || loading}
          loading={loading}
          className="flex items-center gap-2"
          aria-label="Submit answer"
        >
          {submitText}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }
);

QuizNavigator.displayName = 'QuizNavigator';
