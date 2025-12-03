'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dailyTestAPI } from '@/features/daily-test/api/dailyTestAPI';
import type { RecommendedLesson } from '@/features/daily-test/api/types';
import { Card, CardContent } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { CareerTag, KibiIcon } from '@/shared/ui';
import {
  BookOpen,
  FlaskConical,
  BookText,
  Globe,
  Target,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

/**
 * Daily Session Section Component
 * Displays personalized lesson recommendations within the dashboard
 * Uses the new daily-test/session/generate endpoint that follows
 * the 3-subject rotation algorithm based on the day
 */
export const DailySessionSection = React.forwardRef<HTMLElement>(
  (props, ref) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<RecommendedLesson[]>([]);
    const [error, setError] = useState<string | null>(null);
    const hasLoadedRef = React.useRef(false);

    useEffect(() => {
      // Prevent duplicate requests - only load once
      if (hasLoadedRef.current) {
        return;
      }

      hasLoadedRef.current = true;

      const loadRecommendations = async () => {
        setLoading(true);
        setError(null);
        try {
          // Use the new endpoint that follows the 3-subject rotation algorithm
          const data = await dailyTestAPI.generateDailySession();
          setRecommendations(data.recommendedLessons || []);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error('Error loading daily session:', err.message);
            // Check if it's a "must complete daily test first" error
            if (err.message.includes('daily test') || err.message.includes('must complete')) {
              setError('Debes completar el test diario antes de acceder a la sesión de estudio');
            } else {
              setError(err.message);
            }
          } else {
            console.error('Error loading daily session:', err);
            setError('Error al cargar las recomendaciones');
          }
          setRecommendations([]);
        } finally {
          setLoading(false);
        }
      };

      loadRecommendations();
    }, []);

    const getSubjectIcon = (subjectName: string) => {
      const name = subjectName.toLowerCase();
      if (name.includes('matemática') || name.includes('álgebra') || name.includes('cálculo'))
        return BookOpen;
      if (
        name.includes('ciencia') ||
        name.includes('física') ||
        name.includes('química')
      )
        return FlaskConical;
      if (name.includes('lectura') || name.includes('comprensión') || name.includes('redacción'))
        return BookText;
      if (name.includes('historia') || name.includes('geografía') || name.includes('economía'))
        return Globe;
      return Target;
    };

    const getSubjectColor = (index: number) => {
      const colors = [
        'bg-primary-green/10 text-primary-green',
        'bg-blue-500/10 text-blue-500',
        'bg-cyan-500/10 text-cyan-500',
        'bg-purple-500/10 text-purple-500',
      ];
      return colors[index % colors.length];
    };

    const handleStartLesson = (recommendation: RecommendedLesson) => {
      // Navigate to lesson if available
      if (recommendation.status !== 'LOCKED') {
        window.location.href = `/daily-session/lesson/${recommendation._id}`;
      }
    };

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
                <Target className="w-6 h-6 text-primary-green" />
              </div>
              <h1 className="text-3xl font-bold text-grey-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                Tu ruta de hoy
              </h1>
            </div>
            <p className="text-grey-600 dark:text-gray-400 font-[family-name:var(--font-rubik)]">
              Recomendaciones personalizadas basadas en tu progreso
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
            </div>
          )}

          {/* Error State - Must complete daily test */}
          {!loading && error && (
            <div className="text-center py-20">
              <div className="inline-flex p-4 bg-orange-100 dark:bg-orange-900/20 rounded-full mb-4">
                <AlertCircle className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-2">
                {error}
              </h3>
              <p className="text-grey-600 dark:text-gray-400 mb-6">
                Completa el test diario para desbloquear tu sesión de estudio personalizada
              </p>
              <Button onClick={() => router.push('/daily-test')}>
                Ir al Test Diario
              </Button>
            </div>
          )}

          {/* Recommendations Grid */}
          {!loading && !error && recommendations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((rec, index) => {
                const IconComponent = getSubjectIcon(rec.subjectName);
                const colorClass = getSubjectColor(index);
                const isDisabled = rec.status === 'LOCKED';

                return (
                  <Card
                    key={`${rec.subjectId}-${rec._id}`}
                    className={cn(
                      'bg-white dark:bg-[#131820] border-grey-200 dark:border-gray-800 transition-all duration-200',
                      isDisabled
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:border-primary-green/50 dark:hover:border-primary-green/30 cursor-pointer group'
                    )}
                    onClick={() => handleStartLesson(rec)}
                  >
                    <CardContent className="p-0">
                      {/* Icon and Subject Tag */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={cn('p-3 rounded-lg flex-shrink-0', colorClass)}>
                          {rec.subjectIconUrl ? (
                            <img
                              src={rec.subjectIconUrl}
                              alt={rec.subjectName}
                              className="w-6 h-6"
                            />
                          ) : (
                            <IconComponent className="w-6 h-6" />
                          )}
                        </div>
                        <CareerTag career={rec.subjectName} />
                      </div>

                      {/* Title */}
                      <h3
                        className={cn(
                          'text-lg font-bold mb-2 font-[family-name:var(--font-quicksand)] transition-colors',
                          isDisabled
                            ? 'text-gray-500'
                            : 'text-grey-900 dark:text-white group-hover:text-primary-green'
                        )}
                      >
                        {rec.title}
                      </h3>

                      {/* Topic & Subtopic */}
                      <p className="text-sm text-grey-600 dark:text-gray-400 mb-3 font-[family-name:var(--font-rubik)]">
                        {rec.subjectName} • {rec.subtopicName || rec.difficultyLevel}
                      </p>

                      {/* Reason */}
                      <div className="flex items-start gap-2 mb-4">
                        <KibiIcon
                          size={16}
                          className="mt-0.5 flex-shrink-0"
                        />
                        <p className="text-sm text-grey-700 dark:text-gray-300 font-[family-name:var(--font-rubik)]">
                          {rec.reason}
                        </p>
                      </div>

                      {/* Status Badge */}
                      {rec.status === 'IN_PROGRESS' && rec.progress > 0 && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 rounded-full">
                          <span className="text-xs font-medium text-blue-500">
                            {rec.progress}% completado
                          </span>
                        </div>
                      )}

                      {rec.status === 'COMPLETED' && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 rounded-full">
                          <span className="text-xs font-medium text-green-500">
                            Completado
                          </span>
                        </div>
                      )}

                      {rec.status === 'AVAILABLE' && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 rounded-full">
                          <span className="text-xs font-medium text-green-500">
                            +20% mejora potencial
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && recommendations.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex p-4 bg-grey-200 dark:bg-gray-800/50 rounded-full mb-4">
                <Target className="w-12 h-12 text-grey-500 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-2">
                No hay recomendaciones disponibles
              </h3>
              <p className="text-grey-600 dark:text-gray-400 mb-6">
                Completa más lecciones para recibir recomendaciones
                personalizadas
              </p>
              <Button onClick={() => router.push('/home')}>
                Volver al inicio
              </Button>
            </div>
          )}
        </div>
      </main>
    );
  }
);

DailySessionSection.displayName = 'DailySessionSection';
