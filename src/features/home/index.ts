/**
 * Home Feature - Public API
 * Barrel export for the home dashboard feature
 */

// Main Layout (primary export)
export { HomeLayout } from './ui/HomeLayout';

// UI Components (if needed externally)
export { HomeTopMenu } from './ui/HomeTopMenu';
export { SidebarNavigation } from './ui/SidebarNavigation';
export { HomeContent } from './ui/HomeContent';

// Hooks
export { useHomeNavigation } from './hooks/useHomeNavigation';

// Types
export type * from './types/home.types';
