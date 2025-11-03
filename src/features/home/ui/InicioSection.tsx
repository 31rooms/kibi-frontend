'use client';

import React, { useState, useLayoutEffect, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/lib/context';
import { useMySubjects } from '../hooks/useMySubjects';
import { useProgress } from '@/features/progress/hooks/useProgress';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent } from '@/shared/ui/Card';
import { Star, ChevronRight, CheckCircle } from 'lucide-react';

/**
 * Inicio Section Component
 * Main home section with weekly calendar, achievement, daily session button, and subjects
 */
export const InicioSection = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const [initialLoading, setInitialLoading] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [nextChallengeTime, setNextChallengeTime] = useState('07:07');
    const loadedCountRef = useRef(0);
    const internalRef = useRef<HTMLElement>(null);
    const router = useRouter();
    const { isDarkMode } = useTheme();

    // Fetch subjects with enabled/disabled state from API
    const { subjects, career, totalQuestions, isLoading, error } = useMySubjects();
    const { dashboard } = useProgress();

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

    // Handle Daily Session button click
    const handleDailySessionClick = () => {
      router.push('/daily-session');
    };

    // Calculate next challenge time (24h from now)
    useEffect(() => {
      const updateNextChallenge = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const diff = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setNextChallengeTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      };

      updateNextChallenge();
      const interval = setInterval(updateNextChallenge, 60000); // Update every minute

      return () => clearInterval(interval);
    }, []);

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

    // Get days of the week with activity status
    const getDaysOfWeek = () => {
      const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
      const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
      const mondayIndex = today === 0 ? 6 : today - 1; // Convert to Monday-based index

      return days.map((day, index) => ({
        label: day,
        isActive: index <= mondayIndex,
        isInactive: index > mondayIndex,
      }));
    };

    const weekDays = getDaysOfWeek();

    return (
      <main
        ref={internalRef}
        className={cn(
          "flex-1 overflow-y-auto p-6 md:p-8",
          "bg-white dark:bg-[#0A0F1E]",
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
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-[#0A0F1E] z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
          </div>
        )}

        {/* Content with fade-in transition */}
        <div
          className={cn(
            "max-w-7xl mx-auto min-h-full flex flex-col",
            "transition-opacity duration-300",
            showContent ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Weekly Calendar */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-sm text-gray-400 mr-2">
              <CheckCircle className="w-4 h-4 inline mr-1 text-primary-green" />
              Activo
            </span>
            <span className="text-sm text-gray-500 mr-4">
              <div className="w-4 h-4 inline-block mr-1 rounded-full bg-gray-600"></div>
              Inactivo
            </span>

            <div className="flex gap-2">
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    day.isActive && "bg-primary-green text-white",
                    day.isInactive && "bg-gray-700 dark:bg-gray-800 text-gray-400"
                  )}
                >
                  {day.label}
                </div>
              ))}
            </div>
          </div>

          {/* Achievement of the Week */}
          <div className="mb-6 flex justify-center">
            <Card className="bg-transparent border-2 border-primary-green/50 w-[280px]">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-green/20 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary-green fill-primary-green" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Logro de la semana
                  </p>
                  <p className="text-base font-bold text-white">
                    Primer paso
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Session Button */}
          <div className="mb-6 flex flex-col items-center gap-4">
            <Button
              onClick={handleDailySessionClick}
              size="lg"
              className="w-[280px] h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              color="green"
            >
              Sesión diaria
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-sm text-gray-400">
              Próximo reto en{' '}
              <span className="text-white font-medium">{nextChallengeTime} h</span>
            </p>
          </div>

          {/* Container for vertically stacked subjects with curved S-wave layout */}
          <div className="w-[280px] sm:w-[350px] mx-auto flex flex-col gap-2 pb-6 mt-6">
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

                const iconPath = subject.iconPath;

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
