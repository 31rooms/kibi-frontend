'use client';

import { useState, useEffect } from 'react';
import { careersAPI } from '../api/careers-service';
import type { MySubjectsResponse, SubjectWithState } from '../types/careers.types';

/**
 * Local subjects array - matches the subjects in HomeContent.tsx
 * This serves as the master list of all possible subjects
 *
 * svg Naming Convention:
 * - Materia-0.svg = Literatura
 * - Materia-1.svg = Filosofía
 * - Materia-2.svg = Premedicina
 * - Materia-3.svg = Cálculo
 * - Materia-4.svg = Biología
 * - Materia-5.svg = Física
 * - Materia-6.svg = Economía
 * - Materia-7.svg = Historia de México
 * - Materia-8.svg = Cálculo diferencial e integral
 * - Materia-9.svg = Aritmética
 * - Materia-10.svg = Administración
 * - Materia-11.svg = Química
 * - Materia-12.svg = Historia
 * - Materia-13.svg = Geografía
 * - Materia-14.svg = Ciencias de la salud
 * - Materia-15.svg = Álgebra
 * - Materia-16.svg = Finanzas
 * - Materia-17.svg = Derecho
 * - Materia-18.svg = Probabilidad y Estadística
 * - Materia-19.svg = Pensamiento Matemático
 * - Materia-20.svg = Inglés, Redacción Indirecta, Comprensión Lectora (compartido)
 */
const LOCAL_SUBJECTS = [
  { id: 23, name: 'Materia-0.svg', displayName: 'Literatura' },
  { id: 22, name: 'Materia-1.svg', displayName: 'Filosofía' },
  { id: 21, name: 'Materia-2.svg', displayName: 'Premedicina' },
  { id: 20, name: 'Materia-3.svg', displayName: 'Cálculo' },
  { id: 19, name: 'Materia-4.svg', displayName: 'Biología' },
  { id: 18, name: 'Materia-5.svg', displayName: 'Física' },
  { id: 17, name: 'Materia-6.svg', displayName: 'Economía' },
  { id: 16, name: 'Materia-7.svg', displayName: 'Historia de México' },
  { id: 15, name: 'Materia-8.svg', displayName: 'Cálculo diferencial e integral' },
  { id: 14, name: 'Materia-9.svg', displayName: 'Aritmética' },
  { id: 13, name: 'Materia-10.svg', displayName: 'Administración' },
  { id: 12, name: 'Materia-11.svg', displayName: 'Química' },
  { id: 11, name: 'Materia-12.svg', displayName: 'Historia' },
  { id: 10, name: 'Materia-13.svg', displayName: 'Geografía' },
  { id: 9, name: 'Materia-14.svg', displayName: 'Ciencias de la salud' },
  { id: 8, name: 'Materia-15.svg', displayName: 'Álgebra' },
  { id: 7, name: 'Materia-16.svg', displayName: 'Finanzas' },
  { id: 6, name: 'Materia-17.svg', displayName: 'Derecho' },
  { id: 5, name: 'Materia-18.svg', displayName: 'Probabilidad y Estadística' },
  { id: 4, name: 'Materia-19.svg', displayName: 'Pensamiento Matemático' },
  { id: 3, name: 'Materia-20.svg', displayName: 'Inglés' },
  { id: 2, name: 'Materia-22.svg', displayName: 'Redacción Indirecta' },
  { id: 1, name: 'Materia-21.svg', displayName: 'Comprensión Lectora' },
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
 * 3. Only shows subjects that are in the API response (enabled: true)
 * 4. Uses /public/subjects/light/open/ for all displayed subjects
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

      // Normalize function: lowercase, remove accents, normalize spaces/hyphens
      const normalize = (str: string): string => {
        return str
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/[-\s]+/g, '') // Remove hyphens and spaces
          .trim();
      };

      // Create a map of local subjects by normalized displayName for flexible lookup
      const localSubjectsMap = new Map(
        LOCAL_SUBJECTS.map((subject) => [normalize(subject.displayName), subject])
      );
      // Map API subjects to local subjects (only show subjects from API)
      const mappedSubjects: SubjectWithState[] = response.subjects
        .map((apiSubject) => {
          const normalizedApiName = normalize(apiSubject.name);
          const localSubject = localSubjectsMap.get(normalizedApiName);

          if (!localSubject) {
            console.warn(`Subject "${apiSubject.name}" (normalized: "${normalizedApiName}") from API not found in local subjects`);
            return null;
          }

          return {
            id: localSubject.id,
            name: localSubject.name,
            displayName: localSubject.displayName,
            enabled: true,
            iconPath: `/subjects/light/open/${localSubject.name}`,
            questionsInExam: apiSubject.questionsInExam,
            apiId: apiSubject._id,
          } as SubjectWithState;
        })
        .filter((subject): subject is SubjectWithState => subject !== null);

      setSubjects(mappedSubjects);
      setCareer(response.career);
      setTotalQuestions(response.totalQuestions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load subjects';
      setError(errorMessage);
      console.error('useMySubjects error:', err);

      // Set empty subjects array on error
      setSubjects([]);
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
