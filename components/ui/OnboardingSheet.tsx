import React from 'react';
import { cn } from '@/lib/utils';
import { PageIndicator } from './PageIndicator';
import { CircleButton } from './CircleButton';
import { ArrowLeft } from 'lucide-react';

export interface OnboardingSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNextButton?: boolean;
  showPreviousButton?: boolean;
}

export const OnboardingSheet = React.forwardRef<HTMLDivElement, OnboardingSheetProps>(
  ({
    title,
    description,
    currentPage,
    totalPages,
    onPageChange,
    onNext,
    onPrevious,
    showNextButton = true,
    showPreviousButton = false,
    className,
    children,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full h-full bg-[#2C3241] rounded-t-[40px] shadow-strong p-6',
          'flex flex-col gap-4',
          className
        )}
        {...props}
      >
        <PageIndicator
          totalPages={totalPages}
          currentPage={currentPage}
          onPageClick={onPageChange}
        />

        <div className="flex flex-col gap-3">
          <h1 className="text-[29px] font-bold text-white leading-[normal] font-[family-name:var(--font-quicksand)]">
            {title}
          </h1>
          <p className="text-[16px] text-grey-400 leading-[22px] font-[family-name:var(--font-rubik)]">
            {description}
          </p>
        </div>

        {/* Navegación con flechas - DENTRO del sheet */}
        <div className={cn(
          "flex items-center gap-4 mt-2",
          showPreviousButton && showNextButton ? "justify-between" : "justify-center"
        )}>
          {/* Flecha ANTERIOR (izquierda) - outline gris */}
          {showPreviousButton && onPrevious && (
            <button
              onClick={onPrevious}
              className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-grey-400 text-grey-400 hover:bg-grey-700/20 transition-all flex-shrink-0"
              aria-label="Anterior"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Flecha SIGUIENTE (derecha) - verde filled */}
          {showNextButton && onNext && (
            <CircleButton
              onClick={onNext}
              aria-label="Siguiente"
              size="large"
              variant="primary"
              color="green"
            />
          )}
        </div>

        {children && <div className="flex flex-col gap-3 mt-2">{children}</div>}
      </div>
    );
  }
);

OnboardingSheet.displayName = 'OnboardingSheet';
