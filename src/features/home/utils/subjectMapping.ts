/**
 * Subject Mapping Utility
 *
 * Maps subject IDs to their metadata (name, slug, icon)
 */

import type { Subject } from '@/features/questionnaire/types/questionnaire.types';

/**
 * All available subjects in the system
 * Ordered from Literatura (20) to Inglés (1)
 */
export const SUBJECTS: Record<number, Subject> = {
  20: {
    id: 20,
    name: 'Literatura',
    slug: 'literatura',
    iconFilename: '20literatura.svg',
    description: 'Literatura universal y análisis literario',
  },
  19: {
    id: 19,
    name: 'Filosofía',
    slug: 'filosofia',
    iconFilename: '19filosofia.svg',
    description: 'Filosofía y pensamiento crítico',
  },
  18: {
    id: 18,
    name: 'Premedicina',
    slug: 'premedicina',
    iconFilename: '18premedicina.svg',
    description: 'Ciencias de la salud y medicina',
  },
  17: {
    id: 17,
    name: 'Cálculo',
    slug: 'calculo',
    iconFilename: '17calculo.svg',
    description: 'Cálculo diferencial e integral',
  },
  16: {
    id: 16,
    name: 'Biología',
    slug: 'biologia',
    iconFilename: '16biologia.svg',
    description: 'Biología celular y molecular',
  },
  15: {
    id: 15,
    name: 'Física',
    slug: 'fisica',
    iconFilename: '15fisica.svg',
    description: 'Física clásica y moderna',
  },
  14: {
    id: 14,
    name: 'Economía',
    slug: 'economia',
    iconFilename: '14economia.svg',
    description: 'Economía y análisis económico',
  },
  13: {
    id: 13,
    name: 'Historia de México',
    slug: 'historia-mexico',
    iconFilename: '13historiamexico.svg',
    description: 'Historia de México',
  },
  12: {
    id: 12,
    name: 'Cálculo Integral',
    slug: 'calculo-integral',
    iconFilename: '12calculointegral.svg',
    description: 'Cálculo integral avanzado',
  },
  11: {
    id: 11,
    name: 'Administración',
    slug: 'administracion',
    iconFilename: '11administracion.svg',
    description: 'Administración y gestión empresarial',
  },
  10: {
    id: 10,
    name: 'Química',
    slug: 'quimica',
    iconFilename: '10quimica.svg',
    description: 'Química general y orgánica',
  },
  9: {
    id: 9,
    name: 'Historia Universal',
    slug: 'historia-universal',
    iconFilename: '9historiauniversal.svg',
    description: 'Historia universal',
  },
  8: {
    id: 8,
    name: 'Geografía',
    slug: 'geografia',
    iconFilename: '8geografia.svg',
    description: 'Geografía física y humana',
  },
  7: {
    id: 7,
    name: 'Ciencias de la Salud',
    slug: 'ciencias-salud',
    iconFilename: '7cienciasdesalud.svg',
    description: 'Ciencias de la salud',
  },
  6: {
    id: 6,
    name: 'Álgebra',
    slug: 'algebra',
    iconFilename: '6algebra.svg',
    description: 'Álgebra y ecuaciones',
  },
  5: {
    id: 5,
    name: 'Finanzas',
    slug: 'finanzas',
    iconFilename: '5finanzas.svg',
    description: 'Finanzas y contabilidad',
  },
  4: {
    id: 4,
    name: 'Derecho',
    slug: 'derecho',
    iconFilename: '4derecho.svg',
    description: 'Derecho y leyes',
  },
  3: {
    id: 3,
    name: 'Estadística',
    slug: 'estadistica',
    iconFilename: '3estadistica.svg',
    description: 'Estadística y probabilidad',
  },
  2: {
    id: 2,
    name: 'Aritmética',
    slug: 'aritmetica',
    iconFilename: '2aritmetica.svg',
    description: 'Aritmética básica',
  },
  1: {
    id: 1,
    name: 'Inglés',
    slug: 'ingles',
    iconFilename: '1ingles.svg',
    description: 'Inglés básico e intermedio',
  },
};

/**
 * Get subject by ID
 */
export function getSubjectById(id: number): Subject | undefined {
  return SUBJECTS[id];
}

/**
 * Get subject by slug
 */
export function getSubjectBySlug(slug: string): Subject | undefined {
  return Object.values(SUBJECTS).find((subject) => subject.slug === slug);
}

/**
 * Get all subjects as array
 */
export function getAllSubjects(): Subject[] {
  return Object.values(SUBJECTS);
}
