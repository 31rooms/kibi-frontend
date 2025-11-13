'use client';

import React, { useEffect, useState } from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { cn } from '@/shared/lib/utils';

interface StripeCardInputProps {
  className?: string;
  error?: string;
  onChange?: (isComplete: boolean, hasError: boolean) => void;
}

/**
 * StripeCardInput Component
 *
 * Componente que integra Stripe CardElement con el diseño de Kibi.
 * Mantiene los mismos estilos visuales que los Input existentes.
 * Detecta el modo oscuro y actualiza los colores del texto dinámicamente.
 */
export const StripeCardInput: React.FC<StripeCardInputProps> = ({
  className,
  error,
  onChange,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Detectar el modo oscuro inicial
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Observar cambios en el modo oscuro (solo si cambia)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Memoizar el handler para evitar re-creaciones innecesarias
  const handleChange = React.useCallback((event: any) => {
    if (onChange) {
      onChange(event.complete, !!event.error);
    }
  }, [onChange]);

  // Memoizar las options del CardElement para evitar re-renders
  const cardElementOptions = React.useMemo(
    () => ({
      style: {
        base: {
          fontSize: '16px',
          fontFamily: 'var(--font-rubik), Rubik, sans-serif',
          color: isDarkMode ? '#ffffff' : '#171B22',
          '::placeholder': {
            color: isDarkMode ? '#9ca3af' : '#adb5bd',
          },
          iconColor: '#95C16B',
        },
        invalid: {
          color: '#dc3545',
          iconColor: '#dc3545',
        },
      },
      hidePostalCode: true, // Oculta el código postal (no se necesita)
      disableLink: true, // Deshabilitar Link autofill para evitar problemas de estilo
    }),
    [isDarkMode]
  );

  return (
    <div>
      <div
        className={cn(
          // Base styles matching Kibi Input component
          "w-full px-4 py-3 rounded-lg",

          // Background colors
          "bg-white dark:bg-[#171B22]",

          // Border styles
          "border-2",
          error
            ? "border-error-500"
            : "border-grey-300 dark:border-[#374151]",

          // Focus state
          "focus-within:border-primary-green",

          // Transitions
          "transition-colors duration-200",

          className
        )}
      >
        <CardElement
          onChange={handleChange}
          options={cardElementOptions}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-error-500 font-[family-name:var(--font-rubik)]">
          {error}
        </p>
      )}
    </div>
  );
};
