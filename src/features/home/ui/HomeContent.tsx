'use client';

import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/lib/context';
import type { HomeContentProps } from '../types/home.types';
import { useMySubjects } from '../hooks/useMySubjects';

/**
 * Home Content Component
 * Main content area displaying vertically stacked subjects
 */
export const HomeContent = React.forwardRef<HTMLElement, HomeContentProps>(
  ({ selectedSection }, ref) => {
    const [initialLoading, setInitialLoading] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const loadedCountRef = useRef(0);
    const internalRef = useRef<HTMLElement>(null);
    const router = useRouter();
    const { isDarkMode } = useTheme();

    // Fetch subjects with enabled/disabled state from API
    const { subjects, career, totalQuestions, isLoading, error } = useMySubjects();

    // Combine external ref with internal ref
    React.useImperativeHandle(ref, () => internalRef.current as HTMLElement);

    // Reset image tracking when subjects change
    useLayoutEffect(() => {
      if (subjects.length > 0) {
        loadedCountRef.current = 0;
        setImagesLoaded(false);
        setShowContent(false);
      }
    }, [subjects.length]);

    // Track image loads
    const handleImageLoad = useCallback(() => {
      loadedCountRef.current += 1;

      if (loadedCountRef.current === subjects.length) {
        setImagesLoaded(true);
      }
    }, [subjects.length]);

    // Handle subject card click - Navigate to lesson page
    const handleSubjectClick = (subjectApiId: string, enabled: boolean) => {
      if (!enabled) {
        console.log(`Subject is disabled`);
        return;
      }
      console.log(`Navigating to lesson for subject API ID: ${subjectApiId}`);
      router.push(`/lesson/${subjectApiId}`);
    };

    // Scroll to bottom when all images are loaded
    useLayoutEffect(() => {
      const mainElement = internalRef.current;

      if (mainElement && !isLoading && subjects.length > 0 && imagesLoaded && initialLoading) {
        // Scroll to bottom with all images loaded (accurate scrollHeight)
        mainElement.scrollTop = mainElement.scrollHeight;

        // Verify scroll position
        requestAnimationFrame(() => {
          mainElement.scrollTop = mainElement.scrollHeight;

          // Fade in content smoothly
          requestAnimationFrame(() => {
            setShowContent(true);

            // Hide loading overlay after fade starts
            setTimeout(() => {
              setInitialLoading(false);
            }, 50);
          });
        });
      }
    }, [isLoading, subjects.length, imagesLoaded, initialLoading]);

    return (
      <main
        ref={internalRef}
        className={cn(
          "flex-1 overflow-y-auto p-6 md:p-8",
          "bg-white dark:bg-[#171B22]",
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
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-[#171B22] z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          </div>
        )}

        {/* Content with fade-in transition */}
        <div
          className={cn(
            "max-w-7xl mx-auto min-h-full flex flex-col justify-end",
            "transition-opacity duration-300",
            showContent ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Container for vertically stacked subjects with curved S-wave layout */}
          {/* Width: 280px on mobile, 350px on larger screens, SVGs follow 8-position wave pattern for pronounced symmetric curve */}
          <div className="w-[280px] sm:w-[350px] mx-auto flex flex-col gap-2 pb-6">
            {/* Display all subjects from API (all are enabled) */}
            {subjects.map((subject, index) => {
                // S-wave pattern: 8 positions per cycle for fast symmetric movement
                const wavePosition = index % 8;

                // Calculate horizontal offset based on wave position
                // Creates pronounced curve: right → left → right
                // Mobile (≤640px): Scaled to ~80% to fit within 280px container
                // Desktop (>640px): Full scale for 350px container
                // Positions 0-3: Move from right to left (4 steps)
                // Position 4: Stay at left (extended left peak)
                // Positions 5-7: Return from left to right (3 steps)
                const getHorizontalOffset = (position: number): string => {
                  switch(position) {
                    case 0: return 'ml-[176px] sm:ml-[220px]';   // Derecha completa (80% = 176px)
                    case 1: return 'ml-[120px] sm:ml-[150px]';   // Transición (80% = 120px)
                    case 2: return 'ml-[80px] sm:ml-[100px]';    // Transición (80% = 80px)
                    case 3: return 'ml-[24px] sm:ml-[30px]';     // Izquierda completa (80% = 24px)
                    case 4: return 'ml-[0px]';                   // Izquierda completa (0 stays 0)
                    case 5: return 'ml-[40px] sm:ml-[50px]';     // Regresando (80% = 40px)
                    case 6: return 'ml-[104px] sm:ml-[130px]';   // Regresando (80% = 104px)
                    case 7: return 'ml-[144px] sm:ml-[180px]';   // Derecha completa (80% = 144px)
                    default: return 'ml-[84px] sm:ml-[105px]';   // Default (80% = 84px)
                  }
                };

                // Construct icon path based on theme
                // TODO: Temporarily showing light icons in both modes
                const iconPath = subject.iconPath; // Always use light version for now
                // const iconPath = isDarkMode
                //   ? subject.iconPath.replace('/subjects/light/', '/subjects/dark/')
                //   : subject.iconPath;

                return (
                  <div
                    key={subject.id}
                    onClick={() => handleSubjectClick(subject.apiId, subject.enabled)}
                    className={cn(
                      "relative w-[120px] sm:w-[150px] h-auto transition-transform hover:scale-105",
                      subject.enabled ? "cursor-pointer" : "cursor-not-allowed opacity-70",
                      getHorizontalOffset(wavePosition)
                    )}
                  >
                    <Image
                      src={iconPath}
                      alt={`${subject.displayName} subject`}
                      width={150}
                      height={90}
                      className="w-full h-auto"
                      priority={index < 5} // Prioritize first 5 images
                      onLoad={handleImageLoad} // Track each image load
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
