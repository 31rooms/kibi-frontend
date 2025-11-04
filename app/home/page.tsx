'use client';

import { DashboardLayout } from '@/features/dashboard';

// Force dynamic rendering to avoid SSR issues with useSearchParams
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return <DashboardLayout />;
}
