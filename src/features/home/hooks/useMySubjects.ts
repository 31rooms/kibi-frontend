'use client';

import { useState, useEffect } from 'react';
import { careersAPI } from '../api/careers-service';
import type { MySubjectsResponse, SubjectWithState } from '../types/careers.types';

/**
 * Local subjects array - matches the subjects in HomeContent.tsx
 * This serves as the master list of all possible subjects
 */
const LOCAL_SUBJECTS = [
  { id: 20, name: '20literatura.svg', displayName: 'Literatura' },
  { id: 19, name: '19filosofia.svg', displayName: 'Filosofía' },
  { id: 18, name: '18premedicina.svg', displayName: 'Premedicina' },
  { id: 17, name: '17calculo.svg', displayName: 'Cálculo' },
  { id: 16, name: '16biologia.svg', displayName: 'Biología' },
  { id: 15, name: '15fisica.svg', displayName: 'Física' },
  { id: 14, name: '14economia.svg', displayName: 'Economía' },
  { id: 13, name: '13historiamexico.svg', displayName: 'Historia de México' },
  { id: 12, name: '12calculointegral.svg', displayName: 'Cálculo Integral' },
  { id: 11, name: '11administracion.svg', displayName: 'Administración' },
  { id: 10, name: '10quimica.svg', displayName: 'Química' },
  { id: 9, name: '9historiauniversal.svg', displayName: 'Historia Universal' },
  { id: 8, name: '8geografia.svg', displayName: 'Geografía' },
  { id: 7, name: '7cienciasdesalud.svg', displayName: 'Ciencias de la Salud' },
  { id: 6, name: '6algebra.svg', displayName: 'Álgebra' },
  { id: 5, name: '5finanzas.svg', displayName: 'Finanzas' },
  { id: 4, name: '4derecho.svg', displayName: 'Derecho' },
  { id: 3, name: '3estadistica.svg', displayName: 'Estadística' },
  { id: 2, name: '2aritmetica.svg', displayName: 'Aritmética' },
  { id: 1, name: '1ingles.svg', displayName: 'Inglés' },
];

interface UseMySubjectsReturn {
  subjects: SubjectWithState[];
  career: MySubjectsResponse['career'] | null;
  totalQuestions: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch user's subjects and merge with local subject list
 *
 * Business Logic:
 * 1. Fetches subjects from API (GET /careers/my-subjects)
 * 2. Matches API subjects with local subjects by displayName
 * 3. If a subject is in the API response -> enabled: true, use /public/subjects/light/open/
 * 4. If a subject is NOT in the API response -> enabled: false, use /public/subjects/light/disabled/
 *
 * @returns Object with subjects array, career info, loading state, error, and refetch function
 */
export function useMySubjects(): UseMySubjectsReturn {
  const [subjects, setSubjects] = useState<SubjectWithState[]>([]);
  const [career, setCareer] = useState<MySubjectsResponse['career'] | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await careersAPI.getMySubjects();

      // Create a map of API subjects by name for quick lookup
      const apiSubjectsMap = new Map(
        response.subjects.map((subject) => [subject.name, subject])
      );

      // Merge local subjects with API data
      const mergedSubjects: SubjectWithState[] = LOCAL_SUBJECTS.map((localSubject) => {
        const apiSubject = apiSubjectsMap.get(localSubject.displayName);
        const enabled = !!apiSubject;

        return {
          id: localSubject.id,
          name: localSubject.name,
          displayName: localSubject.displayName,
          enabled,
          iconPath: enabled
            ? `/subjects/light/open/${localSubject.name}`
            : `/subjects/light/disabled/${localSubject.name}`,
          questionsInExam: apiSubject?.questionsInExam,
          apiId: apiSubject?._id,
        };
      });

      setSubjects(mergedSubjects);
      setCareer(response.career);
      setTotalQuestions(response.totalQuestions);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load subjects';
      setError(errorMessage);
      console.error('useMySubjects error:', err);

      // Set all subjects as disabled on error
      const disabledSubjects: SubjectWithState[] = LOCAL_SUBJECTS.map((localSubject) => ({
        id: localSubject.id,
        name: localSubject.name,
        displayName: localSubject.displayName,
        enabled: false,
        iconPath: `/subjects/light/disabled/${localSubject.name}`,
      }));

      setSubjects(disabledSubjects);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return {
    subjects,
    career,
    totalQuestions,
    isLoading,
    error,
    refetch: fetchSubjects,
  };
}
