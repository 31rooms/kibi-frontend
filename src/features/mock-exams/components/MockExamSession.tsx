'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { mockExamsAPI } from '../api/mockExamsAPI';
import type { StartMockExamResponse, MockExamQuestion, AnswerMockExamRequest } from '../api/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Alert, AlertDescription } from '@/shared/ui/Alert';
import { Modal } from '@/shared/ui/Modal';
import {
  Clock,
  CheckCircle2,
  Circle,
  Flag,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface MockExamSessionProps {
  attemptId: string;
}

// Track answers locally since questions don't have userAnswer field
interface QuestionState {
  answered: boolean;
  selectedAnswer: string | null;
  markedForReview: boolean;
}

export function MockExamSession({ attemptId }: MockExamSessionProps) {
  const router = useRouter();
  const [attempt, setAttempt] = useState<StartMockExamResponse | null>(null);
  const [questionStates, setQuestionStates] = useState<Map<string, QuestionState>>(new Map());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showNavigationGrid, setShowNavigationGrid] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load attempt data
  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  const loadAttempt = async () => {
    setLoading(true);
    try {
      // Get attempt summary to check status and time
      const summary = await mockExamsAPI.getAttemptSummary(attemptId);

      // If already completed, redirect to results
      if (summary.status === 'COMPLETED') {
        router.push(`/mock-exams/${attemptId}/results`);
        return;
      }

      // For now, we need to get the questions from the initial start response
      // which should be stored or refetched. Using the attempt details endpoint
      const attemptData = await mockExamsAPI.getAttemptDetails(attemptId);

      // Build a minimal StartMockExamResponse-like structure
      const attemptResponse: StartMockExamResponse = {
        attemptId: attemptId,
        mockExamId: attemptData.mockExamId,
        mockExamName: summary.mockExamName,
        totalQuestions: attemptData.totalQuestions,
        timeLimitMinutes: attemptData.timeLimit,
        timeRemainingSeconds: summary.timeRemainingSeconds,
        questions: attemptData.questions,
        startedAt: attemptData.startTime,
      };

      setAttempt(attemptResponse);
      setTimeRemaining(summary.timeRemainingSeconds);

      // Initialize question states
      const states = new Map<string, QuestionState>();
      attemptData.questions.forEach((q: MockExamQuestion) => {
        states.set(q._id, {
          answered: false,
          selectedAnswer: null,
          markedForReview: false,
        });
      });
      setQuestionStates(states);

      // Auto-submit if time is up (status is either IN_PROGRESS or EXPIRED here since COMPLETED redirects)
      if (summary.timeRemainingSeconds === 0) {
        handleComplete(true);
      }
    } catch (error) {
      console.error('Error loading attempt:', error);
      router.push('/mock-exams');
    } finally {
      setLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0 || !attempt) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        // Warnings
        if (newTime === 30 * 60) {
          alert('⏰ Quedan 30 minutos');
        } else if (newTime === 10 * 60) {
          alert('⏰ Quedan 10 minutos');
        } else if (newTime === 0) {
          handleComplete(true);
        }

        return Math.max(0, newTime);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, attempt]);

  // Format time as HH:MM:SS for long durations
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswerSelect = async (optionId: string) => {
    if (!attempt) return;

    setSelectedAnswer(optionId);

    try {
      const currentQ = attempt.questions[currentQuestionIndex];

      await mockExamsAPI.answerQuestion(attemptId, {
        questionId: currentQ._id,
        selectedAnswer: optionId,
        timeSpentSeconds: 0, // Track this if needed
      });

      // Update local state
      setQuestionStates((prev) => {
        const newStates = new Map(prev);
        newStates.set(currentQ._id, {
          ...newStates.get(currentQ._id)!,
          answered: true,
          selectedAnswer: optionId,
        });
        return newStates;
      });
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  // Toggle mark for review
  const handleToggleMarkForReview = () => {
    if (!attempt) return;

    const currentQ = attempt.questions[currentQuestionIndex];

    setQuestionStates((prev) => {
      const newStates = new Map(prev);
      const currentState = newStates.get(currentQ._id)!;
      newStates.set(currentQ._id, {
        ...currentState,
        markedForReview: !currentState.markedForReview,
      });
      return newStates;
    });
  };

  // Navigation
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      const prevQ = attempt?.questions[newIndex];
      if (prevQ) {
        const state = questionStates.get(prevQ._id);
        setSelectedAnswer(state?.selectedAnswer || null);
      }
    }
  };

  const handleNext = () => {
    if (attempt && currentQuestionIndex < attempt.questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      const nextQ = attempt.questions[newIndex];
      const state = questionStates.get(nextQ._id);
      setSelectedAnswer(state?.selectedAnswer || null);
    }
  };

  const handleNavigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    const q = attempt?.questions[index];
    if (q) {
      const state = questionStates.get(q._id);
      setSelectedAnswer(state?.selectedAnswer || null);
    }
    setShowNavigationGrid(false);
  };

  // Calculate statistics
  const getStatistics = () => {
    if (!attempt) return { answered: 0, unanswered: 0, marked: 0 };

    let answered = 0;
    let marked = 0;

    questionStates.forEach((state) => {
      if (state.answered) answered++;
      if (state.markedForReview) marked++;
    });

    return {
      answered,
      unanswered: attempt.questions.length - answered,
      marked,
    };
  };

  // Handle complete
  const handleComplete = async (timeUp = false) => {
    if (!attempt) return;

    setIsSubmitting(true);
    try {
      await mockExamsAPI.completeMockExam(attemptId);
      router.push(`/mock-exams/${attemptId}/results`);
    } catch (error) {
      console.error('Error completing exam:', error);
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert>
          <AlertDescription>No se pudo cargar el examen</AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentQuestion = attempt.questions[currentQuestionIndex];
  const currentState = questionStates.get(currentQuestion._id) || {
    answered: false,
    selectedAnswer: null,
    markedForReview: false,
  };
  const stats = getStatistics();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Timer */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNavigationGrid(!showNavigationGrid)}
              >
                <Grid3x3 className="w-4 h-4 mr-2" />
                Navegación
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Pregunta {currentQuestionIndex + 1} / {attempt.questions.length}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg',
                  timeRemaining < 10 * 60
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    : timeRemaining < 30 * 60
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                )}
              >
                <Clock className="w-5 h-5" />
                {formatTime(timeRemaining)}
              </div>

              <Button onClick={() => setShowConfirmModal(true)} variant="default">
                Finalizar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Grid Modal */}
      {showNavigationGrid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-start justify-center pt-20">
          <Card className="max-w-4xl w-full mx-4 max-h-[80vh] overflow-auto">
            <CardHeader>
              <CardTitle>Navegación de Preguntas</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Respondida</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-gray-400" />
                  <span>Sin responder</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-orange-600" />
                  <span>Marcada</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-2">
                {attempt.questions.map((q, index) => {
                  const state = questionStates.get(q._id);
                  return (
                    <button
                      key={q._id}
                      onClick={() => handleNavigateToQuestion(index)}
                      className={cn(
                        'aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium relative',
                        index === currentQuestionIndex
                          ? 'border-blue-600 bg-blue-100 text-blue-700'
                          : state?.answered
                          ? 'border-green-600 bg-green-100 text-green-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {index + 1}
                      {state?.markedForReview && (
                        <Flag className="w-3 h-3 absolute top-1 right-1 text-orange-600" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setShowNavigationGrid(false)}>Cerrar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-medium">{currentQuestion.subjectName || 'Materia'}</span>
                  <span>•</span>
                  <span>Pregunta {currentQuestion.order || currentQuestionIndex + 1}</span>
                </div>
                <CardTitle className="text-xl">
                  {currentQuestion.statement}
                </CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleMarkForReview}
                className={cn(
                  currentState.markedForReview && 'border-orange-600 text-orange-600'
                )}
              >
                <Flag
                  className={cn('w-4 h-4', currentState.markedForReview && 'fill-current')}
                />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Question Image */}
            {currentQuestion.questionImage && (
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={currentQuestion.questionImage}
                  alt="Question"
                  className="w-full"
                />
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 text-left transition-all',
                    selectedAnswer === option.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white dark:bg-gray-800'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5',
                        selectedAnswer === option.id
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      )}
                    >
                      {selectedAnswer === option.id && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stats.answered} / {attempt.questions.length} respondidas
            {stats.marked > 0 && ` • ${stats.marked} marcadas`}
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentQuestionIndex === attempt.questions.length - 1}
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Finalizar Examen"
        >
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                ¿Estás seguro de que deseas finalizar el examen?
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Preguntas respondidas:</span>
                <span className="font-semibold">{stats.answered}</span>
              </div>
              <div className="flex justify-between">
                <span>Preguntas pendientes:</span>
                <span className="font-semibold text-orange-600">{stats.unanswered}</span>
              </div>
              {stats.marked > 0 && (
                <div className="flex justify-between">
                  <span>Marcadas para revisión:</span>
                  <span className="font-semibold text-orange-600">{stats.marked}</span>
                </div>
              )}
            </div>

            {stats.unanswered > 0 && (
              <Alert>
                <AlertDescription>
                  Tienes {stats.unanswered} preguntas sin responder. ¿Deseas continuar?
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleComplete(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Finalizando...' : 'Finalizar Examen'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
