'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Badge } from './Badge';
import { Bell, Flame, Moon, Menu, Sun } from 'lucide-react';

export interface TopMenuProps {
  showLogo?: boolean;
  logoSrc?: string;
  logoText?: string;
  showFreeBadge?: boolean;
  notificationCount?: number;
  streakCount?: number;
  onNotificationClick?: () => void;
  onStreakClick?: () => void;
  onThemeToggle?: () => void;
  onMenuClick?: () => void;
  isDarkMode?: boolean;
  className?: string;
}

export const TopMenu = React.forwardRef<HTMLDivElement, TopMenuProps>(
  (
    {
      showLogo = false,
      logoSrc,
      logoText = 'Kibi',
      showFreeBadge = false,
      notificationCount = 0,
      streakCount = 0,
      onNotificationClick,
      onStreakClick,
      onThemeToggle,
      onMenuClick,
      isDarkMode = false,
      className,
      ...props
    },
    ref
  ) => {
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
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Bell/Alarm Icon */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-grey-100 rounded-full transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="w-6 h-6" />
          </button>

          {/* Free Badge */}
          {showFreeBadge && (
            <Badge variant="solid" color="success" className="text-xs">
              Gratis
            </Badge>
          )}

          {/* Streak Icon with Notification */}
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
        </div>

        {/* Center Section - Logo (optional) */}
        {showLogo && (
          <div className="flex-1 flex justify-center">
            {logoSrc ? (
              <img src={logoSrc} alt={logoText} className="h-8" />
            ) : (
              <span className="text-xl font-bold text-dark-900">{logoText}</span>
            )}
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-2">
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

          {/* Notifications Icon */}
          {notificationCount > 0 && (
            <button
              onClick={onNotificationClick}
              className="relative p-2 hover:bg-grey-100 rounded-full transition-colors"
              aria-label={`${notificationCount} notificaciones`}
            >
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            </button>
          )}

          {/* Menu Icon */}
          {showLogo && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-grey-100 rounded-full transition-colors"
              aria-label="Menú"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

TopMenu.displayName = 'TopMenu';
