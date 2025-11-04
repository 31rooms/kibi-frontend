/**
 * Dashboard Feature - Public API
 * Main dashboard layout that orchestrates all sections
 */

// Main Layout (primary export)
export { DashboardLayout } from './ui/DashboardLayout';

// UI Components
export { DashboardTopMenu } from './ui/DashboardTopMenu';
export { DashboardSidebar } from './ui/DashboardSidebar';
export { DashboardContent } from './ui/DashboardContent';

// Legacy components (if still needed)
export { DashboardHeader } from './ui/DashboardHeader';
export { UserInfoCard } from './ui/UserInfoCard';
export { PlaceholderCard } from './ui/PlaceholderCard';

// Configuration (for advanced use cases)
export { SECTION_COMPONENTS, DEFAULT_SECTION, getSectionComponent } from './config/sections.config';

// Hooks
export { useDashboardNavigation } from './hooks/useDashboardNavigation';

// Types
export type * from './types/dashboard.types';
