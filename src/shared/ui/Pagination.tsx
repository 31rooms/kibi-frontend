'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  // Calculate which pages to show (max 5 visible)
  const getVisiblePages = (): number[] => {
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // If current page is near the start
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    // If current page is near the end
    if (currentPage >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    // Current page is in the middle
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const visiblePages = getVisiblePages();
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const buttonBaseClasses = cn(
    'w-[48px] h-[48px] rounded-full flex items-center justify-center',
    'transition-colors duration-200',
    'font-[family-name:var(--font-quicksand)] text-[18px] font-medium'
  );

  const inactiveButtonClasses = cn(
    buttonBaseClasses,
    'border border-grey-400 dark:border-dark-500',
    'bg-transparent dark:bg-dark-900',
    'text-grey-700 dark:text-grey-400',
    'hover:bg-grey-100 dark:hover:bg-dark-700'
  );

  const activeButtonClasses = cn(
    buttonBaseClasses,
    'bg-primary-green border-primary-green',
    'text-white dark:text-dark-900'
  );

  const disabledButtonClasses = cn(
    buttonBaseClasses,
    'border border-grey-300 dark:border-dark-600',
    'bg-transparent dark:bg-dark-900',
    'text-grey-400 dark:text-dark-600',
    'cursor-not-allowed'
  );

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0 p-1',
        'rounded-full',
        'border border-grey-400 dark:border-dark-500',
        'bg-white dark:bg-dark-900',
        className
      )}
    >
      {/* Previous Button */}
      <button
        onClick={() => canGoPrev && onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        className={canGoPrev ? inactiveButtonClasses : disabledButtonClasses}
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={currentPage === page ? activeButtonClasses : inactiveButtonClasses}
          aria-label={`Página ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => canGoNext && onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={canGoNext ? inactiveButtonClasses : disabledButtonClasses}
        aria-label="Página siguiente"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

Pagination.displayName = 'Pagination';
