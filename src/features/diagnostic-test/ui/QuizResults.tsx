'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { QuizResults as QuizResultsType } from '../types/quiz.types';
import { getQuizStatistics } from '../utils/quizScoring';
import { Button } from '@/shared/ui';
import { CheckCircle, XCircle, Clock, Target } from 'lucide-react';

export interface QuizResultsProps {
  /** Quiz results data */
  results: QuizResultsType;

  /** Callback to restart the quiz */
  onRestart?: () => void;

  /** Callback to view detailed results */
  onViewDetails?: () => void;

  /** Callback to go home/exit */
  onExit?: () => void;

  /** Custom className */
  className?: string;
}

/**
 * Quiz results display component
 *
 * Shows:
 * - Score and performance level
 * - Statistics (correct/incorrect, time spent)
 * - Action buttons (restart, view details, exit)
 */
export function QuizResults({
  results,
  onRestart,
  onViewDetails,
  onExit,
  className,
}: QuizResultsProps) {
  const stats = getQuizStatistics(results);

  // Format time in minutes and seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // Get score color based on performance
  const getScoreColor = () => {
    if (stats.score >= 90) return 'text-success-600';
    if (stats.score >= 70) return 'text-primary-green';
    if (stats.score >= 50) return 'text-orange-500';
    return 'text-error-500';
  };

  const getScoreBgColor = () => {
    if (stats.score >= 90) return 'bg-success-50';
    if (stats.score >= 70) return 'bg-primary-green/10';
    if (stats.score >= 50) return 'bg-orange-50';
    return 'bg-error-50';
  };

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Main Score Card */}
      <div className="bg-white rounded-xl shadow-bubble p-8 mb-6 text-center">
        {/* Performance Badge */}
        <div
          className={cn(
            'inline-flex items-center justify-center w-24 h-24 rounded-full mb-4',
            getScoreBgColor()
          )}
        >
          <span className={cn('text-4xl font-bold', getScoreColor())}>
            {stats.score}%
          </span>
        </div>

        {/* Performance Message */}
        <h2 className="text-2xl font-bold text-primary-blue mb-2">
          {stats.performance.message}
        </h2>

        {/* Pass/Fail Status */}
        <p className="text-grey-600">
          {stats.isPassing ? (
            <span className="text-success-600 font-medium">
              Has aprobado el test
            </span>
          ) : (
            <span className="text-error-500 font-medium">
              Necesitas mejorar
            </span>
          )}
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Correct Answers */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-success-500" />
            <span className="text-sm font-medium text-grey-600">
              Correctas
            </span>
          </div>
          <p className="text-2xl font-bold text-primary-blue">
            {stats.correctCount}
          </p>
        </div>

        {/* Incorrect Answers */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-error-500" />
            <span className="text-sm font-medium text-grey-600">
              Incorrectas
            </span>
          </div>
          <p className="text-2xl font-bold text-primary-blue">
            {stats.incorrectCount}
          </p>
        </div>

        {/* Time Spent */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-primary-green" />
            <span className="text-sm font-medium text-grey-600">
              Tiempo total
            </span>
          </div>
          <p className="text-2xl font-bold text-primary-blue">
            {formatTime(stats.totalTimeSpent)}
          </p>
        </div>

        {/* Accuracy */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-primary-green" />
            <span className="text-sm font-medium text-grey-600">
              Precisión
            </span>
          </div>
          <p className="text-2xl font-bold text-primary-blue">
            {stats.accuracy}%
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {onRestart && (
          <Button
            variant="primary"
            color="green"
            size="medium"
            onClick={onRestart}
            className="flex-1"
          >
            Intentar de nuevo
          </Button>
        )}

        {onViewDetails && (
          <Button
            variant="secondary"
            color="blue"
            size="medium"
            onClick={onViewDetails}
            className="flex-1"
          >
            Ver detalles
          </Button>
        )}

        {onExit && (
          <Button
            variant="text"
            color="blue"
            size="medium"
            onClick={onExit}
            className="flex-1"
          >
            Salir
          </Button>
        )}
      </div>
    </div>
  );
}
