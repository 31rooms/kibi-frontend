'use client';

import React from 'react';
import Image from 'next/image';
import {
  QuizTimer,
  QuizProgress,
  QuizQuestion,
  QuizOption,
  CareerTag,
  FeedbackCard,
} from '@/shared/ui';
import { Button } from '@/shared/ui/Button';
import { ArrowRight } from 'lucide-react';
import type { DailyTestSession as DailyTestSessionType, AnswerQuestionResponse } from '../api/types';

interface DailyTestSessionProps {
  session: DailyTestSessionType;
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  answerFeedback: AnswerQuestionResponse | null;
  timer: number;
  loading: boolean;
  onAnswerSelect: (optionId: string) => void;
  onNextQuestion: () => void;
  onExit: () => void;
}

export function DailyTestSession({
  session,
  currentQuestionIndex,
  selectedAnswer,
  answerFeedback,
  timer,
  loading,
  onAnswerSelect,
  onNextQuestion,
  onExit
}: DailyTestSessionProps) {
  const currentQuestion = session.questions[currentQuestionIndex];
  const currentQuestionNumber = currentQuestionIndex + 1;
  const showResult = answerFeedback !== null;

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-80px)] bg-grey-50 dark:bg-[#171B22]">
      <div className="container max-w-3xl mx-auto flex flex-col flex-1 px-4">
        {/* Exit Button */}
        <div className="py-4">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-grey-700 hover:text-grey-900 dark:text-grey-300 dark:hover:text-grey-100 transition-colors cursor-pointer"
            aria-label="Salir del test"
          >
            <Image
              src="/icons/close-square.svg"
              alt="Salir"
              width={24}
              height={24}
            />
            <span className="text-sm font-medium">Salir</span>
          </button>
        </div>

        {/* Timer and Progress Bar */}
        <div className="flex items-center gap-4 mb-4">
          {/* Timer - countdown de 60 segundos por pregunta */}
          <QuizTimer
            timeRemaining={timer}
            initialTime={60}
            isRunning={!showResult}
            showProgress={false}
          />

          {/* Progress */}
          <QuizProgress
            current={currentQuestionNumber}
            total={session.questions.length}
            className="flex-1"
          />
        </div>

        {/* Subject Tag */}
        {currentQuestion.subjectName && (
          <div className="mb-4">
            <CareerTag career={currentQuestion.subjectName} variant="career" />
          </div>
        )}

        {/* Question Card */}
        <QuizQuestion
          question={currentQuestion.statement}
          questionNumber={currentQuestionNumber}
          className="mb-6"
        />

        {/* Question Image */}
        {currentQuestion.questionImage && (
          <div className="mb-6">
            <img
              src={currentQuestion.questionImage}
              alt="Ilustración de la pregunta"
              className="rounded-lg max-w-full h-auto border border-[#DEE2E6] dark:border-[#374151]"
            />
          </div>
        )}

        {/* Options List */}
        <div className="space-y-3 flex-1">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option.id;

            return (
              <QuizOption
                key={option.id}
                id={option.id}
                text={option.text}
                selected={isSelected}
                disabled={showResult || loading}
                onSelect={() => !showResult && onAnswerSelect(option.id)}
              />
            );
          })}
        </div>

        {/* Feedback Section */}
        {answerFeedback && (
          <div className="my-6 animate-fade-in">
            <FeedbackCard
              isCorrect={answerFeedback.isCorrect}
              message={answerFeedback.explanation || (answerFeedback.isCorrect ? '¡Respuesta correcta!' : 'Tu respuesta no es correcta')}
              enableMarkdown={true}
              showKibiIcon={true}
            />
          </div>
        )}

        {/* Navigation Section */}
        <div className="mt-auto pt-6 pb-8 flex justify-center">
          <Button
            onClick={onNextQuestion}
            disabled={!selectedAnswer || loading || showResult}
            variant="primary"
            color="green"
            className="w-full max-w-[235px] flex items-center justify-center gap-2"
          >
            <span>Enviar respuesta</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}
