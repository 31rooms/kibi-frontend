'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface QuizTextInputProps {
  /** Current text value */
  value: string;

  /** Change handler */
  onChange: (value: string) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Maximum character limit */
  maxLength?: number;

  /** Custom className */
  className?: string;

  /** Disabled state */
  disabled?: boolean;
}

/**
 * QuizTextInput Component
 *
 * Text input component for quiz questions requiring text responses.
 * Features a textarea with character counter.
 */
export function QuizTextInput({
  value,
  onChange,
  placeholder = 'Escriba su respuesta',
  maxLength = 200,
  className,
  disabled = false,
}: QuizTextInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Label */}
      <label className="block text-base font-medium text-grey-900 dark:text-white mb-3">
        Respuesta
      </label>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={6}
          className={cn(
            'w-full px-4 py-3 rounded-lg border border-grey-300 dark:border-[#374151]',
            'text-base text-grey-900 dark:text-white placeholder:text-grey-500 dark:placeholder:text-grey-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-blue dark:focus:ring-[#374151] focus:border-transparent dark:focus:border-[#374151]',
            'resize-none transition-colors',
            'disabled:bg-grey-100 disabled:cursor-not-allowed',
            'bg-white dark:bg-[#171B22]'
          )}
        />

        {/* Character Counter */}
        <div className="flex justify-end mt-2">
          <span className="text-sm text-grey-600 dark:text-grey-400">
            {value.length}/{maxLength}
          </span>
        </div>
      </div>
    </div>
  );
}
