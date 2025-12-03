'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { StreakDisplay } from '@/shared/ui/StreakDisplay';
import { ProjectedScore } from '@/shared/ui/ProjectedScore';
import { TestCard } from '@/shared/ui/TestCard';
import { ReviewCard } from '@/shared/ui/ReviewCard';
import { SubjectEffectiveness } from '@/shared/ui/SubjectEffectiveness';
import { AchievementBadge } from '@/shared/ui/AchievementBadge';
import { useProgress } from '@/features/progress/hooks/useProgress';
import { useDailyTest } from '@/features/daily-test/hooks/useDailyTest';
import { reviewAPI } from '@/features/review/api/reviewAPI';
import { progressAPI } from '@/features/progress/api/progressAPI';
import type { PendingReview } from '@/features/review/api/types';
import type { Achievement } from '@/features/progress/api/types';
import {
  Trophy,
  TrendingUp,
  Clock,
  BookOpen,
  ChevronRight,
  Target,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

/**
 * Dashboard Widgets Component
 * Displays cards for streak, projected score, daily test, reviews, and achievements
 */
export function DashboardWidgets() {
  const router = useRouter();
  const { dashboard, loadDashboard, loading: progressLoading } = useProgress();
  const { check, checkAvailability, loading: testLoading } = useDailyTest();
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [weakSubjects, setWeakSubjects] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingAchievements, setLoadingAchievements] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Load dashboard data
      const dashData = await loadDashboard();

      // Load daily test check
      await checkAvailability();

      // Load pending reviews
      loadReviews();

      // Load achievements
      loadAchievements();

      // Load subjects effectiveness
      loadWeakSubjects();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const data = await reviewAPI.getPendingReviews();
      setReviews(data.reviews.slice(0, 3)); // Top 3
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const loadAchievements = async () => {
    setLoadingAchievements(true);
    try {
      const data = await progressAPI.getUserAchievements();
      setAchievements(data.recent.slice(0, 3)); // Last 3
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoadingAchievements(false);
    }
  };

  const loadWeakSubjects = async () => {
    try {
      const data = await progressAPI.getSubjectsEffectiveness();
      // Get subjects with effectiveness < 70%, sorted by effectiveness
      const weak = data.subjects
        .filter((s) => s.effectiveness < 70)
        .sort((a, b) => a.effectiveness - b.effectiveness)
        .slice(0, 5);
      setWeakSubjects(weak);
    } catch (error) {
      console.error('Error loading weak subjects:', error);
    }
  };

  if (progressLoading && !dashboard) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-8 py-6 space-y-6">
      {/* Top Row: Streak + Projected Score + Daily Test */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500" />
              Racha
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard && (
              <StreakDisplay
                currentStreak={dashboard.streak.current}
                maxStreak={dashboard.streak.maximum}
                isActive={dashboard.streak.isActive}
                lastTestDate={dashboard.streak.lastTestDate}
                size="md"
                showDetails={true}
              />
            )}
            {dashboard && !dashboard.streak.isActive && (
              <div className="mt-4">
                <Button
                  onClick={() => router.push('/daily-test')}
                  variant="default"
                  size="sm"
                  className="w-full"
                >
                  Completa tu test diario
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projected Score Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Puntaje Proyectado
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {dashboard && dashboard.projectedScore && (
              <>
                <ProjectedScore
                  score={dashboard.projectedScore.score}
                  confidence={dashboard.projectedScore.confidence}
                  trend={dashboard.projectedScore.trend}
                  changeFromLast={dashboard.projectedScore.changeFromLast}
                  size="md"
                  showDetails={true}
                />
                <Button
                  onClick={() => router.push('/progress')}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Ver desglose
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Daily Test Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Test Diario
            </CardTitle>
          </CardHeader>
          <CardContent>
            {check ? (
              check.available ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">Disponible</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      10 preguntas diarias
                    </p>
                    {dashboard && dashboard.streak.current > 0 && (
                      <div className="flex items-center justify-center gap-2 mt-2 text-orange-500">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Racha de {dashboard.streak.current} días
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => router.push('/daily-test')}
                    className="w-full"
                  >
                    Iniciar Test
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium text-gray-600">Completado hoy</p>
                  <div className="flex items-center justify-center text-green-600">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Vuelve mañana para continuar tu racha
                  </p>
                </div>
              )
            ) : (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Reviews + Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reviews Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                Repasos Pendientes
              </CardTitle>
              {dashboard && dashboard.pendingReviews.count > 0 && (
                <span className="text-2xl font-bold text-yellow-600">
                  {dashboard.pendingReviews.count}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loadingReviews ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review.subtopicId}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{review.subtopicName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {review.subjectName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded',
                            review.priority === 'HIGH'
                              ? 'bg-red-100 text-red-700'
                              : review.priority === 'MEDIUM'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          )}
                        >
                          {review.priority}
                        </span>
                        {review.overdue && (
                          <span className="text-xs text-red-600">Atrasado</span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push(`/reviews?subtopic=${review.subtopicId}`)}
                      size="sm"
                      variant="outline"
                    >
                      Repasar
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => router.push('/reviews')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Ver todos los repasos
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No hay repasos pendientes
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Logros Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAchievements ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <AchievementBadge
                      achievement={{
                        ...achievement,
                        code: achievement.type,
                        type: achievement.type as any,
                        icon: achievement.icon || '🏆',
                        rarity: 'COMMON' as const,
                        points: 100,
                        category: achievement.type,
                      }}
                      size="md"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => router.push('/achievements')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Ver todos los logros
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completa actividades para desbloquear logros
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Third Row: Weak Subjects */}
      {weakSubjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              Materias que Necesitan Refuerzo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weakSubjects.map((subject) => (
                <SubjectEffectiveness
                  key={subject.id}
                  name={subject.name}
                  effectiveness={subject.effectiveness}
                  trend={subject.trend}
                  questionsAnswered={subject.questionsAnswered}
                  level={subject.level}
                  onClick={() => router.push(`/lesson/${subject.id}`)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
