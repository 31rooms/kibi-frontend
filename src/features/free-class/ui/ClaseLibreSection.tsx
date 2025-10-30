'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';

export const ClaseLibreSection = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          "flex-1 overflow-y-auto p-6 md:p-8",
          "bg-white dark:bg-[#171B22]",
          className
        )}
        {...props}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-6">
            Clase Libre
          </h1>
          <p className="text-grey-600 dark:text-grey-400">
            Esta seccion permitira practicar libremente.
          </p>
        </div>
      </main>
    );
  }
);

ClaseLibreSection.displayName = 'ClaseLibreSection';
