'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SectionType } from '../types/dashboard.types';

/**
 * Custom hook for managing dashboard navigation state and actions
 * Supports initializing the section from URL query parameters
 */
export function useDashboardNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSection, setSelectedSection] = useState<SectionType>('inicio');

  // Initialize section from URL query parameter if present
  useEffect(() => {
    const sectionParam = searchParams.get('section') as SectionType | null;
    if (sectionParam) {
      // Validate that the section exists in our types
      const validSections: SectionType[] = [
        'inicio',
        'progreso',
        'clase-libre',
        'examen',
        'cuenta',
        'daily-session',
        'lesson',
      ];
      if (validSections.includes(sectionParam)) {
        setSelectedSection(sectionParam);
      }
    }
  }, [searchParams]);

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
