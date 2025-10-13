import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-medium rounded-full transition-colors',
  {
    variants: {
      variant: {
        solid: '',
        outline: 'bg-transparent border',
        subtle: 'border border-transparent',
        text: 'bg-transparent border-transparent',
      },
      color: {
        primary: '',
        'primary-green': '',
        dark: '',
        gray: '',
        light: '',
        warning: '',
        danger: '',
        success: '',
        info: '',
      },
    },
    compoundVariants: [
      // Solid variants
      {
        variant: 'solid',
        color: 'primary',
        className: 'bg-blue-500 text-white',
      },
      {
        variant: 'solid',
        color: 'primary-green',
        className: 'bg-[var(--color-primary-green)] text-white',
      },
      {
        variant: 'solid',
        color: 'dark',
        className: 'bg-dark-900 text-white',
      },
      {
        variant: 'solid',
        color: 'gray',
        className: 'bg-grey-500 text-white',
      },
      {
        variant: 'solid',
        color: 'light',
        className: 'bg-grey-100 text-dark-700',
      },
      {
        variant: 'solid',
        color: 'warning',
        className: 'bg-warning-500 text-white',
      },
      {
        variant: 'solid',
        color: 'danger',
        className: 'bg-error-500 text-white',
      },
      {
        variant: 'solid',
        color: 'success',
        className: 'bg-success-500 text-white',
      },
      {
        variant: 'solid',
        color: 'info',
        className: 'bg-cyan-500 text-white',
      },

      // Outline variants
      {
        variant: 'outline',
        color: 'primary',
        className: 'border-blue-500 text-blue-500',
      },
      {
        variant: 'outline',
        color: 'primary-green',
        className: 'border-[var(--color-primary-green)] text-[var(--color-primary-green)]',
      },
      {
        variant: 'outline',
        color: 'dark',
        className: 'border-dark-900 text-dark-900',
      },
      {
        variant: 'outline',
        color: 'gray',
        className: 'border-grey-500 text-grey-500',
      },
      {
        variant: 'outline',
        color: 'light',
        className: 'border-grey-300 text-grey-700',
      },
      {
        variant: 'outline',
        color: 'warning',
        className: 'border-warning-500 text-warning-500',
      },
      {
        variant: 'outline',
        color: 'danger',
        className: 'border-error-500 text-error-500',
      },
      {
        variant: 'outline',
        color: 'success',
        className: 'border-success-500 text-success-500',
      },
      {
        variant: 'outline',
        color: 'info',
        className: 'border-cyan-500 text-cyan-500',
      },

      // Subtle variants
      {
        variant: 'subtle',
        color: 'primary',
        className: 'bg-blue-50 text-blue-700',
      },
      {
        variant: 'subtle',
        color: 'primary-green',
        className: 'bg-success-50 text-success-700',
      },
      {
        variant: 'subtle',
        color: 'dark',
        className: 'bg-dark-50 text-dark-700',
      },
      {
        variant: 'subtle',
        color: 'gray',
        className: 'bg-grey-100 text-grey-700',
      },
      {
        variant: 'subtle',
        color: 'light',
        className: 'bg-grey-50 text-grey-600',
      },
      {
        variant: 'subtle',
        color: 'warning',
        className: 'bg-warning-50 text-warning-700',
      },
      {
        variant: 'subtle',
        color: 'danger',
        className: 'bg-error-50 text-error-700',
      },
      {
        variant: 'subtle',
        color: 'success',
        className: 'bg-success-50 text-success-700',
      },
      {
        variant: 'subtle',
        color: 'info',
        className: 'bg-cyan-50 text-cyan-700',
      },

      // Text variants
      {
        variant: 'text',
        color: 'primary',
        className: 'text-blue-500',
      },
      {
        variant: 'text',
        color: 'primary-green',
        className: 'text-[var(--color-primary-green)]',
      },
      {
        variant: 'text',
        color: 'dark',
        className: 'text-dark-900',
      },
      {
        variant: 'text',
        color: 'gray',
        className: 'text-grey-500',
      },
      {
        variant: 'text',
        color: 'light',
        className: 'text-grey-400',
      },
      {
        variant: 'text',
        color: 'warning',
        className: 'text-warning-500',
      },
      {
        variant: 'text',
        color: 'danger',
        className: 'text-error-500',
      },
      {
        variant: 'text',
        color: 'success',
        className: 'text-success-500',
      },
      {
        variant: 'text',
        color: 'info',
        className: 'text-cyan-500',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, color, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, color }), className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
