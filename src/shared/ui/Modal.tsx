'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Info, CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react';

export interface ModalProps {
  open?: boolean;
  isOpen?: boolean; // Alias for open
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void; // Alias for onOpenChange
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
  /** Custom children content (overrides description) */
  children?: React.ReactNode;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      isOpen,
      onOpenChange,
      onClose,
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
      children,
    },
    ref
  ) => {
    const isModalOpen = isOpen ?? open ?? false;

    const handleClose = () => {
      onOpenChange?.(false);
      onClose?.();
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

    if (!isModalOpen) return null;

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
            'relative bg-white dark:bg-[#171B22] rounded-lg shadow-lg flex flex-col gap-6 p-6',
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
                'text-center text-[#373737] dark:text-white',
                size === 'default'
                  ? "font-['Quicksand',sans-serif] font-bold text-[20px]"
                  : "font-['Rubik',sans-serif] text-[16px] leading-[22px]"
              )}
            >
              {title}
            </h2>

            {/* Decorative Line */}
            <div className={cn('h-[3px] w-[90px] rounded-[2px]', config.lineColor)} />

            {/* Description or Children */}
            {children ? (
              <div className="w-full">{children}</div>
            ) : (
              <p
                className={cn(
                  'text-center text-[#7b7b7b] dark:text-grey-400',
                  size === 'default'
                    ? "font-['Inter',sans-serif] text-[16px] w-full max-w-[430px]"
                    : "font-['Rubik',sans-serif] text-[14px] w-full"
                )}
              >
                {description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className={cn('flex gap-[18px] w-full', singleButton && 'justify-center')}>
            {!singleButton && (
              <button
                onClick={handleCancel}
                className={cn(
                  'flex-1 bg-white dark:bg-[#171B22] border border-[#dee2e6] dark:border-grey-700 text-[#373737] dark:text-white',
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
                'bg-[#171B22] text-white',
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
