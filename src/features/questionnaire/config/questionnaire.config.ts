/**
 * Questionnaire Configuration
 *
 * General configuration for questionnaires feature
 */

/**
 * Default questionnaire settings
 */
export const QUESTIONNAIRE_CONFIG = {
  /** Default time per question in seconds */
  defaultTimePerQuestion: 40,

  /** Whether to allow reviewing previous questions */
  allowReview: true,

  /** Whether to show timer */
  showTimer: true,

  /** Whether to show progress indicator */
  showProgress: true,

  /** Minimum passing score percentage */
  passingScorePercentage: 70,

  /** Number of questions per questionnaire */
  questionsPerQuiz: 10,
} as const;

/**
 * Achievement thresholds
 */
export const ACHIEVEMENT_THRESHOLDS = {
  basic: 0,
  intermediate: 50,
  advanced: 80,
} as const;

/**
 * Get level name based on score
 */
export function getLevelName(score: number): string {
  if (score >= ACHIEVEMENT_THRESHOLDS.advanced) return 'Avanzado';
  if (score >= ACHIEVEMENT_THRESHOLDS.intermediate) return 'Intermedio';
  return 'Básico';
}
