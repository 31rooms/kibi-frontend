export interface DashboardUser {
  email?: string;
  phoneNumber?: string;
  profileComplete?: boolean;
  firstName?: string;
  lastName?: string;
}

export interface DashboardStats {
  coursesCount: number;
  progressPercentage: number;
  completedLessons: number;
}

/**
 * Dashboard Layout Types
 * Types for the main dashboard layout and navigation
 */

export type SectionType = 'inicio' | 'progreso' | 'clase-libre' | 'examen' | 'cuenta';

export interface DashboardLayoutProps {
  className?: string;
}

export interface DashboardSidebarProps {
  selectedSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  onLogout: () => void;
}

export interface DashboardContentProps {
  selectedSection: SectionType;
}
