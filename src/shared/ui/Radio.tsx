'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  labelClassName?: string;
}

/**
 * Radio Button Component
 * A reusable radio button with circle indicator
 * Follows the same pattern as Checkbox component (style 5)
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      checked = false,
      onCheckedChange,
      label,
      labelClassName,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };

    const radioElement = (
      <div className="relative inline-block">
        <input
          ref={ref}
          id={inputId}
          type="radio"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'h-5 w-5 flex items-center justify-center shrink-0 rounded-full border-2 transition-all duration-200 cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-green',
            disabled && 'cursor-not-allowed opacity-50',
            checked
              ? 'border-primary-green bg-white'
              : 'border-grey-400 dark:border-grey-500 hover:border-grey-500 dark:hover:border-grey-400',
            className
          )}
        >
          {checked && (
            <div className="h-2.5 w-2.5 rounded-full bg-primary-green" />
          )}
        </label>
      </div>
    );

    if (label) {
      return (
        <div className="flex items-center gap-2">
          {radioElement}
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm leading-none cursor-pointer select-none text-dark-900 dark:text-white',
              disabled && 'cursor-not-allowed opacity-50',
              labelClassName
            )}
          >
            {label}
          </label>
        </div>
      );
    }

    return radioElement;
  }
);

Radio.displayName = 'Radio';
