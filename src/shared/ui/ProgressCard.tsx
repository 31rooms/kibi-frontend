'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Progress } from '@/shared/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface ProgressCardProps {
  title: string;
  value: number | string;
  maxValue?: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number | string;
  icon?: React.ReactNode;
  className?: string;
  showProgress?: boolean;
  progressColor?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  maxValue = 100,
  subtitle,
  trend,
  trendValue,
  icon,
  className,
  showProgress = false,
  progressColor = 'bg-primary'
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const progressValue = maxValue ? (numericValue / maxValue) * 100 : 0;

  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {trend && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                {trendValue && (
                  <span className={cn(
                    'text-sm',
                    trend === 'up' ? 'text-green-500' :
                    trend === 'down' ? 'text-red-500' :
                    'text-gray-500'
                  )}>
                    {trendValue}
                  </span>
                )}
              </div>
            )}
          </div>

          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}

          {showProgress && (
            <Progress
              value={progressValue}
              className="h-2"
              indicatorClassName={progressColor}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};