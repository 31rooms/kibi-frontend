'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface ExamResultsViewProps {
  totalAnswered: number;
  totalQuestions: number;
  totalCorrect: number;
  totalIncorrect: number;
  score: number;
  onGoHome: () => void;
}

export function ExamResultsView({
  totalAnswered,
  totalQuestions,
  totalCorrect,
  totalIncorrect,
  score,
  onGoHome,
}: ExamResultsViewProps) {
  const correctPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const incorrectPercentage = totalQuestions > 0 ? Math.round((totalIncorrect / totalQuestions) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#171b22] py-8 flex items-center justify-center">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Stars Icon */}
          <div className="mb-4">
            <Image
              src="/icons/stars-simulacro.svg"
              alt="Simulacro completado"
              width={120}
              height={120}
              className="dark:hidden"
            />
            <Image
              src="/icons/stars-simulacro-dark.svg"
              alt="Simulacro completado"
              width={120}
              height={120}
              className="hidden dark:block"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-grey-900 dark:text-white">
            ¡Has completado tu simulación de Examen de admisión!
          </h1>

          {/* Answers Count with Background */}
          <div className="inline-block px-6 py-3 rounded-lg bg-[#E7FFE7] dark:bg-[#1E242D]">
            <p className="text-lg font-semibold text-grey-900 dark:text-white">
              Respuestas: {totalAnswered}/{totalQuestions}
            </p>
          </div>

          {/* Effectiveness Title */}
          <h2 className="text-xl font-semibold text-grey-900 dark:text-white">
            Tu efectividad:
          </h2>

          {/* Effectiveness Cards */}
          <div className="w-full max-w-md space-y-4">
            {/* Aciertos Card */}
            <Card
              variant="default"
              padding="none"
              className="bg-white dark:bg-primary-blue border-grey-500 dark:border-dark-500 max-h-[50px]"
            >
              <div className="flex items-center justify-between px-4 py-2 h-[50px]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success-600" />
                  </div>
                  <span className="text-base font-medium text-grey-900 dark:text-white">
                    Aciertos
                  </span>
                </div>
                <span className="text-xl font-bold text-success-600">
                  {correctPercentage}%
                </span>
              </div>
            </Card>

            {/* Errores Card */}
            <Card
              variant="default"
              padding="none"
              className="bg-white dark:bg-primary-blue border-grey-500 dark:border-dark-500 max-h-[50px]"
            >
              <div className="flex items-center justify-between px-4 py-2 h-[50px]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-error-100 dark:bg-error-900/20 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-error-600" />
                  </div>
                  <span className="text-base font-medium text-grey-900 dark:text-white">
                    Errores
                  </span>
                </div>
                <span className="text-xl font-bold text-error-600">
                  {incorrectPercentage}%
                </span>
              </div>
            </Card>
          </div>

          {/* Score */}
          <div className="pt-4">
            <p className="text-2xl font-bold text-grey-900 dark:text-white">
              Puntaje: {score} pts
            </p>
          </div>

          {/* Motivational Message */}
          <p className="text-base text-grey-600 dark:text-grey-400 max-w-md">
            No te desanimes! Recuerda que aún nos quedan sesiones por completar y temas por aprender.
          </p>

          {/* Action Button */}
          <div className="pt-6">
            <Button
              variant="primary"
              color="green"
              size="medium"
              onClick={onGoHome}
            >
              Ir al inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
