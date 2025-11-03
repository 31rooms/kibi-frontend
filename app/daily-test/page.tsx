'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { dailyTestAPI } from '@/features/daily-test/api/dailyTestAPI';
import { progressAPI } from '@/features/progress/api/progressAPI';
import type { DailyTestSession, DailyTestQuestion, AnswerQuestionResponse, CompleteDailyTestResponse } from '@/features/daily-test/api/types';

// Feature Components
import { DailyTestSession as DailyTestSessionComponent } from '@/features/daily-test/components/DailyTestSession';
import { ReportContentModal } from '@/features/daily-test/components/ReportContentModal';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/Badge';
import { Alert, AlertDescription } from '@/shared/ui/Alert';
import { AchievementBadge } from '@/shared/ui/AchievementBadge';

import {
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
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
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    checkDailyTest();
  }, []);

  // Timer effect
  useEffect(() => {
    if (viewMode === 'test' && !answerFeedback) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [viewMode, answerFeedback]);

  const checkDailyTest = async () => {
    setLoading(true);
    try {
      const check = await dailyTestAPI.checkDailyTest();
      setHasTestAvailable(check.hasTestAvailable);
      setCheckMessage(check.message || '');

      if (check.hasTestAvailable) {
        // Check if there's an ongoing session
        const existingSession = await dailyTestAPI.getCurrentSession();
        if (existingSession && !existingSession.completed) {
          setSession(existingSession);
          // Find last answered question
          const lastAnswered = existingSession.questions.findIndex(q => !q.userAnswer);
          setCurrentQuestionIndex(lastAnswered === -1 ? 0 : lastAnswered);
          setViewMode('test');
        }
      }
    } catch (error) {
      console.error('Error checking daily test:', error);
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
      setTimer(0);
    } catch (error) {
      console.error('Error starting test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (optionId: string) => {
    if (!session || answerFeedback) return;

    setSelectedAnswer(optionId);
    setLoading(true);

    try {
      const feedback = await dailyTestAPI.answerQuestion(session.id, {
        questionId: session.questions[currentQuestionIndex].question.id,
        selectedOptionId: optionId,
        timeSpent: timer
      });

      setAnswerFeedback(feedback);
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setAnswerFeedback(null);
    setTimer(0);

    if (currentQuestionIndex < (session?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeTest();
    }
  };

  const completeTest = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const testResults = await dailyTestAPI.completeDailyTest(session.id);
      setResults(testResults);
      setViewMode('results');

      // Refresh dashboard data
      await progressAPI.getDashboard();
    } catch (error) {
      console.error('Error completing test:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReport = async (reason: string, details: string) => {
    if (!session) return;
    const currentQuestion = session.questions[currentQuestionIndex];

    // TODO: Implementar endpoint de reporte en el backend
    console.log('Reporting question:', {
      questionId: currentQuestion.question.id,
      reason,
      details
    });

    // Simulación de éxito
    return Promise.resolve();
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setAnswerFeedback(null);
      setTimer(0);
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
                10 preguntas para mantener tu racha activa
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
                      Completa tu test diario para mantener tu racha y ganar experiencia
                    </p>

                    <div className="grid grid-cols-3 gap-4 py-4">
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          <CheckCircle className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-sm font-medium">10 Preguntas</p>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          <Clock className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-sm font-medium">~15 minutos</p>
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
                      {checkMessage || 'Ya completaste tu test diario de hoy. Vuelve mañana!'}
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
          onNextQuestion={handleNextQuestion}
          onPrevQuestion={handlePrevQuestion}
          onReport={() => setShowReportModal(true)}
        />

        <ReportContentModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          questionId={session.questions[currentQuestionIndex].question.id}
          onSubmit={handleReport}
        />
      </ProtectedRoute>
    );
  }

  // RESULTS VIEW
  if (viewMode === 'results' && results) {
    const percentage = (results.correctAnswers / results.totalQuestions) * 100;

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
              <CardTitle className="text-2xl">Test Completado!</CardTitle>
              <CardDescription>
                {results.streakUpdated && results.newStreak > 0 && (
                  <span className="flex items-center justify-center gap-2 mt-2 text-orange-500 font-medium">
                    <Flame className="w-4 h-4" />
                    Racha: {results.newStreak} días
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score */}
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">
                  {results.correctAnswers}/{results.totalQuestions}
                </div>
                <p className="text-muted-foreground">
                  {percentage.toFixed(0)}% de respuestas correctas
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {results.correctAnswers}
                  </p>
                  <p className="text-sm text-muted-foreground">Correctas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    +{results.experienceGained}
                  </p>
                  <p className="text-sm text-muted-foreground">XP ganada</p>
                </div>
              </div>

              {/* Achievements */}
              {results.achievements && results.achievements.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Logros Desbloqueados
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {results.achievements.map((achievement) => (
                      <AchievementBadge
                        key={achievement.id}
                        achievement={{
                          ...achievement,
                          code: achievement.type,
                          type: achievement.type as any,
                          icon: '🏆',
                          rarity: 'COMMON' as const,
                          points: 100,
                          category: achievement.type
                        }}
                        size="md"
                        animate={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4">
                <Button onClick={() => router.push('/home')} size="lg">
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