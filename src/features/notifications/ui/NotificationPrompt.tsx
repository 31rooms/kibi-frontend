'use client';

import React, { useState } from 'react';
import { Bell, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/lib/context';
import { Button } from '@/shared/ui';

export interface NotificationPromptProps {
  onEnable: () => Promise<boolean>;
  onDismiss: () => void;
  onLater: () => void;
  className?: string;
}

/**
 * Notification Prompt Component
 * Card prompt to request push notification permissions
 * Shows when user hasn't enabled notifications yet
 * Supports both light and dark mode themes
 */
export const NotificationPrompt = React.forwardRef<HTMLDivElement, NotificationPromptProps>(
  ({ onEnable, onDismiss, onLater, className }, ref) => {
    const { isDarkMode } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleEnable = async () => {
      setIsLoading(true);
      try {
        const result = await onEnable();
        if (result) {
          setSuccess(true);
          // Auto-dismiss on success after showing checkmark
          setTimeout(() => onDismiss(), 2000);
        }
      } catch (error) {
        console.error('Error enabling notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg shadow-lg p-4 relative',
          'border',
          className
        )}
        style={{
          backgroundColor: isDarkMode ? '#1E242D' : '#ffffff',
          borderColor: isDarkMode ? '#374151' : '#DEE2E6',
        }}
      >
        {/* Close button */}
        <button
          onClick={onDismiss}
          className={cn(
            'absolute top-2 right-2 p-1.5 rounded-full',
            'transition-colors duration-200'
          )}
          style={{
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          }}
          aria-label="Cerrar"
        >
          <X
            className="w-4 h-4"
            style={{ color: isDarkMode ? '#9CA3AF' : '#6C757D' }}
          />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3 mb-3 pr-6">
          {/* Icon */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: success
                ? 'rgba(149, 193, 107, 0.15)'
                : isDarkMode
                ? 'rgba(45, 104, 248, 0.15)'
                : 'rgba(23, 27, 34, 0.08)',
            }}
          >
            {success ? (
              <CheckCircle2 className="w-5 h-5" style={{ color: '#95C16B' }} />
            ) : (
              <Bell className="w-5 h-5" style={{ color: isDarkMode ? '#2D68F8' : '#171B22' }} />
            )}
          </div>

          {/* Text */}
          <div className="flex-1">
            <h3
              className="text-base font-semibold mb-1 font-[family-name:var(--font-rubik)]"
              style={{ color: isDarkMode ? '#ffffff' : '#171B22' }}
            >
              {success ? '¡Notificaciones activadas!' : '¡Mantente al día con tus rachas!'}
            </h3>
            <p
              className="text-sm font-[family-name:var(--font-rubik)]"
              style={{ color: isDarkMode ? '#D1D5DB' : '#495057' }}
            >
              {success
                ? 'Recibirás notificaciones sobre tu progreso'
                : 'Activa las notificaciones para recibir recordatorios sobre tus rachas, logros y más.'}
            </p>
          </div>
        </div>

        {/* Actions */}
        {!success && (
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleEnable}
              disabled={isLoading}
              variant="primary"
              size="sm"
              className="flex-1"
            >
              {isLoading ? 'Activando...' : 'Activar notificaciones'}
            </Button>
            <Button onClick={onLater} variant="outline" size="sm">
              Más tarde
            </Button>
          </div>
        )}
      </div>
    );
  }
);

NotificationPrompt.displayName = 'NotificationPrompt';
