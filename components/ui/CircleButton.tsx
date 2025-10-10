import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button, type ButtonProps } from './Button';
import { cn } from '@/lib/utils';

/**
 * CircleButton - Botón circular con icono
 *
 * Extiende el componente Button del sistema de diseño para crear
 * botones circulares perfectos (ancho = alto) con iconos centrados.
 *
 * Usado principalmente en navegación de onboarding y acciones flotantes.
 */

export interface CircleButtonProps extends Omit<ButtonProps, 'children'> {
  /** Icono a mostrar. Por defecto: ArrowRight */
  icon?: React.ReactNode;
}

const sizeClasses = {
  small: 'h-10 w-10 p-0',
  medium: 'h-12 w-12 p-0',
  large: 'h-14 w-14 p-0',
};

export const CircleButton = React.forwardRef<HTMLButtonElement, CircleButtonProps>(
  ({ className, size = 'medium', icon, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        className={cn(sizeClasses[size as keyof typeof sizeClasses], className)}
        {...props}
      >
        {icon || <ArrowRight className="h-5 w-5" />}
      </Button>
    );
  }
);

CircleButton.displayName = 'CircleButton';
