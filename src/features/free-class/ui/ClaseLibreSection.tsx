'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Search, Loader2 } from 'lucide-react';
import { Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Toggle, Card, CareerTag, Pagination } from '@/shared/ui';
import Image from 'next/image';
import { useLessonSearch, useMySubjects } from '../hooks';
import type { DifficultyLevel, LessonSearchResult } from '../types';

// Map difficulty levels to Spanish labels
const difficultyLabels: Record<DifficultyLevel, string> = {
  BASIC: 'Basico',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
};

export const ClaseLibreSection = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const router = useRouter();

    // Hooks for data fetching
    const {
      lessons,
      total,
      isLoading: isLoadingLessons,
      error: lessonsError,
      currentPage,
      totalPages,
      setPage,
      searchValue,
      setSearchValue,
      subjectId,
      setSubjectId,
      difficultyLevel,
      setDifficultyLevel,
      viewedOnly,
      setViewedOnly,
    } = useLessonSearch({
      pageSize: 5,
      debounceDelay: 400,
    });

    const {
      subjects,
      isLoading: isLoadingSubjects,
      error: subjectsError,
    } = useMySubjects();

    // Debug: log subjects
    React.useEffect(() => {
      console.log('[ClaseLibreSection] subjects:', subjects, 'isLoading:', isLoadingSubjects, 'error:', subjectsError);
    }, [subjects, isLoadingSubjects, subjectsError]);

    // Toggle states (recomendados disabled for now)
    const [recomendados, setRecomendados] = React.useState(false);

    // Handle card click to navigate to lesson
    const handleCardClick = (lesson: LessonSearchResult) => {
      router.push(`/free-class/lesson/${lesson._id}`);
    };

    // Handle difficulty change
    const handleDifficultyChange = (value: string) => {
      setDifficultyLevel(value === 'all' ? '' : value as DifficultyLevel);
    };

    // Handle subject change
    const handleSubjectChange = (value: string) => {
      setSubjectId(value === 'all' ? '' : value);
    };

    return (
      <main
        ref={ref}
        className={cn(
          "flex-1 overflow-y-auto p-6 md:p-8",
          "bg-white dark:bg-[#171B22]",
          className
        )}
        {...props}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header with icon and title */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative w-[113px] h-[113px]">
              <Image
                src="/illustrations/hands.svg"
                alt="Hands"
                fill
                className="dark:hidden"
              />
              <Image
                src="/illustrations/hands-dark.svg"
                alt="Hands"
                fill
                className="hidden dark:block"
              />
            </div>
            <h1 className="text-[36px] font-bold text-[#95C16B] font-[family-name:var(--font-quicksand)]">
              Clase libre
            </h1>
          </div>

          {/* Search bar */}
          <div className="w-full">
            <Input
              placeholder="Que quieres estudiar hoy?"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              leadingIcon={<Search className="w-5 h-5" />}
            />
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Materia dropdown */}
            <div className="w-full sm:w-[200px]">
              <Select value={subjectId || 'all'} onValueChange={handleSubjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Materia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las materias</SelectItem>
                  {isLoadingSubjects ? (
                    <SelectItem value="loading" disabled>
                      Cargando...
                    </SelectItem>
                  ) : subjectsError ? (
                    <SelectItem value="error" disabled>
                      Error al cargar
                    </SelectItem>
                  ) : subjects.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Sin materias
                    </SelectItem>
                  ) : (
                    subjects.map((subject) => (
                      <SelectItem key={subject._id} value={subject._id}>
                        {subject.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Nivel dropdown */}
            <div className="w-full sm:w-[200px]">
              <Select value={difficultyLevel || 'all'} onValueChange={handleDifficultyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  <SelectItem value="BASIC">Basico</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermedio</SelectItem>
                  <SelectItem value="ADVANCED">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 ml-auto">
              <Toggle
                checked={recomendados}
                onCheckedChange={setRecomendados}
                label="Recomendados"
                labelPosition="right"
                style="1"
                disabled
              />
              <Toggle
                checked={viewedOnly}
                onCheckedChange={setViewedOnly}
                label="Temas Vistos"
                labelPosition="right"
                style="1"
              />
            </div>
          </div>

          {/* Results section */}
          <div className="mt-8 space-y-4">
            <h2 className="text-[20px] font-semibold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
              Resultados <span className="text-[#95C16B]">({total})</span>
            </h2>

            {/* Loading state */}
            {isLoadingLessons && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#95C16B] animate-spin" />
              </div>
            )}

            {/* Error state */}
            {lessonsError && !isLoadingLessons && (
              <div className="text-center py-12">
                <p className="text-red-500">{lessonsError}</p>
              </div>
            )}

            {/* Empty state */}
            {!isLoadingLessons && !lessonsError && lessons.length === 0 && (
              <div className="text-center py-12">
                <p className="text-grey-500 dark:text-grey-400">
                  No se encontraron lecciones con los filtros seleccionados.
                </p>
              </div>
            )}

            {/* Results list */}
            {!isLoadingLessons && !lessonsError && lessons.length > 0 && (
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <Card
                    key={lesson._id}
                    className="relative p-6 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCardClick(lesson)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Subject tag */}
                        {lesson.subject && (
                          <CareerTag
                            variant="career"
                            career={lesson.subject.name}
                            className="text-sm font-[family-name:var(--font-rubik)]"
                          />
                        )}

                        {/* Title */}
                        <h3 className="text-[18px] font-semibold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                          {lesson.title}
                        </h3>

                        {/* Difficulty badge */}
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full font-medium",
                            lesson.difficultyLevel === 'BASIC' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                            lesson.difficultyLevel === 'INTERMEDIATE' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                            lesson.difficultyLevel === 'ADVANCED' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                          )}>
                            {difficultyLabels[lesson.difficultyLevel]}
                          </span>
                          {lesson.estimatedMinutes > 0 && (
                            <span className="text-xs text-grey-500 dark:text-grey-400">
                              ~{lesson.estimatedMinutes} min
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Pagination */}
                <div className="flex justify-center pt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }
);

ClaseLibreSection.displayName = 'ClaseLibreSection';
