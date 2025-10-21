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

    // Auto-scroll to bottom on mount
    useLayoutEffect(() => {
      const mainElement = internalRef.current;

      if (mainElement) {
        // Wait for content to render, then scroll and hide loader
        requestAnimationFrame(() => {
          mainElement.scrollTop = mainElement.scrollHeight;

          // Hide loader after scroll
          setTimeout(() => {
            setInitialLoading(false);
          }, 100);
        });
      }
    }, []);

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
        <div className="max-w-7xl mx-auto">
          {/* Container for vertically stacked subjects (Literatura top, Inglés bottom) */}
          <div className="flex flex-col items-center gap-3">
            {subjects.map((subject, index) => {
              return (
                <div
                  key={subject.id}
                  onClick={() => handleSubjectAction(subject.id, subject.enabled)}
                  className={cn(
                    "relative w-[351px] h-auto",
                    subject.enabled ? "cursor-pointer" : "cursor-not-allowed"
                  )}
                >
                  <Image
                    src={subject.iconPath}
                    alt={`${subject.displayName} subject`}
                    width={351}
                    height={200}
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
