import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'text-white shadow-sm hover:shadow-md active:shadow-sm',
        default: 'text-white shadow-sm hover:shadow-md active:shadow-sm', // Alias for primary
        secondary: 'bg-transparent border-2 hover:bg-opacity-10 active:bg-opacity-20 dark:bg-[#171B22] dark:border-[#374151] dark:text-white',
        outline: 'bg-transparent border-2 hover:bg-opacity-10 active:bg-opacity-20 dark:bg-[#171B22] dark:border-[#374151] dark:text-white', // Alias for secondary
        text: 'bg-transparent hover:bg-opacity-10 active:bg-opacity-20',
        elevated: 'text-white shadow-strong hover:shadow-bubble active:shadow-sm',
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md active:bg-red-800 active:shadow-sm focus-visible:ring-red-500',
      },
      color: {
        green: '',
        blue: '',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-full', // Alias
        small: 'h-9 px-4 text-sm rounded-full',
        md: 'h-11 px-6 text-base rounded-full', // Alias
        medium: 'h-11 px-6 text-base rounded-full',
        lg: 'h-[52px] px-8 text-lg rounded-full', // Alias
        large: 'h-[52px] px-8 text-lg rounded-full',
      },
    },
    compoundVariants: [
      // Primary + Green
      {
        variant: 'primary',
        color: 'green',
        className: 'bg-[var(--color-button-green-default)] hover:bg-[#3a6b0b] active:bg-[#2d5309] focus-visible:ring-[var(--color-primary-green)]',
      },
      // Primary + Blue
      {
        variant: 'primary',
        color: 'blue',
        className: 'bg-[var(--color-primary-blue)] hover:bg-[#2b3249] active:bg-[#1a1f2e] focus-visible:ring-[var(--color-primary-blue)]',
      },
      // Default (alias for Primary) + Green
      {
        variant: 'default',
        color: 'green',
        className: 'bg-[var(--color-button-green-default)] hover:bg-[#3a6b0b] active:bg-[#2d5309] focus-visible:ring-[var(--color-primary-green)]',
      },
      // Default (alias for Primary) + Blue
      {
        variant: 'default',
        color: 'blue',
        className: 'bg-[var(--color-primary-blue)] hover:bg-[#2b3249] active:bg-[#1a1f2e] focus-visible:ring-[var(--color-primary-blue)]',
      },
      // Secondary + Green
      {
        variant: 'secondary',
        color: 'green',
        className: 'border-[var(--color-button-green-default)] text-[var(--color-button-green-default)] hover:bg-[var(--color-button-green-default)] active:bg-[var(--color-button-green-default)]',
      },
      // Secondary + Blue
      {
        variant: 'secondary',
        color: 'blue',
        className: 'border-[var(--color-primary-blue)] text-[var(--color-primary-blue)] hover:bg-[var(--color-primary-blue)] active:bg-[var(--color-primary-blue)]',
      },
      // Outline (alias for Secondary) + Green
      {
        variant: 'outline',
        color: 'green',
        className: 'border-[var(--color-button-green-default)] text-[var(--color-button-green-default)] hover:bg-[var(--color-button-green-default)] active:bg-[var(--color-button-green-default)]',
      },
      // Outline (alias for Secondary) + Blue
      {
        variant: 'outline',
        color: 'blue',
        className: 'border-[var(--color-primary-blue)] text-[var(--color-primary-blue)] hover:bg-[var(--color-primary-blue)] active:bg-[var(--color-primary-blue)]',
      },
      // Text + Green
      {
        variant: 'text',
        color: 'green',
        className: 'text-[var(--color-button-green-default)] hover:bg-[var(--color-button-green-default)] active:bg-[var(--color-button-green-default)]',
      },
      // Text + Blue
      {
        variant: 'text',
        color: 'blue',
        className: 'text-[var(--color-primary-blue)] hover:bg-[var(--color-primary-blue)] active:bg-[var(--color-primary-blue)]',
      },
      // Elevated + Green
      {
        variant: 'elevated',
        color: 'green',
        className: 'bg-[var(--color-button-green-default)] hover:bg-[#3a6b0b] active:bg-[#2d5309] focus-visible:ring-[var(--color-primary-green)]',
      },
      // Elevated + Blue
      {
        variant: 'elevated',
        color: 'blue',
        className: 'bg-[var(--color-primary-blue)] hover:bg-[#2b3249] active:bg-[#1a1f2e] focus-visible:ring-[var(--color-primary-blue)]',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      color: 'green',
      size: 'medium',
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, color, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, color, size }), className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
