'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { useDashboardNavigation } from '../hooks/useDashboardNavigation';
import { useAuth } from '@/features/authentication';
import { useMySubjects } from '@/features/home/hooks/useMySubjects';
import { useActivityTracker } from '@/features/progress/hooks/useActivityTracker';
import { DashboardTopMenu } from './DashboardTopMenu';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardContent } from './DashboardContent';
import { Button } from '@/shared/ui/Button';
import { KibiMessage } from '@/shared/ui/KibiMessage';
import { LoadingScreen } from '@/shared/ui/LoadingScreen';
import { ArrowRight } from 'lucide-react';
import type { DashboardLayoutProps } from '../types/dashboard.types';

/**
 * Dashboard Layout Component
 * Main layout for the dashboard with top menu, sidebar, and content area
 * Orchestrates navigation between different sections (inicio, progreso, clase-libre, examen, cuenta)
 */
export const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  ({ className, children }, ref) => {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const { isLoading: isSubjectsLoading } = useMySubjects();
    const { selectedSection, setSelectedSection, handleLogout } =
      useDashboardNavigation();

    // Track user activity time
    useActivityTracker({ enabled: !!user && !isAuthLoading });

    // Show loading screen while user data or subjects are being fetched
    if (isAuthLoading || !user || isSubjectsLoading) {
      return <LoadingScreen />;
    }

    // Check if diagnostic test is not completed
    const needsDiagnostic = !user?.diagnosticCompleted;

    // Handle diagnostic test button click
    const handleStartDiagnostic = () => {
      router.push('/form-diagnostic-test');
    };

    return (
      <div ref={ref} className={cn('h-screen flex flex-col relative overflow-hidden', className)}>
        {/* Top Navigation */}
        <DashboardTopMenu
          logoSrc="/illustrations/logo.svg"
          logoText="Kibi"
          streakCount={5}
          selectedSection={selectedSection}
          onSectionChange={setSelectedSection}
          onLogout={handleLogout}
          onStreakClick={() => console.log('Streak clicked')}
          onMenuClick={() => console.log('Menu clicked')}
        />
        {/* Note: logoSrc will automatically switch to logo-dark.svg in dark mode */}

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden bg-grey-50 dark:bg-[#171B22]">
          {/* Sidebar */}
          <DashboardSidebar
            selectedSection={selectedSection}
            onSectionChange={setSelectedSection}
            onLogout={handleLogout}
          />

          {/* Main Content - either custom children or section-based navigation */}
          {children || <DashboardContent selectedSection={selectedSection} />}
        </div>

        {/* Diagnostic Test Overlay - Show when diagnostic is not completed */}
        {needsDiagnostic && (
          <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/70 dark:bg-[#0A0F1E]/70">
            <div className="flex flex-col items-center gap-6">
              <KibiMessage
                message={`Inicia tu Test Diagnóstico para\ndesbloquear esta pantalla`}
                iconSize={80}
                textSize={18}
              />
              <Button
                onClick={handleStartDiagnostic}
                variant="primary"
                size="md"
              >
                Iniciar Test Diagnóstico
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DashboardLayout.displayName = 'DashboardLayout';
