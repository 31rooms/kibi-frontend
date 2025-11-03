'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Clock, BookOpen, AlertCircle, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { PendingReview } from '@/features/review/api/types';

interface ReviewCardProps {
  review: PendingReview;
  onStart?: () => void;
  onSkip?: () => void;
  showActions?: boolean;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onStart,
  onSkip,
  showActions = true,
  className
}) => {
  const getPriorityColor = (priority: PendingReview['priority']) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'LOW':
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getPriorityLabel = (priority: PendingReview['priority']) => {
    switch (priority) {
      case 'HIGH':
        return 'Alta prioridad';
      case 'MEDIUM':
        return 'Media prioridad';
      case 'LOW':
      default:
        return 'Baja prioridad';
    }
  };

  const formatDaysAgo = (days: number) => {
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    return `Hace ${days} días`;
  };

  const getMasteryStars = (level: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={cn(
            'text-lg',
            i < level ? 'text-yellow-400' : 'text-gray-300'
          )}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <Card
      className={cn(
        'hover:shadow-md transition-all duration-200',
        review.overdue && 'border-red-300 bg-red-50/50',
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">{review.subtopicName}</h3>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">
                {review.subjectName} → {review.topicName}
              </p>
            </div>
          </div>

          <Badge
            className={cn(
              'text-xs',
              getPriorityColor(review.priority)
            )}
            variant="outline"
          >
            {getPriorityLabel(review.priority)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDaysAgo(review.daysSinceLastReview)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              Intervalo: {review.currentInterval} días
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Dominio actual</span>
            <div className="flex items-center">
              {getMasteryStars(review.masteryLevel)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Preguntas disponibles</span>
            <span className="text-sm font-medium">{review.questionsAvailable}</span>
          </div>
        </div>

        {review.overdue && (
          <div className="flex items-center gap-2 p-2 bg-red-100 rounded-md">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-xs text-red-700">
              Repaso atrasado - Requiere atención inmediata
            </span>
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onStart}
              size="sm"
              className="flex-1"
              variant={review.overdue ? 'destructive' : 'default'}
            >
              Repasar ahora
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            {onSkip && (
              <Button
                onClick={onSkip}
                size="sm"
                variant="outline"
                className="px-3"
              >
                Posponer
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};