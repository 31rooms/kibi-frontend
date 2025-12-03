'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { dailyTestAPI } from '@/features/daily-test/api/dailyTestAPI';
import { progressAPI } from '@/features/progress/api/progressAPI';
import type { DailyTestSession, DailyTestQuestion, AnswerQuestionResponse, CompleteDailyTestResponse } from '@/features/daily-test/api/types';

// Feature Components
import { DailyTestSession as DailyTestSessionComponent } from '@/features/daily-test/components/DailyTestSession';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Alert, AlertDescription } from '@/shared/ui/Alert';
import { Modal } from '@/shared/ui/Modal';

import {
  Clock,
  CheckCircle,
  ChevronRight,
  Zap,
  Trophy,
  Flame,
  Target,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type ViewMode = 'check' | 'test' | 'results';

export default function DailyTestPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('check');
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<DailyTestSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<AnswerQuestionResponse | null>(null);
  const [results, setResults] = useState<CompleteDailyTestResponse | null>(null);
  const [timer, setTimer] = useState(0);
  const [hasTestAvailable, setHasTestAvailable] = useState(false);
  const [checkMessage, setCheckMessage] = useState('');
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    checkDailyTest();
  }, []);

  const QUESTION_TIME_LIMIT = 60; // 1 minuto por pregunta
  const FEEDBACK_DISPLAY_TIME = 2000; // 2 segundos para mostrar feedback

  // Timer effect - countdown desde 60 segundos
  useEffect(() => {
    if (viewMode === 'test' && !answerFeedback) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [viewMode, answerFeedback]);

  // Auto-skip cuando el tiempo llega a 0 (sin respuesta = incorrecto)
  useEffect(() => {
    if (timer === 0 && viewMode === 'test' && !answerFeedback && session && !loading) {
      handleTimeOut();
    }
  }, [timer]);

  // Auto-avanzar después de mostrar feedback
  useEffect(() => {
    if (answerFeedback && viewMode === 'test') {
      const timeout = setTimeout(() => {
        goToNextQuestion();
      }, FEEDBACK_DISPLAY_TIME);
      return () => clearTimeout(timeout);
    }
  }, [answerFeedback]);

  const checkDailyTest = async () => {
    setLoading(true);
    try {
      const check = await dailyTestAPI.checkDailyTest();
      // Use 'available' from new API (backward compatible with hasTestAvailable)
      setHasTestAvailable(check.available);

      if (check.completedToday) {
        setCheckMessage('Ya completaste tu test diario de hoy. ¡Vuelve mañana!');
      } else if (!check.available) {
        setCheckMessage('El test diario no está disponible en este momento.');
      }
    } catch (error) {
      console.error('Error checking daily test:', error);
      setCheckMessage('Error al verificar disponibilidad del test.');
    } finally {
      setLoading(false);
    }
  };

  const startTest = async () => {
    setLoading(true);
    try {
      const newSession = await dailyTestAPI.generateDailyTest();
      setSession(newSession);
      setCurrentQuestionIndex(0);
      setViewMode('test');
      setTimer(QUESTION_TIME_LIMIT);
    } catch (error) {
      console.error('Error starting test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionId: string) => {
    if (!session || answerFeedback) return;
    setSelectedAnswer(optionId);
  };

  // Enviar respuesta al endpoint
  const handleSubmitAnswer = async () => {
    if (!session || !selectedAnswer || answerFeedback || loading) return;

    setLoading(true);
    try {
      const currentQuestion = session.questions[currentQuestionIndex];
      // Calcular tiempo usado (60 - tiempo restante)
      const timeSpent = QUESTION_TIME_LIMIT - timer;
      const feedback = await dailyTestAPI.answerQuestion(session.testId, {
        questionId: currentQuestion._id,
        selectedAnswer: selectedAnswer,
        timeSpentSeconds: timeSpent
      });

      setAnswerFeedback(feedback);
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setLoading(false);
    }
  };

  // Avanzar a la siguiente pregunta
  const goToNextQuestion = () => {
    if (!session) return;

    setSelectedAnswer(null);
    setAnswerFeedback(null);
    setTimer(QUESTION_TIME_LIMIT);

    if (currentQuestionIndex < (session.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeTest();
    }
  };

  // Cuando se agota el tiempo - marcar como incorrecto y mostrar feedback
  const handleTimeOut = async () => {
    if (!session || loading) return;

    setLoading(true);
    try {
      const currentQuestion = session.questions[currentQuestionIndex];
      // Enviar sin respuesta o con respuesta vacía - el backend lo marca como incorrecto
      const feedback = await dailyTestAPI.answerQuestion(session.testId, {
        questionId: currentQuestion._id,
        selectedAnswer: selectedAnswer || '', // Enviar vacío si no hay selección
        timeSpentSeconds: QUESTION_TIME_LIMIT
      });

      setAnswerFeedback(feedback);
    } catch (error) {
      console.error('Error on timeout:', error);
      // Si hay error, avanzar de todos modos
      goToNextQuestion();
    } finally {
      setLoading(false);
    }
  };

  // Manejar click en salir
  const handleExitClick = () => {
    setShowExitModal(true);
  };

  // Confirmar salida del test
  const handleConfirmExit = () => {
    setShowExitModal(false);
    router.push('/home');
  };

  const completeTest = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const testResults = await dailyTestAPI.completeDailyTest(session.testId);
      setResults(testResults);
      setViewMode('results');

      // Refresh dashboard data
      try {
        await progressAPI.getDashboard();
      } catch {
        // Ignore errors from progress API
      }
    } catch (error) {
      console.error('Error completing test:', error);
    } finally {
      setLoading(false);
    }
  };

  // CHECK VIEW
  if (viewMode === 'check') {
    return (
      <ProtectedRoute>
        <div className="container max-w-4xl mx-auto p-6 min-h-screen flex items-center justify-center">
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Zap className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Test Diario</CardTitle>
              <CardDescription>
                Preguntas personalizadas para mantener tu racha activa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : hasTestAvailable ? (
                <>
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Completa tu test diario para desbloquear tu sesión de estudio
                    </p>

                    <div className="grid grid-cols-3 gap-4 py-4">
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          <CheckCircle className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-sm font-medium">7-10 Preguntas</p>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          <Clock className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-sm font-medium">~10 minutos</p>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          <Flame className="w-6 h-6 text-orange-500" />
                        </div>
                        <p className="text-sm font-medium">Mantén racha</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={startTest}
                    className="w-full"
                    size="lg"
                  >
                    Comenzar Test Diario
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {checkMessage || 'Ya completaste tu test diario de hoy. ¡Vuelve mañana!'}
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={() => router.push('/home')}
                    variant="outline"
                    className="w-full"
                  >
                    Volver al inicio
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  // TEST VIEW
  if (viewMode === 'test' && session) {
    return (
      <ProtectedRoute>
        <DailyTestSessionComponent
          session={session}
          currentQuestionIndex={currentQuestionIndex}
          selectedAnswer={selectedAnswer}
          answerFeedback={answerFeedback}
          timer={timer}
          loading={loading}
          onAnswerSelect={handleAnswerSelect}
          onNextQuestion={handleSubmitAnswer}
          onExit={handleExitClick}
        />

        {/* Exit Confirmation Modal */}
        <Modal
          isOpen={showExitModal}
          onClose={() => setShowExitModal(false)}
          state="alert"
          title="¿Seguro que deseas salir?"
          description="Si sales ahora, perderás todo el progreso del test diario. Esta acción no se puede deshacer."
          cancelText="Cancelar"
          confirmText="Salir del test"
          onCancel={() => setShowExitModal(false)}
          onConfirm={handleConfirmExit}
        />
      </ProtectedRoute>
    );
  }

  // RESULTS VIEW
  if (viewMode === 'results' && results) {
    const percentage = results.results.effectiveness;

    return (
      <ProtectedRoute>
        <div className="container max-w-4xl mx-auto p-6 min-h-screen flex items-center justify-center">
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className={cn(
                  'p-4 rounded-full',
                  percentage >= 80 ? 'bg-green-100 dark:bg-green-900' :
                  percentage >= 60 ? 'bg-blue-100 dark:bg-blue-900' :
                  'bg-orange-100 dark:bg-orange-900'
                )}>
                  <Trophy className={cn(
                    'w-12 h-12',
                    percentage >= 80 ? 'text-green-600' :
                    percentage >= 60 ? 'text-blue-600' :
                    'text-orange-600'
                  )} />
                </div>
              </div>
              <CardTitle className="text-2xl">¡Test Completado!</CardTitle>
              <CardDescription>
                {results.streakUpdated && results.currentStreak > 0 && (
                  <span className="flex items-center justify-center gap-2 mt-2 text-orange-500 font-medium">
                    <Flame className="w-4 h-4" />
                    Racha: {results.currentStreak} días
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score */}
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">
                  {results.results.correctAnswers}/{results.results.totalQuestions}
                </div>
                <p className="text-muted-foreground">
                  {percentage.toFixed(0)}% de efectividad
                </p>
              </div>

              {/* Subject Breakdown */}
              {results.results.subjectBreakdown && results.results.subjectBreakdown.length > 0 && (
                <div className="space-y-3 py-4 border-y">
                  <h3 className="font-semibold text-center">Por Asignatura</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {results.results.subjectBreakdown.map((subject) => (
                      <div key={subject.subjectName} className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">{subject.subjectName}</p>
                        <p className="text-lg font-bold">
                          {subject.correct}/{subject.total}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Session Unlocked */}
              {results.sessionUnlocked && (
                <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    {results.message || '¡Tu sesión de estudio está desbloqueada!'}
                  </AlertDescription>
                </Alert>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4">
                {results.sessionUnlocked && (
                  <Button onClick={() => router.push('/session')} size="lg">
                    Ir a mi sesión de estudio
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                <Button
                  onClick={() => router.push('/home')}
                  variant={results.sessionUnlocked ? 'outline' : 'default'}
                >
                  Volver al inicio
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/progress')}
                >
                  Ver mi progreso
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return null;
}
