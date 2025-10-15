/**
 * Home Feature Types
 * Types for the home dashboard feature
 */

export type SidebarType = 'inicio' | 'progreso' | 'clase-libre' | 'examen' | 'cuenta';

export interface HomeLayoutProps {
  className?: string;
}

export interface SidebarNavigationProps {
  selectedSection: SidebarType;
  onSectionChange: (section: SidebarType) => void;
  onLogout: () => void;
}

export interface HomeContentProps {
  selectedSection: SidebarType;
}
