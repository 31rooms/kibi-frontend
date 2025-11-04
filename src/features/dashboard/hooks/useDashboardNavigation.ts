'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SectionType } from '../types/dashboard.types';

/**
 * Custom hook for managing dashboard navigation state and actions
 * Note: URL query parameter support temporarily disabled to fix SSR build issues
 */
export function useDashboardNavigation() {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<SectionType>('inicio');

  const handleLogout = () => {
    // TODO: Implement full logout logic (clear tokens, clear auth context, etc.)
    router.push('/auth/login');
  };

  return {
    selectedSection,
    setSelectedSection,
    handleLogout,
  };
}
