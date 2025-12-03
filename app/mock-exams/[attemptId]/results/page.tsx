'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { mockExamsAPI } from '@/features/mock-exams/api/mockExamsAPI';
import type { MockExamAttempt, SubjectScore } from '@/features/mock-exams/api/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Trophy, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export default function MockExamResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const unwrappedParams = use(params);
  const attemptId = unwrappedParams.attemptId;
  const router = useRouter();
  const [attempt, setAttempt] = useState<MockExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [attemptId]);

  const loadResults = async () => {
    setLoading(true);
    try {
      const data = await mockExamsAPI.getAttemptDetails(attemptId);
      setAttempt(data);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!attempt) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <p>No se encontraron resultados</p>
        </div>
      </ProtectedRoute>
    );
  }

  const percentage = ((attempt.correctAnswers || 0) / attempt.totalQuestions) * 100;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Trophy className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">¡Examen Completado!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Simulacro #{attempt.examNumber}
            </p>
          </div>

          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle>Puntaje General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div>
                  <div className="text-6xl font-bold text-purple-600">
                    {attempt.correctAnswers}
                    <span className="text-3xl text-gray-400">/{attempt.totalQuestions}</span>
                  </div>
                  <div className="text-2xl text-gray-600 dark:text-gray-400 mt-2">
                    {percentage.toFixed(1)}%
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {percentage >= 70 ? (
                    <>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-green-600 font-medium">¡Excelente trabajo!</span>
                    </>
                  ) : percentage >= 50 ? (
                    <>
                      <Minus className="w-5 h-5 text-yellow-600" />
                      <span className="text-yellow-600 font-medium">Buen intento</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      <span className="text-red-600 font-medium">Sigue practicando</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Breakdown */}
          {attempt.scoresBySubject && attempt.scoresBySubject.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Desglose por Materia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {attempt.scoresBySubject.map((subject) => (
                  <div key={subject.subjectId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{subject.subjectName}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {subject.correct}/{subject.total} ({subject.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'absolute left-0 top-0 h-full transition-all rounded-full',
                          subject.percentage >= 70
                            ? 'bg-green-600'
                            : subject.percentage >= 50
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        )}
                        style={{ width: `${subject.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push(`/mock-exams/${attemptId}/review`)}
              className="w-full"
            >
              Ver Respuestas Incorrectas
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/mock-exams')}
              className="w-full"
            >
              Volver a Simulacros
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/home')}
              className="w-full"
            >
              Ir al Inicio
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
