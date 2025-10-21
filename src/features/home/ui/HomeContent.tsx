'use client';

import React, { useState, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Alert } from '@/shared/ui';
import type { HomeContentProps } from '../types/home.types';
import { useMySubjects } from '../hooks/useMySubjects';

/**
 * Home Content Component
 * Main content area displaying vertically stacked subjects
 */
export const HomeContent = React.forwardRef<HTMLElement, HomeContentProps>(
  ({ selectedSection }, ref) => {
    const [initialLoading, setInitialLoading] = useState(true);
    const internalRef = useRef<HTMLElement>(null);
    const router = useRouter();

    // Fetch subjects with enabled/disabled state from API
    const { subjects, career, totalQuestions, isLoading, error } = useMySubjects();

    // Combine external ref with internal ref
    React.useImperativeHandle(ref, () => internalRef.current as HTMLElement);

    // Handle subject action button click - Navigate to questionnaire only if enabled
    const handleSubjectAction = (subjectId: number, enabled: boolean) => {
      if (!enabled) {
        console.log(`Subject ID ${subjectId} is disabled`);
        return;
      }
      console.log(`Navigating to questionnaire for subject ID: ${subjectId}`);
      router.push(`/questionnaire/${subjectId}`);
    };

    // Auto-scroll to bottom when data is loaded
    useLayoutEffect(() => {
      const mainElement = internalRef.current;

      // Only execute scroll when data is loaded (isLoading is false and subjects exist)
      if (mainElement && !isLoading && subjects.length > 0) {
        // Wait for content to render, then scroll and hide loader
        requestAnimationFrame(() => {
          mainElement.scrollTop = mainElement.scrollHeight;

          // Hide loader after scroll completes
          setTimeout(() => {
            setInitialLoading(false);
          }, 100);
        });
      }
    }, [isLoading, subjects.length]);

    return (
      <main
        ref={internalRef}
        className={cn(
          "flex-1 overflow-y-auto p-6 md:p-8",
          "bg-background-white",
          "relative",
          "scrollbar-hide"
        )}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
      >
        {/* Loader overlay - show while initial loading or fetching data */}
        {(initialLoading || isLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background-white z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          </div>
        )}

        {/* Content with subjects (always rendered, hidden by loader overlay) */}
        <div className="max-w-7xl mx-auto min-h-full flex flex-col justify-end">
          {/* Container for vertically stacked subjects with curved S-wave layout */}
          {/* Width: 350px, SVGs follow 8-position wave pattern for pronounced symmetric curve */}
          <div className="w-[350px] mx-auto flex flex-col gap-2 pb-6">
            {/* Display all subjects from API (all are enabled) */}
            {subjects.map((subject, index) => {
                // S-wave pattern: 8 positions per cycle for fast symmetric movement
                const wavePosition = index % 8;

                // Calculate horizontal offset based on wave position
                // Creates pronounced curve: right (160px) → left (10px) → right (160px)
                // Positions 0-3: Move from right to left (4 steps)
                // Position 4: Stay at left (extended left peak)
                // Positions 5-7: Return from left to right (3 steps)
                // All positions shifted +10px to the right for better visualization
                const getHorizontalOffset = (position: number): string => {
                  switch(position) {
                    case 0: return 'ml-[220px]';   // Derecha completa (Inglés/inicio) - 150 
                    case 1: return 'ml-[150px]';   // Transición - 100 
                    case 2: return 'ml-[100px]';    // Transición - 50 
                    case 3: return 'ml-[30px]';    // Izquierda completa (Derecho) - 0 
                    case 4: return 'ml-[0px]';    // Izquierda completa (Finanzas - extended left peak) - 0 
                    case 5: return 'ml-[50px]';    // Regresando - 50 
                    case 6: return 'ml-[130px]';   // Regresando - 100 
                    case 7: return 'ml-[180px]';   // Derecha completa - 150 
                    default: return 'ml-[105px]';   // 75 
                  }
                };

                return (
                  <div
                    key={subject.id}
                    onClick={() => handleSubjectAction(subject.id, subject.enabled)}
                    className={cn(
                      "relative w-[150px] h-auto transition-transform hover:scale-105",
                      subject.enabled ? "cursor-pointer" : "cursor-not-allowed opacity-70",
                      getHorizontalOffset(wavePosition)
                    )}
                  >
                    <Image
                      src={subject.iconPath}
                      alt={`${subject.displayName} subject`}
                      width={150}
                      height={90}
                      className="w-full h-auto"
                      priority={index < 5} // Prioritize first 5 images
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </main>
    );
  }
);

HomeContent.displayName = 'HomeContent';
