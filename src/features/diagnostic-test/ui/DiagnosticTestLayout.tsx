'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Modal } from '@/shared/ui';
import Image from 'next/image';

export interface DiagnosticTestLayoutProps {
  /** Main content (QuizContainer) */
  children: React.ReactNode;

  /** Title of the diagnostic test */
  title?: string;

  /** Whether to show the exit button */
  showExitButton?: boolean;

  /** Callback when exit button is clicked */
  onExit?: () => void;

  /** Custom className for the layout */
  className?: string;

  /** Background color variant */
  background?: 'white' | 'gray';
}

/**
 * Layout wrapper for diagnostic tests
 *
 * Provides:
 * - Exit button
 * - Consistent padding and background
 * - Mobile-responsive design
 */
export function DiagnosticTestLayout({
  children,
  title,
  showExitButton = true,
  onExit,
  className,
  background = 'gray',
}: DiagnosticTestLayoutProps) {
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);

  const handleExitClick = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    if (onExit) {
      onExit();
    } else {
      // Redirect to home (default behavior)
      router.push('/');
    }
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  return (
    <div
      className={cn(
        'min-h-screen',
        background === 'gray' ? 'bg-grey-50 dark:bg-[#171B22]' : 'bg-white dark:bg-[#171B22]',
        className
      )}
    >
      {/* Exit Button Only - Top Left */}
      {showExitButton && (
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-8 md:pt-6 pb-8">
          <button
            onClick={handleExitClick}
            className="flex items-center gap-2 text-grey-700 hover:text-grey-900 transition-colors mb-4 cursor-pointer"
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
      )}

      {/* Exit Confirmation Modal */}
      <Modal
        open={showExitModal}
        onOpenChange={setShowExitModal}
        state="alert"
        title="¿Seguro que desea abandonar el test?"
        description="Para poder obtener una ruta de aprendizaje acorde con tus necesidades, requerimos que finalices el test de diagnostico. ¿Aun asi deseas abandonar?"
        cancelText="Cancelar"
        confirmText="Continuar"
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
      />

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        {children}
      </div>
    </div>
  );
}
