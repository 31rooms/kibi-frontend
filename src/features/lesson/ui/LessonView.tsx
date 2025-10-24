'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Alert, Button } from '@/shared/ui';
import { useSubjectHierarchy } from '../hooks/useSubjectHierarchy';
import type { LessonViewProps, Module, Lesson } from '../types/lesson.types';
import { ArrowLeft } from 'lucide-react';
import { LessonContent } from './LessonContent';

/**
 * LessonView Component
 * Displays lessons with interactive content and practice questions
 *
 * Features:
 * - Simple back button navigation (no blue header)
 * - Module title outside accordions
 * - Three accordions per lesson (educational content + practice)
 * - Interactive questions with validation and feedback
 */
export const LessonView = React.forwardRef<HTMLDivElement, LessonViewProps>(
  ({ subjectId }, ref) => {
    const router = useRouter();
    const { hierarchy, isLoading, error, refetch } = useSubjectHierarchy(subjectId);

    // Handle back navigation
    const handleBack = () => {
      router.back();
    };

    // Handle finish session
    const handleFinishSession = () => {
      router.push('/home');
    };

    // Loading state
    if (isLoading) {
      return (
        <div
          ref={ref}
          className="min-h-screen flex items-center justify-center bg-background-white"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            <p className="text-grey-600 text-sm">Cargando lecciones...</p>
          </div>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div
          ref={ref}
          className="min-h-screen flex items-center justify-center bg-background-white p-6"
        >
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive">
              <p className="font-medium">Error al cargar las lecciones</p>
              <p className="text-sm mt-1">{error}</p>
            </Alert>
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg',
                  'bg-grey-200 text-grey-700',
                  'hover:bg-grey-300 transition-colors',
                  'font-medium text-sm'
                )}
              >
                Volver
              </button>
              <button
                onClick={() => refetch()}
                className={cn(
                  'flex-1 px-4 py-2 rounded-lg',
                  'bg-primary-blue text-white',
                  'hover:bg-opacity-90 transition-colors',
                  'font-medium text-sm'
                )}
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Collect all lessons from the hierarchy
    const lessonsWithModules: Array<{ module: Module; lesson: Lesson }> = [];

    if (hierarchy && hierarchy.topics) {
      hierarchy.topics
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .forEach(topic => {
          topic.subtopics
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .forEach(subtopic => {
              subtopic.modules
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .forEach(module => {
                  // Check if module has lessons
                  if (module.lessons && module.lessons.length > 0) {
                    module.lessons.forEach(lesson => {
                      lessonsWithModules.push({ module, lesson });
                    });
                  }
                });
            });
        });
    }

    // Empty state
    if (lessonsWithModules.length === 0 && !isLoading && !error) {
      return (
        <div
          ref={ref}
          className="min-h-screen flex flex-col bg-grey-50"
        >
          {/* Simple Back Button */}
          <div className="p-6">
            <button
              onClick={handleBack}
              className={cn(
                'flex items-center gap-2',
                'text-dark-900 hover:text-primary-blue',
                'transition-colors'
              )}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Volver</span>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full space-y-4 text-center">
              <div className="text-grey-400 mb-4">
                <svg
                  className="w-20 h-20 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-grey-700">
                No hay lecciones disponibles
              </h2>
              <p className="text-grey-500 text-sm">
                Este tema aún no tiene lecciones agregadas.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Success state - Display lessons with new structure
    return (
      <div ref={ref} className="min-h-screen bg-grey-50 pb-12">
        {/* Simple Back Button - NO blue header */}
        <div className="bg-white border-b border-grey-200 p-6 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleBack}
              className={cn(
                'flex items-center gap-2',
                'text-dark-900 hover:text-primary-blue',
                'transition-colors'
              )}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium font-[family-name:var(--font-rubik)]">Volver</span>
            </button>
          </div>
        </div>

        {/* Content - Lessons */}
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
          {lessonsWithModules.map(({ module, lesson }, index) => (
            <LessonContent
              key={`${module._id}-${lesson._id}`}
              module={module}
              lesson={lesson}
            />
          ))}

          {/* Finalizar sesión button - Centered at the end */}
          <div className="flex justify-center">
            <Button
              variant="primary"
              color="green"
              size="medium"
              onClick={handleFinishSession}
            >
              Finalizar sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

LessonView.displayName = 'LessonView';
