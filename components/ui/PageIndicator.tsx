import React from 'react';
import { cn } from '@/lib/utils';

export interface PageIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  totalPages: number;
  currentPage: number;
  onPageClick?: (page: number) => void;
}

export const PageIndicator = React.forwardRef<HTMLDivElement, PageIndicatorProps>(
  ({ totalPages, currentPage, onPageClick, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center gap-2', className)}
        role="navigation"
        aria-label="Pagination"
        {...props}
      >
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageClick?.(pageNumber)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                isActive ? 'w-8 bg-[var(--color-button-green-default)]' : 'w-2 bg-grey-300',
                onPageClick && 'cursor-pointer hover:bg-grey-400'
              )}
              aria-label={`Go to slide ${pageNumber + 1}`}
              aria-current={isActive ? 'true' : 'false'}
              type="button"
            />
          );
        })}
      </div>
    );
  }
);

PageIndicator.displayName = 'PageIndicator';
