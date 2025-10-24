'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { QuizOption } from '@/shared/ui';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Question } from '../types/lesson.types';

interface QuestionState {
  selectedAnswers: string[];
  isValidated: boolean; // Permanently tracks if question has been validated at least once
  isCorrect: boolean;
  showTemporaryFeedback: boolean; // Controls temporary 3-second feedback display
}

export interface LessonQuestionsProps {
  questions: Question[];
  className?: string;
}

/**
 * LessonQuestions Component
 * Renders interactive questions for lessons with validation and feedback
 *
 * Features:
 * - Single/Multiple choice questions
 * - Answer validation with visual feedback
 * - Step-by-step explanations for incorrect answers
 * - Toast feedback with Kibi icon
 */
export const LessonQuestions = React.forwardRef<HTMLDivElement, LessonQuestionsProps>(
  ({ questions, className }, ref) => {
    const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({});

    // Initialize question state if not exists
    const getQuestionState = (questionId: string): QuestionState => {
      return questionStates[questionId] || {
        selectedAnswers: [],
        isValidated: false,
        isCorrect: false,
        showTemporaryFeedback: false,
      };
    };

    // Handle option selection
    const handleSelectOption = (questionId: string, optionId: string, isMultipleChoice: boolean) => {
      setQuestionStates((prev) => {
        const currentState = prev[questionId] || {
          selectedAnswers: [],
          isValidated: false,
          isCorrect: false,
          showTemporaryFeedback: false,
        };

        let newSelectedAnswers: string[];

        if (isMultipleChoice) {
          // Toggle selection for multiple choice
          if (currentState.selectedAnswers.includes(optionId)) {
            newSelectedAnswers = currentState.selectedAnswers.filter((id) => id !== optionId);
          } else {
            newSelectedAnswers = [...currentState.selectedAnswers, optionId];
          }
        } else {
          // Replace selection for single choice
          newSelectedAnswers = [optionId];
        }

        return {
          ...prev,
          [questionId]: {
            ...currentState,
            selectedAnswers: newSelectedAnswers,
            // Keep isValidated to maintain explanation visibility
            // Only hide temporary feedback when changing answer
            showTemporaryFeedback: false,
          },
        };
      });
    };

    // Clean step-by-step explanation markdown to remove "Respuesta correcta" line
    const cleanStepByStepExplanation = (markdown: string): string => {
      // Remove lines that contain "Respuesta correcta" with or without checkmark
      return markdown
        .split('\n')
        .filter(line => !line.includes('Respuesta correcta') && !line.includes('✅'))
        .join('\n');
    };

    // Validate answer
    const handleValidate = (question: Question) => {
      const state = getQuestionState(question._id);
      const correctAnswers = question.correctAnswers;

      // Check if answer is correct
      const sortedSelected = [...state.selectedAnswers].sort();
      const sortedCorrect = [...correctAnswers].sort();
      const isCorrect =
        sortedSelected.length === sortedCorrect.length &&
        sortedSelected.every((val, index) => val === sortedCorrect[index]);

      // Update state
      setQuestionStates((prev) => ({
        ...prev,
        [question._id]: {
          ...state,
          isValidated: true,
          isCorrect,
          showTemporaryFeedback: true,
        },
      }));

      // If incorrect, auto-clear feedback after 3 seconds and allow retry
      if (!isCorrect) {
        setTimeout(() => {
          setQuestionStates((prev) => {
            const currentState = prev[question._id];
            // Only reset if still showing feedback (user didn't interact)
            if (currentState?.showTemporaryFeedback) {
              return {
                ...prev,
                [question._id]: {
                  ...currentState,
                  selectedAnswers: [], // Clear selection to allow retry
                  showTemporaryFeedback: false, // Hide feedback
                  // Keep isValidated: true to maintain explanation visible
                },
              };
            }
            return prev;
          });
        }, 3000);
      }
    };


    return (
      <div ref={ref} className={cn('space-y-8', className)}>
        {questions.map((question, questionIndex) => {
          const state = getQuestionState(question._id);
          const isMultipleChoice = question.type === 'MULTIPLE_CHOICE';
          const hasSelectedAnswer = state.selectedAnswers.length > 0;

          return (
            <div key={question._id} className="space-y-4">
              {/* Question Statement */}
              <h4 className="text-[16px] font-semibold text-dark-900 font-[family-name:var(--font-quicksand)]">
                Ejercicio {questionIndex + 1} - {question.statement}
              </h4>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option) => {
                  const isSelected = state.selectedAnswers.includes(option.id);
                  // Only disable if answer is correct (permanent)
                  // Allow interaction if incorrect (even after validation) for retry
                  const isDisabled = state.isCorrect;

                  return (
                    <QuizOption
                      key={option.id}
                      id={option.id}
                      text={option.text}
                      selected={isSelected}
                      multipleChoice={isMultipleChoice}
                      onSelect={() => !isDisabled && handleSelectOption(question._id, option.id, isMultipleChoice)}
                      disabled={isDisabled}
                    />
                  );
                })}
              </div>

              {/* Validate Button */}
              {/* Show button when has selected answer and NOT permanently correct */}
              {!state.isCorrect && hasSelectedAnswer && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleValidate(question)}
                    className={cn(
                      'px-8 py-3 rounded-lg',
                      'bg-primary-green text-white',
                      'hover:bg-primary-green/90 transition-colors',
                      'font-medium text-[16px] font-[family-name:var(--font-rubik)]'
                    )}
                  >
                    Validar
                  </button>
                </div>
              )}

              {/* Temporary Feedback Toast (shown for 3 seconds after validation) */}
              {state.showTemporaryFeedback && (
                <div className="flex flex-col items-center gap-4 py-4">
                  {/* Feedback Card */}
                  <div className="relative flex items-center gap-3 px-6 py-4 bg-white rounded-[20px] shadow-[0px_12px_40px_15px_#0000001A]">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <Image
                        src={state.isCorrect ? '/icons/succes-icon.svg' : '/icons/error-icon.svg'}
                        alt={state.isCorrect ? 'success' : 'error'}
                        width={36}
                        height={36}
                      />
                    </div>

                    {/* Message */}
                    <p className="text-dark-900 font-medium text-base leading-snug max-w-sm">
                      {state.isCorrect ? '¡Respuesta correcta!' : 'Tu respuesta no es correcta, veamos por qué'}
                    </p>

                    {/* Triangle/Bonete - pointing down */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
                      style={{
                        borderLeft: '12px solid transparent',
                        borderRight: '12px solid transparent',
                        borderTop: '12px solid white',
                        filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.05))',
                      }}
                    />
                  </div>

                  {/* Kibi Icon */}
                  <div className="flex-shrink-0">
                    <Image
                      src="/illustrations/Kibi Icon.svg"
                      alt="Kibi"
                      width={80}
                      height={80}
                    />
                  </div>
                </div>
              )}

              {/* Step-by-step Explanation (permanently shown after first incorrect validation) */}
              {state.isValidated && !state.isCorrect && question.stepByStepExplanation && (
                <div className="mt-4 p-4 border border-grey-300 rounded-lg bg-white">
                  <div className="prose prose-sm max-w-none font-[family-name:var(--font-rubik)]">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="text-[14px] text-dark-800 leading-relaxed mb-3 last:mb-0">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-dark-900">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-dark-800">{children}</em>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-[14px] text-dark-800">{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="bg-grey-100 px-2 py-1 rounded text-[13px] font-mono text-dark-900">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {cleanStepByStepExplanation(question.stepByStepExplanation)}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

LessonQuestions.displayName = 'LessonQuestions';
