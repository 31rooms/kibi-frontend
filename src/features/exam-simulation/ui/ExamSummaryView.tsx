'use client';

import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { ExamQuestionState } from '../types';

interface ExamSummaryViewProps {
  questionStates: ExamQuestionState[];
  totalAnswered: number;
  totalCorrect: number;
  totalQuestions: number;
  onResumeExam: () => void;
  onCompleteExam: () => void;
  onGoToQuestion: (index: number) => void;
}

export function ExamSummaryView({
  questionStates,
  totalAnswered,
  totalCorrect,
  totalQuestions,
  onResumeExam,
  onCompleteExam,
  onGoToQuestion,
}: ExamSummaryViewProps) {
  const QUESTIONS_PER_CARD = 30;
  const totalCards = Math.ceil(totalQuestions / QUESTIONS_PER_CARD);

  const renderQuestionIndicator = (index: number, state: ExamQuestionState) => {
    const isAnswered = state.isAnswered;

    return (
      <button
        key={index}
        onClick={() => onGoToQuestion(index)}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:opacity-70',
          'flex items-center gap-2'
        )}
      >
        {isAnswered ? (
          <CheckCircle className="w-5 h-5 text-primary-green" />
        ) : (
          <XCircle className="w-5 h-5 text-error-500" />
        )}
        <span className="text-sm font-medium text-grey-900 dark:text-white">
          {index + 1}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-primary-blue py-8">
      <div className="container max-w-6xl mx-auto px-4 flex-1 flex flex-col">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-grey-900 dark:text-white">
            Resumen
          </h1>
        </div>

        {/* Answers Count with Background */}
        <div className="mb-6">
          <div className="inline-block mx-auto w-full text-center">
            <div className="inline-block px-6 py-3 rounded-lg bg-[#E7FFE7] dark:bg-[#1E242D]">
              <p className="text-lg font-semibold text-grey-900 dark:text-white">
                Respuestas: {totalAnswered}/{totalQuestions}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-8">
          <p className="text-sm text-grey-600 dark:text-grey-400">
            Haz click en los iconos marcados con la "X" y podrás volver a la pregunta y responderla.
          </p>
        </div>

        {/* Question Cards Grid */}
        <div className="flex-1 flex items-start justify-center ">
          <div className="inline-flex flex-wrap gap-4 justify-center">
            {Array.from({ length: totalCards }).map((_, cardIndex) => {
              const startIdx = cardIndex * QUESTIONS_PER_CARD;
              const endIdx = Math.min(startIdx + QUESTIONS_PER_CARD, totalQuestions);
              const cardQuestions = questionStates.slice(startIdx, endIdx);

              return (
                <Card
                  key={cardIndex}
                  variant="default"
                  padding="medium"
                  className="bg-white dark:bg-primary-blue min-h-[230px]"
                >
                  <div className="flex flex-wrap gap-4 justify-start max-w-md">
                    {cardQuestions.map((state, idx) =>
                      renderQuestionIndicator(startIdx + idx, state)
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto w-full">
          <Button
            variant="primary"
            color="green"
            size="large"
            onClick={onResumeExam}
            className="flex-1"
          >
            Retomar examen
          </Button>
          <Button
            variant="secondary"
            color="blue"
            size="large"
            onClick={onCompleteExam}
            className="flex-1"
          >
            Finalizar examen
          </Button>
        </div>
      </div>
    </div>
  );
}
