'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type TrendType = 'IMPROVING' | 'STABLE' | 'DECLINING' | 'UP' | 'DOWN';

interface TrendIndicatorProps {
  trend: TrendType;
  value?: number | string;
  label?: string;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  trend,
  value,
  label,
  showIcon = true,
  showLabel = true,
  size = 'md',
  className
}) => {
  const normalizedTrend = trend === 'UP' ? 'IMPROVING' : trend === 'DOWN' ? 'DECLINING' : trend;

  const sizeClasses = {
    xs: {
      container: 'text-xs',
      icon: 'w-3 h-3',
      badge: 'px-1.5 py-0.5'
    },
    sm: {
      container: 'text-sm',
      icon: 'w-3.5 h-3.5',
      badge: 'px-2 py-0.5'
    },
    md: {
      container: 'text-base',
      icon: 'w-4 h-4',
      badge: 'px-2.5 py-1'
    },
    lg: {
      container: 'text-lg',
      icon: 'w-5 h-5',
      badge: 'px-3 py-1.5'
    }
  };

  const getTrendConfig = () => {
    switch (normalizedTrend) {
      case 'IMPROVING':
        return {
          icon: TrendingUp,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Mejorando',
          valueColor: 'text-green-700'
        };
      case 'DECLINING':
        return {
          icon: TrendingDown,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Bajando',
          valueColor: 'text-red-700'
        };
      case 'STABLE':
      default:
        return {
          icon: Minus,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          label: 'Estable',
          valueColor: 'text-gray-700'
        };
    }
  };

  const config = getTrendConfig();
  const Icon = config.icon;
  const currentSize = sizeClasses[size];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5',
        currentSize.container,
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            currentSize.icon,
            config.color,
            'flex-shrink-0'
          )}
        />
      )}

      {showLabel && (
        <span
          className={cn(
            'rounded-full border',
            currentSize.badge,
            config.bgColor,
            config.borderColor,
            config.color,
            'font-medium'
          )}
        >
          {label || config.label}
        </span>
      )}

      {value !== undefined && (
        <span
          className={cn(
            'font-semibold',
            config.valueColor
          )}
        >
          {typeof value === 'number' && value > 0 ? '+' : ''}
          {value}
          {typeof value === 'number' ? '%' : ''}
        </span>
      )}
    </div>
  );
};

// Componente adicional para mostrar múltiples tendencias
interface TrendGroupProps {
  trends: {
    label: string;
    trend: TrendType;
    value?: number | string;
  }[];
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const TrendGroup: React.FC<TrendGroupProps> = ({
  trends,
  size = 'sm',
  className
}) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {trends.map((item, index) => (
        <TrendIndicator
          key={index}
          trend={item.trend}
          value={item.value}
          label={item.label}
          size={size}
          showIcon={true}
          showLabel={true}
        />
      ))}
    </div>
  );
};