'use client';

import React from 'react';
import { Modal } from '@/shared/ui/Modal';

interface ExitConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmExit: () => void;
}

/**
 * Exit Confirmation Modal for Exam Simulation
 *
 * Uses the Modal component from shared UI
 * Matches the pattern from diagnostic-test
 */
export function ExitConfirmationModal({
  open,
  onOpenChange,
  onConfirmExit,
}: ExitConfirmationModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      state="alert"
      title="¿Seguro que desea salir del examen?"
      description="Si sales ahora, perderás todo el progreso del examen. Esta acción no se puede deshacer."
      cancelText="Cancelar"
      confirmText="Salir del examen"
      onCancel={() => onOpenChange(false)}
      onConfirm={onConfirmExit}
    />
  );
}
