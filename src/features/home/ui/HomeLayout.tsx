'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { useHomeNavigation } from '../hooks/useHomeNavigation';
import { HomeTopMenu } from './HomeTopMenu';
import { SidebarNavigation } from './SidebarNavigation';
import { HomeContent } from './HomeContent';
import type { HomeLayoutProps } from '../types/home.types';

/**
 * Home Layout Component
 * Main layout for the home dashboard with top menu, sidebar, and content area
 */
export const HomeLayout = React.forwardRef<HTMLDivElement, HomeLayoutProps>(
  ({ className }, ref) => {
    const { selectedSection, setSelectedSection, handleLogout } =
      useHomeNavigation();

    return (
      <div ref={ref} className={cn('min-h-screen bg-grey-50 flex flex-col', className)}>
        {/* Top Navigation */}
        <HomeTopMenu
          logoSrc="/illustrations/logo.svg"
          logoText="Kibi"
          streakCount={5}
          onStreakClick={() => console.log('Streak clicked')}
          onThemeToggle={() => console.log('Theme toggled')}
          onMenuClick={() => console.log('Menu clicked')}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <SidebarNavigation
            selectedSection={selectedSection}
            onSectionChange={setSelectedSection}
            onLogout={handleLogout}
          />

          {/* Main Content */}
          <HomeContent selectedSection={selectedSection} />
        </div>
      </div>
    );
  }
);

HomeLayout.displayName = 'HomeLayout';
