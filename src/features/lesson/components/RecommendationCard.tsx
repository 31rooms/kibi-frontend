'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Target, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface RecommendationCardProps {
  topicName: string;
  subtopicName: string;
  level: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
  reason: string;
  effectiveness: number;
  onStart: () => void;
  className?: string;
}

export function RecommendationCard({
  topicName,
  subtopicName,
  level,
  reason,
  effectiveness,
  onStart,
  className,
}: RecommendationCardProps) {
  const getLevelColor = () => {
    switch (level) {
      case 'BASICO':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'INTERMEDIO':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'AVANZADO':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    }
  };

  return (
    <Card className={cn('border-2 border-blue-500 dark:border-blue-700', className)}>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-lg">RECOMENDADO PARA TI</CardTitle>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Basado en tu efectividad actual del {effectiveness.toFixed(1)}% en esta materia
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Tema:</span>
            <span className="text-gray-700 dark:text-gray-300">{topicName}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Subtema:</span>
            <span className="text-gray-700 dark:text-gray-300">{subtopicName}</span>
            <span className={cn('text-xs px-2 py-0.5 rounded font-medium', getLevelColor())}>
              {level}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-gray-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-medium">Razón:</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{reason}</p>
            </div>
          </div>
        </div>

        <Button onClick={onStart} className="w-full" size="lg">
          <TrendingUp className="w-4 h-4 mr-2" />
          Comenzar Lección Recomendada
        </Button>
      </CardContent>
    </Card>
  );
}
