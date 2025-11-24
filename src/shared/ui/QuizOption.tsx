'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from './Checkbox';
import { MarkdownRenderer } from './MarkdownRenderer';

export interface QuizOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The option text to display (supports Markdown) */
  text: string;

  /** Whether this option is selected */
  selected?: boolean;

  /** Whether this is a multiple choice question (checkbox vs radio) */
  multipleChoice?: boolean;

  /** Callback when option is clicked */
  onSelect?: () => void;

  /** Whether the option is disabled */
  disabled?: boolean;

  /** Option letter/number for display (A, B, C, etc.) - NOT USED in new design */
  label?: string;

  /** Show result state (correct/incorrect) - for review mode */
  resultState?: 'correct' | 'incorrect' | null;

  /** Unique ID for the input (required for label association) */
  id?: string;
}

export const QuizOption = React.forwardRef<HTMLDivElement, QuizOptionProps>(
  (
    {
      className,
      text,
      selected = false,
      multipleChoice = false,
      onSelect,
      disabled = false,
      label, // NOT USED in new design
      resultState = null,
      id,
      ...props
    },
    ref
  ) => {
    const handleChange = (checked?: boolean | 'indeterminate') => {
      if (!disabled && onSelect) {
        onSelect();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 py-2 cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={() => !disabled && onSelect && onSelect()}
        {...props}
      >
        {/* Use Checkbox from design system - always style 2 (default) */}
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => {
            // Don't call onSelect here, it's handled by the div onClick
            // This prevents double-triggering
          }}
          disabled={disabled}
        />

        {/* Label with option text */}
        <div
          className={cn(
            'flex-1 text-base font-normal text-primary-blue dark:text-white select-none',
            disabled && 'cursor-not-allowed'
          )}
        >
          <MarkdownRenderer
            content={text}
            className="[&>p]:mb-0 [&>p]:inline"
          />
        </div>
      </div>
    );
  }
);

QuizOption.displayName = 'QuizOption';
