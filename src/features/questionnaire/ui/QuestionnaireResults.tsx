'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui';
import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface QuestionnaireResultsProps {
  /** Score achieved (e.g., "8/10") */
  correctAnswers: number;

  /** Total questions */
  totalQuestions: number;

  /** Areas where user excelled (optional) */
  effectivenessAreas?: Array<{
    name: string;
    percentage: number;
  }>;

  /** Current progress percentage towards next achievement */
  progressPercentage?: number;

  /** Callback when user clicks "Go to daily session" */
  onGoToDailySession: () => void;

  /** Custom className */
  className?: string;
}

/**
 * QuestionnaireResults Component
 *
 * Displays the results screen after completing a questionnaire.
 * Shows congratulations message, score, effectiveness by area, and progress.
 */
export function QuestionnaireResults({
  correctAnswers,
  totalQuestions,
  effectivenessAreas = [],
  progressPercentage = 65,
  onGoToDailySession,
  className,
}: QuestionnaireResultsProps) {
  return (
    <div
      className={cn(
        'w-full max-w-md mx-auto text-center py-8 px-4',
        className
      )}
    >
      {/* Success Icon - Clapping Hands SVG */}
      <div className="flex justify-center mb-8">
        <Image
          src="/illustrations/hands.svg"
          alt="Manos aplaudiendo"
          width={100}
          height={100}
          priority
        />
      </div>

      {/* Congratulations Message */}
      <h2
        className="font-quicksand text-[23px] font-bold leading-[100%] tracking-normal text-center text-dark-900 mb-2"
      >
        ¡Felicidades por completar
      </h2>
      <h2
        className="font-quicksand text-[23px] font-bold leading-[100%] tracking-normal text-center text-dark-900 mb-6"
      >
        tu reto de hoy!
      </h2>

      {/* Score Badge */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#E7FFE7] px-6 py-2 rounded-full">
          <span className="text-base font-bold text-dark-900">
            Respuestas: {correctAnswers}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* Effectiveness by Area Section */}
      {effectivenessAreas.length > 0 && (
        <div className="mb-8 w-full">
          <h3 className="text-lg font-medium text-dark-800 mb-4">
            Efectividad por área:
          </h3>

          <div className="space-y-3 w-full">
            {effectivenessAreas.map((area, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white border border-grey-200 rounded-lg px-3 py-3 w-full"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-[#13C296] flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-dark-900 font-semibold text-sm sm:text-base truncate">{area.name}:</span>
                </div>
                <div className="bg-[#13C2961A] px-3 py-1.5 rounded-full flex-shrink-0 ml-2">
                  <span className="text-[#13C296] font-semibold text-sm sm:text-base whitespace-nowrap">
                    {area.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Achievement Progress */}
      <div className="mb-8 w-full">
        <h3 className="text-lg font-semibold text-[#4A7C0F] mb-4">
          Próximo logro
        </h3>

        <div className="relative w-full">
          {/* Progress Bar Container */}
          <div className="flex items-center gap-2 sm:gap-4 w-full">
            {/* 0% Label */}
            <span className="text-xs sm:text-sm font-medium text-dark-600 tabular-nums flex-shrink-0">
              0%
            </span>

            {/* Progress Bar */}
            <div className="flex-1 h-2.5 bg-grey-200 rounded-full overflow-hidden min-w-0">
              <div
                className="h-full bg-[#4A7C0F] rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progreso: ${progressPercentage}%`}
              />
            </div>

            {/* 100% Label */}
            <span className="text-xs sm:text-sm font-medium text-dark-600 tabular-nums flex-shrink-0">
              100%
            </span>

            {/* Star Icon SVG */}
            <div className="flex-shrink-0">
              <Image
                src="/icons/star.svg"
                alt="Estrella"
                width={24}
                height={24}
                priority
                className="w-6 h-6 sm:w-7 sm:h-7"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full px-2 sm:px-0">
        <Button
          onClick={onGoToDailySession}
          variant="primary"
          color="green"
          size="large"
          className="w-full font-semibold"
        >
          Ir a sesión diaria →
        </Button>
      </div>
    </div>
  );
}
