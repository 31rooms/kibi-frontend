/**
 * Home Feature - Public API
 * Barrel export for the home dashboard feature
 */

// Main Section Component (primary export)
export { InicioSection } from './ui/InicioSection';

// Dashboard Widgets
export { DashboardWidgets } from './components/DashboardWidgets';

// Legacy exports (deprecated - use dashboard feature instead)
export { HomeLayout } from './ui/HomeLayout';
export { HomeTopMenu } from './ui/HomeTopMenu';
export { SidebarNavigation } from './ui/SidebarNavigation';
export { HomeContent } from './ui/HomeContent';

// Hooks
export { useHomeNavigation } from './hooks/useHomeNavigation';
export { useMySubjects } from './hooks/useMySubjects';

// API Services (if needed externally)
export { careersAPI } from './api/careers-service';

// Types
export type * from './types/home.types';
export type * from './types/careers.types';
