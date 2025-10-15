'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui';
import { Flame, Moon, Menu, Sun, Bell } from 'lucide-react';
import Image from 'next/image';

export interface HomeTopMenuProps {
  logoSrc?: string;
  logoText?: string;
  streakCount?: number;
  notificationCount?: number;
  onStreakClick?: () => void;
  onThemeToggle?: () => void;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
  onAvatarClick?: () => void;
  isDarkMode?: boolean;
  className?: string;
}

/**
 * Home Top Menu Component
 * Custom top navigation for home with logo on left and actions on right
 * Desktop: Shows flame, theme, notifications, and user profile
 * Mobile: Shows flame, theme, and hamburger menu
 */
export const HomeTopMenu = React.forwardRef<HTMLDivElement, HomeTopMenuProps>(
  (
    {
      logoSrc,
      logoText = 'Kibi',
      streakCount = 12,
      notificationCount = 0,
      onStreakClick,
      onThemeToggle,
      onNotificationClick,
      onMenuClick,
      onAvatarClick,
      isDarkMode = false,
      className,
      ...props
    },
    ref
  ) => {
    // Hardcoded user data
    const userName = 'Yohanna';
    const userEmail = 'usiario@email.com';
    const avatarSrc = '/illustrations/avatar.svg';

    return (
      <div
        ref={ref}
        className={cn(
          'w-full bg-white border-b border-grey-200 px-4 py-3',
          'flex items-center justify-between gap-4',
          className
        )}
        {...props}
      >
        {/* Left Section - Logo */}
        <div className="flex items-center gap-3">
          {logoSrc ? (
            <img src={logoSrc} alt={logoText} className="w-[140px] h-auto" />
          ) : (
            <span className="text-xl font-bold text-dark-900 font-[family-name:var(--font-quicksand)]">
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
              className="relative p-2 hover:bg-grey-100 rounded-full transition-colors"
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
            onClick={onThemeToggle}
            className="p-2 hover:bg-grey-100 rounded-full transition-colors"
            aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>

          {/* Notification Icon */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-grey-100 rounded-full transition-colors"
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
            className="hidden md:flex items-center gap-3 hover:bg-grey-100 rounded-full pl-1 pr-3 py-1 transition-colors"
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
              <span className="text-base font-semibold text-dark-900">
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
            className="md:hidden p-2 hover:bg-grey-100 rounded-full transition-colors"
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
