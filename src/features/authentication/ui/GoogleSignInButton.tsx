'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '@/shared/lib/context';
import { cn } from '@/shared/lib/utils';
import {
  initGoogleSignIn,
  renderGoogleButton,
  isGoogleSignInAvailable,
} from '../utils/googleSignIn';

export interface GoogleSignInButtonProps {
  onSuccess: (idToken: string) => void | Promise<void>;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  disabled = false,
  className = '',
}) => {
  const { isDarkMode } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Callback wrapper
  const handleSuccess = useCallback(
    async (idToken: string) => {
      try {
        await onSuccess(idToken);
      } catch (error) {
        if (onError && error instanceof Error) {
          onError(error);
        }
      }
    },
    [onSuccess, onError]
  );

  // Esperar a que el script de Google cargue
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Verificar si ya está cargado
    if (isGoogleSignInAvailable()) {
      setIsReady(true);
      return;
    }

    // Esperar a que cargue
    const checkInterval = setInterval(() => {
      if (isGoogleSignInAvailable()) {
        clearInterval(checkInterval);
        setIsReady(true);
      }
    }, 100);

    // Timeout después de 5 segundos
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      console.warn('⚠️ Timeout esperando Google Identity Services');
    }, 5000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

  // Inicializar Google y renderizar botón oculto cuando esté listo
  useEffect(() => {
    if (!isReady || !containerRef.current) return;

    const success = initGoogleSignIn({
      callback: handleSuccess,
      onError,
    });

    if (success) {
      renderGoogleButton(containerRef.current, {
        theme: isDarkMode ? 'filled_black' : 'outline',
      });
    }
  }, [isReady, isDarkMode, handleSuccess, onError]);

  // Manejar clic - simular clic en el botón oficial oculto
  const handleClick = useCallback(() => {
    if (!isReady || disabled) return;

    if (containerRef.current) {
      const googleButton = containerRef.current.querySelector(
        'div[role="button"]'
      ) as HTMLElement;
      if (googleButton) {
        googleButton.click();
      }
    }
  }, [isReady, disabled]);

  return (
    <>
      {/* Botón visible con estilos originales */}
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || !isReady}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        aria-label="Iniciar sesión con Google"
      >
        <img
          src={isDarkMode ? '/icons/Google-dark.svg' : '/icons/Google-light.svg'}
          alt="Google"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </button>
      {/* Botón oficial de Google oculto (necesario para la funcionalidad) */}
      <div ref={containerRef} className="hidden" />
    </>
  );
};

GoogleSignInButton.displayName = 'GoogleSignInButton';
