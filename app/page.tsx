'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/shared/ui';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if onboarding has been completed
    const hasCompletedOnboarding = localStorage.getItem('kibi_onboarding_completed');

    if (hasCompletedOnboarding) {
      // If already completed, redirect to login
      router.push('/auth/login');
    } else {
      // Otherwise, redirect to onboarding after 2 seconds
      const timer = setTimeout(() => {
        router.push('/onboarding');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-primary-blue)]">
      <div className="flex flex-col items-center gap-8 animate-fade-in">
        {/* Logo de Kibi */}
        <Logo size="large" white />

        {/* Loading indicator */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-white dark:bg-[#171B22]/80 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-white dark:bg-[#171B22]/80 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-white dark:bg-[#171B22]/80 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
