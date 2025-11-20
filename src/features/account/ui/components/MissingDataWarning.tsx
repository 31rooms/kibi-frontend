import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface MissingDataWarningProps {
  className?: string;
}

/**
 * Component to show "Completar" with warning icon for missing/incomplete user data
 * The yellow color contrasts well in both light and dark modes
 */
export const MissingDataWarning: React.FC<MissingDataWarningProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-[18px] font-medium text-[#E8B600] dark:text-[#FFC800] font-[family-name:var(--font-rubik)]">
        Completar
      </span>
      <AlertTriangle className="h-5 w-5 text-[#E8B600] dark:text-[#FFC800]" />
    </div>
  );
};
