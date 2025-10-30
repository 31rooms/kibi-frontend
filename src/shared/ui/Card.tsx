import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const cardVariants = cva(
  'rounded-lg transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'border border-grey-500 bg-white dark:border-dark-500 dark:bg-primary-blue',
        elevated: 'border border-grey-500 bg-white shadow-md dark:border-dark-500 dark:bg-primary-blue',
      },
      padding: {
        none: '',
        small: 'p-4',
        medium: 'p-6',
        large: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'medium',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
