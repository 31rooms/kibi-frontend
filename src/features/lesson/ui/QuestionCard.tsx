'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import type { Question } from '../types/lesson.types';
import { QuestionType } from '../types/lesson.types';
import Image from 'next/image';

export interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  correctAnswers: string[]; // This should come from the API when available
  onAnswered?: (questionId: string, isCorrect: boolean) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  correctAnswers,
  onAnswered
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const isMultipleChoice = question.type === QuestionType.MULTIPLE_CHOICE;

  // Handle option selection
  const handleOptionClick = (optionId: string) => {
    if (isAnswered) return; // Don't allow changes after answering

    setSelectedOptions(prev => {
      if (isMultipleChoice) {
        // Multiple choice - toggle selection
        if (prev.includes(optionId)) {
          return prev.filter(id => id !== optionId);
        }
        return [...prev, optionId];
      } else {
        // Single choice - replace selection
        return [optionId];
      }
    });
  };

  // Handle answer validation
  const handleValidate = () => {
    // Check if answer is correct
    const correct =
      selectedOptions.length === correctAnswers.length &&
      selectedOptions.every(id => correctAnswers.includes(id));

    setIsCorrect(correct);
    setIsAnswered(true);

    // Notify parent component
    onAnswered?.(question._id, correct);
  };

  // Handle retry
  const handleRetry = () => {
    setSelectedOptions([]);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="mt-0 first:mt-0 mb-6 last:mb-0 p-4 bg-grey-50 rounded-xl border border-grey-200">
      {/* Question Statement */}
      <div className="text-base font-semibold text-dark-900 mb-4">
        Ejercicio {questionNumber} - {question.statement}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-4">
        {question.options.map(option => {
          const isSelected = selectedOptions.includes(option.id);
          const showCorrect = isAnswered && correctAnswers.includes(option.id);
          const showIncorrect = isAnswered && isSelected && !correctAnswers.includes(option.id);

          return (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className={cn(
                'p-3 rounded-lg border-2 transition-all flex items-center gap-2',
                isSelected ? 'border-primary-green bg-green-50' : 'border-grey-300 bg-white',
                isAnswered ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-primary-green',
              )}
            >
              {/* Checkbox/Radio */}
              <div
                className={cn(
                  'w-5 h-5 flex items-center justify-center flex-shrink-0 border-2 transition-all',
                  isMultipleChoice ? 'rounded' : 'rounded-full',
                  isSelected ? 'border-primary-green bg-primary-green' : 'border-grey-400 bg-transparent'
                )}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Option Text */}
              <span className="flex-1 text-dark-900 text-sm">
                {option.id}) {option.text}
              </span>

              {/* Correct/Incorrect indicators */}
              {showCorrect && (
                <svg className="w-5 h-5 text-success-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {showIncorrect && (
                <svg className="w-5 h-5 text-error-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Validate Button */}
      {!isAnswered && selectedOptions.length > 0 && (
        <button
          onClick={handleValidate}
          className={cn(
            'w-full py-3 px-6 rounded-lg font-semibold text-sm transition-colors',
            'bg-primary-green text-white hover:bg-opacity-90'
          )}
        >
          Validar
        </button>
      )}

      {/* Feedback */}
      {isAnswered && (
        <div
          className={cn(
            'flex items-center gap-3 p-4 rounded-lg border mt-4',
            isCorrect
              ? 'bg-success-50 border-success-200'
              : 'bg-error-50 border-error-200'
          )}
        >
          <div className="flex-shrink-0">
            <Image
              src={isCorrect ? '/icons/succes-icon.svg' : '/icons/error-icon.svg'}
              alt={isCorrect ? 'Correcto' : 'Incorrecto'}
              width={36}
              height={36}
            />
          </div>
          <div className="flex-1">
            <div
              className={cn(
                'font-semibold mb-1',
                isCorrect ? 'text-success-700' : 'text-error-700'
              )}
            >
              {isCorrect ? '¡Correcto!' : 'No es correcto'}
            </div>
            {!isCorrect && (
              <div className="text-sm text-error-600">
                Tu respuesta no es correcta, veamos por qué
              </div>
            )}
          </div>
        </div>
      )}

      {/* Retry Button - Only shown when incorrect */}
      {isAnswered && !isCorrect && (
        <button
          onClick={handleRetry}
          className={cn(
            'w-full py-3 px-6 rounded-lg font-semibold text-sm transition-colors mt-3',
            'bg-primary-blue text-white hover:bg-opacity-90'
          )}
        >
          Intentar de nuevo
        </button>
      )}
    </div>
  );
};
