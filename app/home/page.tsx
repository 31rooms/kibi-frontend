'use client';

import { Suspense } from 'react';
import { DashboardLayout } from '@/features/dashboard';

// Force dynamic rendering to avoid SSR issues with useSearchParams
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0A0F1E]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
      </div>
    }>
      <DashboardLayout />
    </Suspense>
  );
}
