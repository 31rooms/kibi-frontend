'use client';

import React from 'react';
import { InicioSection } from '@/features/home';
import { ProgresoSection } from '@/features/progress';
import { ClaseLibreSection } from '@/features/free-class';
import { ExamenSection } from '@/features/exam';
import { AccountSection } from '@/features/account';
import type { DashboardContentProps } from '../types/dashboard.types';

/**
 * Dashboard Content Orchestrator
 * Renders the appropriate section based on selectedSection state
 * Acts as a router between different dashboard sections/features
 */
export const DashboardContent = React.forwardRef<HTMLElement, DashboardContentProps>(
  ({ selectedSection }, ref) => {
    // Render the appropriate section component
    const renderSection = () => {
      switch (selectedSection) {
        case 'inicio':
          return <InicioSection ref={ref} />;
        case 'progreso':
          return <ProgresoSection ref={ref} />;
        case 'clase-libre':
          return <ClaseLibreSection ref={ref} />;
        case 'examen':
          return <ExamenSection ref={ref} />;
        case 'cuenta':
          return <AccountSection ref={ref} />;
        default:
          return <InicioSection ref={ref} />;
      }
    };

    return <>{renderSection()}</>;
  }
);

DashboardContent.displayName = 'DashboardContent';
