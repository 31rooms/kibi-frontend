/**
 * Home Feature - Public API
 * Barrel export for the home dashboard feature
 */

// Main Section Component (primary export)
export { InicioSection } from './ui/InicioSection';

// Dashboard Widgets
export { DashboardWidgets } from './components/DashboardWidgets';

// Hooks
export { useMySubjects } from './hooks/useMySubjects';

// API Services (if needed externally)
export { careersAPI } from './api/careers-service';

// Types
export type * from './types/home.types';
export type * from './types/careers.types';
