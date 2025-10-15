'use client';

import React, { useState } from 'react';
import type { QuizConfig } from '../types/quiz.types';
import { QuestionType } from '../types/quiz.types';
import { useQuizState } from '../hooks/useQuizState';
import { useQuizTimer } from '../hooks/useQuizTimer';
import { useQuizNavigation } from '../hooks/useQuizNavigation';
import { useFeedback } from '../hooks/useFeedback';
import { calculateQuizResults } from '../utils/quizScoring';
import {
  QuizTimer,
  QuizProgress,
  QuizQuestion,
  QuizOption,
  QuizNavigator,
  FeedbackToast,
  Modal,
} from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { CourseSelectionForm } from './CourseSelectionForm';
import { ResultsSummary } from './ResultsSummary';
import type { CourseSelectionData } from '../types/course-selection.types';

export interface QuizContainerProps {
  /** Quiz configuration */
  config: QuizConfig;

  /** Callback when quiz is completed with results */
  onComplete?: (results: ReturnType<typeof calculateQuizResults>) => void;

  /** Custom className for container */
  className?: string;

  /** Show timer */
  showTimer?: boolean;

  /** Show progress */
  showProgress?: boolean;
}

/**
 * Main quiz container component that orchestrates the quiz flow
 *
 * This component handles:
 * - Question display and navigation
 * - Timer management
 * - Answer selection
 * - Result calculation and submission
 */
export function QuizContainer({
  config,
  onComplete,
  className,
  showTimer = config.showTimer ?? true,
  showProgress = config.showProgress ?? true,
}: QuizContainerProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAutoAdvancingRef = React.useRef(false); // Track if auto-advancing to prevent double navigation

  // Flow control states
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showCourseSelection, setShowCourseSelection] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [courseSelectionData, setCourseSelectionData] = useState<CourseSelectionData | null>(null);

  // Feedback management
  const feedbackHook = useFeedback();

  // Quiz state management
  const quiz = useQuizState({
    config,
    onComplete: (answers) => {
      const results = calculateQuizResults(config.questions, answers);
      if (onComplete) {
        onComplete(results);
      }
    },
  });

  // Navigation state
  const navigation = useQuizNavigation({
    currentIndex: quiz.currentQuestionIndex,
    totalQuestions: quiz.totalQuestions,
    allowReview: config.allowReview,
  });

  // Get time for current question
  const currentQuestionTime =
    quiz.currentQuestion.timeLimit ||
    config.defaultTimePerQuestion ||
    60; // Default 60 seconds

  // Handle time up callback
  const handleTimeUp = React.useCallback(() => {
    // Prevent double navigation
    if (isAutoAdvancingRef.current) {
      console.log('⚠️ Already auto-advancing, skipping');
      return;
    }

    console.log('⏰ Time up! Current question:', quiz.currentQuestionIndex + 1);
    isAutoAdvancingRef.current = true;

    // Save current answer (always as array) - even if empty
    quiz.setCurrentAnswer(selectedAnswers);

    // Move to next or complete
    if (navigation.isLastQuestion) {
      console.log('✅ Last question - completing quiz');
      setIsSubmitting(true);

      // Small delay to show loading state
      setTimeout(() => {
        quiz.completeQuiz();
        setIsSubmitting(false);
        isAutoAdvancingRef.current = false;
        // Show completion modal instead of going directly to results
        setShowCompletionModal(true);
      }, 500);
    } else {
      console.log('➡️ Moving to next question:', quiz.currentQuestionIndex + 2);
      quiz.goToNext();
      // Reset flag will happen in useEffect when question changes
    }
  }, [selectedAnswers, quiz, navigation.isLastQuestion]); // Dependencies

  // Timer management
  const timer = useQuizTimer({
    initialTime: currentQuestionTime,
    autoStart: true,
    onTimeUp: handleTimeUp,
  });

  // Reset timer when question changes
  React.useEffect(() => {
    console.log('🔄 Question changed to:', quiz.currentQuestionIndex + 1);

    // Reset auto-advance flag when question changes
    isAutoAdvancingRef.current = false;

    const newTime =
      quiz.currentQuestion.timeLimit ||
      config.defaultTimePerQuestion ||
      60;

    console.log('⏱️ Restarting timer with', newTime, 'seconds');
    timer.restart(newTime);

    // Load previously selected answer if exists
    const existingAnswer = quiz.getAnswer(quiz.currentQuestion.id);
    if (existingAnswer) {
      console.log('📝 Loading existing answer:', existingAnswer.selectedAnswer);
      setSelectedAnswers(existingAnswer.selectedAnswer);
    } else {
      console.log('🆕 New question - no existing answer');
      setSelectedAnswers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.currentQuestionIndex, quiz.currentQuestion.id]);

  // Handle option selection
  const handleSelectOption = (optionId: string) => {
    const isMultipleChoice = quiz.currentQuestion.type === QuestionType.MULTIPLE_CHOICE;

    if (isMultipleChoice) {
      // Multiple choice - toggle selection
      setSelectedAnswers((prev) => {
        if (prev.includes(optionId)) {
          return prev.filter((id) => id !== optionId);
        }
        return [...prev, optionId];
      });
    } else {
      // Single choice - replace selection
      setSelectedAnswers([optionId]);
    }
  };

  // Helper function to check if answer is correct
  const isAnswerCorrect = (selected: string[]): boolean => {
    const correctAnswers = quiz.currentQuestion.correctAnswers;

    // Both arrays must have same length
    if (selected.length !== correctAnswers.length) {
      return false;
    }

    // Sort both arrays and compare
    const sortedSelected = [...selected].sort();
    const sortedCorrect = [...correctAnswers].sort();

    return sortedSelected.every((val, index) => val === sortedCorrect[index]);
  };

  // Handle next/submit with feedback
  const handleNext = async () => {
    // Save current answer (always as array)
    if (selectedAnswers.length > 0) {
      quiz.setCurrentAnswer(selectedAnswers);
    }

    // Check if answer is correct and show feedback
    const isCorrect = isAnswerCorrect(selectedAnswers);

    if (isCorrect) {
      await feedbackHook.showSuccess();
    } else {
      // Get correct answer letters for display
      const correctAnswers = quiz.currentQuestion.correctAnswers;
      await feedbackHook.showFailed(correctAnswers);
    }

    // After feedback completes, move to next or complete
    if (navigation.isLastQuestion) {
      setIsSubmitting(true);
      timer.pause();

      // Small delay to show loading state
      setTimeout(() => {
        quiz.completeQuiz();
        setIsSubmitting(false);
        // Show completion modal instead of going directly to results
        setShowCompletionModal(true);
      }, 500);
    } else {
      quiz.goToNext();
    }
  };

  // Handle previous
  const handlePrevious = () => {
    quiz.goToPrevious();
  };

  // Handle course selection submit
  const handleCourseSelectionSubmit = (data: CourseSelectionData) => {
    console.log('Course selected:', data);
    setCourseSelectionData(data);
    setShowCourseSelection(false);
    setShowFinalResults(true);
  };

  // Handle course selection skip (optional)
  const handleCourseSelectionSkip = () => {
    console.log('Course selection skipped');
    setShowCourseSelection(false);
    setShowFinalResults(true);
  };

  const isAnswered = selectedAnswers.length > 0;

  // If quiz is completed and should show course selection form
  if (quiz.isCompleted && showCourseSelection) {
    return (
      <div className="fixed inset-0 bg-grey-50 flex items-center justify-center z-50">
        <CourseSelectionForm
          onSubmit={handleCourseSelectionSubmit}
        />
      </div>
    );
  }

  // If quiz is completed and should show final results
  if (quiz.isCompleted && showFinalResults) {
    const results = calculateQuizResults(config.questions, quiz.answers);

    // Calculate level based on score
    const getLevel = (score: number): string => {
      if (score >= 80) return 'Avanzado';
      if (score >= 50) return 'Intermedio';
      return 'Básico';
    };

    // TODO: Replace with real data from quiz results analysis
    // For now, using sample data matching the design
    const currentLevel = getLevel(results.score);
    const progressPercentage = 65; // This should be calculated based on course goals
    const strengths = ['Comprensión lectora', 'Historia'];
    const areasToReinforce = ['Álgebra', 'Química'];

    const handleGoToPreparation = () => {
      // TODO: Navigate to preparation route
      console.log('Navigating to preparation route...');
      console.log('Course selected:', courseSelectionData);
      console.log('Quiz results:', results);
    };

    return (
      <div className="fixed inset-0 bg-grey-50 flex items-center justify-center z-50">
        <ResultsSummary
          currentLevel={currentLevel}
          progressPercentage={progressPercentage}
          strengths={strengths}
          areasToReinforce={areasToReinforce}
          onGoToPreparation={handleGoToPreparation}
        />
      </div>
    );
  }

  // Continue with normal quiz flow
  return (
    <div className={cn('w-full max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]', className)}>
      {/* Header Section - Timer and Progress in same line */}
      <div className="flex items-center gap-4 mb-6">
        {/* Timer - Left */}
        {showTimer && (
          <QuizTimer
            timeRemaining={timer.timeRemaining}
            initialTime={timer.initialTime}
            isRunning={timer.isRunning}
            showProgress={false}
          />
        )}

        {/* Progress - Right (takes remaining space) */}
        {showProgress && (
          <QuizProgress
            current={navigation.currentQuestionNumber}
            total={navigation.totalQuestions}
            className="flex-1"
          />
        )}
      </div>

      {/* Question Card */}
      <QuizQuestion
        question={quiz.currentQuestion.statement}
        questionNumber={navigation.currentQuestionNumber}
        className="mb-6"
      />

      {/* Options List - Takes available space */}
      <div className="space-y-3 mb-8 flex-1">
        {quiz.currentQuestion.options.map((option) => {
          const isMultipleChoice = quiz.currentQuestion.type === QuestionType.MULTIPLE_CHOICE;

          return (
            <QuizOption
              key={option.id}
              id={`option-${option.id}`}
              text={option.text}
              selected={selectedAnswers.includes(option.id)}
              multipleChoice={isMultipleChoice}
              onSelect={() => handleSelectOption(option.id)}
            />
          );
        })}
      </div>

      {/* Navigation Section - Always at bottom */}
      <div className="mt-auto pb-4">
        {/* Feedback Toast - Shows above button */}
        <div className="flex justify-center mb-4">
          {feedbackHook.feedback.isShowing && (
            <FeedbackToast
              variant={feedbackHook.feedback.variant}
              message={feedbackHook.feedback.message}
              duration={feedbackHook.feedback.duration}
              onHide={feedbackHook.hideFeedback}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <QuizNavigator
          isAnswered={isAnswered}
          isLastQuestion={navigation.isLastQuestion}
          isFirstQuestion={navigation.isFirstQuestion}
          canGoPrevious={navigation.canGoPrevious}
          onNext={handleNext}
          onPrevious={handlePrevious}
          loading={isSubmitting || feedbackHook.isShowingFeedback}
        />
      </div>

      {/* Modal de Success - Se muestra al completar el quiz */}
      <Modal
        open={showCompletionModal}
        onOpenChange={setShowCompletionModal}
        state="success"
        title="Todas tus respuestas han sido registradas"
        description="Gracias por tu tiempo. Con base en tus respuestas hemos creado una ruta de materias especialmente diseñada para ti."
        confirmText="Conoce mis Resultados"
        showCloseButton={false}
        singleButton={true}
        onConfirm={() => {
          setShowCompletionModal(false);
          setShowCourseSelection(true);
        }}
      />
    </div>
  );
}
