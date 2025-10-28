'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { X, Check, Circle } from 'lucide-react';

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'style'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  style?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
  label?: string;
  labelPosition?: 'left' | 'right';
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      checked = false,
      onCheckedChange,
      style = '1',
      label,
      labelPosition = 'right',
      disabled,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    const renderToggle = () => {
      const baseClasses = 'relative inline-flex h-8 w-[55px] rounded-[30px] transition-all duration-200';

      // Style 1: Default green toggle
      if (style === '1') {
        return (
          <div
            className={cn(
              baseClasses,
              checked ? 'bg-[#95c16b]' : 'bg-[#5f6774]'
            )}
          >
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white dark:bg-[#171B22] transition-all duration-200',
                checked ? 'left-[calc(100%-2px)] -translate-x-full' : 'left-[2px]'
              )}
            />
          </div>
        );
      }

      // Style 2: Big circle toggle
      if (style === '2') {
        return (
          <div className={cn(baseClasses, 'bg-gray-200')}>
            <div
              className={cn(
                'absolute top-0 h-full w-[50.91%] rounded-full transition-all duration-200',
                checked ? 'left-[49.09%] bg-[#47830e]' : 'left-0 bg-white dark:bg-[#171B22]'
              )}
            />
          </div>
        );
      }

      // Style 3: Gray with icons
      if (style === '3') {
        return (
          <div className={cn(baseClasses, 'bg-gray-200')}>
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full transition-all duration-200 flex items-center justify-center',
                checked ? 'left-[calc(100%-2px)] -translate-x-full bg-[#47830e]' : 'left-[2px] bg-white dark:bg-[#171B22]'
              )}
            >
              {checked ? (
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
              ) : (
                <X className="h-4 w-4 text-grey-500 dark:text-grey-400" strokeWidth={3} />
              )}
            </div>
          </div>
        );
      }

      // Style 4: Dark toggle
      if (style === '4') {
        return (
          <div
            className={cn(
              baseClasses,
              checked ? 'bg-[#47830e]' : 'bg-[#111928]'
            )}
          >
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-[#e5e7eb] transition-all duration-200',
                checked ? 'left-[calc(100%-2px)] -translate-x-full' : 'left-[2px]'
              )}
            />
          </div>
        );
      }

      // Style 5: Big circle with indicator dots
      if (style === '5') {
        return (
          <div className={cn(baseClasses, 'bg-gray-200')}>
            <div
              className={cn(
                'absolute top-0 h-full w-[50.91%] rounded-full bg-white dark:bg-[#171B22] transition-all duration-200 flex items-center',
                checked ? 'left-[49.09%] justify-start pl-3' : 'left-0 justify-end pr-3'
              )}
            >
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  checked ? 'bg-[#47830e]' : 'bg-gray-400'
                )}
              />
            </div>
          </div>
        );
      }

      // Style 6: Dark green both states
      if (style === '6') {
        return (
          <div className={cn(baseClasses, 'bg-[#47830e]')}>
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white dark:bg-[#171B22] transition-all duration-200',
                checked ? 'left-[calc(100%-2px)] -translate-x-full opacity-100' : 'left-[2px] opacity-40'
              )}
            />
          </div>
        );
      }

      // Style 7: Blue outlined
      if (style === '7') {
        return (
          <div className={cn(baseClasses, 'bg-[#eaeefb] border border-[#bfceff]')}>
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-[#6b7cff] transition-all duration-200',
                checked ? 'left-[calc(100%-2px)] -translate-x-full' : 'left-[2px]'
              )}
            />
          </div>
        );
      }

      // Style 8: Dark/light with icons
      if (style === '8') {
        return (
          <div
            className={cn(
              baseClasses,
              checked ? 'bg-[#eaeefb]' : 'bg-[#111928]'
            )}
          >
            <div
              className={cn(
                'absolute top-0 h-full w-[50.91%] rounded-full transition-all duration-200 flex items-center justify-center',
                checked ? 'left-[49.09%] bg-[#6b7cff]' : 'left-0 bg-[#374151]'
              )}
            >
              <Circle className="h-3 w-3 text-white" strokeWidth={2} />
            </div>
          </div>
        );
      }

      // Style 9: Light blue with icons
      if (style === '9') {
        return (
          <div className={cn(baseClasses, 'bg-[#eaeefb]')}>
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full transition-all duration-200 flex items-center justify-center',
                checked ? 'left-[calc(100%-2px)] -translate-x-full bg-[#6b7cff]' : 'left-[2px] bg-white dark:bg-[#171B22]'
              )}
            >
              {checked ? (
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
              ) : (
                <X className="h-4 w-4 text-grey-400" strokeWidth={3} />
              )}
            </div>
          </div>
        );
      }

      return null;
    };

    const toggleButton = (
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        data-state={checked ? 'on' : 'off'}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        {renderToggle()}
      </button>
    );

    if (label) {
      return (
        <div className="flex items-center gap-3">
          {labelPosition === 'left' && (
            <span className="text-sm text-grey-700 dark:text-grey-300">{label}</span>
          )}
          {toggleButton}
          {labelPosition === 'right' && (
            <span className="text-sm text-grey-700 dark:text-grey-300">{label}</span>
          )}
        </div>
      );
    }

    return toggleButton;
  }
);

Toggle.displayName = 'Toggle';
