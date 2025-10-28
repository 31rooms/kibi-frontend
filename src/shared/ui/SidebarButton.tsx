'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { Home, TrendingUp, BookOpen, FileText, User } from 'lucide-react';

const sidebarButtonVariants = cva(
  // Base styles
  'w-full max-w-[192px] h-[48px] flex items-center justify-start gap-3 px-4 font-medium transition-all duration-200 border-2 cursor-pointer hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-green font-[family-name:var(--font-rubik)]',
  {
    variants: {
      selected: {
        true: 'bg-[#47830E33] border-[#DEE2E6] dark:border-[#95C16B] text-[#47830E] dark:text-white',
        false: 'bg-white dark:bg-[#171B22] border-[#DEE2E6] dark:border-[#374151] text-dark-700 dark:text-grey-300 hover:bg-grey-50',
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);

export interface SidebarButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>,
    VariantProps<typeof sidebarButtonVariants> {
  /**
   * Type of the sidebar button
   */
  type: 'inicio' | 'progreso' | 'clase-libre' | 'examen' | 'cuenta';
}

/**
 * SidebarButton Component
 *
 * A reusable button component for sidebar navigation with icons and labels.
 * Supports 5 different types: inicio, progreso, clase-libre, examen, cuenta.
 *
 * @example
 * ```tsx
 * <SidebarButton type="inicio" selected={true} onClick={handleClick} />
 * <SidebarButton type="progreso" selected={false} onClick={handleClick} />
 * ```
 */
export const SidebarButton = React.forwardRef<
  HTMLButtonElement,
  SidebarButtonProps
>(({ className, selected, type, ...props }, ref) => {
  // Map type to icon and label
  const getIconAndLabel = () => {
    switch (type) {
      case 'inicio':
        return {
          icon: <Home className="w-5 h-5" style={{ color: '#95C16B' }} />,
          label: 'Inicio',
        };
      case 'progreso':
        return {
          icon: <TrendingUp className="w-5 h-5" style={{ color: '#95C16B' }} />,
          label: 'Mi Progreso',
        };
      case 'clase-libre':
        return {
          icon: <BookOpen className="w-5 h-5" style={{ color: '#95C16B' }} />,
          label: 'Clase Libre',
        };
      case 'examen':
        return {
          icon: <FileText className="w-5 h-5" style={{ color: '#95C16B' }} />,
          label: 'Examen',
        };
      case 'cuenta':
        return {
          icon: <User className="w-5 h-5" style={{ color: '#95C16B' }} />,
          label: 'Mi Cuenta',
        };
      default:
        return {
          icon: <Home className="w-5 h-5" style={{ color: '#95C16B' }} />,
          label: 'Inicio',
        };
    }
  };

  const { icon, label } = getIconAndLabel();

  return (
    <button
      ref={ref}
      className={cn(sidebarButtonVariants({ selected }), className)}
      style={{ borderRadius: '100px' }}
      {...props}
    >
      {icon}
      <span className="text-[14px] md:text-[16px] font-medium">{label}</span>
    </button>
  );
});

SidebarButton.displayName = 'SidebarButton';
