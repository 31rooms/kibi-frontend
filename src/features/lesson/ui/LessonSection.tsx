'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedLessonView } from './EnhancedLessonView';
import { Card, CardContent } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import {
  BookOpen,
  FlaskConical,
  BookText,
  Globe,
  Target,
  ArrowLeft,
} from 'lucide-react';
import { cn, getDriveImageUrl, isDriveFileUrl } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';

/**
 * Lesson Section Component
 * Wrapper component for the dashboard that either:
 * 1. Shows a list of available subjects (if no subject selected)
 * 2. Shows the EnhancedLessonView for a selected subject
 */
export const LessonSection = React.forwardRef<HTMLElement>((props, ref) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );
  const [subjects, setSubjects] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      icon?: string;
      color?: string;
    }>
  >([]);

  // TODO: Replace with actual API call to get user's enrolled subjects
  useEffect(() => {
    // Mock data - replace with actual API call
    setSubjects([
      {
        id: '1',
        name: 'Matemáticas',
        description: 'Álgebra, geometría y cálculo',
        color: 'bg-blue-500/10 text-blue-500',
      },
      {
        id: '2',
        name: 'Ciencias',
        description: 'Física, química y biología',
        color: 'bg-green-500/10 text-green-500',
      },
      {
        id: '3',
        name: 'Comprensión Lectora',
        description: 'Análisis de textos y vocabulario',
        color: 'bg-purple-500/10 text-purple-500',
      },
      {
        id: '4',
        name: 'Historia',
        description: 'Historia universal y regional',
        color: 'bg-orange-500/10 text-orange-500',
      },
    ]);
  }, []);

  const getSubjectIcon = (subjectName: string) => {
    const name = subjectName.toLowerCase();
    if (name.includes('matemática') || name.includes('álgebra'))
      return BookOpen;
    if (
      name.includes('ciencia') ||
      name.includes('física') ||
      name.includes('química')
    )
      return FlaskConical;
    if (name.includes('lectura') || name.includes('comprensión'))
      return BookText;
    if (name.includes('historia') || name.includes('geografía'))
      return Globe;
    return Target;
  };

  // If a subject is selected, show the EnhancedLessonView
  if (selectedSubjectId) {
    return (
      <main
        ref={ref}
        className="flex-1 overflow-auto bg-grey-50 dark:bg-[#0A0F1E]"
      >
        <div className="p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedSubjectId(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a materias
          </Button>
        </div>
        <EnhancedLessonView subjectId={selectedSubjectId} />
      </main>
    );
  }

  // Otherwise, show the subject selection grid
  return (
    <main
      ref={ref}
      className="flex-1 overflow-auto bg-grey-50 dark:bg-[#0A0F1E] p-8"
    >
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-green/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-green" />
            </div>
            <h1 className="text-3xl font-bold text-grey-900 dark:text-white font-[family-name:var(--font-quicksand)]">
              Mis Materias
            </h1>
          </div>
          <p className="text-grey-600 dark:text-gray-400 font-[family-name:var(--font-rubik)]">
            Selecciona una materia para ver sus lecciones y contenido
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject, index) => {
            const IconComponent = getSubjectIcon(subject.name);
            const colorClass =
              subject.color || 'bg-primary-green/10 text-primary-green';

            return (
              <Card
                key={subject.id}
                className="bg-white dark:bg-[#131820] border-grey-200 dark:border-gray-800 hover:border-primary-green/50 cursor-pointer group transition-all duration-200"
                onClick={() => setSelectedSubjectId(subject.id)}
              >
                <CardContent className="p-6">
                  {/* Icon and Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn('p-3 rounded-lg', colorClass)}>
                      {subject.icon ? (
                        <img
                          src={isDriveFileUrl(subject.icon) ? getDriveImageUrl(subject.icon) : subject.icon}
                          alt={subject.name}
                          className="w-6 h-6"
                        />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs border-primary-green text-primary-green"
                    >
                      Activo
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold mb-2 text-grey-900 dark:text-white group-hover:text-primary-green transition-colors font-[family-name:var(--font-quicksand)]">
                    {subject.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-grey-600 dark:text-gray-400 font-[family-name:var(--font-rubik)]">
                    {subject.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {subjects.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-grey-200 dark:bg-gray-800/50 rounded-full mb-4">
              <BookOpen className="w-12 h-12 text-grey-500 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-2">
              No hay materias disponibles
            </h3>
            <p className="text-grey-600 dark:text-gray-400 mb-6">
              Contacta con tu administrador para inscribirte en materias
            </p>
          </div>
        )}
      </div>
    </main>
  );
});

LessonSection.displayName = 'LessonSection';
