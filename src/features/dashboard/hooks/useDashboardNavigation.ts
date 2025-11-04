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

  // Initialize section from URL query parameter or default to 'inicio'
  const getInitialSection = (): SectionType => {
    const sectionParam = searchParams?.get('section') as SectionType | null;
    const validSections: SectionType[] = [
      'inicio',
      'progreso',
      'clase-libre',
      'examen',
      'cuenta',
      'daily-session',
      'lesson',
    ];

    if (sectionParam && validSections.includes(sectionParam)) {
      console.log('🔍 useDashboardNavigation - Initial section from URL:', sectionParam);
      return sectionParam;
    }

    return 'inicio';
  };

  const [selectedSection, setSelectedSection] = useState<SectionType>(getInitialSection);

  // Update section when URL changes
  useEffect(() => {
    const sectionParam = searchParams?.get('section') as SectionType | null;
    console.log('🔍 useDashboardNavigation - URL section param changed:', sectionParam);

    if (sectionParam) {
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
        console.log('✅ useDashboardNavigation - Setting section to:', sectionParam);
        setSelectedSection(sectionParam);
      }
    } else {
      // If no section param, default to inicio
      setSelectedSection('inicio');
    }
  }, [searchParams]);

  // Wrapper function to update both state AND URL
  const handleSectionChange = (section: SectionType) => {
    setSelectedSection(section);

    // Update URL based on section
    if (section === 'inicio') {
      router.push('/home');
    } else {
      router.push(`/home?section=${section}`);
    }
  };

  const handleLogout = () => {
    // TODO: Implement full logout logic (clear tokens, clear auth context, etc.)
    router.push('/auth/login');
  };

  return {
    selectedSection,
    setSelectedSection: handleSectionChange,
    handleLogout,
  };
}
