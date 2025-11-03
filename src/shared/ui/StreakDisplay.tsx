'use client';

import React from 'react';
import { Flame, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface StreakDisplayProps {
  currentStreak: number;
  maxStreak?: number;
  isActive?: boolean;
  lastTestDate?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
  maxStreak,
  isActive = true,
  lastTestDate,
  size = 'md',
  showDetails = true,
  className
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const getStreakColor = () => {
    if (!isActive) return 'text-gray-400';
    if (currentStreak >= 30) return 'text-orange-500';
    if (currentStreak >= 7) return 'text-amber-500';
    if (currentStreak >= 3) return 'text-yellow-500';
    return 'text-orange-400';
  };

  const getStreakMessage = () => {
    if (!isActive) return 'Racha perdida';
    if (currentStreak >= 30) return 'En llamas!';
    if (currentStreak >= 7) return 'Una semana completa!';
    if (currentStreak >= 3) return 'Buen comienzo!';
    if (currentStreak === 1) return 'Comienza tu racha!';
    return 'Sin racha activa';
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative">
        <Flame
          className={cn(
            iconSizes[size],
            getStreakColor(),
            isActive && currentStreak > 0 && 'animate-pulse'
          )}
        />
        {currentStreak >= 7 && (
          <div className="absolute -top-1 -right-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <div className={cn('font-bold', sizeClasses[size])}>
          <span className={getStreakColor()}>{currentStreak}</span>
          <span className="text-muted-foreground ml-1">
            {currentStreak === 1 ? 'día' : 'días'}
          </span>
        </div>

        {showDetails && (
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-xs text-muted-foreground">
              {getStreakMessage()}
            </span>

            {maxStreak !== undefined && maxStreak > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Award className="w-3 h-3" />
                <span>Récord: {maxStreak} días</span>
              </div>
            )}

            {lastTestDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>Último: {new Date(lastTestDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};