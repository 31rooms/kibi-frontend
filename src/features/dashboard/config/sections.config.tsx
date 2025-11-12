/**
 * Dashboard Sections Configuration
 * Centralized configuration for all dashboard sections
 *
 * This pattern makes it easy to:
 * - Add new sections (just add one entry)
 * - Remove sections (remove one entry)
 * - See all available sections at a glance
 * - Maintain type safety
 */

import React from 'react';
import { InicioSection } from '@/features/home';
import { ProgresoSection } from '@/features/progress';
import { ClaseLibreSection } from '@/features/free-class';
import { ExamenSection } from '@/features/exam';
import { ExamSimulationSection } from '@/features/exam-simulation';
import { AccountSection } from '@/features/account';
import { DailySessionSection } from '@/features/daily-session';
import { LessonSection } from '@/features/lesson';
import { KibibotSection } from '@/features/kibibot';
import type { SectionType } from '../types/dashboard.types';

/**
 * Type for section components
 * All section components must accept a ref prop
 */
type SectionComponent = React.ForwardRefExoticComponent<
  React.RefAttributes<HTMLElement>
>;

/**
 * Section Components Registry
 * Maps section IDs to their corresponding React components
 *
 * To add a new section:
 * 1. Import the section component at the top
 * 2. Add a new entry here: 'section-id': SectionComponent
 * 3. Add the section ID to SectionType in dashboard.types.ts
 */
export const SECTION_COMPONENTS: Record<SectionType, SectionComponent> = {
  'inicio': InicioSection,
  'progreso': ProgresoSection,
  'clase-libre': ClaseLibreSection,
  'examen': ExamenSection,
  'exam-simulation': ExamSimulationSection,
  'cuenta': AccountSection,
  'daily-session': DailySessionSection,
  'lesson': LessonSection,
  'kibibot': KibibotSection,
} as const;

/**
 * Default section to show when an invalid section is requested
 */
export const DEFAULT_SECTION: SectionType = 'inicio';

/**
 * Helper function to get a section component
 * Returns the requested section or the default section if not found
 */
export const getSectionComponent = (section: SectionType): SectionComponent => {
  return SECTION_COMPONENTS[section] || SECTION_COMPONENTS[DEFAULT_SECTION];
};
