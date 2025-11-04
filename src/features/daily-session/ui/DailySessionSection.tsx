'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dailySessionAPI } from '../api/dailySessionAPI';
import type { DailySessionRecommendation } from '../api/types';
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
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

/**
 * Daily Session Section Component
 * Displays personalized lesson recommendations within the dashboard
 * This is a wrapper component that can be used in the dashboard layout
 */
export const DailySessionSection = React.forwardRef<HTMLElement>(
  (props, ref) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<
      DailySessionRecommendation[]
    >([]);

    useEffect(() => {
      loadRecommendations();
    }, []);

    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const data = await dailySessionAPI.getRecommendations();
        setRecommendations(data.recommendations || []);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error loading recommendations:', error.message);
        } else {
          console.error('Error loading recommendations:', error);
        }
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

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

    const getSubjectColor = (index: number) => {
      const colors = [
        'bg-primary-green/10 text-primary-green',
        'bg-blue-500/10 text-blue-500',
        'bg-cyan-500/10 text-cyan-500',
        'bg-purple-500/10 text-purple-500',
      ];
      return colors[index % colors.length];
    };

    const handleStartLesson = (recommendation: DailySessionRecommendation) => {
      // Solo permitir navegación si hay contenido disponible
      if (recommendation.hasContent && recommendation.lessonId) {
        router.push(`/daily-session/lesson/${recommendation.lessonId}`);
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

          {/* Recommendations Grid */}
          {!loading && recommendations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((rec, index) => {
                const IconComponent = getSubjectIcon(rec.subjectName);
                const colorClass = getSubjectColor(index);
                const isDisabled = !rec.hasContent;

                return (
                  <Card
                    key={`${rec.subjectId}-${rec.lessonId || index}`}
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
                          {rec.iconUrl ? (
                            <img
                              src={rec.iconUrl}
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
                        {rec.lessonTitle}
                      </h3>

                      {/* Topic & Subtopic */}
                      <p className="text-sm text-grey-600 dark:text-gray-400 mb-3 font-[family-name:var(--font-rubik)]">
                        {rec.topicName} • {rec.subtopicName}
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

                      {/* Improvement Badge */}
                      {rec.hasContent &&
                        rec.potentialImprovement &&
                        rec.potentialImprovement !== '0%' && (
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 rounded-full">
                            <span className="text-xs font-medium text-green-500">
                              +{rec.potentialImprovement} mejora potencial
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
          {!loading && recommendations.length === 0 && (
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
