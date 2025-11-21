'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  DiagnosticTestLayout,
  ResultsSummary,
  useDiagnosticTest,
} from '@/features/diagnostic-test';
import {
  QuizTimer,
  QuizProgress,
  QuizQuestion,
  QuizOption,
  QuizNavigator,
  KibiMessage,
  Button,
} from '@/shared/ui';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/features/authentication';
import { accountAPI } from '@/features/account';
import { QuestionType, useQuizTimer } from '@/features/diagnostic-test';

export default function DiagnosticTestPage() {
  const router = useRouter();
  const { updateUser } = useAuth();

  // Diagnostic test hook
  const {
    isLoading,
    error,
    testId,
    currentPhase,
    questions,
    results,
    startTest,
    submitAnswer,
    loadNextPhase,
    completeTest,
  } = useDiagnosticTest();

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhaseTransition, setShowPhaseTransition] = useState(false);
  const [isLoadingNextPhase, setIsLoadingNextPhase] = useState(false);
  const [nextPhaseReady, setNextPhaseReady] = useState(false);
  const [completedPhase, setCompletedPhase] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const questionStartTimeRef = useRef<number>(Date.now());
  const isProcessingRef = useRef(false);

  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestionInPhase = currentQuestionIndex === questions.length - 1;

  // Ref for handleNext to avoid circular dependency
  const handleNextRef = useRef<() => void>(() => {});

  // Timer
  const timeLimit = currentQuestion?.timeLimit || 60;
  const timer = useQuizTimer({
    initialTime: timeLimit,
    autoStart: !!currentQuestion,
    onTimeUp: () => {
      // Only handle if not already processing
      if (!isProcessingRef.current && !isSubmitting) {
        handleNextRef.current();
      }
    },
  });

  // Start test on mount - only once
  const hasStartedRef = useRef(false);
  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      startTest().catch(console.error);
    }
  }, [startTest]);

  // Reset timer when question changes
  useEffect(() => {
    if (currentQuestion) {
      timer.restart(currentQuestion.timeLimit || 60);
      questionStartTimeRef.current = Date.now();
      setSelectedAnswers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, currentQuestion?.id]);

  const handleExit = () => {
    router.push('/home');
  };

  const handleSelectOption = (optionId: string) => {
    const isMultipleChoice = currentQuestion?.type === QuestionType.MULTIPLE_CHOICE;

    if (isMultipleChoice) {
      setSelectedAnswers((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedAnswers([optionId]);
    }
  };

  const handleNext = async () => {
    if (!currentQuestion || !testId) return;

    // Prevent multiple submissions using ref (more reliable than state)
    if (isProcessingRef.current || isSubmitting) return;
    isProcessingRef.current = true;

    setIsSubmitting(true);
    timer.pause();

    // Calculate time spent
    const timeSpentSeconds = Math.round((Date.now() - questionStartTimeRef.current) / 1000);

    // If no answer selected (time ran out), use "x" as invalid answer (will be marked incorrect)
    const answersToSubmit = selectedAnswers.length > 0 ? selectedAnswers : ['x'];

    try {
      // Submit answer to backend
      await submitAnswer(
        currentQuestion.id,
        answersToSubmit,
        timeSpentSeconds
      );

      // Move to next question or handle phase transition
      if (isLastQuestionInPhase) {
        // Check if there are more phases
        if (currentPhase < 3) {
          // Show transition screen and start loading next phase
          setCompletedPhase(currentPhase);
          setShowPhaseTransition(true);
          setIsLoadingNextPhase(true);
          setNextPhaseReady(false);

          // Start loading next phase immediately
          try {
            const hasQuestions = await loadNextPhase();

            // Handle Phase II with 0 questions - automatically advance to Phase III
            if (!hasQuestions && currentPhase === 1) {
              const phase3HasQuestions = await loadNextPhase();
              if (!phase3HasQuestions) {
                await completeTest();
                setShowResults(true);
                return;
              }
            }

            setNextPhaseReady(true);
          } catch (err) {
            console.error('Error loading next phase:', err);
          } finally {
            setIsLoadingNextPhase(false);
          }
        } else {
          // Last phase completed - complete the test
          await completeTest();
          setShowResults(true);
        }
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    } finally {
      setIsSubmitting(false);
      isProcessingRef.current = false;
    }
  };

  // Keep ref updated with latest handleNext
  handleNextRef.current = handleNext;

  const handleContinueToNextPhase = () => {
    setShowPhaseTransition(false);
    setCurrentQuestionIndex(0);
    setNextPhaseReady(false);
  };

  const handleGoToPreparation = async () => {
    try {
      // Update user's diagnosticCompleted to true
      const updatedUser = await accountAPI.updateProfile({
        diagnosticCompleted: true,
      });
      updateUser(updatedUser);
      router.push('/home');
    } catch (error) {
      console.error('Failed to update diagnosticCompleted:', error);
      router.push('/home');
    }
  };

  // Loading state
  if (isLoading && !currentQuestion) {
    return (
      <DiagnosticTestLayout showExitButton={true} onExit={handleExit}>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin" />
          <p className="text-dark-900 dark:text-white">Cargando test diagnóstico...</p>
        </div>
      </DiagnosticTestLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DiagnosticTestLayout showExitButton={true} onExit={handleExit}>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <p className="text-error-500">{error}</p>
          <button
            onClick={() => startTest()}
            className="px-4 py-2 bg-primary-green text-white rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </DiagnosticTestLayout>
    );
  }

  // Phase transition view
  if (showPhaseTransition) {
    const getPhaseMessage = () => {
      if (completedPhase === 1) {
        return (
          <>
            <span className="font-bold">Estamos revisando tus respuestas...</span>
            {'\n'}¡Estás haciendo un gran trabajo! Esto nos ayuda a crear un plan de estudio personalizado para ti. Solo un momento más y seguimos con el siguiente reto.
          </>
        );
      } else {
        return (
          <>
            <span className="font-bold">Identificando tu tipo de aprendizaje</span>
            {'\n'}Detectamos la forma en que aprendes más rápido para adaptar tu experiencia.
          </>
        );
      }
    };

    return (
      <DiagnosticTestLayout showExitButton={false}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <KibiMessage
            message={getPhaseMessage()}
            iconSize={80}
            textSize={18}
          />

          {/* Loading indicator */}
          <div className="flex flex-col items-center gap-2">
            {isLoadingNextPhase && (
              <>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                </div>
                <p className="text-dark-900 dark:text-white text-sm">Cargando</p>
              </>
            )}
          </div>

          {/* Continue button */}
          <Button
            variant="primary"
            size="medium"
            onClick={handleContinueToNextPhase}
            disabled={!nextPhaseReady}
          >
            Continuar
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </DiagnosticTestLayout>
    );
  }

  // Results view
  if (showResults && results) {
    const getLevelDisplay = (level: string): string => {
      switch (level) {
        case 'BASIC':
          return 'Básico';
        case 'INTERMEDIATE':
          return 'Intermedio';
        case 'ADVANCED':
          return 'Avanzado';
        default:
          return level;
      }
    };

    return (
      <DiagnosticTestLayout showExitButton={false}>
        <ResultsSummary
          currentLevel={getLevelDisplay(results.determinedLevel)}
          progressPercentage={Math.round(results.overallScore)}
          strengths={results.strengths.length > 0 ? results.strengths : ['Sin fortalezas destacadas']}
          areasToReinforce={results.weaknesses.length > 0 ? results.weaknesses : ['Sin áreas críticas']}
          onGoToPreparation={handleGoToPreparation}
        />
      </DiagnosticTestLayout>
    );
  }

  // Quiz view
  if (!currentQuestion) {
    return null;
  }

  const isAnswered = selectedAnswers.length > 0;

  return (
    <DiagnosticTestLayout showExitButton={true} onExit={handleExit}>
      <div className="w-full max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-10rem)]">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-4">
          <QuizTimer
            timeRemaining={timer.timeRemaining}
            initialTime={timer.initialTime}
            isRunning={timer.isRunning}
            showProgress={false}
          />
          <QuizProgress
            current={currentQuestionIndex + 1}
            total={questions.length}
            className="flex-1"
          />
        </div>


        {/* Question */}
        <QuizQuestion
          question={currentQuestion.statement}
          questionNumber={currentQuestion.order}
          className="mb-6"
        />

        {/* Options */}
        <div className="space-y-3 flex-1">
          {currentQuestion.options.map((option) => (
            <QuizOption
              key={option.id}
              id={`option-${option.id}`}
              text={option.text}
              selected={selectedAnswers.includes(option.id)}
              multipleChoice={currentQuestion.type === QuestionType.MULTIPLE_CHOICE}
              onSelect={() => handleSelectOption(option.id)}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-auto pb-4">
          <QuizNavigator
            isAnswered={isAnswered}
            isLastQuestion={isLastQuestionInPhase && currentPhase === 3}
            isFirstQuestion={currentQuestionIndex === 0}
            canGoPrevious={false}
            onNext={handleNext}
            onPrevious={() => {}}
            loading={isSubmitting}
          />
        </div>
      </div>
    </DiagnosticTestLayout>
  );
}
