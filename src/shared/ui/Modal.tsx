'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Info, CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react';

export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  state?: 'information' | 'success' | 'alert' | 'warning';
  size?: 'default' | 'small';
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  showCloseButton?: boolean;
  className?: string;
  /** Show only the confirm button (hides cancel button) */
  singleButton?: boolean;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open = false,
      onOpenChange,
      state = 'information',
      size = 'default',
      title = 'Your Message Sent Successfully',
      description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum been.",
      cancelText = 'Cancelar',
      confirmText = 'Continuar',
      onCancel,
      onConfirm,
      showCloseButton = false,
      className,
      singleButton = false,
    },
    ref
  ) => {
    const handleClose = () => {
      onOpenChange?.(false);
    };

    const handleCancel = () => {
      onCancel?.();
      handleClose();
    };

    const handleConfirm = () => {
      onConfirm?.();
      handleClose();
    };

    // State-specific colors and icons
    const stateConfig = {
      information: {
        icon: Info,
        iconBg: 'bg-[rgba(45,104,248,0.2)]',
        iconColor: 'text-[#0074f0]',
        lineColor: 'bg-[#0074f0]',
      },
      success: {
        icon: CheckCircle2,
        iconBg: 'bg-[rgba(74,183,93,0.2)]',
        iconColor: 'text-[#1da534]',
        lineColor: 'bg-[#1da534]',
      },
      alert: {
        icon: AlertCircle,
        iconBg: 'bg-[rgba(229,57,57,0.2)]',
        iconColor: 'text-[#df0707]',
        lineColor: 'bg-[#df0707]',
      },
      warning: {
        icon: AlertTriangle,
        iconBg: 'bg-[rgba(255,211,51,0.2)]',
        iconColor: 'text-[#ffc800]',
        lineColor: 'bg-[#ffc800]',
      },
    };

    const config = stateConfig[state];
    const Icon = config.icon;

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
            'relative bg-white rounded-lg shadow-lg flex flex-col gap-6 p-6',
            size === 'default' ? 'w-[500px]' : 'w-[360px]',
            className
          )}
        >
          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Content */}
          <div className="flex flex-col gap-3 items-center">
            {/* Icon */}
            <div
              className={cn(
                'flex items-center justify-center rounded-full',
                config.iconBg,
                size === 'default' ? 'p-5' : 'p-3'
              )}
            >
              <Icon
                className={cn('h-6 w-6', config.iconColor)}
                strokeWidth={2}
              />
            </div>

            {/* Title */}
            <h2
              className={cn(
                'text-center text-[#373737]',
                size === 'default'
                  ? "font-['Quicksand',sans-serif] font-bold text-[20px]"
                  : "font-['Rubik',sans-serif] text-[16px] leading-[22px]"
              )}
            >
              {title}
            </h2>

            {/* Decorative Line */}
            <div className={cn('h-[3px] w-[90px] rounded-[2px]', config.lineColor)} />

            {/* Description */}
            <p
              className={cn(
                'text-center text-[#7b7b7b]',
                size === 'default'
                  ? "font-['Inter',sans-serif] text-[16px] w-full max-w-[430px]"
                  : "font-['Rubik',sans-serif] text-[14px] w-full"
              )}
            >
              {description}
            </p>
          </div>

          {/* Actions */}
          <div className={cn('flex gap-[18px] w-full', singleButton && 'justify-center')}>
            {!singleButton && (
              <button
                onClick={handleCancel}
                className={cn(
                  'flex-1 bg-white border border-[#dee2e6] text-[#373737]',
                  'font-["Roboto",sans-serif] text-[16px] rounded-full transition-colors',
                  'hover:bg-gray-50',
                  size === 'default' ? 'px-5 py-3.5' : 'px-5 py-2.5'
                )}
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={cn(
                'bg-[#20263d] text-white',
                'font-["Roboto",sans-serif] text-[16px] rounded-full transition-colors',
                'hover:bg-[#2a3149]',
                size === 'default' ? 'px-5 py-3.5' : 'px-5 py-2.5',
                singleButton ? 'min-w-[200px]' : 'flex-1'
              )}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';
