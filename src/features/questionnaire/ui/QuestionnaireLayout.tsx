'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Modal } from '@/shared/ui';
import Image from 'next/image';

export interface QuestionnaireLayoutProps {
  /** Child components to render */
  children: React.ReactNode;

  /** Title of the questionnaire */
  title?: string;

  /** Whether to show exit button */
  showExitButton?: boolean;

  /** Callback when exit button is clicked */
  onExit?: () => void;

  /** Custom className for the container */
  className?: string;
}

/**
 * QuestionnaireLayout Component
 *
 * Layout wrapper for subject-specific questionnaires.
 * Provides consistent styling and exit functionality.
 */
export function QuestionnaireLayout({
  children,
  title,
  showExitButton = true,
  onExit,
  className,
}: QuestionnaireLayoutProps) {
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
      router.push('/home');
    }
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  return (
    <div className={cn('min-h-screen bg-grey-50', className)}>
      {/* Exit Button - Top Left */}
      {showExitButton && (
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-8 md:pt-6">
          <button
            onClick={handleExitClick}
            className="flex items-center gap-2 text-grey-700 hover:text-grey-900 transition-colors mb-4 cursor-pointer"
            aria-label="Salir del cuestionario"
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
        title="¿Seguro que desea abandonar el cuestionario?"
        description="Si abandonas ahora, perderás tu progreso en este cuestionario. ¿Aún así deseas salir?"
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
