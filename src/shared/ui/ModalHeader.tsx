'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';

export interface ModalHeaderProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  size?: 'default' | 'small' | 'large';
  className?: string;
  children?: React.ReactNode;
  /** Customize the separator color (defaults to primary-green in dark mode, #47830E in light mode) */
  separatorColor?: string;
}

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  (
    {
      open = false,
      onOpenChange,
      title = 'Modal',
      subtitle,
      size = 'default',
      className,
      children,
      separatorColor,
    },
    ref
  ) => {
    const handleClose = () => {
      onOpenChange?.(false);
    };

    if (!open) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={handleClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Modal Content */}
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'relative bg-white dark:bg-[#171B22] rounded-lg shadow-lg flex flex-col overflow-hidden',
            size === 'small' && 'w-[320px]',
            size === 'default' && 'w-[400px]',
            size === 'large' && 'w-[500px]',
            className
          )}
        >
          {/* Header with border-bottom */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#DEE2E6] dark:border-[#374151]">
            <h2 className="text-[20px] font-bold text-[#373737] dark:text-white font-['Quicksand',sans-serif]">
              {title}
            </h2>
            <button
              onClick={handleClose}
              className="text-grey-500 hover:text-grey-700 dark:text-grey-400 dark:hover:text-grey-200 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="h-6 w-6" strokeWidth={2} />
            </button>
          </div>

          {/* Subtitle section with separator below */}
          {subtitle && (
            <>
              <div className="px-6 py-4 flex flex-col items-center gap-3">
                <h3 className="text-[18px] font-semibold text-[#373737] dark:text-white font-['Quicksand',sans-serif] text-center">
                  {subtitle}
                </h3>

                {/* Colored Separator - centered and 20% width */}
                <div
                  className={cn(
                    'h-[3px] w-[20%] rounded-full',
                    separatorColor ? '' : 'bg-[#47830E] dark:bg-[#95C16B]'
                  )}
                  style={separatorColor ? { backgroundColor: separatorColor } : undefined}
                />
              </div>
            </>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';
