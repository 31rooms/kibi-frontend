'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SidebarType } from '../types/home.types';

/**
 * Custom hook for managing home navigation state and actions
 */
export function useHomeNavigation() {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<SidebarType>('inicio');

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
