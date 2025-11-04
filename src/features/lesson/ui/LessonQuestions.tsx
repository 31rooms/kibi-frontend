'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { QuizOption, FeedbackCard, MarkdownRenderer, Button } from '@/shared/ui';
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
    // This function preserves HTML tags, LaTeX formulas, and multi-line content
    const cleanStepByStepExplanation = (markdown: string): string => {
      if (!markdown) return '';

      // Split by newlines while preserving empty lines
      const lines = markdown.split('\n');

      // Filter out lines that contain "Respuesta correcta" or checkmark
      // but preserve all other content including HTML and LaTeX
      const filteredLines = lines.filter(line => {
        const trimmedLine = line.trim();
        // Skip empty lines that we want to keep for formatting
        if (trimmedLine === '') return true;
        // Remove lines with "Respuesta correcta" or checkmark
        return !trimmedLine.includes('Respuesta correcta') && !trimmedLine.includes('✅');
      });

      return filteredLines.join('\n').trim();
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
              <h4 className="text-[16px] font-semibold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
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
                  <Button
                    variant="primary"
                    color="green"
                    size="medium"
                    onClick={() => handleValidate(question)}
                  >
                    Validar
                  </Button>
                </div>
              )}

              {/* Temporary Feedback Toast (shown for 3 seconds after validation) */}
              {state.showTemporaryFeedback && (
                <FeedbackCard
                  isCorrect={state.isCorrect}
                  showKibiIcon={true}
                />
              )}

              {/* Step-by-step Explanation (permanently shown after first incorrect validation) */}
              {state.isValidated && !state.isCorrect && question.stepByStepExplanation && (
                <div className="mt-4 p-4 border border-grey-300 dark:border-[#374151] rounded-lg bg-white dark:bg-[#1E242D]">
                  <h3 className="text-[16px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-3">
                    Solución paso a paso:
                  </h3>
                  <MarkdownRenderer
                    content={cleanStepByStepExplanation(question.stepByStepExplanation)}
                    className="prose prose-sm max-w-none font-[family-name:var(--font-rubik)]"
                  />
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
