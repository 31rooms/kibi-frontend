'use client';

import React, { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Flag, AlertCircle } from 'lucide-react';

interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  onSubmit: (reason: string, details: string) => Promise<void>;
}

const REPORT_REASONS = [
  { id: 'incorrect', label: 'Respuesta incorrecta marcada como correcta' },
  { id: 'typo', label: 'Error ortográfico o gramatical' },
  { id: 'unclear', label: 'Pregunta confusa o mal redactada' },
  { id: 'outdated', label: 'Contenido desactualizado' },
  { id: 'inappropriate', label: 'Contenido inapropiado' },
  { id: 'other', label: 'Otro' }
];

export function ReportContentModal({
  isOpen,
  onClose,
  questionId,
  onSubmit
}: ReportContentModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setSubmitting(true);
    try {
      await onSubmit(selectedReason, details);
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setDetails('');
    setSubmitted(false);
    onClose();
  };

  if (submitted) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        state="success"
        title="Reporte Enviado"
        description="Gracias por ayudarnos a mejorar el contenido. Revisaremos tu reporte pronto."
        singleButton
        confirmText="Entendido"
        onConfirm={handleClose}
      />
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      state="warning"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
            <Flag className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Reportar Contenido
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ayúdanos a identificar problemas con esta pregunta
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ¿Cuál es el problema?
          </label>
          {REPORT_REASONS.map((reason) => (
            <label
              key={reason.id}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedReason === reason.id
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-yellow-300'
              }`}
            >
              <input
                type="radio"
                name="reason"
                value={reason.id}
                checked={selectedReason === reason.id}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-900 dark:text-white">
                {reason.label}
              </span>
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Detalles adicionales (opcional)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Describe el problema con más detalle..."
            className="w-full p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-colors resize-none"
            rows={4}
          />
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 dark:text-blue-200">
            Tu reporte es anónimo y nos ayuda a mejorar la calidad del contenido para todos los estudiantes.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={submitting}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedReason || submitting}
            loading={submitting}
            color="blue"
            className="flex-1"
          >
            Enviar Reporte
          </Button>
        </div>
      </div>
    </Modal>
  );
}
