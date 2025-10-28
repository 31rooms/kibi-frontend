'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui';
import { Flame, Moon, Menu, Sun, Bell } from 'lucide-react';
import Image from 'next/image';
import { useAuth, Theme, authAPI } from '@/features/authentication';

export interface HomeTopMenuProps {
  logoSrc?: string;
  logoText?: string;
  streakCount?: number;
  notificationCount?: number;
  onStreakClick?: () => void;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
  onAvatarClick?: () => void;
  className?: string;
}

/**
 * Home Top Menu Component
 * Custom top navigation for home with logo on left and actions on right
 * Desktop: Shows flame, theme, notifications, and user profile
 * Mobile: Shows flame, theme, and hamburger menu
 *
 * Theme is automatically loaded from authenticated user's preferences
 */
export const HomeTopMenu = React.forwardRef<HTMLDivElement, HomeTopMenuProps>(
  (
    {
      logoSrc,
      logoText = 'Kibi',
      streakCount = 12,
      notificationCount = 0,
      onStreakClick,
      onNotificationClick,
      onMenuClick,
      onAvatarClick,
      className,
      ...props
    },
    ref
  ) => {
    const { user, updateUser } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isUpdatingTheme, setIsUpdatingTheme] = useState(false);

    // Determine actual theme based on user preference and system preference
    useEffect(() => {
      if (!user) return;

      const determineTheme = () => {
        if (user.theme === Theme.DARK) {
          return true;
        } else if (user.theme === Theme.LIGHT) {
          return false;
        } else {
          // Theme.SYSTEM - detect from browser
          return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
      };

      const newIsDarkMode = determineTheme();
      setIsDarkMode(newIsDarkMode);

      // Listen for system theme changes if user preference is SYSTEM
      if (user.theme === Theme.SYSTEM) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
          setIsDarkMode(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    }, [user]);

    const handleThemeToggle = async () => {
      if (!user || isUpdatingTheme) return;

      try {
        setIsUpdatingTheme(true);

        // Toggle based on what's CURRENTLY DISPLAYED
        // If showing Sun icon (isDarkMode = true) → user wants LIGHT
        // If showing Moon icon (isDarkMode = false) → user wants DARK
        const newTheme = isDarkMode ? Theme.LIGHT : Theme.DARK;

        // Update in backend
        const updatedUser = await authAPI.updateProfile({ theme: newTheme });

        // Update user in context and localStorage (this will trigger useEffect to update isDarkMode)
        updateUser(updatedUser);
      } catch (error) {
        console.error('❌ Failed to update theme:', error);
      } finally {
        setIsUpdatingTheme(false);
      }
    };

    // User data from auth context
    const userName = user?.firstName || 'Usuario';
    const userEmail = user?.email || '';
    const avatarSrc = '/illustrations/avatar.svg';

    return (
      <div
        ref={ref}
        className={cn(
          'w-full bg-white dark:bg-[#171B22] px-4 py-3',
          'border-b border-[#DEE2E6] dark:border-[#374151]',
          'flex items-center justify-between gap-4',
          className
        )}
        {...props}
      >
        {/* Left Section - Logo */}
        <div className="flex items-center gap-3">
          {logoSrc !== undefined ? (
            <img
              src={isDarkMode ? '/illustrations/logo-dark.svg' : logoSrc}
              alt={logoText}
              className="w-[140px] h-auto"
            />
          ) : (
            <span className="text-xl font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
              {logoText}
            </span>
          )}
        </div>

        {/* Right Section - Actions and Profile */}
        <div className="flex items-center gap-2">
          {/* Streak Icon with Badge */}
          {streakCount > 0 && (
            <button
              onClick={onStreakClick}
              className="relative p-2 rounded-full cursor-pointer"
              aria-label={`Racha: ${streakCount} días`}
            >
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {streakCount}
              </span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            disabled={isUpdatingTheme}
            className="p-2 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-orange-400" />
            ) : (
              <Moon className="w-6 h-6 text-primary-blue" />
            )}
          </button>

          {/* Notification Icon */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 rounded-full cursor-pointer"
            aria-label="Notificaciones"
          >
            <Bell className="w-6 h-6" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-error-500 rounded-full w-2 h-2" />
            )}
          </button>

          {/* User Profile (Desktop only) */}
          <button
            onClick={onAvatarClick}
            className="hidden md:flex items-center gap-3 rounded-full pl-1 pr-3 py-1 cursor-pointer"
            aria-label="Perfil de usuario"
          >
            <Image
              src={avatarSrc}
              alt={userName}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold text-dark-900 dark:text-white">
                {userName}
              </span>
              <span className="text-sm text-grey-600">
                {userEmail}
              </span>
            </div>
          </button>

          {/* Menu Icon (Mobile only) */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-full cursor-pointer"
            aria-label="Menú"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }
);

HomeTopMenu.displayName = 'HomeTopMenu';
