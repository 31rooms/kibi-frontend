'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { useDashboardNavigation } from '../hooks/useDashboardNavigation';
import { DashboardTopMenu } from './DashboardTopMenu';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardContent } from './DashboardContent';
import type { DashboardLayoutProps } from '../types/dashboard.types';

/**
 * Dashboard Layout Component
 * Main layout for the dashboard with top menu, sidebar, and content area
 * Orchestrates navigation between different sections (inicio, progreso, clase-libre, examen, cuenta)
 */
export const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  ({ className, children }, ref) => {
    const { selectedSection, setSelectedSection, handleLogout } =
      useDashboardNavigation();

    return (
      <div ref={ref} className={cn('h-screen flex flex-col', className)}>
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
      </div>
    );
  }
);

DashboardLayout.displayName = 'DashboardLayout';
