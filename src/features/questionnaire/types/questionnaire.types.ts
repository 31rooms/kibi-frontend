/**
 * Questionnaire Feature Types
 *
 * Type definitions for subject-specific questionnaires.
 * Extends types from diagnostic-test feature.
 */

import type { QuizConfig, QuizResults } from '@/features/diagnostic-test';

/**
 * Subject information
 */
export interface Subject {
  /** Unique identifier for the subject */
  id: number;

  /** Display name in Spanish */
  name: string;

  /** URL-friendly slug */
  slug: string;

  /** Icon filename */
  iconFilename: string;

  /** Subject description (optional) */
  description?: string;
}

/**
 * Questionnaire configuration for a specific subject
 * Extends QuizConfig with subject-specific metadata
 */
export interface SubjectQuestionnaire {
  /** Subject information */
  subject: Subject;

  /** Quiz configuration */
  config: QuizConfig;

  /** Minimum passing score (optional) */
  passingScore?: number;

  /** Target areas for this questionnaire */
  targetAreas?: string[];
}

/**
 * Questionnaire results with subject context
 */
export interface QuestionnaireResults extends QuizResults {
  /** Subject ID */
  subjectId: number;

  /** Areas of strength identified */
  strengths?: string[];

  /** Areas that need reinforcement */
  areasToReinforce?: string[];

  /** Progress percentage towards next achievement */
  progressPercentage?: number;

  /** Current level achieved */
  currentLevel?: string;
}

/**
 * Achievement/Badge information
 */
export interface Achievement {
  /** Achievement ID */
  id: string;

  /** Achievement name */
  name: string;

  /** Achievement description */
  description: string;

  /** Icon or emoji */
  icon: string;

  /** Progress towards this achievement (0-100) */
  progress: number;
}
