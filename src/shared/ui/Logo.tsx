'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/lib/context';

/**
 * Logo - Componente de logo de Kibi
 *
 * Muestra el logo de Kibi con el robot y el texto.
 * Usa Next.js Image para optimización automática.
 * Automáticamente cambia entre logo claro y oscuro según el tema.
 */

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tamaño del logo */
  size?: 'small' | 'medium' | 'large';
  /** Usar versión blanca del logo (anula detección automática) */
  white?: boolean;
}

const sizeClasses = {
  small: 'h-12',
  medium: 'h-16',
  large: 'h-32',
};

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, size = 'medium', white, ...props }, ref) => {
    const { isDarkMode } = useTheme();

    // Si white está explícitamente definido, úsalo; si no, usa isDarkMode
    const shouldUseWhiteLogo = white !== undefined ? white : isDarkMode;

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex items-center', sizeClasses[size], className)}
        {...props}
      >
        <Image
          src={shouldUseWhiteLogo ? '/illustrations/logo-dark.svg' : '/illustrations/logo.svg'}
          alt="Kibi Logo"
          width={300}
          height={150}
          className="h-full w-auto object-contain"
          priority
        />
      </div>
    );
  }
);

Logo.displayName = 'Logo';
