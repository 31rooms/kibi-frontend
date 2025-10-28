import React from 'react';
import { Logo } from '@/shared/ui';

export interface AuthLayoutProps {
  children: React.ReactNode;
  showLogo?: boolean;
}

/**
 * AuthLayout - Reusable 2-column layout for authentication pages
 * Left: Abstract gradient background with logo
 * Right: Form content
 */
export const AuthLayout = React.forwardRef<HTMLDivElement, AuthLayoutProps>(
  ({ children, showLogo = true }, ref) => {
    return (
      <div ref={ref} className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT COLUMN - Illustration/Image */}
        <div className="hidden lg:flex bg-gradient-to-br from-cyan-400 via-blue-500 to-primary-green relative overflow-hidden items-center justify-center p-12">
          {/* Abstract shapes background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-64 h-64 bg-primary-green/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-cyan-300/20 rounded-full blur-2xl" />
          </div>

          {/* Logo */}
          {showLogo && (
            <div className="relative z-10">
              <Logo size="large" white />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Form Content */}
        <div className="flex items-center justify-center p-6 lg:p-12 bg-white dark:bg-[#171B22]">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            {showLogo && (
              <div className="lg:hidden mb-8 flex justify-center">
                <Logo size="medium" />
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    );
  }
);

AuthLayout.displayName = 'AuthLayout';
