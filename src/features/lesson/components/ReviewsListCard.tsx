'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Clock, AlertTriangle, Calendar } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { PendingReview } from '@/features/review/api/types';

interface ReviewsListCardProps {
  reviews: PendingReview[];
  onStartReview: (subtopicId: string) => void;
  className?: string;
}

export function ReviewsListCard({ reviews, onStartReview, className }: ReviewsListCardProps) {
  if (reviews.length === 0) {
    return null;
  }

  const getDaysUntilDue = (dueDate: Date): string => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Atrasado ${Math.abs(diffDays)} días`;
    } else if (diffDays === 0) {
      return 'Para hoy';
    } else if (diffDays === 1) {
      return 'Para mañana';
    } else {
      return `En ${diffDays} días`;
    }
  };

  return (
    <Card className={cn('border-l-4 border-l-yellow-500', className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-600" />
          <CardTitle className="text-lg">REPASOS PROGRAMADOS</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Repasa estos temas para mantener tu dominio
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review.subtopicId}
            className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{review.subtopicName}</h4>
                {review.overdue && (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-3 h-3" />
                <span
                  className={cn(
                    review.overdue
                      ? 'text-red-600 font-medium'
                      : review.priority === 'HIGH'
                      ? 'text-orange-600 font-medium'
                      : ''
                  )}
                >
                  {getDaysUntilDue(review.dueDate)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    'px-2 py-0.5 rounded',
                    review.priority === 'HIGH'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : review.priority === 'MEDIUM'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  )}
                >
                  Prioridad: {review.priority}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Nivel de dominio: {review.masteryLevel}/5
                </span>
              </div>
            </div>
            <Button
              onClick={() => onStartReview(review.subtopicId)}
              size="sm"
              variant={review.overdue ? 'default' : 'outline'}
            >
              {review.overdue ? 'Repasar Ahora' : 'Repasar'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
