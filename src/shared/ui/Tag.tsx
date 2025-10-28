import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';

const tagVariants = cva(
  'inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full transition-colors',
  {
    variants: {
      variant: {
        solid: '',
        outline: 'bg-transparent border',
        subtle: 'border border-transparent',
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
        className: 'bg-grey-100 text-dark-700 dark:text-grey-300',
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
        className: 'border-dark-900 text-dark-900 dark:text-white',
      },
      {
        variant: 'outline',
        color: 'gray',
        className: 'border-grey-500 text-grey-500 dark:text-grey-400',
      },
      {
        variant: 'outline',
        color: 'light',
        className: 'border-grey-300 text-grey-700 dark:text-grey-300',
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
        className: 'bg-dark-50 text-dark-700 dark:text-grey-300',
      },
      {
        variant: 'subtle',
        color: 'gray',
        className: 'bg-grey-100 text-grey-700 dark:text-grey-300',
      },
      {
        variant: 'subtle',
        color: 'light',
        className: 'bg-grey-50 text-grey-600 dark:text-grey-400',
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
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
    },
  }
);

export interface TagProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof tagVariants> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onRemove?: () => void;
  removable?: boolean;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, color, children, icon, onRemove, removable, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(tagVariants({ variant, color }), className)}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {(removable || onRemove) && (
          <button
            type="button"
            onClick={onRemove}
            className="flex-shrink-0 hover:opacity-70 transition-opacity ml-1 -mr-1"
            aria-label="Remove tag"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';
