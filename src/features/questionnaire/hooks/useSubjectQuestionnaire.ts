import { useMemo } from 'react';
import type { QuizConfig } from '@/features/diagnostic-test';
import type { Subject } from '../types/questionnaire.types';
import { getQuestionnaireBySubjectId } from '../data/subject-questionnaires.mock';
import { getSubjectById } from '@/features/home/utils/subjectMapping';

export interface UseSubjectQuestionnaireReturn {
  /** Quiz configuration for the subject */
  config: QuizConfig | undefined;

  /** Subject information */
  subjectInfo: Subject | undefined;

  /** Whether the questionnaire is loading (for future API integration) */
  isLoading: boolean;

  /** Error message if questionnaire not found */
  error: string | null;

  /** Whether the subject has a questionnaire available */
  hasQuestionnaire: boolean;
}

/**
 * Hook to get questionnaire data for a specific subject
 *
 * @param subjectId - The ID of the subject
 * @returns Questionnaire configuration and subject information
 *
 * @example
 * ```tsx
 * const { config, subjectInfo, hasQuestionnaire } = useSubjectQuestionnaire(1);
 *
 * if (!hasQuestionnaire) {
 *   return <NotFound />;
 * }
 *
 * return <QuizContainer config={config} />;
 * ```
 */
export function useSubjectQuestionnaire(
  subjectId: number
): UseSubjectQuestionnaireReturn {
  const result = useMemo(() => {
    // Get subject information
    const subjectInfo = getSubjectById(subjectId);

    // Get questionnaire configuration
    const config = getQuestionnaireBySubjectId(subjectId);

    // Check if questionnaire exists
    const hasQuestionnaire = Boolean(config && subjectInfo);

    // Generate error message if needed
    let error: string | null = null;
    if (!subjectInfo) {
      error = `Materia con ID ${subjectId} no encontrada`;
    } else if (!config) {
      error = `Cuestionario para ${subjectInfo.name} no disponible`;
    }

    return {
      config,
      subjectInfo,
      isLoading: false, // TODO: Set to true when fetching from API
      error,
      hasQuestionnaire,
    };
  }, [subjectId]);

  return result;
}
