'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { useDashboardNavigation } from '../hooks/useDashboardNavigation';
import { useAuth } from '@/features/authentication';
import { DashboardTopMenu } from './DashboardTopMenu';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardContent } from './DashboardContent';
import { Button } from '@/shared/ui/Button';
import { KibiMessage } from '@/shared/ui/KibiMessage';
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
    const { user } = useAuth();
    const { selectedSection, setSelectedSection, handleLogout } =
      useDashboardNavigation();

    // Check if diagnostic test is not completed
    const needsDiagnostic = !user?.diagnosticCompleted;

    // Handle diagnostic test button click
    const handleStartDiagnostic = () => {
      router.push('/form-diagnostic-test');
    };

    return (
      <div ref={ref} className={cn('h-screen flex flex-col relative', className)}>
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
