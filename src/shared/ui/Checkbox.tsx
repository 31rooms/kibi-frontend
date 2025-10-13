'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'style'> {
  checked?: boolean | 'indeterminate';
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  style?: '1' | '2' | '3' | '4' | '5';
  label?: string;
  labelClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      checked = false,
      onCheckedChange,
      style = '2',
      label,
      labelClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        if (checked === 'indeterminate') {
          onCheckedChange(true);
        } else if (checked === true) {
          onCheckedChange(false);
        } else {
          onCheckedChange(true);
        }
      }
    };

    const state =
      checked === 'indeterminate'
        ? 'indeterminate'
        : checked
          ? 'checked'
          : 'unchecked';

    // Style 1: Square with inner square fill
    if (style === '1') {
      const checkboxElement = (
        <button
          ref={ref}
          role="checkbox"
          aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
          data-state={state}
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            'h-5 w-5 shrink-0 rounded border-2 transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#47830e]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'border-[#dee2e6] hover:border-[#5f6774]',
            'flex items-center justify-center',
            className
          )}
          {...props}
        >
          {state === 'checked' && (
            <div className="h-2.5 w-2.5 rounded-[1px] bg-[#47830e]" />
          )}
          {state === 'indeterminate' && (
            <div className="h-0.5 w-2.5 bg-[#47830e]" />
          )}
        </button>
      );

      if (label) {
        return (
          <div className="flex items-center gap-2">
            {checkboxElement}
            <label
              className={cn(
                'text-sm leading-none cursor-pointer select-none',
                disabled && 'cursor-not-allowed opacity-50',
                labelClassName
              )}
              onClick={handleClick}
            >
              {label}
            </label>
          </div>
        );
      }

      return checkboxElement;
    }

    // Style 2: Square with checkmark (default)
    if (style === '2') {
      const checkboxElement = (
        <button
          ref={ref}
          role="checkbox"
          aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
          data-state={state}
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            'h-5 w-5 shrink-0 rounded border-2 transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#47830e]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            state === 'checked' || state === 'indeterminate'
              ? 'bg-[#47830e] border-[#47830e]'
              : 'border-[#dee2e6] hover:border-[#5f6774]',
            'flex items-center justify-center',
            className
          )}
          {...props}
        >
          {state === 'checked' && (
            <Check className="h-4 w-4 text-white" strokeWidth={3} />
          )}
          {state === 'indeterminate' && (
            <Minus className="h-4 w-4 text-white" strokeWidth={3} />
          )}
        </button>
      );

      if (label) {
        return (
          <div className="flex items-center gap-2">
            {checkboxElement}
            <label
              className={cn(
                'text-sm leading-none cursor-pointer select-none',
                disabled && 'cursor-not-allowed opacity-50',
                labelClassName
              )}
              onClick={handleClick}
            >
              {label}
            </label>
          </div>
        );
      }

      return checkboxElement;
    }

    // Style 3: Square with light background and green check
    if (style === '3') {
      const checkboxElement = (
        <button
          ref={ref}
          role="checkbox"
          aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
          data-state={state}
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            'h-5 w-5 shrink-0 rounded border-2 transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#47830e]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            state === 'checked' || state === 'indeterminate'
              ? 'bg-[#f1f4ff] border-[#dee2e6]'
              : 'border-[#dee2e6] hover:border-[#5f6774]',
            'flex items-center justify-center',
            className
          )}
          {...props}
        >
          {state === 'checked' && (
            <Check className="h-4 w-4 text-[#47830e]" strokeWidth={3} />
          )}
          {state === 'indeterminate' && (
            <Minus className="h-4 w-4 text-[#47830e]" strokeWidth={3} />
          )}
        </button>
      );

      if (label) {
        return (
          <div className="flex items-center gap-2">
            {checkboxElement}
            <label
              className={cn(
                'text-sm leading-none cursor-pointer select-none',
                disabled && 'cursor-not-allowed opacity-50',
                labelClassName
              )}
              onClick={handleClick}
            >
              {label}
            </label>
          </div>
        );
      }

      return checkboxElement;
    }

    // Style 4: Circle that fills solid when checked
    if (style === '4') {
      const checkboxElement = (
        <button
          ref={ref}
          role="checkbox"
          aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
          data-state={state}
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            'h-5 w-5 shrink-0 rounded-full border-2 transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#47830e]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            state === 'checked' || state === 'indeterminate'
              ? 'bg-[#47830e] border-[#47830e]'
              : 'border-[#dee2e6] hover:border-[#5f6774]',
            'flex items-center justify-center',
            className
          )}
          {...props}
        >
          {state === 'checked' && (
            <Check className="h-3 w-3 text-white" strokeWidth={4} />
          )}
          {state === 'indeterminate' && (
            <Minus className="h-3 w-3 text-white" strokeWidth={4} />
          )}
        </button>
      );

      if (label) {
        return (
          <div className="flex items-center gap-2">
            {checkboxElement}
            <label
              className={cn(
                'text-sm leading-none cursor-pointer select-none',
                disabled && 'cursor-not-allowed opacity-50',
                labelClassName
              )}
              onClick={handleClick}
            >
              {label}
            </label>
          </div>
        );
      }

      return checkboxElement;
    }

    // Style 5: Circle with small inner circle when checked
    if (style === '5') {
      const checkboxElement = (
        <button
          ref={ref}
          role="checkbox"
          aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
          data-state={state}
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            'h-5 w-5 shrink-0 rounded-full border-2 transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#47830e]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'border-[#dee2e6] hover:border-[#5f6774]',
            'flex items-center justify-center',
            className
          )}
          {...props}
        >
          {state === 'checked' && (
            <div className="h-2.5 w-2.5 rounded-full bg-[#47830e]" />
          )}
          {state === 'indeterminate' && (
            <div className="h-0.5 w-2.5 bg-[#47830e]" />
          )}
        </button>
      );

      if (label) {
        return (
          <div className="flex items-center gap-2">
            {checkboxElement}
            <label
              className={cn(
                'text-sm leading-none cursor-pointer select-none',
                disabled && 'cursor-not-allowed opacity-50',
                labelClassName
              )}
              onClick={handleClick}
            >
              {label}
            </label>
          </div>
        );
      }

      return checkboxElement;
    }

    return null;
  }
);

Checkbox.displayName = 'Checkbox';
