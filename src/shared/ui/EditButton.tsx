import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { SquarePen } from 'lucide-react';

const editButtonVariants = cva(
  // Base styles
  'rounded-full border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0',
  {
    variants: {
      size: {
        small: 'h-8 w-8',
        medium: 'h-9 w-9',
        large: 'h-10 w-10',
        responsive: 'h-8 w-8 lg:h-11 lg:w-11',
      },
      variant: {
        light: 'border-grey-400 bg-white hover:border-primary-green',
        dark: 'border-[#374151] bg-[#1E242D] hover:border-primary-green',
        adaptive: 'border-grey-400 dark:border-[#374151] bg-white dark:bg-[#1E242D] hover:border-primary-green',
      },
    },
    defaultVariants: {
      size: 'medium',
      variant: 'adaptive',
    },
  }
);

const iconSizeMap = {
  small: 'h-4 w-4',
  medium: 'h-4 w-4',
  large: 'h-5 w-5',
  responsive: 'h-4 w-4 lg:h-5 lg:w-5',
};

export interface EditButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof editButtonVariants> {
  iconClassName?: string;
}

/**
 * EditButton Component
 *
 * Circular button with SquarePen icon for edit actions.
 * Supports light mode, dark mode, and automatic adaptation.
 *
 * @example
 * ```tsx
 * // Adaptive (auto dark mode support)
 * <EditButton onClick={() => console.log('Edit')} />
 *
 * // Custom size
 * <EditButton size="large" onClick={() => console.log('Edit')} />
 *
 * // Responsive size
 * <EditButton size="responsive" onClick={() => console.log('Edit')} />
 *
 * // Light mode only
 * <EditButton variant="light" onClick={() => console.log('Edit')} />
 * ```
 */
export const EditButton = React.forwardRef<HTMLButtonElement, EditButtonProps>(
  ({ className, size, variant, iconClassName, ...props }, ref) => {
    const iconSize = size ? iconSizeMap[size] : iconSizeMap.medium;

    return (
      <button
        className={cn(editButtonVariants({ size, variant }), className)}
        ref={ref}
        aria-label="Editar"
        {...props}
      >
        <SquarePen
          className={cn('text-primary-green', iconSize, iconClassName)}
          strokeWidth={2}
        />
      </button>
    );
  }
);

EditButton.displayName = 'EditButton';
