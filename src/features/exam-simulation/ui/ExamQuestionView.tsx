'use client';

import React, { useState } from 'react';
import type { Question, QuizAnswer } from '../types';
import {
  QuizTimer,
  QuizProgress,
  QuizQuestion,
  QuizOption,
  QuizNavigator,
  CareerTag,
  ModalInfo,
} from '@/shared/ui';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';
import { Eye } from 'lucide-react';
import { QuestionType } from '@/features/diagnostic-test/types/quiz.types';
import Image from 'next/image';

export interface ExamQuestionViewProps {
  /** Current question to display */
  question: Question;

  /** Current question index (0-based) */
  currentIndex: number;

  /** Total number of questions */
  totalQuestions: number;

  /** Currently selected answers (array for multi-select support) */
  selectedAnswers: string[];

  /** Whether the current question has been answered */
  isAnswered: boolean;

  /** Timer remaining time (seconds) */
  timeRemaining: number;

  /** Initial timer time (seconds) */
  initialTime: number;

  /** Whether timer is running */
  isTimerRunning: boolean;

  /** Subject name to display */
  subjectName?: string;

  /** Callback when an option is selected */
  onSelectOption: (optionId: string) => void;

  /** Callback when skip button is clicked */
  onSkip: () => void;

  /** Callback when submit/next button is clicked */
  onSubmit: () => void;

  /** Callback when view summary button is clicked */
  onViewSummary: () => void;

  /** Whether submit is in progress */
  isSubmitting?: boolean;
}

/**
 * Exam Question View Component
 *
 * Displays a single exam question with timer, progress, and navigation
 * Matches the design and structure of diagnostic-test QuizContainer
 */
export function ExamQuestionView({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswers,
  isAnswered,
  timeRemaining,
  initialTime,
  isTimerRunning,
  subjectName,
  onSelectOption,
  onSkip,
  onSubmit,
  onViewSummary,
  isSubmitting = false,
}: ExamQuestionViewProps) {
  const currentQuestionNumber = currentIndex + 1;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isMultipleChoice = question.type === QuestionType.MULTIPLE_CHOICE;
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-240px)] pb-8">
      {/* Timer and Progress Bar */}
      <div className="flex items-center gap-4 mb-4">
        {/* Timer */}
        <QuizTimer
          timeRemaining={timeRemaining}
          initialTime={initialTime}
          isRunning={isTimerRunning}
          showProgress={false}
        />

        {/* Progress */}
        <QuizProgress
          current={currentQuestionNumber}
          total={totalQuestions}
          className="flex-1"
        />
      </div>

      {/* Subject Tag and Help Button */}
      <div className="flex items-center justify-between mb-4">
        {/* Subject Tag - Left */}
        {subjectName && (
          <CareerTag career={subjectName} variant="career" />
        )}

        {/* Help Button - Right */}
        {question.helpDescription && (
          <button
            type="button"
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full transition-colors',
              !subjectName && 'ml-auto'
            )}
            aria-label="Ayuda"
            onClick={() => setShowHelpModal(true)}
          >
            <Image
              src="/icons/foco-button-dark.svg"
              alt="Ayuda"
              width={40}
              height={40}
              className="dark:block hidden"
            />
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:hidden block">
              <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" fill="white"/>
              <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#DEE2E6"/>
              <path d="M20 16.918L19.1975 18.313C19.0175 18.6205 19.1675 18.8755 19.52 18.8755H20.4725C20.8325 18.8755 20.975 19.1305 20.795 19.438L20 20.833" stroke="#47830E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.225 24.5301V23.6601C15.5 22.6176 14.0825 20.5851 14.0825 18.4251C14.0825 14.7126 17.495 11.8026 21.35 12.6426C23.045 13.0176 24.53 14.1426 25.3025 15.6951C26.87 18.8451 25.22 22.1901 22.7975 23.6526V24.5226C22.7975 24.7401 22.88 25.2426 22.0775 25.2426H17.945C17.12 25.2501 17.225 24.9276 17.225 24.5301Z" stroke="#47830E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.375 27.5004C19.0925 27.0129 20.9075 27.0129 22.625 27.5004" stroke="#47830E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Question Card */}
      <QuizQuestion
        question={question.statement}
        questionNumber={currentQuestionNumber}
        className="mb-6"
      />

      {/* Options List - Takes available space */}
      <div className="space-y-3 flex-1">
        {question.options.map((option) => {
          const isSelected = selectedAnswers.includes(option.id);

          return (
            <QuizOption
              key={option.id}
              id={option.id}
              text={option.text}
              selected={isSelected}
              multipleChoice={isMultipleChoice}
              onSelect={() => onSelectOption(option.id)}
            />
          );
        })}
      </div>

      {/* Navigation Section - Always at bottom */}
      <div className="mt-auto pt-6">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-4">
          {/* Submit/Next Button - Left */}
          <Button
            onClick={onSubmit}
            disabled={!isAnswered || isSubmitting}
            variant="primary"
            color="green"
            size="medium"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <span>Enviar respuesta</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>

          {/* Skip Button - Right */}
          <button
            onClick={onSkip}
            className={cn(
              'flex-1 px-6 py-3 rounded-lg font-medium transition-all',
              'bg-transparent',
              'hover:bg-grey-50 dark:hover:bg-dark-800'
            )}
            style={{ color: '#95C16B' }}
          >
            Saltar
          </button>
        </div>
      </div>

      {/* Help Modal */}
      {question.helpDescription && (
        <ModalInfo
          open={showHelpModal}
          onOpenChange={setShowHelpModal}
          title="Ayuda"
          description={question.helpDescription}
          confirmText="Entendido"
          onConfirm={() => setShowHelpModal(false)}
        />
      )}
    </div>
  );
}
