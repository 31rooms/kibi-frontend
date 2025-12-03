'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { Clock, Zap, Flag, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { DailyTestSession as DailyTestSessionType, DailyTestQuestion, AnswerQuestionResponse } from '../api/types';

interface DailyTestSessionProps {
  session: DailyTestSessionType;
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  answerFeedback: AnswerQuestionResponse | null;
  timer: number;
  loading: boolean;
  onAnswerSelect: (optionId: string) => void;
  onNextQuestion: () => void;
  onPrevQuestion?: () => void;
  onReport: () => void;
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
  onPrevQuestion,
  onReport
}: DailyTestSessionProps) {
  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === session.questions.length - 1;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 py-6">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Badge variant="default" color="primary-green" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Test Diario
            </Badge>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Pregunta {currentQuestionIndex + 1} de {session.questions.length}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4" />
              {formatTime(timer)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onReport}
              className="flex items-center gap-1"
            >
              <Flag className="w-3 h-3" />
              Reportar
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Science Capsule Card */}
        <Card className="shadow-lg border-2 border-primary-green/20">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-green/5 to-transparent">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-primary-green animate-pulse" />
                  <span className="text-xs font-medium text-primary-green uppercase tracking-wide">
                    Cápsula de Ciencia
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentQuestion.subjectName || 'Matemáticas'}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Nivel: {currentQuestion.difficultyLevel || 'INTERMEDIATE'}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Question */}
            <div className="mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-l-4 border-blue-500">
                <p className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
                  {currentQuestion.statement}
                </p>
              </div>

              {/* Question Image */}
              {currentQuestion.questionImage && (
                <div className="mt-4">
                  <img
                    src={currentQuestion.questionImage}
                    alt="Question illustration"
                    className="rounded-lg max-w-full h-auto border border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrect = answerFeedback?.correctOptionId === option.id;
                const isWrong = isSelected && !isCorrect && answerFeedback;
                const showResult = answerFeedback !== null;

                return (
                  <button
                    key={option.id}
                    onClick={() => !showResult && onAnswerSelect(option.id)}
                    disabled={showResult || loading}
                    className={cn(
                      'w-full text-left p-4 rounded-lg border-2 transition-all duration-200',
                      'hover:shadow-md disabled:cursor-not-allowed',
                      !showResult && !isSelected && 'border-gray-200 dark:border-gray-700 hover:border-primary-green',
                      !showResult && isSelected && 'border-primary-green bg-primary-green/5',
                      showResult && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-900/20',
                      showResult && isWrong && 'border-red-500 bg-red-50 dark:bg-red-900/20',
                      showResult && !isCorrect && !isWrong && 'opacity-50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold',
                        !showResult && 'border-gray-300 text-gray-600',
                        showResult && isCorrect && 'border-green-500 bg-green-500 text-white',
                        showResult && isWrong && 'border-red-500 bg-red-500 text-white'
                      )}>
                        {showResult && isCorrect ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : showResult && isWrong ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span className="flex-1 text-base font-medium text-gray-900 dark:text-white">
                        {option.text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback Section */}
            {answerFeedback && (
              <div className={cn(
                'p-4 rounded-lg border-l-4 mb-6',
                answerFeedback.isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-500'
              )}>
                <div className="flex items-start gap-3">
                  {answerFeedback.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className={cn(
                      'font-bold mb-2',
                      answerFeedback.isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                    )}>
                      {answerFeedback.isCorrect ? '¡Correcto!' : 'Incorrecto'}
                    </h4>
                    {answerFeedback.explanation && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {answerFeedback.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={onPrevQuestion}
                disabled={currentQuestionIndex === 0 || !answerFeedback}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <Button
                onClick={onNextQuestion}
                disabled={!answerFeedback || loading}
                className="flex-1"
                color="green"
              >
                {isLastQuestion ? 'Finalizar' : 'Siguiente'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question Navigator */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
            Progreso del test
          </p>
          <div className="flex flex-wrap gap-2">
            {session.questions.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium border-2 transition-colors',
                  index === currentQuestionIndex && 'border-primary-green bg-primary-green text-white',
                  index < currentQuestionIndex && 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700',
                  index > currentQuestionIndex && 'border-gray-300 dark:border-gray-600 text-gray-500'
                )}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
