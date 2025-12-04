'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { SectionType } from '../types/dashboard.types';

/**
 * Custom hook for managing dashboard navigation state and actions
 * Supports initializing the section from URL query parameters or pathname
 */
export function useDashboardNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize section from URL query parameter, pathname, or default to 'inicio'
  const getInitialSection = (): SectionType => {
    // First check pathname for specific routes
    if (pathname?.startsWith('/free-class')) {
      return 'clase-libre';
    }
    if (pathname?.startsWith('/daily-session')) {
      return 'daily-session';
    }

    const sectionParam = searchParams?.get('section') as SectionType | null;
    const validSections: SectionType[] = [
      'inicio',
      'progreso',
      'clase-libre',
      'examen',
      'exam-simulation',
      'cuenta',
      'daily-session',
      'lesson',
      'kibibot',
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
    // First check pathname for specific routes
    if (pathname?.startsWith('/free-class')) {
      setSelectedSection('clase-libre');
      return;
    }
    if (pathname?.startsWith('/daily-session')) {
      setSelectedSection('daily-session');
      return;
    }

    const sectionParam = searchParams?.get('section') as SectionType | null;
    console.log('🔍 useDashboardNavigation - URL section param changed:', sectionParam);

    if (sectionParam) {
      const validSections: SectionType[] = [
        'inicio',
        'progreso',
        'clase-libre',
        'examen',
        'exam-simulation',
        'cuenta',
        'daily-session',
        'lesson',
        'kibibot',
      ];
      if (validSections.includes(sectionParam)) {
        console.log('✅ useDashboardNavigation - Setting section to:', sectionParam);
        setSelectedSection(sectionParam);
      }
    } else {
      // If no section param, default to inicio
      setSelectedSection('inicio');
    }
  }, [searchParams, pathname]);

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
