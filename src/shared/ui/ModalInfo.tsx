'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import Image from 'next/image';

export interface ModalInfoProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  onConfirm?: () => void;
  className?: string;
}

export const ModalInfo = React.forwardRef<HTMLDivElement, ModalInfoProps>(
  (
    {
      open = false,
      onOpenChange,
      title = 'Ayuda',
      description = 'Esta es la descripción del modal.',
      confirmText = 'Entendido',
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
            'relative bg-white rounded-2xl shadow-lg flex flex-col w-[90%] max-w-[880px] max-h-[90vh]',
            'border border-[#DEE2E6]',
            className
          )}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 cursor-pointer"
          >
            <Image
              src="/icons/close-square.svg"
              alt="Cerrar"
              width={32}
              height={32}
            />
          </button>

          {/* Title */}
          <div className="px-8 pt-8 pb-4">
            <h2 className="text-center text-[#000000] font-['Quicksand',sans-serif] font-bold text-[24px]">
              {title}
            </h2>
          </div>

          {/* Description - Scrollable */}
          <div className="px-8 pb-6 flex-1 overflow-y-auto">
            <div className="bg-white rounded-lg border border-[#DEE2E6] p-6">
              <p className="text-[#000000] font-['Rubik',sans-serif] text-[16px] leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="px-8 pb-8 flex justify-center">
            <button
              onClick={handleConfirm}
              className="bg-[#6BA83C] text-white font-['Roboto',sans-serif] font-medium text-[18px] rounded-full px-20 py-3.5 transition-all hover:bg-[#5a8f33] active:scale-95 min-w-[200px] shadow-md hover:shadow-lg"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ModalInfo.displayName = 'ModalInfo';
