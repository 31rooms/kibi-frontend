import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const alertVariants = cva(
  'w-full rounded-lg border p-4 flex items-start gap-3 font-[family-name:var(--font-rubik)]',
  {
    variants: {
      variant: {
        default: 'bg-grey-50 text-dark-900 border-grey-200 dark:bg-grey-800 dark:text-white dark:border-grey-700',
        destructive:
          'border-error-300 bg-error-50 text-error-900 dark:border-error-700 dark:bg-error-900 dark:text-error-50',
        success:
          'border-success-300 bg-success-50 text-success-900 dark:border-success-700 dark:bg-success-900 dark:text-success-50',
        warning:
          'border-warning-300 bg-warning-50 text-warning-900 dark:border-warning-700 dark:bg-warning-900 dark:text-warning-50',
        info:
          'border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const iconVariants = cva(
  'h-5 w-5 flex-shrink-0 mt-0.5',
  {
    variants: {
      variant: {
        default: 'text-grey-600 dark:text-grey-400',
        destructive: 'text-error-600 dark:text-error-400',
        success: 'text-success-600 dark:text-success-400',
        warning: 'text-warning-600 dark:text-warning-400',
        info: 'text-blue-600 dark:text-blue-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, children, ...props }, ref) => {
  const Icon = {
    destructive: XCircle,
    success: CheckCircle,
    warning: AlertCircle,
    info: Info,
    default: null,
  }[variant || 'default'];

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {Icon && <Icon className={iconVariants({ variant })} />}
      <div className="flex-1 text-sm">
        {children}
      </div>
    </div>
  );
});
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight font-[family-name:var(--font-rubik)]', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed font-[family-name:var(--font-rubik)]', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };