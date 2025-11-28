'use client';

import React, { useState, useLayoutEffect, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/lib/context';
import { useAuth } from '@/features/authentication';
import { useMySubjects } from '../hooks/useMySubjects';
import { useProgress } from '@/features/progress/hooks/useProgress';
import { useWeeklyStatus } from '../hooks/useWeeklyStatus';
import { useNotificationContext } from '@/features/notifications';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { KibibotFloatingButton } from '@/shared/ui/KibibotFloatingButton';
import { ChevronRight, CheckCircle, Bell, X } from 'lucide-react';

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
    const [showNotificationPrompt, setShowNotificationPrompt] = useState(true);
    const [isEnablingNotifications, setIsEnablingNotifications] = useState(false);
    const loadedCountRef = useRef(0);
    const internalRef = useRef<HTMLElement>(null);
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { user } = useAuth();
    const { pushState, subscribeToPush } = useNotificationContext();

    // Fetch subjects with enabled/disabled state from API
    const { subjects, career, totalQuestions, isLoading, error } = useMySubjects();
    const { dashboard } = useProgress();
    const { weekDays, currentStreak } = useWeeklyStatus();

    // Check if user has FREE plan
    const isFreeUser = !user?.subscriptionPlan || user.subscriptionPlan.toUpperCase() === 'FREE';

    // Check if daily test was completed today
    const todayStatus = weekDays.find(day => day.isToday);
    const isDailyTestCompletedToday = todayStatus?.dailyTestCompleted ?? false;

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
      router.push('/home?section=daily-session');
    };

    // Handle Daily Test button click
    const handleDailyTestClick = () => {
      if (!isDailyTestCompletedToday) {
        // TODO: Navigate to daily test when implemented
        console.log('Navigate to daily test');
      }
    };

    // Handle Kibibot button click
    const handleKibibotClick = () => {
      router.push('/home?section=kibibot');
    };

    // Handle notification enable
    const handleEnableNotifications = async () => {
      setIsEnablingNotifications(true);
      try {
        const success = await subscribeToPush();
        if (success) {
          // Auto-dismiss on success after short delay
          setTimeout(() => {
            setShowNotificationPrompt(false);
          }, 1500);
        }
      } catch (error) {
        console.error('Error enabling notifications:', error);
      } finally {
        setIsEnablingNotifications(false);
      }
    };

    // Handle notification prompt dismiss
    const handleDismissNotificationPrompt = () => {
      setShowNotificationPrompt(false);
      // Save to localStorage to remember dismissal
      localStorage.setItem('notification-prompt-dismissed', Date.now().toString());
    };

    // Check if notification prompt should be shown
    useEffect(() => {
      console.log('🔔 [InicioSection] Checking notification prompt:', {
        isSupported: pushState.isSupported,
        isSubscribed: pushState.isSubscribed,
        permission: pushState.permission,
      });

      // Don't show if already subscribed or permission denied
      if (pushState.isSubscribed || pushState.permission === 'denied') {
        console.log('🔔 [InicioSection] Hiding prompt: isSubscribed or denied');
        setShowNotificationPrompt(false);
        return;
      }

      // Si el permiso es 'default', limpiar el localStorage de dismissal
      // porque el usuario quitó los permisos y debemos mostrar el prompt de nuevo
      if (pushState.permission === 'default') {
        console.log('🔔 [InicioSection] Permission is default, clearing dismissal localStorage');
        localStorage.removeItem('notification-prompt-dismissed');
      }

      // Check if user dismissed it before (don't show for 7 days)
      const dismissedAt = localStorage.getItem('notification-prompt-dismissed');
      if (dismissedAt) {
        const daysSinceDismissal = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissal < 7) {
          console.log('🔔 [InicioSection] Hiding prompt: dismissed within 7 days');
          setShowNotificationPrompt(false);
          return;
        }
      }

      // Show the prompt
      console.log('🔔 [InicioSection] Showing notification prompt');
      setShowNotificationPrompt(true);
    }, [pushState.isSubscribed, pushState.permission, pushState.isSupported]);

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

    // Debug: Log render state
    console.log('🔔 [InicioSection] Render state:', {
      showNotificationPrompt,
      isSupported: pushState.isSupported,
      isSubscribed: pushState.isSubscribed,
      permission: pushState.permission,
      willShowModal: showNotificationPrompt && pushState.isSupported,
    });

    return (
      <main
        ref={internalRef}
        className={cn(
          "flex-1 overflow-y-auto",
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

        {/* Weekly Calendar - Sticky Top Left - Hidden on Mobile */}
        <div
          className={cn(
            "sticky top-12 left-12 z-10 w-fit hidden md:block",
            "transition-opacity duration-300",
            showContent ? "opacity-100" : "opacity-0"
          )}
        >
          <Card padding="small" className="bg-white dark:bg-[#171B22]">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-gray-400">
                <CheckCircle className="w-3 h-3 inline mr-1 text-primary-green" />
                Activo
              </span>
              <span className="text-xs text-gray-500">
                <div className="w-3 h-3 inline-block mr-1 rounded-full bg-gray-600"></div>
                Inactivo
              </span>
            </div>

            <div className="flex gap-2">
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                    day.dailyTestCompleted && "bg-primary-green text-white",
                    !day.dailyTestCompleted && !day.isFuture && "bg-gray-700 dark:bg-gray-800 text-gray-400",
                    day.isFuture && "bg-gray-800 dark:bg-gray-900 text-gray-500 opacity-50",
                    day.isToday && !day.dailyTestCompleted && "ring-2 ring-primary-green"
                  )}
                >
                  {day.dayLabel}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Achievement of the Week - Sticky */}
        <div
          className={cn(
            "sticky left-4 md:left-12 top-4 top-[45%] z-10 w-fit",
            "transition-opacity duration-300",
            showContent ? "opacity-100" : "opacity-0"
          )}
        >
          <Card
            variant="elevated"
            padding="small"
            className="w-[200px]"
            style={{
              backgroundColor: isDarkMode ? '#16301866' : '#E7FFE766'
            }}
          >
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center">
                <Image
                  src="/icons/star-flash.svg"
                  alt="Star achievement"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-white">
                  Logro de la semana
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Primer paso
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Notification Prompt - Fixed Top Right */}
        {showNotificationPrompt && pushState.isSupported && (
          <div
            className={cn(
              "fixed top-20 left-0 right-0 px-4 md:left-auto md:top-[121px] md:right-12 md:px-0 z-20",
              "transition-opacity duration-300",
              showContent ? "opacity-100" : "opacity-0"
            )}
          >
            <Card
              variant="elevated"
              padding="small"
              className="w-full md:w-[280px] relative bg-white dark:bg-[#171B22]"
            >
              {/* Close button */}
              <button
                onClick={handleDismissNotificationPrompt}
                className="absolute top-2 right-2 p-1 hover:bg-grey-100 dark:hover:bg-grey-700 rounded-full transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4 text-grey-600 dark:text-grey-400" />
              </button>

              <div className="flex items-start gap-3 pr-6">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-blue/10 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary-blue" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-dark-900 dark:text-white mb-1">
                    ¿Quieres recibir notificaciones en este dispositivo?
                  </p>
                  <p className="text-xs text-grey-600 dark:text-grey-400 mb-3">
                    Te avisaremos sobre tus rachas y logros
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleEnableNotifications}
                      disabled={isEnablingNotifications}
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs"
                    >
                      {isEnablingNotifications ? 'Activando...' : 'Activar'}
                    </Button>
                    <Button
                      onClick={handleDismissNotificationPrompt}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Más tarde
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Content container */}
        <div className="relative min-h-[calc(100vh-200px)] pb-[60px]">
          {/* Container for vertically stacked subjects with curved S-wave layout */}
          <div
            className={cn(
              "w-[280px] sm:w-[380px] mx-auto flex flex-col gap-2 pt-6",
              "transition-opacity duration-300",
              showContent ? "opacity-100" : "opacity-0"
            )}
          >
            {subjects.map((subject, index) => {
                // S-wave pattern: 8 positions per cycle
                const wavePosition = index % 8;

                const getHorizontalOffset = (position: number): string => {
                  switch(position) {
                    case 0: return 'ml-[176px] sm:ml-[220px]';
                    case 1: return 'ml-[200px] sm:ml-[250px]';
                    case 2: return 'ml-[180px] sm:ml-[219px]';
                    case 3: return 'ml-[140px] sm:ml-[160px]';
                    case 4: return 'ml-[86px]';
                    case 5: return 'ml-[0px] sm:ml-[0px]';
                    case 6: return 'ml-[104px] sm:ml-[130px]';
                    case 7: return 'ml-[144px] sm:ml-[180px]';
                    default: return 'ml-[84px] sm:ml-[105px]';
                  }
                };

                // Determine if subject is enabled based on plan
                // FREE users: last 2 subjects are enabled (open), rest are disabled
                // GOLD/DIAMOND users: all subjects are enabled (open)
                const isSubjectEnabled = isFreeUser ? index >= subjects.length - 2 : true;
                const iconState = isSubjectEnabled ? 'open' : 'disabled';
                const themeFolder = isDarkMode ? 'dark' : 'light';
                const iconPath = `/subjects/${themeFolder}/${iconState}/${subject.name}`;

                return (
                  <div
                    key={subject.id}
                    onClick={() => handleSubjectClick(subject.apiId, isSubjectEnabled)}
                    className={cn(
                      "relative w-[120px] sm:w-[150px] h-auto transition-transform hover:scale-105",
                      isSubjectEnabled ? "cursor-pointer" : "cursor-not-allowed opacity-70",
                      getHorizontalOffset(wavePosition)
                    )}
                  >
                    <Image
                      src={iconPath}
                      alt={`${subject.displayName} subject`}
                      width={150}
                      height={90}
                      className="w-full h-auto max-h-[129px]"
                      priority={index < 5}
                      onLoad={handleImageLoad}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        {/* Daily Session & Test Buttons - Floating Sticky Bottom */}
        <div
          className={cn(
            "sticky bottom-4 left-0 right-0 z-20 flex flex-col items-center pointer-events-none",
            "transition-opacity duration-300",
            showContent ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="backdrop-blur bg-white/10 dark:bg-black/10 p-4 md:p-8 flex flex-col items-center gap-2 border border-white/20 dark:border-white/10" style={{ borderRadius: '24px' }}>
            {/* Buttons container - horizontal on all screens */}
            <div className="flex flex-row gap-2 md:gap-3">
              <Button
                onClick={handleDailySessionClick}
                size="lg"
                className="h-12 px-4 md:px-6 text-sm md:text-base font-bold shadow-2xl hover:shadow-3xl transition-all pointer-events-auto whitespace-nowrap"
                color="green"
              >
                Sesión diaria
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2 flex-shrink-0" />
              </Button>

              <Button
                onClick={handleDailyTestClick}
                size="lg"
                disabled={isDailyTestCompletedToday}
                className={cn(
                  "h-12 px-4 md:px-6 text-sm md:text-base font-bold shadow-2xl transition-all pointer-events-auto whitespace-nowrap",
                  isDailyTestCompletedToday
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-3xl"
                )}
                color="blue"
              >
                Test diario
                {isDailyTestCompletedToday
                  ? <CheckCircle className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2 flex-shrink-0" />
                  : <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2 flex-shrink-0" />
                }
              </Button>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-[#0A0F1E] px-3 py-1 rounded-full shadow-md pointer-events-none">
              Próximo reto en{' '}
              <span className="text-gray-900 dark:text-white font-medium">{nextChallengeTime} h</span>
            </p>
          </div>
        </div>

        {/* Kibibot Floating Button - Bottom Right */}
        <KibibotFloatingButton
          onClick={handleKibibotClick}
          size={60}
          bottom={32}
          right={32}
        />
      </main>
    );
  }
);

InicioSection.displayName = 'InicioSection';
