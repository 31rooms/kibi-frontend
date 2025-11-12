'use client';

import React from 'react';
import { KibiIcon } from './KibiIcon';
import { cn } from '@/shared/lib/utils';

export interface KibibotFloatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Size of the Kibi icon
   * @default 60
   */
  size?: number;
  /**
   * Position from bottom of the screen (in pixels or Tailwind spacing)
   * @default "1rem" (16px)
   */
  bottom?: string | number;
  /**
   * Position from right of the screen (in pixels or Tailwind spacing)
   * @default "1rem" (16px)
   */
  right?: string | number;
  /**
   * Whether to show a pulsing animation
   * @default true
   */
  pulse?: boolean;
  /**
   * Whether to show a notification badge
   * @default false
   */
  showBadge?: boolean;
  /**
   * Custom badge content (e.g., number of notifications)
   */
  badgeContent?: string | number;
}

/**
 * KibibotFloatingButton Component
 * A floating action button featuring the Kibi mascot icon
 * Automatically adapts to light/dark mode with theme-aware icons
 *
 * **Usage:**
 * ```tsx
 * <KibibotFloatingButton onClick={() => openChat()} />
 * <KibibotFloatingButton size={50} showBadge badgeContent={3} />
 * ```
 */
export const KibibotFloatingButton = React.forwardRef<HTMLButtonElement, KibibotFloatingButtonProps>(
  ({
    size = 60,
    bottom = '1rem',
    right = '1rem',
    pulse = true,
    showBadge = false,
    badgeContent,
    className,
    ...props
  }, ref) => {
    // Convert number bottom/right to rem
    const bottomValue = typeof bottom === 'number' ? `${bottom / 16}rem` : bottom;
    const rightValue = typeof right === 'number' ? `${right / 16}rem` : right;

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'fixed z-50',
          'flex items-center justify-center',
          'rounded-full',
          'bg-white dark:bg-[#171B22]',
          'border-2 border-primary-green',
          'shadow-lg hover:shadow-xl',
          'transition-all duration-300',
          'hover:scale-110',
          'focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2',
          // Pulse animation
          pulse && 'animate-pulse hover:animate-none',
          className
        )}
        style={{
          bottom: bottomValue,
          right: rightValue,
          width: `${size}px`,
          height: `${size}px`,
        }}
        aria-label="Abrir chat de Kibibot"
        {...props}
      >
        <KibiIcon size={size * 0.7} />

        {/* Notification Badge */}
        {showBadge && (
          <span
            className={cn(
              'absolute -top-1 -right-1',
              'flex items-center justify-center',
              'min-w-[20px] h-5 px-1',
              'bg-error-500 text-white',
              'text-xs font-bold',
              'rounded-full',
              'border-2 border-white dark:border-[#171B22]',
              'shadow-md'
            )}
          >
            {badgeContent || ''}
          </span>
        )}
      </button>
    );
  }
);

KibibotFloatingButton.displayName = 'KibibotFloatingButton';
