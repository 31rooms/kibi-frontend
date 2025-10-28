'use client';

import React from 'react';
import { SidebarButton } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { LogOut } from 'lucide-react';
import type { SidebarNavigationProps } from '../types/home.types';

/**
 * Sidebar Navigation Component
 * Displays navigation buttons for desktop view with logout functionality
 */
export const SidebarNavigation = React.forwardRef<
  HTMLElement,
  SidebarNavigationProps
>(({ selectedSection, onSectionChange, onLogout }, ref) => {
  return (
    <aside
      ref={ref}
      className={cn(
        'w-full max-w-[240px] bg-white dark:bg-[#1E242D] p-4 flex flex-col',
        'border-r border-[#DEE2E6] dark:border-[#374151]',
        'hidden md:flex' // Hidden on mobile, visible on tablet+
      )}
    >
      {/* Navigation Buttons with 24px gap */}
      <div className="flex-1 flex flex-col gap-6" style={{marginTop:'40px'}}>
        <SidebarButton
          type="inicio"
          selected={selectedSection === 'inicio'}
          onClick={() => onSectionChange('inicio')}
        />
        <SidebarButton
          type="progreso"
          selected={selectedSection === 'progreso'}
          onClick={() => onSectionChange('progreso')}
        />
        <SidebarButton
          type="clase-libre"
          selected={selectedSection === 'clase-libre'}
          onClick={() => onSectionChange('clase-libre')}
        />
        <SidebarButton
          type="examen"
          selected={selectedSection === 'examen'}
          onClick={() => onSectionChange('examen')}
        />
        <SidebarButton
          type="cuenta"
          selected={selectedSection === 'cuenta'}
          onClick={() => onSectionChange('cuenta')}
        />
      </div>

      {/* Simple Logout Button */}
      <div className="pt-4 border-t border-grey-200 dark:border-grey-700">
        <button
          onClick={onLogout}
          className={cn(
            'flex items-center gap-2',
            'text-dark-700 dark:text-white hover:text-primary-blue',
            'transition-colors duration-200',
            'font-[family-name:var(--font-rubik)] text-[14px] font-medium'
          )}
          aria-label="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
});

SidebarNavigation.displayName = 'SidebarNavigation';
