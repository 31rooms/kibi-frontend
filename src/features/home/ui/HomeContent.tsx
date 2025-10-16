'use client';

import React, { useState, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import type { HomeContentProps } from '../types/home.types';

// Subject interface
interface Subject {
  id: number;
  name: string;
}

// Array of subjects with id and filename (reverse order: Literatura first, Inglés last)
const subjects: Subject[] = [
  { id: 20, name: '20literatura.svg' },
  { id: 19, name: '19filosofia.svg' },
  { id: 18, name: '18premedicina.svg' },
  { id: 17, name: '17calculo.svg' },
  { id: 16, name: '16biologia.svg' },
  { id: 15, name: '15fisica.svg' },
  { id: 14, name: '14economia.svg' },
  { id: 13, name: '13historiamexico.svg' },
  { id: 12, name: '12calculointegral.svg' },
  { id: 11, name: '11administracion.svg' },
  { id: 10, name: '10quimica.svg' },
  { id: 9, name: '9historiauniversal.svg' },
  { id: 8, name: '8geografia.svg' },
  { id: 7, name: '7cienciasdesalud.svg' },
  { id: 6, name: '6algebra.svg' },
  { id: 5, name: '5finanzas.svg' },
  { id: 4, name: '4derecho.svg' },
  { id: 3, name: '3estadistica.svg' },
  { id: 2, name: '2aritmetica.svg' },
  { id: 1, name: '1ingles.svg' },
];

/**
 * Home Content Component
 * Main content area displaying vertically stacked subjects
 */
export const HomeContent = React.forwardRef<HTMLElement, HomeContentProps>(
  ({ selectedSection }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const internalRef = useRef<HTMLElement>(null);
    const router = useRouter();

    // Combine external ref with internal ref
    React.useImperativeHandle(ref, () => internalRef.current as HTMLElement);

    // Handle subject action button click - Navigate to questionnaire
    const handleSubjectAction = (subjectId: number) => {
      console.log(`Navigating to questionnaire for subject ID: ${subjectId}`);
      router.push(`/questionnaire/${subjectId}`);
    };

    // Auto-scroll to bottom on mount
    useLayoutEffect(() => {
      const mainElement = internalRef.current;

      if (mainElement) {
        // Wait for content to render, then scroll and hide loader
        requestAnimationFrame(() => {
          mainElement.scrollTop = mainElement.scrollHeight;

          // Hide loader after scroll
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        });
      }
    }, []);

    return (
      <main
        ref={internalRef}
        className={cn(
          "flex-1 overflow-y-auto p-6 md:p-8",
          "bg-background-white",
          "relative",
          "scrollbar-hide"
        )}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
      >
        {/* Loader overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background-white z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          </div>
        )}

        {/* Content with subjects (always rendered, hidden by loader overlay) */}
        <div className="max-w-7xl mx-auto">
            {/* Container for vertically stacked subjects (Literatura top, Inglés bottom) */}
            <div className="flex flex-col items-center gap-3">
              {subjects.map((subject, index) => {
                // Extract subject name from filename (e.g., "1ingles.svg" -> "Inglés")
                const subjectName = subject.name
                  .replace(/^\d+/, '') // Remove leading number
                  .replace('.svg', '') // Remove extension
                  .replace(/([A-Z])/g, ' $1') // Add space before capitals
                  .trim();

                return (
                  <div
                    key={subject.id}
                    onClick={() => handleSubjectAction(subject.id)}
                    className="relative w-[351px] h-auto cursor-pointer"
                  >
                    <Image
                      src={`/subjects/light/open/${subject.name}`}
                      alt={`${subjectName} subject`}
                      width={351}
                      height={200}
                      className="w-full h-auto"
                      priority={index < 5} // Prioritize first 5 images
                    />
                  </div>
                );
              })}
            </div>
        </div>
      </main>
    );
  }
);

HomeContent.displayName = 'HomeContent';
