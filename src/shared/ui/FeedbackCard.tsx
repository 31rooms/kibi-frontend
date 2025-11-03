'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { MarkdownRenderer } from './MarkdownRenderer';

export interface FeedbackCardProps {
  /**
   * Type of feedback - determines icon and message
   */
  isCorrect: boolean;
  /**
   * Custom message (optional) - defaults to standard messages.
   * Supports plain text, Markdown, and LaTeX equations.
   */
  message?: string;
  /**
   * Enable markdown/LaTeX rendering for the message
   * @default false - uses plain text
   */
  enableMarkdown?: boolean;
  /**
   * Show Kibi icon below the feedback card
   * @default true
   */
  showKibiIcon?: boolean;
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * FeedbackCard Component
 *
 * A reusable feedback card with success/error states and dark mode support.
 * Used throughout the app for showing validation feedback with Kibi branding.
 *
 * Features:
 * - Success/Error states with appropriate icons
 * - Dark mode support
 * - Optional Kibi mascot icon
 * - Tooltip-style design with triangle pointer
 * - Supports plain text, Markdown, and LaTeX equations
 *
 * @example
 * ```tsx
 * // Plain text
 * <FeedbackCard
 *   isCorrect={false}
 *   message="Tu respuesta no es correcta, veamos por qué"
 *   showKibiIcon={true}
 * />
 *
 * // With Markdown and LaTeX
 * <FeedbackCard
 *   isCorrect={false}
 *   message="La respuesta correcta es $x^2 + y^2 = r^2$"
 *   enableMarkdown={true}
 *   showKibiIcon={true}
 * />
 * ```
 */
export const FeedbackCard = React.forwardRef<HTMLDivElement, FeedbackCardProps>(
  ({ isCorrect, message, enableMarkdown = false, showKibiIcon = true, className }, ref) => {
    const defaultMessage = isCorrect
      ? '¡Respuesta correcta!'
      : 'Tu respuesta no es correcta, veamos por qué';

    const finalMessage = message || defaultMessage;

    return (
      <div ref={ref} className={cn('flex flex-col items-center gap-4 py-4', className)}>
        {/* Feedback Card */}
        <div className="relative flex items-center gap-3 px-6 py-4 bg-white dark:bg-[#1E242D] rounded-[20px] shadow-[0px_12px_40px_15px_#0000001A] dark:shadow-[0px_12px_40px_15px_#00000040]">
          {/* Icon */}
          <div className="flex-shrink-0">
            <Image
              src={isCorrect ? '/icons/succes-icon.svg' : '/icons/error-icon.svg'}
              alt={isCorrect ? 'success' : 'error'}
              width={36}
              height={36}
            />
          </div>

          {/* Message */}
          {enableMarkdown ? (
            <div className="max-w-sm">
              <MarkdownRenderer
                content={finalMessage}
                className="text-dark-900 dark:text-white font-medium text-base leading-snug [&>p]:mb-0 [&>p:last-child]:mb-0"
              />
            </div>
          ) : (
            <p className="text-dark-900 dark:text-white font-medium text-base leading-snug max-w-sm">
              {finalMessage}
            </p>
          )}

          {/* Triangle/Bonete - pointing down */}
          {showKibiIcon && (
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
              style={{
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '12px solid currentColor',
                filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.05))',
              }}
            >
              <style jsx>{`
                div {
                  color: white;
                }
                :global(.dark) div {
                  color: #1E242D;
                }
              `}</style>
            </div>
          )}
        </div>

        {/* Kibi Icon - with dark mode support */}
        {showKibiIcon && (
          <div className="flex-shrink-0">
            <Image
              src="/illustrations/Kibi Icon.svg"
              alt="Kibi"
              width={80}
              height={80}
              className="dark:hidden"
            />
            <Image
              src="/illustrations/Kibi Icon blanco.svg"
              alt="Kibi"
              width={80}
              height={80}
              className="hidden dark:block"
            />
          </div>
        )}
      </div>
    );
  }
);

FeedbackCard.displayName = 'FeedbackCard';
