'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import {
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { SubjectDetail } from '@/features/progress/api/types';

interface SubjectStatsProps {
  subjectDetail: SubjectDetail;
  className?: string;
}

export function SubjectStats({ subjectDetail, className }: SubjectStatsProps) {
  const { subject, effectiveness, level, progress, projectedScore } = subjectDetail;

  const getLevelColor = () => {
    switch (level) {
      case 'BASICO':
        return 'text-red-600';
      case 'INTERMEDIO':
        return 'text-yellow-600';
      case 'AVANZADO':
        return 'text-green-600';
    }
  };

  const getLevelBgColor = () => {
    switch (level) {
      case 'BASICO':
        return 'bg-red-100 dark:bg-red-900';
      case 'INTERMEDIO':
        return 'bg-yellow-100 dark:bg-yellow-900';
      case 'AVANZADO':
        return 'bg-green-100 dark:bg-green-900';
    }
  };

  const getEffectivenessColor = () => {
    if (effectiveness >= 80) return 'text-green-600';
    if (effectiveness >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getLastActivityText = (): string => {
    if (!progress.lastActivity) return 'Nunca';

    const lastActivity = new Date(progress.lastActivity);
    const now = new Date();
    const diffTime = now.getTime() - lastActivity.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  };

  const completedTopics = subjectDetail.topics.filter((t) => t.progress.completed).length;
  const totalTopics = subjectDetail.topics.length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Estadísticas de {subject.name}
          </CardTitle>
          <div className={cn('px-3 py-1 rounded-full font-medium', getLevelBgColor(), getLevelColor())}>
            {level}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Effectiveness */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Efectividad</span>
          </div>
          <span className={cn('text-2xl font-bold', getEffectivenessColor())}>
            {effectiveness.toFixed(1)}%
          </span>
        </div>

        {/* Topics Progress */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Temas Completados</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{completedTopics}</span>
            <span className="text-gray-600 dark:text-gray-400">/ {totalTopics}</span>
          </div>
        </div>

        {/* Questions Answered */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Preguntas Respondidas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">{progress.correctAnswers}</span>
            <span className="text-gray-600 dark:text-gray-400">/ {progress.questionsAnswered}</span>
          </div>
        </div>

        {/* Study Time */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Tiempo de Estudio</span>
          </div>
          <span className="text-2xl font-bold">{formatTime(progress.studyTimeMinutes)}</span>
        </div>

        {/* Projected Score */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Aporte al Puntaje</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">{projectedScore.toFixed(0)}</span>
        </div>

        {/* Last Activity */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span className="font-medium">Última Actividad</span>
          <span className="text-gray-700 dark:text-gray-300">{getLastActivityText()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
