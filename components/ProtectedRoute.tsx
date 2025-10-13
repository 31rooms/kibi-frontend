'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      // Store the attempted URL to redirect after login
      const returnUrl = pathname;
      const loginUrl = `/auth/login${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`;
      router.push(loginUrl);
    }
  }, [isAuthenticated, isLoading, requireAuth, router, pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin" />
          <p className="text-dark-600 font-[family-name:var(--font-rubik)]">Cargando...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and auth is required, don't render children
  // (redirect will happen in useEffect)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}