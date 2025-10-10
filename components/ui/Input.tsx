'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const inputVariants = cva(
  'w-full rounded-lg px-3 py-2 text-sm transition-all duration-200 placeholder:text-grey-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-grey-300 bg-white text-grey-900 hover:border-grey-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
        error:
          'border border-error-500 bg-white text-grey-900 focus:border-error-500 focus:ring-2 focus:ring-error-100',
        success:
          'border border-success-500 bg-white text-grey-900 focus:border-success-500 focus:ring-2 focus:ring-success-100',
        disabled: 'border border-dashed border-grey-300 bg-grey-50 text-grey-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  showClearButton?: boolean;
  onClear?: () => void;
  variant?: VariantProps<typeof inputVariants>['variant'];
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      helperText,
      error,
      success,
      leadingIcon,
      trailingIcon,
      showClearButton,
      onClear,
      variant,
      disabled,
      containerClassName,
      ...props
    },
    ref
  ) => {
    // Determine the actual variant based on props
    const actualVariant = disabled
      ? 'disabled'
      : error
        ? 'error'
        : success
          ? 'success'
          : variant || 'default';

    // Determine helper text and icon
    const displayHelperText = error || success || helperText;
    const displayHelperColor = error
      ? 'text-error-500'
      : success
        ? 'text-success-500'
        : 'text-grey-600';

    // Determine trailing icon
    const defaultTrailingIcon = error ? (
      <AlertCircle className="h-4 w-4 text-error-500" />
    ) : success ? (
      <CheckCircle className="h-4 w-4 text-success-500" />
    ) : null;

    const finalTrailingIcon = trailingIcon || defaultTrailingIcon;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="mb-2 block text-sm font-medium text-grey-700">
            {label}
          </label>
        )}
        <div className="relative">
          {leadingIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-grey-400">
              {leadingIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: actualVariant }),
              leadingIcon && 'pl-10',
              (finalTrailingIcon || showClearButton) && 'pr-10',
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {(finalTrailingIcon || showClearButton) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {showClearButton && props.value && !disabled && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-grey-400 hover:text-grey-600 transition-colors"
                  tabIndex={-1}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {finalTrailingIcon && !showClearButton && (
                <div className="text-grey-400">{finalTrailingIcon}</div>
              )}
            </div>
          )}
        </div>
        {displayHelperText && (
          <p className={cn('mt-1.5 text-xs', displayHelperColor)}>
            {displayHelperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
