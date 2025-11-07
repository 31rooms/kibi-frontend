'use client';

import React from 'react';
import { useTheme } from '@/shared/lib/context';
import { cn } from '@/shared/lib/utils';

export interface CareerTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  career?: string;
  variant?: 'career' | 'recommended';
  bgColorLight?: string;
  bgColorDark?: string;
  textColor?: string;
}

/**
 * CareerTag Component
 * Displays a career badge with automatic theme-aware colors
 *
 * Variants:
 * - career: Light mode bg #47830E33, text #47830E | Dark mode bg #95C16B33, text #95C16B
 * - recommended: bg #4361FF1A, text #3758F9 (both modes)
 *
 * Also supports custom colors via bgColorLight, bgColorDark, and textColor props
 */
export const CareerTag = React.forwardRef<HTMLSpanElement, CareerTagProps>(
  ({
    career = 'Aspirante a ingeniería',
    variant = 'career',
    bgColorLight,
    bgColorDark,
    textColor,
    className,
    ...props
  }, ref) => {
    const { isDarkMode } = useTheme();

    // Define colors based on variant
    const getColors = () => {
      // If custom colors provided, use them
      if (bgColorLight || bgColorDark || textColor) {
        return {
          backgroundColor: isDarkMode ? (bgColorDark || bgColorLight) : bgColorLight,
          color: textColor,
        };
      }

      // Otherwise use predefined variants
      switch (variant) {
        case 'recommended':
          return {
            backgroundColor: '#4361FF1A',
            color: '#3758F9',
          };
        case 'career':
        default:
          return {
            backgroundColor: isDarkMode ? '#95C16B33' : '#47830E33',
            color: isDarkMode ? '#95C16B' : '#47830E',
          };
      }
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 min-h-[28px] text-sm font-medium rounded leading-tight',
          className
        )}
        style={getColors()}
        {...props}
      >
        {career}
      </span>
    );
  }
);

CareerTag.displayName = 'CareerTag';
