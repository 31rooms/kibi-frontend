'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipRoot = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const tooltipContentVariants = cva(
  'z-50 overflow-hidden rounded-lg px-3 py-1.5 text-sm font-medium shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      variant: {
        default: 'bg-primary-blue text-white',
        dark: 'bg-dark-900 text-white',
        light: 'bg-white text-dark-900 border border-grey-300',
        success: 'bg-success-500 text-white',
        warning: 'bg-warning-500 text-white',
        danger: 'bg-error-500 text-white',
        info: 'bg-cyan-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipContentVariants> {}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, variant, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipContentVariants({ variant }), className)}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Componente compuesto simple para uso común
export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  variant?: TooltipContentProps['variant'];
  delayDuration?: number;
  className?: string;
}

const Tooltip = ({
  children,
  content,
  side = 'top',
  variant = 'default',
  delayDuration = 200,
  className,
}: TooltipProps) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} variant={variant} className={className}>
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
};

export {
  Tooltip,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
};
