'use client';

import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/lib/context';
import { useMySubjects } from '../hooks/useMySubjects';

/**
 * Inicio Section Component
 * Main home section displaying vertically stacked subjects in S-wave layout
 */
export const InicioSection = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
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
          "scrollbar-hide",
          className
        )}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
        {...props}
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
          <div className="w-[280px] sm:w-[350px] mx-auto flex flex-col gap-2 pb-6">
            {subjects.map((subject, index) => {
                // S-wave pattern: 8 positions per cycle
                const wavePosition = index % 8;

                const getHorizontalOffset = (position: number): string => {
                  switch(position) {
                    case 0: return 'ml-[176px] sm:ml-[220px]';
                    case 1: return 'ml-[120px] sm:ml-[150px]';
                    case 2: return 'ml-[80px] sm:ml-[100px]';
                    case 3: return 'ml-[24px] sm:ml-[30px]';
                    case 4: return 'ml-[0px]';
                    case 5: return 'ml-[40px] sm:ml-[50px]';
                    case 6: return 'ml-[104px] sm:ml-[130px]';
                    case 7: return 'ml-[144px] sm:ml-[180px]';
                    default: return 'ml-[84px] sm:ml-[105px]';
                  }
                };

                // Construct icon path based on theme
                const iconPath = isDarkMode
                  ? subject.iconPath.replace('/subjects/light/', '/subjects/dark/')
                  : subject.iconPath;

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
                      priority={index < 5}
                      onLoad={handleImageLoad}
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

InicioSection.displayName = 'InicioSection';
