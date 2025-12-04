'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Feature imports
import { useMockExam } from '../hooks/useMockExam';
import { mockExamsAPI } from '../api/mock-exams-service';
import { simulationsAPI } from '../api/simulations-service';
import { ExamQuestionView } from './ExamQuestionView';
import { ExamSummaryView } from './ExamSummaryView';
import { ExamResultsView } from './ExamResultsView';
import type { MockExamQuestion, GetAttemptResultsResponse } from '../types/mock-exam.types';

// UI Components
import { Button } from '@/shared/ui/Button';
import { Activity, Loader2, FileText, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

// Inner component that uses useSearchParams (needs Suspense boundary)
function ExamSimulationInner({
  mockExamIdProp,
  purchaseIdProp,
  dynamicModeProp = true, // Default to dynamic mode
  className,
  ...props
}: {
  mockExamIdProp?: string;
  purchaseIdProp?: string;
  dynamicModeProp?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSummary, setShowSummary] = useState(false);
  const [showPreviousResults, setShowPreviousResults] = useState(false);
  const [previousResults, setPreviousResults] = useState<any>(null);
  const [loadingPreviousResults, setLoadingPreviousResults] = useState(false);

  // Access control state
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);

  // Get params from props or URL
  const mockExamId = mockExamIdProp || searchParams.get('examId') || undefined;
  const purchaseId = purchaseIdProp || searchParams.get('purchaseId') || undefined;

  // Use dynamic mode unless a specific mockExamId is provided
  const dynamicMode = dynamicModeProp && !mockExamId;

  const exam = useMockExam({
    mockExamId,
    purchaseId,
    dynamicMode,
    onComplete: (results) => {
      console.log('Exam completed with results:', results);
    },
    onTimeUp: () => {
      console.log('Time is up! Exam auto-completed');
    },
  });

  // Handle exit - navigate away, state is persisted in backend
  const handleExit = () => {
    setShowSummary(false);
    setShowPreviousResults(false);
    router.push('/home?section=examen');
  };

  // Check access on load - user must have credits OR active attempt
  useEffect(() => {
    const checkAccess = async () => {
      // Skip if already checked or if exam hook is still loading
      if (accessChecked || exam.isLoading) return;

      try {
        // If there's an active attempt, user has access
        if (exam.hasActiveAttempt || exam.attemptId) {
          setHasAccess(true);
          setAccessChecked(true);
          return;
        }

        // If there's a last completed attempt, user has access (to view results)
        if (exam.lastCompletedAttempt) {
          setHasAccess(true);
          setAccessChecked(true);
          return;
        }

        // Check if user has credits available
        const quota = await simulationsAPI.getQuota();
        if (quota.remaining > 0) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
          setAccessError('No tienes simulaciones disponibles. Compra una para acceder.');
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setAccessError('Error al verificar acceso');
        setHasAccess(false);
      } finally {
        setAccessChecked(true);
      }
    };

    checkAccess();
  }, [exam.isLoading, exam.hasActiveAttempt, exam.attemptId, exam.lastCompletedAttempt, accessChecked]);

  // Handle viewing previous exam results
  const handleViewPreviousResults = async (attemptId: string) => {
    setLoadingPreviousResults(true);
    try {
      const results = await mockExamsAPI.getAttemptResults(attemptId);
      setPreviousResults(results);
      setShowPreviousResults(true);
    } catch (error) {
      console.error('Error loading previous results:', error);
    } finally {
      setLoadingPreviousResults(false);
    }
  };

  // Auto-show summary when last question is answered
  useEffect(() => {
    if (exam.currentQuestionIndex === exam.totalQuestions - 1 && exam.totalQuestions > 0) {
      const lastQuestion = exam.questions[exam.currentQuestionIndex];
      if (lastQuestion) {
        const hasAnswer = exam.getAnswer(lastQuestion._id);
        if (hasAnswer && hasAnswer.length > 0) {
          setShowSummary(true);
        }
      }
    }
  }, [exam.currentQuestionIndex, exam.totalQuestions, exam.questions, exam.getAnswer]);

  // Handle option selection
  const handleSelectOption = (optionId: string) => {
    if (!exam.currentQuestion) return;

    const isMultipleChoice = exam.currentQuestion.type === 'MULTIPLE_CHOICE';

    if (isMultipleChoice) {
      if (exam.selectedAnswers.includes(optionId)) {
        exam.setSelectedAnswers(exam.selectedAnswers.filter((id) => id !== optionId));
      } else {
        exam.setSelectedAnswers([...exam.selectedAnswers, optionId]);
      }
    } else {
      exam.setSelectedAnswers([optionId]);
    }
  };

  // LOADING STATE
  if (exam.isLoading || !accessChecked) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#171B22]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary-green" />
          <p className="text-grey-600 dark:text-grey-400">Cargando examen...</p>
        </div>
      </div>
    );
  }

  // ACCESS DENIED STATE - No credits and no active attempt
  if (accessChecked && !hasAccess) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#171B22]">
        <div className="flex flex-col items-center gap-4 max-w-md text-center px-4">
          <div className="w-16 h-16 rounded-full bg-warning-100 dark:bg-warning-900/20 flex items-center justify-center">
            <span className="text-4xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-grey-900 dark:text-white">
            Acceso restringido
          </h2>
          <p className="text-grey-600 dark:text-grey-400">
            {accessError || 'No tienes simulaciones disponibles. Compra una para acceder al examen.'}
          </p>
          <Button
            variant="primary"
            color="green"
            onClick={() => router.push('/home?section=examen')}
          >
            Ir a comprar simulación
          </Button>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (exam.error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#171B22]">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-error-100 dark:bg-error-900/20 flex items-center justify-center">
            <span className="text-4xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-grey-900 dark:text-white">
            Error al cargar el examen
          </h2>
          <p className="text-grey-600 dark:text-grey-400">{exam.error}</p>
          <Button
            variant="primary"
            color="green"
            onClick={() => router.push('/home?section=examen')}
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  // PREVIOUS RESULTS VIEW - When viewing completed exam results
  if (showPreviousResults && previousResults) {
    const { results: examResults, comparison, studyRecommendations } = previousResults;

    return (
      <ExamResultsView
        totalAnswered={examResults.correctAnswers + examResults.incorrectAnswers}
        totalQuestions={examResults.totalQuestions}
        totalCorrect={examResults.correctAnswers}
        totalIncorrect={examResults.incorrectAnswers}
        totalSkipped={examResults.skippedAnswers}
        score={examResults.score}
        percentage={examResults.percentage}
        passed={examResults.passed}
        subjectScores={examResults.subjectScores}
        comparison={comparison}
        studyRecommendations={studyRecommendations}
        attemptsRemaining={0}
        onGoHome={() => {
          setShowPreviousResults(false);
          setPreviousResults(null);
        }}
      />
    );
  }

  // Need to start new exam OR resume existing (attemptId exists but no questions loaded)
  const needsToStartOrResume = !exam.isCompleted && (
    !exam.hasActiveAttempt || // No active attempt - need to start
    (exam.attemptId && exam.questions.length === 0) // Has attempt but no questions - need to resume
  );

  if (needsToStartOrResume) {
    // If there's a previous completed exam, show option to view results
    const hasLastCompletedAttempt = exam.lastCompletedAttempt !== null;
    const canStartNewExam = !exam.attemptId; // Can only start new if no active attempt

    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#171B22]">
        <div className="flex flex-col items-center gap-6 max-w-md text-center px-4">
          <Image
            src="/icons/stars-simulacro.svg"
            alt="Simulacro"
            width={100}
            height={100}
            className="dark:hidden"
          />
          <Image
            src="/icons/stars-simulacro-dark.svg"
            alt="Simulacro"
            width={100}
            height={100}
            className="hidden dark:block"
          />
          <h2 className="text-2xl font-bold text-grey-900 dark:text-white">
            {exam.attemptId ? 'Reanudar Simulacro' : 'Iniciar Simulacro'}
          </h2>
          <p className="text-grey-600 dark:text-grey-400">
            {exam.attemptId
              ? 'Tienes un intento en progreso. ¿Deseas continuar?'
              : `El simulacro consta de 168 preguntas y tienes ${EXAM_TIME_LIMIT_MINUTES} minutos (4.5 horas) para completarlo.`}
          </p>

          {/* Show previous results option if there's a completed exam */}
          {hasLastCompletedAttempt && canStartNewExam && (
            <div className="w-full p-4 rounded-lg bg-grey-100 dark:bg-dark-700 border border-grey-200 dark:border-dark-600">
              <p className="text-sm text-grey-600 dark:text-grey-400 mb-3">
                Tienes un examen completado anteriormente.
              </p>
              <Button
                variant="secondary"
                size="small"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleViewPreviousResults(exam.lastCompletedAttempt!.attemptId)}
                disabled={loadingPreviousResults}
              >
                {loadingPreviousResults ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                Ver resultados anteriores
              </Button>
            </div>
          )}

          <div className="flex gap-4">
            <Button variant="secondary" onClick={handleExit}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              color="green"
              onClick={async () => {
                if (exam.attemptId) {
                  await exam.resumeExam();
                } else {
                  await exam.startExam();
                }
              }}
            >
              {exam.attemptId ? 'Continuar' : 'Comenzar'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // RESULTS VIEW - After completing exam
  if (exam.isCompleted && exam.results) {
    const { results: examResults, comparison, studyRecommendations } = exam.results;

    return (
      <ExamResultsView
        totalAnswered={examResults.correctAnswers + examResults.incorrectAnswers}
        totalQuestions={examResults.totalQuestions}
        totalCorrect={examResults.correctAnswers}
        totalIncorrect={examResults.incorrectAnswers}
        totalSkipped={examResults.skippedAnswers}
        score={examResults.score}
        percentage={examResults.percentage}
        passed={examResults.passed}
        subjectScores={examResults.subjectScores}
        comparison={comparison}
        studyRecommendations={studyRecommendations}
        attemptsRemaining={exam.results.attemptsRemaining}
        onGoHome={() => router.push('/home?section=examen')}
      />
    );
  }

  // No questions loaded yet
  if (!exam.currentQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#171B22]">
        <Loader2 className="w-12 h-12 animate-spin text-primary-green" />
      </div>
    );
  }

  // Calculate statistics for summary (without revealing correctness)
  const questionStates = exam.questions.map((question) => {
    const answer = exam.getAnswer(question._id);
    // answer = undefined: not visited
    // answer = []: skipped (user clicked skip)
    // answer = ['a', ...]: answered
    const isAnswered = answer !== undefined && answer.length > 0;
    const isSkipped = answer !== undefined && answer.length === 0;

    return {
      questionId: question._id,
      selectedAnswer: answer?.[0] || null,
      isAnswered,
      isSkipped,
      isCorrect: false,
    };
  });

  // SUMMARY VIEW
  if (showSummary) {
    return (
      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#171B22]">
        <ExamSummaryView
          questionStates={questionStates}
          totalAnswered={exam.answeredCount}
          totalCorrect={0}
          totalQuestions={exam.totalQuestions}
          timeRemaining={exam.timeRemainingSeconds}
          formatTime={exam.formatTime}
          hideCorrectness={true}
          onResumeExam={() => setShowSummary(false)}
          onCompleteExam={() => exam.completeExam()}
          onGoToQuestion={(index) => {
            exam.goToQuestion(index);
            setShowSummary(false);
          }}
        />
      </div>
    );
  }

  // Adapt current question to the format expected by ExamQuestionView
  const adaptedQuestion = adaptQuestion(exam.currentQuestion);

  // QUESTION VIEW
  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto bg-grey-50 dark:bg-[#171B22] relative',
        className
      )}
      {...props}
    >
      {/* Top Header: Exit and View Summary Buttons */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-4 md:pt-6 md:pb-4">
        <div className="flex items-center justify-between">
          {/* Exit Button - Left */}
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-grey-700 hover:text-grey-900 dark:text-grey-300 dark:hover:text-grey-100 transition-colors cursor-pointer"
            aria-label="Salir del examen"
          >
            <Image
              src="/icons/close-square.svg"
              alt="Salir"
              width={24}
              height={24}
            />
            <span className="text-sm font-medium">Salir</span>
          </button>

          {/* View Summary Button - Right */}
          <Button
            onClick={() => setShowSummary(true)}
            variant="secondary"
            size="small"
            className="flex items-center gap-2"
            aria-label="Ver resumen"
          >
            <Activity className="w-4 h-4" style={{ color: '#95C16B' }} />
            <span>Ver resumen</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4">
        <ExamQuestionView
          question={adaptedQuestion as any}
          currentIndex={exam.currentQuestionIndex}
          totalQuestions={exam.totalQuestions}
          selectedAnswers={exam.selectedAnswers}
          isAnswered={exam.selectedAnswers.length > 0}
          timeRemaining={exam.timeRemainingSeconds}
          initialTime={EXAM_TIME_LIMIT_SECONDS}
          isTimerRunning={exam.isTimerRunning}
          subjectName={exam.currentQuestion.subjectName}
          onSelectOption={handleSelectOption}
          onSkip={exam.skipQuestion}
          onSubmit={exam.submitAnswer}
          onViewSummary={() => setShowSummary(true)}
        />
      </div>
    </div>
  );
}

// Constants
const EXAM_TIME_LIMIT_MINUTES = 270; // 4.5 hours
const EXAM_TIME_LIMIT_SECONDS = EXAM_TIME_LIMIT_MINUTES * 60;

export interface ExamSimulationSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Mock exam ID (optional - if not provided, will use dynamic mode) */
  mockExamId?: string;
  /** Purchase ID (required for pre-created exams, not needed for dynamic mode) */
  purchaseId?: string;
  /** Enable dynamic exam generation (default: true) */
  dynamicMode?: boolean;
}

/**
 * Adapts backend MockExamQuestion to the format expected by ExamQuestionView
 */
function adaptQuestion(question: MockExamQuestion) {
  return {
    id: question._id,
    statement: question.statement,
    type: question.type,
    options: question.options,
    helpDescription: undefined, // Backend doesn't provide this yet
    subjectName: question.subjectName,
  };
}

/**
 * Loading fallback for Suspense
 */
function LoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#171B22]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary-green" />
        <p className="text-grey-600 dark:text-grey-400">Cargando...</p>
      </div>
    </div>
  );
}

/**
 * Exam Simulation Section Component
 * Main section for the mock exam (simulacro) feature
 * Handles the complete exam flow: questions, summary, and results
 * Integrates with backend API for state persistence
 *
 * By default uses dynamic mode which generates exams on-the-fly
 * based on user's career using simulation credits from /simulations
 */
export const ExamSimulationSection = React.forwardRef<
  HTMLElement,
  ExamSimulationSectionProps
>(({ mockExamId, purchaseId, dynamicMode = true, className, ...props }, ref) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ExamSimulationInner
        mockExamIdProp={mockExamId}
        purchaseIdProp={purchaseId}
        dynamicModeProp={dynamicMode}
        className={className}
        {...props}
      />
    </Suspense>
  );
});

ExamSimulationSection.displayName = 'ExamSimulationSection';
