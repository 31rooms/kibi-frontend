import React from 'react';
import { cn } from '@/lib/utils';

export interface OnboardingSlideProps extends React.HTMLAttributes<HTMLDivElement> {
  illustration?: React.ReactNode;
  illustrationAlt?: string;
  backgroundColor?: string;
}

export const OnboardingSlide = React.forwardRef<HTMLDivElement, OnboardingSlideProps>(
  ({ illustration, illustrationAlt = 'Onboarding illustration', backgroundColor = 'var(--color-primary-blue)', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative w-full h-full flex flex-col', className)}
        style={{ backgroundColor }}
        {...props}
      >
        {/* Illustration area - takes remaining space */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12">
          {illustration ? (
            illustration
          ) : (
            <div className="w-full max-w-md aspect-square flex items-center justify-center">
              <div className="text-white/20 text-center">
                <svg
                  className="w-48 h-48 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-4 text-sm">{illustrationAlt}</p>
              </div>
            </div>
          )}
        </div>

        {/* Content sheet at bottom */}
        <div className="w-full">{children}</div>
      </div>
    );
  }
);

OnboardingSlide.displayName = 'OnboardingSlide';
