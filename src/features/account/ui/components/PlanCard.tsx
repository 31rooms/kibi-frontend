'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { PlanData } from '../utils/planHelpers';

interface PlanCardProps {
  plan: PlanData;
  hideTag?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, hideTag = false }) => {
  const getPlanStyles = () => {
    if (plan.name.includes('Oro')) {
      return {
        bg: 'bg-[#FFFAE6] dark:bg-[#FFC80033]',
        border: 'border-[#E8B600] dark:border-[#FFC800]',
        separator: 'border-[#E8B600] dark:border-[#FFC800]',
        icon: 'text-[#E8B600] dark:text-[#FFC800]'
      };
    } else if (plan.name.includes('Diamante')) {
      return {
        bg: 'bg-[#EAF0FE] dark:bg-[#2D68F833]',
        border: 'border-[#2D68F8]',
        separator: 'border-[#2D68F8]',
        icon: 'text-[#2D68F8]'
      };
    } else {
      return {
        bg: 'bg-[#E7FFE7] dark:bg-[#1DA53433]',
        border: 'border-[#47830E] dark:border-[#95C16B]',
        separator: 'border-[#47830E] dark:border-[#95C16B]',
        icon: 'text-[#47830E] dark:text-[#95C16B]'
      };
    }
  };

  const styles = getPlanStyles();

  return (
    <div className={cn('relative pt-8 pb-6 px-6 rounded-[8px] border', styles.bg, styles.border)}>
      {/* Header: Icon + Name + Price */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={plan.colors.border} />
            </svg>
          </div>
          <h3 className="text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
            {plan.name}
          </h3>
        </div>
        <span className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
          {plan.price}
        </span>
      </div>

      {/* Separator */}
      <div className={cn('border-b mb-4 opacity-30', styles.separator)}></div>

      {/* Features List */}
      <div className="space-y-2">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <CheckCircle className={cn('h-5 w-5 flex-shrink-0', styles.icon)} />
            <span className="text-[13px] text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
