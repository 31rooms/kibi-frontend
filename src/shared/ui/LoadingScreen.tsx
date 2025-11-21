'use client';

import Image from 'next/image';
import { useTheme } from '@/shared/lib/context';

export interface LoadingScreenProps {
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Full screen loading component with Kibi logo and animated dots
 * Automatically switches logo based on dark/light mode
 */
export const LoadingScreen = ({ className }: LoadingScreenProps) => {
  const { isDarkMode } = useTheme();

  const logoSrc = isDarkMode
    ? '/illustrations/kibi logo blanco.svg'
    : '/illustrations/kibi logo dark.svg';

  return (
    <div className={`flex items-center justify-center min-h-screen bg-white dark:bg-[#171B22] ${className || ''}`}>
      <div className="flex flex-col items-center gap-8 animate-fade-in">
        {/* Logo de Kibi */}
        <Image
          src={logoSrc}
          alt="Kibi"
          width={200}
          height={80}
          priority
        />

        {/* Loading indicator */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};
