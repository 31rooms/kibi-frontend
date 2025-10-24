/**
 * Subject Mapping Utility
 *
 * Maps subject IDs to their metadata (name, slug, icon)
 */

import type { Subject } from '@/features/questionnaire/types/questionnaire.types';

/**
 * All available subjects in the system
 * Ordered from Literatura (23) to Inglés (1)
 *
 * SVG Naming Convention:
 * - Materia-0.svg = Literatura (id: 23)
 * - Materia-1.svg = Filosofía (id: 22)
 * - ...
 * - Materia-19.svg = Inglés (id: 4)
 * - Materia-20.svg = Redacción Indirecta (id: 3)
 * - Materia-21.svg = Pensamiento Matemático (id: 2)
 * - Materia-22.svg = Comprensión Lectora (id: 1)
 */
export const SUBJECTS: Record<number, Subject> = {
  23: {
    id: 23,
    name: 'Literatura',
    slug: 'literatura',
    iconFilename: 'Materia-0.svg',
    description: 'Literatura universal y análisis literario',
  },
  22: {
    id: 22,
    name: 'Filosofía',
    slug: 'filosofia',
    iconFilename: 'Materia-1.svg',
    description: 'Filosofía y pensamiento crítico',
  },
  21: {
    id: 21,
    name: 'Premedicina',
    slug: 'premedicina',
    iconFilename: 'Materia-2.svg',
    description: 'Ciencias de la salud y medicina',
  },
  20: {
    id: 20,
    name: 'Cálculo',
    slug: 'calculo',
    iconFilename: 'Materia-3.svg',
    description: 'Cálculo diferencial e integral',
  },
  19: {
    id: 19,
    name: 'Biología',
    slug: 'biologia',
    iconFilename: 'Materia-4.svg',
    description: 'Biología celular y molecular',
  },
  18: {
    id: 18,
    name: 'Física',
    slug: 'fisica',
    iconFilename: 'Materia-5.svg',
    description: 'Física clásica y moderna',
  },
  17: {
    id: 17,
    name: 'Economía',
    slug: 'economia',
    iconFilename: 'Materia-6.svg',
    description: 'Economía y análisis económico',
  },
  16: {
    id: 16,
    name: 'Historia de México',
    slug: 'historia-mexico',
    iconFilename: 'Materia-7.svg',
    description: 'Historia de México',
  },
  15: {
    id: 15,
    name: 'Cálculo Integral',
    slug: 'calculo-integral',
    iconFilename: 'Materia-8.svg',
    description: 'Cálculo integral avanzado',
  },
  14: {
    id: 14,
    name: 'Administración',
    slug: 'administracion',
    iconFilename: 'Materia-9.svg',
    description: 'Administración y gestión empresarial',
  },
  13: {
    id: 13,
    name: 'Química',
    slug: 'quimica',
    iconFilename: 'Materia-10.svg',
    description: 'Química general y orgánica',
  },
  12: {
    id: 12,
    name: 'Historia',
    slug: 'Historia',
    iconFilename: 'Materia-11.svg',
    description: 'Historia',
  },
  11: {
    id: 11,
    name: 'Geografía',
    slug: 'geografia',
    iconFilename: 'Materia-12.svg',
    description: 'Geografía física y humana',
  },
  10: {
    id: 10,
    name: 'Ciencias de la salud',
    slug: 'ciencias-salud',
    iconFilename: 'Materia-13.svg',
    description: 'Ciencias de la salud',
  },
  9: {
    id: 9,
    name: 'Álgebra',
    slug: 'algebra',
    iconFilename: 'Materia-14.svg',
    description: 'Álgebra y ecuaciones',
  },
  8: {
    id: 8,
    name: 'Finanzas',
    slug: 'finanzas',
    iconFilename: 'Materia-15.svg',
    description: 'Finanzas y contabilidad',
  },
  7: {
    id: 7,
    name: 'Derecho',
    slug: 'derecho',
    iconFilename: 'Materia-16.svg',
    description: 'Derecho y leyes',
  },
  6: {
    id: 6,
    name: 'Probabilidad y Estadística',
    slug: 'Probabilidad y Estadística',
    iconFilename: 'Materia-17.svg',
    description: 'Probabilidad y Estadística',
  },
  5: {
    id: 5,
    name: 'Aritmética',
    slug: 'aritmetica',
    iconFilename: 'Materia-18.svg',
    description: 'Aritmética básica',
  },
  4: {
    id: 4,
    name: 'Inglés',
    slug: 'ingles',
    iconFilename: 'Materia-19.svg',
    description: 'Inglés básico e intermedio',
  },
  3: {
    id: 3,
    name: 'Redacción Indirecta',
    slug: 'redaccion-indirecta',
    iconFilename: 'Materia-19.svg',
    description: 'Redacción indirecta',
  },
  2: {
    id: 2,
    name: 'Pensamiento Matemático',
    slug: 'pensamiento-matematico',
    iconFilename: 'Materia-12.svg',
    description: 'Pensamiento matemático',
  },
  1: {
    id: 1,
    name: 'Comprensión Lectora',
    slug: 'comprension-lectora',
    iconFilename: 'Materia-19.svg',
    description: 'Comprensión lectora',
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
