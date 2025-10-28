'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Sun, Moon } from 'lucide-react';

export interface ToggleWithTextProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'style'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  style?: '1' | '2' | '3' | '4';
  offLabel?: string;
  onLabel?: string;
}

export const ToggleWithText = React.forwardRef<HTMLButtonElement, ToggleWithTextProps>(
  (
    {
      className,
      checked = false,
      onCheckedChange,
      style = '1',
      offLabel = 'Auto Saver Off',
      onLabel = 'Auto Saver On',
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

    // Style 1: Simple toggle with text
    if (style === '1') {
      return (
        <div className={cn('flex items-center gap-3', className)}>
          <button
            ref={ref}
            role="switch"
            aria-checked={checked}
            onClick={handleClick}
            disabled={disabled}
            className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            {...props}
          >
            <div
              className={cn(
                'relative inline-flex h-[26px] w-[50px] rounded-[30px] transition-all duration-200',
                checked ? 'bg-[#95c16b]' : 'bg-[#5f6774]'
              )}
            >
              <div
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white dark:bg-[#171B22] transition-all duration-200',
                  checked ? 'left-[calc(100%-3px)] -translate-x-full' : 'left-[3px]'
                )}
              />
            </div>
          </button>
          <p className="text-sm text-[#373737] dark:text-white font-['Rubik',sans-serif]">
            {checked ? onLabel : offLabel}
          </p>
        </div>
      );
    }

    // Style 2: Light/Dark mode with cards
    if (style === '2') {
      return (
        <div
          className={cn(
            'bg-white dark:bg-[#171B22] h-[48px] w-[275px] rounded-[6px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.12)] relative',
            className
          )}
        >
          <div className="absolute inset-[5px] flex">
            {/* Light mode button */}
            <button
              ref={ref}
              onClick={() => !disabled && onCheckedChange && onCheckedChange(false)}
              disabled={disabled}
              className={cn(
                'flex-1 rounded-[4px] transition-all duration-200 flex items-center justify-center gap-2 px-3',
                !checked ? 'bg-gray-50' : 'bg-white dark:bg-[#171B22]'
              )}
              {...props}
            >
              <Sun className={cn('h-4 w-4', !checked ? 'text-[#47830e]' : 'text-[#637381]')} />
              <span
                className={cn(
                  'text-sm font-medium',
                  !checked ? 'text-[#47830e]' : 'text-[#637381]'
                )}
              >
                Light mode
              </span>
            </button>

            {/* Dark mode button */}
            <button
              onClick={() => !disabled && onCheckedChange && onCheckedChange(true)}
              disabled={disabled}
              className={cn(
                'flex-1 rounded-[4px] transition-all duration-200 flex items-center justify-center gap-2 px-3',
                checked ? 'bg-gray-50' : 'bg-white dark:bg-[#171B22]'
              )}
            >
              <Moon className={cn('h-4 w-4', checked ? 'text-[#47830e]' : 'text-[#637381]')} />
              <span
                className={cn('text-sm font-medium', checked ? 'text-[#47830e]' : 'text-[#637381]')}
              >
                Dark mode
              </span>
            </button>
          </div>
        </div>
      );
    }

    // Style 3: Text - Toggle - Text
    if (style === '3') {
      return (
        <div className={cn('flex items-center gap-3', className)}>
          <p className="text-sm font-medium text-[#111928] dark:text-white">Light</p>
          <button
            ref={ref}
            role="switch"
            aria-checked={checked}
            onClick={handleClick}
            disabled={disabled}
            className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            {...props}
          >
            <div
              className={cn(
                'relative inline-flex h-[32px] w-[60px] rounded-[30px] transition-all duration-200',
                checked ? 'bg-[#111928]' : 'bg-gray-200'
              )}
            >
              <div
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white dark:bg-[#171B22] transition-all duration-200',
                  checked ? 'left-[calc(100%-2px)] -translate-x-full' : 'left-[2px]'
                )}
              />
            </div>
          </button>
          <p className="text-sm font-medium text-[#111928] dark:text-white">Dark</p>
        </div>
      );
    }

    // Style 4: Switch Version with icon buttons
    if (style === '4') {
      return (
        <div className={cn('flex items-center gap-3', className)}>
          <p className="text-sm font-medium text-[#111928] dark:text-white">Switch Version</p>
          <div className="bg-white dark:bg-[#171B22] h-[46px] w-[82px] rounded-[6px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.12)] relative p-[5px]">
            <div className="flex gap-1 h-full">
              {/* Light button */}
              <button
                ref={ref}
                onClick={() => !disabled && onCheckedChange && onCheckedChange(false)}
                disabled={disabled}
                className={cn(
                  'flex-1 rounded-[4px] transition-all duration-200 flex items-center justify-center',
                  !checked ? 'bg-[#47830e]' : 'bg-white dark:bg-[#171B22]'
                )}
                {...props}
              >
                <Sun className={cn('h-4 w-4', !checked ? 'text-white' : 'text-[#637381]')} />
              </button>

              {/* Dark button */}
              <button
                onClick={() => !disabled && onCheckedChange && onCheckedChange(true)}
                disabled={disabled}
                className={cn(
                  'flex-1 rounded-[4px] transition-all duration-200 flex items-center justify-center',
                  checked ? 'bg-[#47830e]' : 'bg-white dark:bg-[#171B22]'
                )}
              >
                <Moon className={cn('h-4 w-4', checked ? 'text-white' : 'text-[#637381]')} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
);

ToggleWithText.displayName = 'ToggleWithText';
