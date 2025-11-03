'use client';

import React from 'react';
import { Progress } from '@/shared/ui/progress';
import { TrendingUp, TrendingDown, Minus, BookOpen } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface SubjectEffectivenessProps {
  name: string;
  effectiveness: number;
  trend?: 'IMPROVING' | 'STABLE' | 'DECLINING';
  questionsAnswered?: number;
  level?: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
  showDetails?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SubjectEffectiveness: React.FC<SubjectEffectivenessProps> = ({
  name,
  effectiveness,
  trend,
  questionsAnswered,
  level,
  showDetails = true,
  onClick,
  className
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'IMPROVING':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'DECLINING':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      case 'STABLE':
      default:
        return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const getEffectivenessColor = () => {
    if (effectiveness >= 80) return 'bg-green-500';
    if (effectiveness >= 60) return 'bg-yellow-500';
    if (effectiveness >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getEffectivenessLabel = () => {
    if (effectiveness >= 80) return 'Excelente';
    if (effectiveness >= 60) return 'Bueno';
    if (effectiveness >= 40) return 'Regular';
    return 'Necesita mejora';
  };

  const getLevelColor = (lvl: string) => {
    switch (lvl) {
      case 'AVANZADO':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'INTERMEDIO':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'BASICO':
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getLevelLabel = (lvl: string) => {
    switch (lvl) {
      case 'AVANZADO':
        return 'Avanzado';
      case 'INTERMEDIO':
        return 'Intermedio';
      case 'BASICO':
      default:
        return 'Básico';
    }
  };

  return (
    <div
      className={cn(
        'p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
        'hover:shadow-md transition-all duration-200',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-medium text-sm">{name}</h4>
          </div>
          {trend && getTrendIcon()}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Efectividad</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{effectiveness.toFixed(1)}%</span>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                effectiveness >= 80 ? 'bg-green-100 text-green-700' :
                effectiveness >= 60 ? 'bg-yellow-100 text-yellow-700' :
                effectiveness >= 40 ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              )}>
                {getEffectivenessLabel()}
              </span>
            </div>
          </div>

          <Progress
            value={effectiveness}
            className="h-2"
            indicatorClassName={getEffectivenessColor()}
          />
        </div>

        {showDetails && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            {questionsAnswered !== undefined && (
              <span className="text-xs text-muted-foreground">
                {questionsAnswered} preguntas
              </span>
            )}

            {level && (
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full border',
                getLevelColor(level)
              )}>
                {getLevelLabel(level)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};