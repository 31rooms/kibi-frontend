'use client';

import React from 'react';
import Image from 'next/image';
import { useTheme } from '@/shared/lib/context';
import { cn } from '@/shared/lib/utils';

export interface KibiIconProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  size?: number | string;
  width?: number;
  height?: number;
}

/**
 * KibiIcon Component
 * Displays the Kibi mascot icon with automatic theme-aware switching
 * Light mode: /illustrations/Kibi Icon.svg (dark version)
 * Dark mode: /illustrations/Kibi Icon blanco.svg (white version)
 */
export const KibiIcon = React.forwardRef<HTMLDivElement, KibiIconProps>(
  ({ size, width, height, className, ...props }, ref) => {
    const { isDarkMode } = useTheme();

    // Determine dimensions
    const iconWidth = width || (typeof size === 'number' ? size : 24);
    const iconHeight = height || (typeof size === 'number' ? size : 24);

    const iconSrc = isDarkMode
      ? '/illustrations/Kibi Icon blanco.svg'
      : '/illustrations/Kibi Icon.svg';

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center justify-center', className)}
        {...props}
      >
        <Image
          src={iconSrc}
          alt="Kibi Icon"
          width={iconWidth}
          height={iconHeight}
          className="object-contain"
        />
      </div>
    );
  }
);

KibiIcon.displayName = 'KibiIcon';
