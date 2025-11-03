'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Info } from 'lucide-react';
import { TooltipRoot, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/Tooltip';
import { cn } from '@/shared/lib/utils';

interface ProjectedScoreProps {
  score: number;
  maxScore?: number;
  confidence?: number;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  changeFromLast?: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProjectedScore: React.FC<ProjectedScoreProps> = ({
  score,
  maxScore = 700,
  confidence,
  trend,
  changeFromLast,
  showDetails = true,
  size = 'md',
  className
}) => {
  const percentage = (score / maxScore) * 100;

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  const textSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };

  const getTrendIcon = () => {
    const iconClass = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';

    switch (trend) {
      case 'UP':
        return <TrendingUp className={cn(iconClass, 'text-green-500')} />;
      case 'DOWN':
        return <TrendingDown className={cn(iconClass, 'text-red-500')} />;
      case 'STABLE':
      default:
        return <Minus className={cn(iconClass, 'text-gray-500')} />;
    }
  };

  const getScoreColor = () => {
    if (score >= 600) return 'text-green-600';
    if (score >= 500) return 'text-blue-600';
    if (score >= 400) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = () => {
    if (score >= 600) return 'stroke-green-500';
    if (score >= 500) return 'stroke-blue-500';
    if (score >= 400) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative">
        <svg
          className={cn(sizeClasses[size], '-rotate-90')}
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="6"
            className="stroke-gray-200 dark:stroke-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className={cn('transition-all duration-500', getProgressColor())}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1">
            <Target className={cn(
              size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5',
              'text-muted-foreground'
            )} />
            <span className={cn(textSizes[size], 'font-bold', getScoreColor())}>
              {Math.round(score)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">de {maxScore}</span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            {trend && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                {changeFromLast !== undefined && (
                  <span className={cn(
                    'text-sm font-medium',
                    trend === 'UP' ? 'text-green-600' :
                    trend === 'DOWN' ? 'text-red-600' :
                    'text-gray-600'
                  )}>
                    {changeFromLast > 0 ? '+' : ''}{changeFromLast}
                  </span>
                )}
              </div>
            )}
          </div>

          {confidence !== undefined && (
            <div className="flex items-center justify-center gap-1">
              <TooltipProvider>
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <span className="text-xs text-muted-foreground">
                        Confianza: {confidence}%
                      </span>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      La confianza indica qué tan precisa es la proyección basada en tu actividad reciente
                    </p>
                  </TooltipContent>
                </TooltipRoot>
              </TooltipProvider>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Puntaje Proyectado
          </div>
        </div>
      )}
    </div>
  );
};