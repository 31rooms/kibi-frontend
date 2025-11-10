'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { ExitConfirmationModal } from './ExitConfirmationModal';
import { Activity } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import Image from 'next/image';

export interface ExamSimulationLayoutProps {
  /** Main content (ExamQuestionView) */
  children: React.ReactNode;

  /** Whether to show the exit button */
  showExitButton?: boolean;

  /** Whether to show the view summary button */
  showViewSummaryButton?: boolean;

  /** Callback when exit is confirmed */
  onExit?: () => void;

  /** Callback when view summary is clicked */
  onViewSummary?: () => void;

  /** Custom className for the layout */
  className?: string;

  /** Background color variant */
  background?: 'white' | 'gray';
}

/**
 * Layout wrapper for exam simulation
 *
 * Provides:
 * - Exit button with confirmation modal
 * - Consistent padding and background
 * - Mobile-responsive design
 * - Matches diagnostic-test layout pattern
 */
export function ExamSimulationLayout({
  children,
  showExitButton = true,
  showViewSummaryButton = false,
  onExit,
  onViewSummary,
  className,
  background = 'gray',
}: ExamSimulationLayoutProps) {
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);

  const handleExitClick = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    if (onExit) {
      onExit();
    } else {
      // Redirect to dashboard (default behavior)
      router.push('/dashboard');
    }
  };

  return (
    <div
      className={cn(
        'min-h-screen',
        background === 'gray' ? 'bg-grey-50 dark:bg-[#171B22]' : 'bg-white dark:bg-[#171B22]',
        className
      )}
    >
      {/* Top Header: Exit and View Summary Buttons */}
      {(showExitButton || showViewSummaryButton) && (
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-4 md:pt-6 md:pb-4">
          <div className="flex items-center justify-between">
            {/* Exit Button - Left */}
            {showExitButton && (
              <button
                onClick={handleExitClick}
                className="flex items-center gap-2 text-grey-700 hover:text-grey-900 dark:text-grey-300 dark:hover:text-grey-100 transition-colors cursor-pointer"
                aria-label="Salir del examen"
              >
                <Image
                  src="/icons/close-square.svg"
                  alt="Salir"
                  width={24}
                  height={24}
                />
                <span className="text-sm font-medium">Salir</span>
              </button>
            )}

            {/* View Summary Button - Right */}
            {showViewSummaryButton && onViewSummary && (
              <Button
                onClick={onViewSummary}
                variant="secondary"
                size="small"
                className="flex items-center gap-2"
                aria-label="Ver resumen"
              >
                <Activity className="w-4 h-4" style={{ color: '#95C16B' }} />
                <span>Ver resumen</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      <ExitConfirmationModal
        open={showExitModal}
        onOpenChange={setShowExitModal}
        onConfirmExit={handleConfirmExit}
      />

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        {children}
      </div>
    </div>
  );
}
