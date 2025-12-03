'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { mockExamsAPI } from '@/features/mock-exams/api/mockExamsAPI';
import type { MockExamListItem, GetMockExamDetailsResponse, PaymentMethod } from '@/features/mock-exams/api/types';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Alert, AlertDescription } from '@/shared/ui/Alert';
import {
  Target,
  Lock,
  AlertCircle,
  Trophy,
  Clock,
  CheckCircle,
  ChevronRight,
  BookOpen,
  CreditCard
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type ViewMode = 'list' | 'details' | 'purchase';

export default function MockExamsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [mockExams, setMockExams] = useState<MockExamListItem[]>([]);
  const [selectedExam, setSelectedExam] = useState<GetMockExamDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMockExams();
  }, []);

  const loadMockExams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockExamsAPI.getMockExams();
      setMockExams(response.mockExams);
    } catch (err) {
      console.error('Error loading mock exams:', err);
      setError('Error al cargar los simulacros');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExam = async (examId: string) => {
    setLoading(true);
    setError(null);
    try {
      const details = await mockExamsAPI.getMockExamDetails(examId);
      setSelectedExam(details);
      setViewMode('details');
    } catch (err) {
      console.error('Error loading exam details:', err);
      setError('Error al cargar los detalles del simulacro');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (paymentMethod: PaymentMethod) => {
    if (!selectedExam) return;

    setLoading(true);
    setError(null);
    try {
      await mockExamsAPI.purchaseMockExam(selectedExam.mockExam._id, { paymentMethod });
      // Refresh exam details after purchase
      const updated = await mockExamsAPI.getMockExamDetails(selectedExam.mockExam._id);
      setSelectedExam(updated);
      setViewMode('details');
    } catch (err) {
      console.error('Error purchasing exam:', err);
      setError('Error al realizar la compra');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async () => {
    if (!selectedExam) return;

    // Find the most recent purchase to get purchaseId
    // For now, we'll use the exam ID (backend may handle this differently)
    setLoading(true);
    setError(null);
    try {
      const response = await mockExamsAPI.startMockExam(selectedExam.mockExam._id, {
        mockExamPurchasedId: selectedExam.mockExam._id, // Backend should validate this
      });
      router.push(`/mock-exams/${response.attemptId}`);
    } catch (err) {
      console.error('Error starting exam:', err);
      setError('Error al iniciar el simulacro');
      setLoading(false);
    }
  };

  // Loading state
  if (loading && viewMode === 'list' && mockExams.length === 0) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    );
  }

  // LIST VIEW - Show all available mock exams
  if (viewMode === 'list') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4 max-w-4xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Target className="w-12 h-12 text-purple-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold">Simulacros de Examen</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Practica con exámenes completos estilo EXANI-II
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Mock Exams List */}
            <div className="grid gap-4">
              {mockExams.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No hay simulacros disponibles</p>
                  </CardContent>
                </Card>
              ) : (
                mockExams.map((exam) => (
                  <Card
                    key={exam._id}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-md',
                      exam.isPurchased && 'border-purple-500'
                    )}
                    onClick={() => handleSelectExam(exam._id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{exam.name}</h3>
                            {exam.isPurchased && (
                              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full">
                                Adquirido
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {exam.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {exam.totalQuestions} preguntas
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {exam.timeLimitMinutes} min
                            </span>
                            {exam.isPurchased && (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                {exam.maxAttempts - (exam.attemptsUsed || 0)} intentos restantes
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!exam.isPurchased && (
                            <span className="font-bold text-purple-600">
                              ${exam.price.toFixed(2)}
                            </span>
                          )}
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Back to home */}
            <Button
              variant="outline"
              onClick={() => router.push('/home')}
              className="w-full"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // DETAILS VIEW - Show selected exam details
  if (viewMode === 'details' && selectedExam) {
    const attemptsRemaining = selectedExam.attemptsRemaining;
    const canStart = selectedExam.isPurchased && attemptsRemaining > 0;

    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4 max-w-4xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Target className="w-12 h-12 text-purple-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold">{selectedExam.mockExam.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedExam.mockExam.description}
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Exam Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Examen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{selectedExam.mockExam.totalQuestions}</p>
                    <p className="text-sm text-muted-foreground">Preguntas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{selectedExam.mockExam.timeLimitMinutes}</p>
                    <p className="text-sm text-muted-foreground">Minutos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{attemptsRemaining}</p>
                    <p className="text-sm text-muted-foreground">Intentos restantes</p>
                  </div>
                </div>

                {/* Subject Distribution */}
                {selectedExam.mockExam.subjectDistribution?.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Distribución por Materia</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedExam.mockExam.subjectDistribution.map((subject) => (
                        <div
                          key={subject.subjectName}
                          className="flex items-center justify-between text-sm p-2 bg-muted rounded"
                        >
                          <span>{subject.subjectName}</span>
                          <span className="font-medium">{subject.questionCount} preguntas</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Previous Attempts */}
            {selectedExam.userAttempts?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Intentos Anteriores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedExam.userAttempts.map((attempt) => (
                      <div
                        key={attempt.attemptId}
                        className="flex items-center justify-between p-3 bg-muted rounded cursor-pointer hover:bg-muted/80"
                        onClick={() => router.push(`/mock-exams/${attempt.attemptId}/results`)}
                      >
                        <div className="flex items-center gap-2">
                          {attempt.status === 'COMPLETED' ? (
                            <Trophy className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-blue-500" />
                          )}
                          <span className="text-sm">
                            {new Date(attempt.startedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {attempt.score !== undefined && (
                            <span className="font-medium">{attempt.score}%</span>
                          )}
                          <span
                            className={cn(
                              'px-2 py-0.5 text-xs rounded-full',
                              attempt.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            )}
                          >
                            {attempt.status === 'COMPLETED' ? 'Completado' : 'En progreso'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {canStart ? (
                <Button
                  onClick={handleStartExam}
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="animate-spin mr-2">⏳</span>
                  ) : null}
                  Comenzar Simulacro
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : !selectedExam.isPurchased ? (
                <Button
                  onClick={() => setViewMode('purchase')}
                  className="w-full"
                  size="lg"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Comprar por ${selectedExam.mockExam.price.toFixed(2)}
                </Button>
              ) : (
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    No tienes intentos restantes para este simulacro
                  </AlertDescription>
                </Alert>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  setSelectedExam(null);
                  setViewMode('list');
                }}
              >
                Volver a la lista
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // PURCHASE VIEW - Payment method selection
  if (viewMode === 'purchase' && selectedExam) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4 max-w-md space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Comprar Simulacro</CardTitle>
                <CardDescription>
                  {selectedExam.mockExam.name} - ${selectedExam.mockExam.price.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Selecciona un método de pago
                  </p>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handlePurchase('CARD')}
                    disabled={loading}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Tarjeta de crédito/débito
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handlePurchase('TRANSFER')}
                    disabled={loading}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 10h18M3 14h18M12 3v18"/>
                    </svg>
                    Transferencia bancaria
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handlePurchase('CASH')}
                    disabled={loading}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="6" width="20" height="12" rx="2"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Efectivo
                  </Button>
                </div>

                <Button
                  variant="text"
                  className="w-full"
                  onClick={() => setViewMode('details')}
                >
                  Cancelar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return null;
}
