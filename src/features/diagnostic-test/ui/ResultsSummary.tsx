'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/lib/context';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

/**
 * ResultsSummary Component Props
 */
export interface ResultsSummaryProps {
  /**
   * The user's current level (e.g., "Intermedio", "Básico", "Avanzado")
   */
  currentLevel: string;

  /**
   * Percentage towards goal (0-100)
   */
  progressPercentage: number;

  /**
   * List of strengths/fortalezas
   */
  strengths: string[];

  /**
   * List of areas to reinforce/reforzar
   */
  areasToReinforce: string[];

  /**
   * Callback when user clicks "Ir a mi ruta de preparación"
   */
  onGoToPreparation: () => void;

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * ResultsSummary Component
 *
 * Displays a summary of diagnostic test results including:
 * - Current level
 * - Progress percentage
 * - Strengths
 * - Areas to reinforce
 *
 * @example
 * ```tsx
 * <ResultsSummary
 *   currentLevel="Intermedio"
 *   progressPercentage={65}
 *   strengths={["Comprensión lectora", "Historia"]}
 *   areasToReinforce={["Álgebra", "Química"]}
 *   onGoToPreparation={() => router.push('/preparation')}
 * />
 * ```
 */
export const ResultsSummary = React.forwardRef<
  HTMLDivElement,
  ResultsSummaryProps
>(
  (
    {
      currentLevel,
      progressPercentage,
      strengths,
      areasToReinforce,
      onGoToPreparation,
      className,
    },
    ref
  ) => {
    const router = useRouter();
    const { isDarkMode } = useTheme();

    const handleGoToPreparation = () => {
      router.push('/home');
      onGoToPreparation();
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full max-w-xl mx-auto p-6 md:p-10 flex flex-col items-center gap-6',
          className
        )}
      >
        {/* Hands Icon with green background */}
        <div className="relative flex justify-center items-center mb-2">
          <Image
            src={isDarkMode ? "/illustrations/hands-dark.svg" : "/illustrations/hands.svg"}
            alt="Hands"
            width={113}
            height={113}
            priority
            className="relative z-10"
          />
        </div>

        {/* Progress Message */}
        <p className="text-[14px] md:text-[16px] text-dark-900 dark:text-white text-center font-[family-name:var(--font-rubik)] leading-relaxed px-4">
          Con tu nivel actual, estás a un{' '}
          <span className="font-semibold">{progressPercentage}%</span> del
          objetivo. Sigamos trabajando para llegar al 100% antes del examen.
        </p>

        {/* Cards Section */}
        <div className="w-full flex flex-col gap-3 mt-2">
          {/* Current Level Card - Yellow */}
          <div className="w-full bg-warning-50 dark:bg-[#FFD33333] rounded-2xl py-4 px-5 md:py-5 md:px-6 flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
              <Image
                src="/icons/trend-up.svg"
                alt="Nivel actual"
                width={40}
                height={40}
              />
            </div>
            <div className="flex-1">
              <p className="text-[14px] md:text-[16px] font-[family-name:var(--font-rubik)] text-dark-900 dark:text-white">
                <span className="font-semibold">Tu nivel actual:</span>{' '}
                {currentLevel}
              </p>
            </div>
          </div>

          {/* Strengths Card - Blue */}
          <div className="w-full bg-blue-50 dark:bg-[#2D68F833] rounded-2xl py-4 px-5 md:py-5 md:px-6 flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
              <Image
                src="/icons/share.svg"
                alt="Fortalezas"
                width={40}
                height={40}
              />
            </div>
            <div className="flex-1">
              <p className="text-[14px] md:text-[16px] font-[family-name:var(--font-rubik)] text-dark-900 dark:text-white">
                <span className="font-semibold">Fortalezas:</span>{' '}
                {strengths.join(', ')}
              </p>
            </div>
          </div>

          {/* Areas to Reinforce Card - Purple/Violet */}
          <div className="w-full bg-purple-50 dark:bg-[#8646F433] rounded-2xl py-4 px-5 md:py-5 md:px-6 flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
              <Image
                src="/icons/task-square.svg"
                alt="Áreas a reforzar"
                width={40}
                height={40}
              />
            </div>
            <div className="flex-1">
              <p className="text-[14px] md:text-[16px] font-[family-name:var(--font-rubik)] text-dark-900 dark:text-white">
                <span className="font-semibold">Áreas a reforzar:</span>{' '}
                {areasToReinforce.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <p className="text-[14px] md:text-[16px] text-dark-900 dark:text-white text-center font-[family-name:var(--font-rubik)] font-semibold leading-relaxed px-4 mt-2">
          ¡Con tus resultados he creado una ruta de materias personal para ti!
        </p>

        {/* CTA Button */}
        <Button
          type="button"
          variant="primary"
          color="green"
          size="large"
          className="w-full mt-4 gap-2"
          onClick={handleGoToPreparation}
        >
          Ir a mi ruta de preparación
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    );
  }
);

ResultsSummary.displayName = 'ResultsSummary';
