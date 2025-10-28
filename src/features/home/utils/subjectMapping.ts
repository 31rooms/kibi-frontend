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
 * png Naming Convention:
 * - Materia-0.png = Literatura (id: 23)
 * - Materia-1.png = Filosofía (id: 22)
 * - ...
 * - Materia-19.png = Inglés (id: 4)
 * - Materia-20.png = Redacción Indirecta (id: 3)
 * - Materia-21.png = Pensamiento Matemático (id: 2)
 * - Materia-22.png = Comprensión Lectora (id: 1)
 */
export const SUBJECTS: Record<number, Subject> = {
  23: {
    id: 23,
    name: 'Literatura',
    slug: 'literatura',
    iconFilename: 'Materia-0.png',
    description: 'Literatura universal y análisis literario',
  },
  22: {
    id: 22,
    name: 'Filosofía',
    slug: 'filosofia',
    iconFilename: 'Materia-1.png',
    description: 'Filosofía y pensamiento crítico',
  },
  21: {
    id: 21,
    name: 'Premedicina',
    slug: 'premedicina',
    iconFilename: 'Materia-2.png',
    description: 'Ciencias de la salud y medicina',
  },
  20: {
    id: 20,
    name: 'Cálculo',
    slug: 'calculo',
    iconFilename: 'Materia-3.png',
    description: 'Cálculo diferencial e integral',
  },
  19: {
    id: 19,
    name: 'Biología',
    slug: 'biologia',
    iconFilename: 'Materia-4.png',
    description: 'Biología celular y molecular',
  },
  18: {
    id: 18,
    name: 'Física',
    slug: 'fisica',
    iconFilename: 'Materia-5.png',
    description: 'Física clásica y moderna',
  },
  17: {
    id: 17,
    name: 'Economía',
    slug: 'economia',
    iconFilename: 'Materia-6.png',
    description: 'Economía y análisis económico',
  },
  16: {
    id: 16,
    name: 'Historia de México',
    slug: 'historia-mexico',
    iconFilename: 'Materia-7.png',
    description: 'Historia de México',
  },
  15: {
    id: 15,
    name: 'Cálculo Integral',
    slug: 'calculo-integral',
    iconFilename: 'Materia-8.png',
    description: 'Cálculo integral avanzado',
  },
  14: {
    id: 14,
    name: 'Administración',
    slug: 'administracion',
    iconFilename: 'Materia-9.png',
    description: 'Administración y gestión empresarial',
  },
  13: {
    id: 13,
    name: 'Química',
    slug: 'quimica',
    iconFilename: 'Materia-10.png',
    description: 'Química general y orgánica',
  },
  12: {
    id: 12,
    name: 'Historia',
    slug: 'Historia',
    iconFilename: 'Materia-11.png',
    description: 'Historia',
  },
  11: {
    id: 11,
    name: 'Geografía',
    slug: 'geografia',
    iconFilename: 'Materia-12.png',
    description: 'Geografía física y humana',
  },
  10: {
    id: 10,
    name: 'Ciencias de la salud',
    slug: 'ciencias-salud',
    iconFilename: 'Materia-13.png',
    description: 'Ciencias de la salud',
  },
  9: {
    id: 9,
    name: 'Álgebra',
    slug: 'algebra',
    iconFilename: 'Materia-14.png',
    description: 'Álgebra y ecuaciones',
  },
  8: {
    id: 8,
    name: 'Finanzas',
    slug: 'finanzas',
    iconFilename: 'Materia-15.png',
    description: 'Finanzas y contabilidad',
  },
  7: {
    id: 7,
    name: 'Derecho',
    slug: 'derecho',
    iconFilename: 'Materia-16.png',
    description: 'Derecho y leyes',
  },
  6: {
    id: 6,
    name: 'Probabilidad y Estadística',
    slug: 'Probabilidad y Estadística',
    iconFilename: 'Materia-17.png',
    description: 'Probabilidad y Estadística',
  },
  5: {
    id: 5,
    name: 'Aritmética',
    slug: 'aritmetica',
    iconFilename: 'Materia-18.png',
    description: 'Aritmética básica',
  },
  4: {
    id: 4,
    name: 'Inglés',
    slug: 'ingles',
    iconFilename: 'Materia-19.png',
    description: 'Inglés básico e intermedio',
  },
  3: {
    id: 3,
    name: 'Redacción Indirecta',
    slug: 'redaccion-indirecta',
    iconFilename: 'Materia-19.png',
    description: 'Redacción indirecta',
  },
  2: {
    id: 2,
    name: 'Pensamiento Matemático',
    slug: 'pensamiento-matematico',
    iconFilename: 'Materia-12.png',
    description: 'Pensamiento matemático',
  },
  1: {
    id: 1,
    name: 'Comprensión Lectora',
    slug: 'comprension-lectora',
    iconFilename: 'Materia-19.png',
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
