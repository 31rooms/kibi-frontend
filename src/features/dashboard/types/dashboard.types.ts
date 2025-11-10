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

export type SectionType =
  | 'inicio'
  | 'progreso'
  | 'clase-libre'
  | 'examen'
  | 'exam-simulation'
  | 'cuenta'
  | 'daily-session'
  | 'lesson';

export interface DashboardLayoutProps {
  className?: string;
  /**
   * Optional children to render custom content instead of DashboardContent
   * If provided, the layout will render children instead of using the section-based navigation
   */
  children?: React.ReactNode;
}

export interface DashboardSidebarProps {
  selectedSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  onLogout: () => void;
}

export interface DashboardContentProps {
  selectedSection: SectionType;
}
