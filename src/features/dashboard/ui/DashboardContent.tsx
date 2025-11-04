'use client';

import React from 'react';
import { getSectionComponent } from '../config/sections.config';
import type { DashboardContentProps } from '../types/dashboard.types';

/**
 * Dashboard Content Orchestrator
 * Renders the appropriate section based on selectedSection state
 * Acts as a router between different dashboard sections/features
 *
 * This component uses a configuration-based approach for scalability.
 * To add a new section, simply update the sections.config.tsx file.
 */
export const DashboardContent = React.forwardRef<HTMLElement, DashboardContentProps>(
  ({ selectedSection }, ref) => {
    // 🔍 DEBUG: Log selected section
    console.log('🎯 DashboardContent - selectedSection:', selectedSection);

    // Get the section component from the registry
    const SectionComponent = getSectionComponent(selectedSection);

    // Render the section component with forwarded ref
    return <SectionComponent ref={ref} />;
  }
);

DashboardContent.displayName = 'DashboardContent';
