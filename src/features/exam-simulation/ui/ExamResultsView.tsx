'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import {
  CheckCircle,
  XCircle,
  MinusCircle,
  Trophy,
  TrendingUp,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Users,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type {
  SubjectScore,
  ScoreComparison,
  StudyRecommendation,
} from '../types/mock-exam.types';

interface ExamResultsViewProps {
  totalAnswered: number;
  totalQuestions: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalSkipped?: number;
  score: number;
  percentage?: number;
  passed?: boolean;
  subjectScores?: SubjectScore[];
  comparison?: ScoreComparison;
  studyRecommendations?: StudyRecommendation[];
  attemptsRemaining?: number;
  onGoHome: () => void;
}

export function ExamResultsView({
  totalAnswered,
  totalQuestions,
  totalCorrect,
  totalIncorrect,
  totalSkipped = 0,
  score,
  percentage,
  passed,
  subjectScores,
  comparison,
  studyRecommendations,
  attemptsRemaining,
  onGoHome,
}: ExamResultsViewProps) {
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Calculate percentages for backwards compatibility
  const correctPercentage = percentage ?? (totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0);
  const incorrectPercentage = totalQuestions > 0 ? Math.round((totalIncorrect / totalQuestions) * 100) : 0;
  const skippedPercentage = totalQuestions > 0 ? Math.round((totalSkipped / totalQuestions) * 100) : 0;

  // Determine if passed (default to 60% threshold)
  const hasPassed = passed ?? correctPercentage >= 60;

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#171b22] py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Status Icon */}
          <div className="mb-2">
            {hasPassed ? (
              <>
                <Image
                  src="/icons/stars-simulacro.svg"
                  alt="Aprobado"
                  width={100}
                  height={100}
                  className="dark:hidden"
                />
                <Image
                  src="/icons/stars-simulacro-dark.svg"
                  alt="Aprobado"
                  width={100}
                  height={100}
                  className="hidden dark:block"
                />
              </>
            ) : (
              <div className="w-24 h-24 rounded-full bg-warning-100 dark:bg-warning-900/20 flex items-center justify-center">
                <TrendingUp className="w-12 h-12 text-warning-600" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className={cn(
            "text-2xl md:text-3xl font-bold",
            hasPassed ? "text-success-600" : "text-warning-600"
          )}>
            {hasPassed
              ? '¡Felicidades! Has aprobado el simulacro'
              : 'Sigue practicando, ¡tú puedes!'}
          </h1>

          {/* Score Display */}
          <div className="flex items-center gap-4">
            <div className={cn(
              "px-8 py-4 rounded-2xl",
              hasPassed ? "bg-success-100 dark:bg-success-900/20" : "bg-warning-100 dark:bg-warning-900/20"
            )}>
              <p className={cn(
                "text-5xl font-bold",
                hasPassed ? "text-success-600" : "text-warning-600"
              )}>
                {correctPercentage}%
              </p>
              <p className="text-sm text-grey-600 dark:text-grey-400 mt-1">
                {score} puntos
              </p>
            </div>
          </div>

          {/* Answers Summary */}
          <div className="w-full max-w-md space-y-3">
            {/* Correctas */}
            <Card
              variant="default"
              padding="none"
              className="bg-white dark:bg-primary-blue border-grey-200 dark:border-dark-500"
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success-600" />
                  </div>
                  <span className="text-base font-medium text-grey-900 dark:text-white">
                    Correctas
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-success-600">
                    {totalCorrect}
                  </span>
                  <span className="text-sm text-grey-500 ml-1">
                    ({correctPercentage}%)
                  </span>
                </div>
              </div>
            </Card>

            {/* Incorrectas */}
            <Card
              variant="default"
              padding="none"
              className="bg-white dark:bg-primary-blue border-grey-200 dark:border-dark-500"
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-error-100 dark:bg-error-900/20 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-error-600" />
                  </div>
                  <span className="text-base font-medium text-grey-900 dark:text-white">
                    Incorrectas
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-error-600">
                    {totalIncorrect}
                  </span>
                  <span className="text-sm text-grey-500 ml-1">
                    ({incorrectPercentage}%)
                  </span>
                </div>
              </div>
            </Card>

            {/* Sin responder */}
            {totalSkipped > 0 && (
              <Card
                variant="default"
                padding="none"
                className="bg-white dark:bg-primary-blue border-grey-200 dark:border-dark-500"
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-grey-100 dark:bg-grey-800 flex items-center justify-center">
                      <MinusCircle className="w-5 h-5 text-grey-500" />
                    </div>
                    <span className="text-base font-medium text-grey-900 dark:text-white">
                      Sin responder
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-grey-500">
                      {totalSkipped}
                    </span>
                    <span className="text-sm text-grey-500 ml-1">
                      ({skippedPercentage}%)
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Comparison with others */}
          {comparison && (
            <Card
              variant="default"
              padding="medium"
              className="w-full max-w-md bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-grey-900 dark:text-white">
                  Comparación con otros estudiantes
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-grey-900 dark:text-white">
                    {comparison.yourScore.toFixed(1)}%
                  </p>
                  <p className="text-xs text-grey-500">Tu puntaje</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-grey-500">
                    {comparison.averageScore.toFixed(1)}%
                  </p>
                  <p className="text-xs text-grey-500">Promedio</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-green">
                    Top {100 - comparison.percentile}%
                  </p>
                  <p className="text-xs text-grey-500">Percentil</p>
                </div>
              </div>
            </Card>
          )}

          {/* Subject Scores */}
          {subjectScores && subjectScores.length > 0 && (
            <div className="w-full max-w-md">
              <h2 className="text-lg font-semibold text-grey-900 dark:text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary-green" />
                Resultados por materia
              </h2>
              <div className="space-y-3">
                {subjectScores.map((subject) => (
                  <div key={subject.subjectId} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-grey-700 dark:text-grey-300">
                        {subject.subjectName}
                      </span>
                      <span className="font-medium text-grey-900 dark:text-white">
                        {subject.correct}/{subject.total} ({subject.percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-grey-200 dark:bg-dark-600 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          subject.percentage >= 60
                            ? "bg-success-500"
                            : subject.percentage >= 40
                            ? "bg-warning-500"
                            : "bg-error-500"
                        )}
                        style={{ width: `${subject.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Study Recommendations */}
          {studyRecommendations && studyRecommendations.length > 0 && (
            <div className="w-full max-w-md">
              <button
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="w-full flex items-center justify-between text-lg font-semibold text-grey-900 dark:text-white mb-4 hover:text-primary-green transition-colors"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary-green" />
                  Recomendaciones de estudio
                </span>
                {showRecommendations ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {showRecommendations && (
                <div className="space-y-4">
                  {studyRecommendations.map((rec, index) => (
                    <Card
                      key={index}
                      variant="default"
                      padding="medium"
                      className="bg-grey-50 dark:bg-dark-700 border-grey-200 dark:border-dark-500 text-left"
                    >
                      <h3 className="font-semibold text-grey-900 dark:text-white mb-2">
                        {rec.subjectName}
                      </h3>
                      <p className="text-sm text-grey-600 dark:text-grey-400 mb-3">
                        {rec.reason}
                      </p>
                      {rec.topicsToReview.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-grey-500 mb-1">
                            Temas a repasar:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {rec.topicsToReview.map((topic, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 text-xs bg-primary-green/10 text-primary-green rounded"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Attempts Remaining */}
          {attemptsRemaining !== undefined && (
            <p className="text-sm text-grey-600 dark:text-grey-400">
              Te quedan <span className="font-semibold text-primary-green">{attemptsRemaining}</span> intento{attemptsRemaining !== 1 ? 's' : ''} disponible{attemptsRemaining !== 1 ? 's' : ''}
            </p>
          )}

          {/* Motivational Message */}
          <p className="text-base text-grey-600 dark:text-grey-400 max-w-md">
            {hasPassed
              ? '¡Excelente trabajo! Sigue practicando para mantener tu nivel.'
              : 'No te desanimes. Recuerda que la práctica hace al maestro. ¡Sigue adelante!'}
          </p>

          {/* Action Button */}
          <div className="pt-4">
            <Button
              variant="primary"
              color="green"
              size="large"
              onClick={onGoHome}
            >
              Ir al inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
