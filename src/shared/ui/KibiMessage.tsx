'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/lib/context';
import { KibiIcon } from './KibiIcon';

const kibiMessageVariants = cva(
  'relative flex items-center gap-3 px-6 py-4 rounded-[20px] transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'bg-[#E7FFE7] dark:bg-[#1E242D]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface KibiMessageProps extends VariantProps<typeof kibiMessageVariants> {
  /** Contenido del mensaje (puede ser string o JSX para texto customizado) */
  message: string | React.ReactNode;
  className?: string;
  /** Tamaño del icono de Kibi (default: 80) */
  iconSize?: number;
  /** Tamaño del texto en px (default: 23) */
  textSize?: number;
}

export const KibiMessage = ({
  variant = 'default',
  message,
  className,
  iconSize = 80,
  textSize = 23,
}: KibiMessageProps) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4',
        className
      )}
    >
      {/* Burbuja de mensaje */}
      <div className={cn(kibiMessageVariants({ variant }))}>
        {/* Message */}
        <div
          className="text-dark-900 dark:text-white leading-snug max-w-sm whitespace-pre-line text-center font-[family-name:var(--font-rubik)]"
          style={{ fontSize: `${textSize}px` }}
        >
          {message}
        </div>

        {/* Triangle/Bonete - pointing down */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
          style={{
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: isDarkMode ? '12px solid #1E242D' : '12px solid #E7FFE7',
          }}
        />
      </div>

      {/* Kibi Icon */}
      <div className="flex-shrink-0">
        <KibiIcon size={iconSize} />
      </div>
    </div>
  );
};
