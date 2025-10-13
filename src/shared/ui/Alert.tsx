import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-grey-200',
        destructive:
          'border-error-300 bg-error-50 text-dark-900 dark:border-error-700 dark:bg-error-900 dark:text-error-50 [&>svg]:text-error-600 dark:[&>svg]:text-error-400',
        success:
          'border-success-300 bg-success-50 text-dark-900 dark:border-success-700 dark:bg-success-900 dark:text-success-50 [&>svg]:text-success-600 dark:[&>svg]:text-success-400',
        warning:
          'border-warning-300 bg-warning-50 text-dark-900 dark:border-warning-700 dark:bg-warning-900 dark:text-warning-50 [&>svg]:text-warning-600 dark:[&>svg]:text-warning-400',
        info:
          'border-blue-300 bg-blue-50 text-dark-900 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-50 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400',
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
      {Icon && <Icon className="h-4 w-4" />}
      {children}
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
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
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
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };