'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { Button } from './Button';

export interface SuccessModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  onConfirm?: () => void;
  className?: string;
}

/**
 * Success Modal Component
 * Modal with green check icon for success messages
 */
export const SuccessModal = React.forwardRef<HTMLDivElement, SuccessModalProps>(
  (
    {
      open = false,
      onOpenChange,
      title = 'Pago recibido con éxito',
      description = 'Su pago a sido validado',
      confirmText = 'Continuar',
      onConfirm,
      className,
    },
    ref
  ) => {
    const handleClose = () => {
      onOpenChange?.(false);
    };

    const handleConfirm = () => {
      onConfirm?.();
      handleClose();
    };

    if (!open) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={handleClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Modal Content */}
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'relative bg-white dark:bg-[#272E3A] rounded-2xl shadow-lg flex flex-col w-[90%] max-w-[480px] p-8',
            className
          )}
        >
          {/* Icon Circle */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 flex items-center justify-center">
              <Image
                src="/icons/succes-icon.svg"
                alt="Success"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-center text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] font-bold text-[24px] mb-2">
            {title}
          </h2>

          {/* Underline */}
          <div className="w-24 h-1 bg-primary-green mx-auto mb-4" />

          {/* Description */}
          <p className="text-center text-grey-600 dark:text-grey-400 font-[family-name:var(--font-rubik)] text-[16px] mb-8">
            {description}
          </p>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleConfirm}
              variant="primary"
              color="blue"
              size="medium"
              className="px-16 min-w-[200px]"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

SuccessModal.displayName = 'SuccessModal';
