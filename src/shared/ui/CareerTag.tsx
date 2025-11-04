'use client';

import React from 'react';
import { useTheme } from '@/shared/lib/context';
import { cn } from '@/shared/lib/utils';

export interface CareerTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  career?: string;
}

/**
 * CareerTag Component
 * Displays a career badge with automatic theme-aware colors
 * Light mode: bg #47830E33, text #47830E
 * Dark mode: bg #95C16B33, text #95C16B
 */
export const CareerTag = React.forwardRef<HTMLSpanElement, CareerTagProps>(
  ({ career = 'Aspirante a ingeniería', className, ...props }, ref) => {
    const { isDarkMode } = useTheme();

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 min-h-[28px] text-sm font-medium rounded leading-tight',
          className
        )}
        style={{
          backgroundColor: isDarkMode ? '#95C16B33' : '#47830E33',
          color: isDarkMode ? '#95C16B' : '#47830E',
        }}
        {...props}
      >
        {career}
      </span>
    );
  }
);

CareerTag.displayName = 'CareerTag';
