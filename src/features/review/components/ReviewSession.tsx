'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { reviewAPI } from '../api/reviewAPI';
import type { ReviewSession as ReviewSessionType, AnswerReviewRequest } from '../api/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Alert, AlertDescription } from '@/shared/ui/Alert';
import { Modal } from '@/shared/ui/Modal';
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Flame,
  Calendar,
  Award,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
// Using console.log for notifications (can be replaced with a toast library if needed)

interface ReviewSessionProps {
  sessionId: string;
}

export function ReviewSession({ sessionId }: ReviewSessionProps) {
  const router = useRouter();
  const [session, setSession] = useState<ReviewSessionType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctOptionId, setCorrectOptionId] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [streak, setStreak] = useState({ correct: 0, incorrect: 0 });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Load session data
  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    setLoading(true);
    try {
      // In a real implementation, we'd fetch the session from the API
      // For now, we'll use getCurrentSession or create a method to get by ID
      const response = await fetch(`/api/review/sessions/${sessionId}`);
      const data = await response.json();
      setSession(data);
    } catch (error) {
      console.error('Error loading session:', error);
      console.error('Error loading session');
      router.push('/reviews');
    } finally {
      setLoading(false);
    }
  };

  // Handle answer submission
  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !session) return;

    setIsSubmitting(true);
    try {
      const currentQ = session.questions[currentQuestionIndex];
      const answerData: AnswerReviewRequest = {
        questionId: currentQ.question.id,
        selectedOptionId: selectedAnswer,
        timeSpent: 0,
      };

      const response = await reviewAPI.answerQuestion(sessionId, answerData);

      setIsCorrect(response.isCorrect);
      setCorrectOptionId(response.correctOptionId);
      setExplanation(response.explanation || '');
      setShowFeedback(true);

      // Update streak
      if (response.isCorrect) {
        setStreak((prev) => ({ correct: prev.correct + 1, incorrect: 0 }));
        console.log('✅ Correct!');
      } else {
        setStreak((prev) => ({ correct: 0, incorrect: prev.incorrect + 1 }));
        console.log('❌ Incorrect');
      }

      // Update local state
      const updatedQuestions = [...session.questions];
      updatedQuestions[currentQuestionIndex] = {
        ...currentQ,
        userAnswer: selectedAnswer,
        isCorrect: response.isCorrect,
      };

      setSession({
        ...session,
        questions: updatedQuestions,
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle next question
  const handleNext = () => {
    if (!session) return;

    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
      setCorrectOptionId('');
      setExplanation('');
    } else {
      // Complete session
      handleCompleteSession();
    }
  };

  // Complete session
  const handleCompleteSession = async () => {
    if (!session) return;

    try {
      const response = await reviewAPI.completeReviewSession(sessionId);
      setResults(response);
      setShowResults(true);
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert>
          <AlertDescription>No se pudo cargar la sesión</AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = {
    answered: session.questions.filter((q) => q.userAnswer).length,
    correct: session.questions.filter((q) => q.isCorrect).length,
    total: session.questions.length,
  };

  // Results Modal
  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full">
                <Award className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">¡Sesión Completada!</h1>
            <p className="text-gray-600 dark:text-gray-400">{session.subtopicName}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-green-600">
                  {results.correctAnswers}
                  <span className="text-3xl text-gray-400">/{results.totalQuestions}</span>
                </div>
                <div className="text-2xl text-gray-600 dark:text-gray-400 mt-2">
                  {results.effectiveness.toFixed(1)}% efectividad
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Nivel de Dominio
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {results.masteryLevel === 0
                      ? 'BÁSICO'
                      : results.masteryLevel <= 2
                      ? 'INTERMEDIO'
                      : 'AVANZADO'}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Próximo Repaso
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {results.intervalDays} días
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <p className="text-blue-900 dark:text-blue-300 font-medium">
                  {results.performanceMessage}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button onClick={() => router.push('/reviews')} className="w-full">
              Ver Todos los Repasos
            </Button>
            <Button variant="outline" onClick={() => router.push('/home')} className="w-full">
              Ir al Inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg">{session.subtopicName}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span>Pregunta {currentQuestionIndex + 1} / {session.questions.length}</span>
                {streak.correct > 0 && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Flame className="w-4 h-4" />
                    <span>{streak.correct} correctas</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {progress.correct} / {progress.total}
              </span>
              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 transition-all"
                  style={{ width: `${(progress.answered / progress.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                {currentQuestion.question.difficulty}
              </span>
              <span>Intento #{currentQuestion.attemptNumber}</span>
            </div>
            <CardTitle className="text-xl">{currentQuestion.question.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Question Image */}
            {currentQuestion.question.imageUrl && (
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={currentQuestion.question.imageUrl}
                  alt="Question"
                  className="w-full"
                />
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrectOption = correctOptionId === option.id;
                const showAsCorrect = showFeedback && isCorrectOption;
                const showAsIncorrect = showFeedback && isSelected && !isCorrect;

                return (
                  <button
                    key={option.id}
                    onClick={() => !showFeedback && setSelectedAnswer(option.id)}
                    disabled={showFeedback}
                    className={cn(
                      'w-full p-4 rounded-lg border-2 text-left transition-all',
                      showAsCorrect &&
                        'border-green-600 bg-green-50 dark:bg-green-900/20',
                      showAsIncorrect &&
                        'border-red-600 bg-red-50 dark:bg-red-900/20',
                      !showFeedback &&
                        isSelected &&
                        'border-blue-600 bg-blue-50 dark:bg-blue-900/20',
                      !showFeedback &&
                        !isSelected &&
                        'border-gray-200 hover:border-gray-300 bg-white dark:bg-gray-800'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center',
                          showAsCorrect && 'border-green-600 bg-green-600',
                          showAsIncorrect && 'border-red-600 bg-red-600',
                          !showFeedback && isSelected && 'border-blue-600 bg-blue-600',
                          !showFeedback && !isSelected && 'border-gray-300'
                        )}
                      >
                        {showAsCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                        {showAsIncorrect && <XCircle className="w-4 h-4 text-white" />}
                        {!showFeedback && isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-gray-100">{option.text}</p>
                        {option.imageUrl && (
                          <img
                            src={option.imageUrl}
                            alt="Option"
                            className="mt-2 rounded border"
                          />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <Alert className={isCorrect ? 'border-green-600' : 'border-red-600'}>
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <div className="flex-1 space-y-2">
                    <AlertDescription>
                      {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                    </AlertDescription>
                    {explanation && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Explicación:</p>
                        <p className="text-gray-700 dark:text-gray-300">{explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Alert>
            )}

            {/* Action Button */}
            <div className="flex justify-end">
              {!showFeedback ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer || isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Respuesta'}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {currentQuestionIndex < session.questions.length - 1
                    ? 'Siguiente Pregunta'
                    : 'Ver Resultados'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
