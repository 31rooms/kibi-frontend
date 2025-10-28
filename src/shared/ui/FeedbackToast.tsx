'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/lib/context';

const feedbackVariants = cva(
  'relative flex items-center gap-3 px-6 py-4 bg-white dark:bg-[#272E3A] rounded-[20px] shadow-[0px_12px_40px_15px_#0000001A] transition-opacity duration-300',
  {
    variants: {
      variant: {
        success: '',
        failed: '',
      },
    },
    defaultVariants: {
      variant: 'success',
    },
  }
);

export interface FeedbackToastProps extends VariantProps<typeof feedbackVariants> {
  message: string;
  className?: string;
  onHide?: () => void;
  /** Duration to show the toast in milliseconds (default: 1000ms) */
  duration?: number;
}

export const FeedbackToast = ({
  variant = 'success',
  message,
  className,
  onHide,
  duration = 1000,
}: FeedbackToastProps) => {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in
    setIsVisible(true);

    // Auto hide after specified duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Call onHide callback after fade out completes
      setTimeout(() => {
        onHide?.();
      }, 300); // Match transition duration
    }, duration);

    return () => clearTimeout(timer);
  }, [onHide, duration]);

  const iconSrc =
    variant === 'success'
      ? '/icons/succes-icon.svg'
      : '/icons/error-icon.svg';

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {/* Feedback Card */}
      <div className={cn(feedbackVariants({ variant }))}>
        {/* Icon */}
        <div className="flex-shrink-0">
          <Image src={iconSrc} alt={variant || ''} width={36} height={36} />
        </div>

        {/* Message */}
        <p className="text-dark-900 dark:text-white font-medium text-base leading-snug max-w-sm">
          {message}
        </p>

        {/* Triangle/Bonete - pointing down */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
          style={{
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: isDarkMode ? '12px solid #272E3A' : '12px solid white',
            filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.05))',
          }}
        />
      </div>

      {/* Kibi Icon */}
      <div className="flex-shrink-0">
        <Image
          src={isDarkMode ? "/illustrations/Kibi Icon blanco.svg" : "/illustrations/Kibi Icon.svg"}
          alt="Kibi"
          width={80}
          height={80}
        />
      </div>
    </div>
  );
};
