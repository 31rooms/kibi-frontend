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
  QuizTextInput,
  QuizNavigator,
  FeedbackToast,
  Modal,
  ModalInfo,
  Tag,
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

  /** Subject name to display in tag */
  subjectName?: string;

  /** Skip internal modals and let parent handle completion UI */
  skipInternalModals?: boolean;
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
  subjectName,
  skipInternalModals = false,
}: QuizContainerProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAutoAdvancingRef = React.useRef(false); // Track if auto-advancing to prevent double navigation

  // Flow control states
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showCourseSelection, setShowCourseSelection] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [courseSelectionData, setCourseSelectionData] = useState<CourseSelectionData | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

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
      return;
    }

    isAutoAdvancingRef.current = true;

    // Save current answer (always as array) - even if empty
    const isTextResponse = quiz.currentQuestion.type === QuestionType.TEXT_RESPONSE;
    const answerToSave = isTextResponse ? [textAnswer] : selectedAnswers;
    quiz.setCurrentAnswer(answerToSave);

    // Move to next or complete
    if (navigation.isLastQuestion) {
      setIsSubmitting(true);

      // Small delay to show loading state
      setTimeout(() => {
        quiz.completeQuiz();
        setIsSubmitting(false);
        isAutoAdvancingRef.current = false;
        // Show completion modal or let parent handle it
        if (skipInternalModals && onComplete) {
          const results = calculateQuizResults(config.questions, quiz.answers);
          onComplete(results);
        } else {
          setShowCompletionModal(true);
        }
      }, 500);
    } else {
      console.log('➡️ Moving to next question:', quiz.currentQuestionIndex + 2);
      quiz.goToNext();
      // Reset flag will happen in useEffect when question changes
    }
  }, [selectedAnswers, textAnswer, quiz, navigation.isLastQuestion]); // Dependencies

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

    // Close help modal when question changes
    setShowHelpModal(false);

    const newTime =
      quiz.currentQuestion.timeLimit ||
      config.defaultTimePerQuestion ||
      60;

    console.log('⏱️ Restarting timer with', newTime, 'seconds');
    timer.restart(newTime);

    // Load previously selected answer if exists
    const existingAnswer = quiz.getAnswer(quiz.currentQuestion.id);
    const isTextResponse = quiz.currentQuestion.type === QuestionType.TEXT_RESPONSE;

    if (existingAnswer) {
      console.log('📝 Loading existing answer:', existingAnswer.selectedAnswer);
      if (isTextResponse) {
        setTextAnswer(existingAnswer.selectedAnswer[0] || '');
        setSelectedAnswers([]);
      } else {
        setSelectedAnswers(existingAnswer.selectedAnswer);
        setTextAnswer('');
      }
    } else {
      console.log('🆕 New question - no existing answer');
      setSelectedAnswers([]);
      setTextAnswer('');
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
    // For TEXT_RESPONSE questions, always return true (for now)
    if (quiz.currentQuestion.type === QuestionType.TEXT_RESPONSE) {
      return true;
    }

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
    const isTextResponse = quiz.currentQuestion.type === QuestionType.TEXT_RESPONSE;
    const answerToSave = isTextResponse ? [textAnswer] : selectedAnswers;

    if (isTextResponse ? textAnswer.length > 0 : selectedAnswers.length > 0) {
      quiz.setCurrentAnswer(answerToSave);
    }

    // Check if answer is correct and show feedback
    const isCorrect = isAnswerCorrect(answerToSave);

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
        // Show completion modal or let parent handle it
        if (skipInternalModals && onComplete) {
          const results = calculateQuizResults(config.questions, quiz.answers);
          onComplete(results);
        } else {
          setShowCompletionModal(true);
        }
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

  const isTextResponse = quiz.currentQuestion.type === QuestionType.TEXT_RESPONSE;
  const isAnswered = isTextResponse ? textAnswer.trim().length > 0 : selectedAnswers.length > 0;

  // If quiz is completed and should show course selection form
  if (quiz.isCompleted && showCourseSelection) {
    return (
      <div className="fixed inset-0 bg-grey-50 dark:bg-[#171B22] flex items-center justify-center z-50">
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
      <div className="fixed inset-0 bg-grey-50 dark:bg-[#171B22] flex items-center justify-center z-50">
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
    <div className={cn('w-full max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-10rem)]', className)}>
      {/* Header Section - Timer and Progress in same line */}
      <div className="flex items-center gap-4 mb-4">
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

      {/* Subject Tag and Focus Button */}
      {(subjectName || quiz.currentQuestion.helpDescription) && (
        <div className="flex items-center justify-between mb-4">
          {/* Subject Tag - Left */}
          {subjectName && (
            <div className="flex items-center gap-2">
              <Tag variant="subtle" color="success">
                {subjectName}
              </Tag>
            </div>
          )}

          {/* Focus Button - Right */}
          {quiz.currentQuestion.helpDescription && (
            <button
              type="button"
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full bg-white border border-grey-300 hover:bg-grey-50 transition-colors',
                !subjectName && 'ml-auto'
              )}
              aria-label="Ayuda"
              onClick={() => setShowHelpModal(true)}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" fill="white"/>
                <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#DEE2E6"/>
                <path d="M20 16.918L19.1975 18.313C19.0175 18.6205 19.1675 18.8755 19.52 18.8755H20.4725C20.8325 18.8755 20.975 19.1305 20.795 19.438L20 20.833" stroke="#47830E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.225 24.5301V23.6601C15.5 22.6176 14.0825 20.5851 14.0825 18.4251C14.0825 14.7126 17.495 11.8026 21.35 12.6426C23.045 13.0176 24.53 14.1426 25.3025 15.6951C26.87 18.8451 25.22 22.1901 22.7975 23.6526V24.5226C22.7975 24.7401 22.88 25.2426 22.0775 25.2426H17.945C17.12 25.2501 17.225 24.9276 17.225 24.5301Z" stroke="#47830E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.375 27.5004C19.0925 27.0129 20.9075 27.0129 22.625 27.5004" stroke="#47830E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Question Card */}
      <QuizQuestion
        question={quiz.currentQuestion.statement}
        questionNumber={navigation.currentQuestionNumber}
        className="mb-6"
      />

      {/* Options List or Text Input - Takes available space */}
      <div className="space-y-3 flex-1">
        {isTextResponse ? (
          <QuizTextInput
            value={textAnswer}
            onChange={setTextAnswer}
            placeholder="Escriba su respuesta"
            maxLength={200}
          />
        ) : (
          quiz.currentQuestion.options.map((option) => {
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
          })
        )}
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

      {/* Modal de Ayuda - Se muestra al hacer click en el botón de ayuda */}
      {quiz.currentQuestion.helpDescription && (
        <ModalInfo
          open={showHelpModal}
          onOpenChange={setShowHelpModal}
          title="Ayuda"
          description={quiz.currentQuestion.helpDescription}
          confirmText="Entendido"
          onConfirm={() => setShowHelpModal(false)}
        />
      )}
    </div>
  );
}
