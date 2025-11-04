'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Alert, Button } from '@/shared/ui';
import { useSubjectHierarchy } from '../hooks/useSubjectHierarchy';
import { progressAPI } from '@/features/progress/api/progressAPI';
import { reviewAPI } from '@/features/review/api/reviewAPI';
import type { LessonViewProps } from '../types/lesson.types';
import type { SubjectDetail } from '@/features/progress/api/types';
import type { PendingReview } from '@/features/review/api/types';
import { ArrowLeft, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { RecommendationCard } from '../components/RecommendationCard';
import { ReviewsListCard } from '../components/ReviewsListCard';
import { SubjectStats } from '../components/SubjectStats';
import { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/ui/Accordion';
// Using console.log for notifications (can be replaced with a toast library if needed)

/**
 * Enhanced LessonView Component
 * Displays subject hierarchy with intelligent recommendations and progress tracking
 *
 * Features:
 * - Smart recommendations based on effectiveness
 * - Pending reviews for the subject
 * - Detailed progress statistics
 * - Dynamic hierarchy with progress indicators
 */
export const EnhancedLessonView = React.forwardRef<HTMLDivElement, LessonViewProps>(
  ({ subjectId }, ref) => {
    const router = useRouter();
    const { hierarchy, isLoading, error, refetch } = useSubjectHierarchy(subjectId);
    const [subjectDetail, setSubjectDetail] = useState<SubjectDetail | null>(null);
    const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
    const [recommendation, setRecommendation] = useState<any>(null);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
      if (subjectId && !isLoading) {
        loadAllData();
      }
    }, [subjectId, isLoading]);

    const loadAllData = async () => {
      setLoadingData(true);
      try {
        // Load subject detail
        const detail = await progressAPI.getSubjectDetail(subjectId);
        setSubjectDetail(detail);

        // Load pending reviews for this subject
        const reviewsData = await reviewAPI.getPendingReviews();
        const subjectReviews = reviewsData.reviews.filter(
          (r) => r.subjectName === detail.subject.name
        );
        setPendingReviews(subjectReviews);

        // Calculate recommendation
        calculateRecommendation(detail, subjectReviews);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    const calculateRecommendation = (detail: SubjectDetail, reviews: PendingReview[]) => {
      // Priority order:
      // 1. Overdue reviews
      // 2. Subtopics with effectiveness < 70%
      // 3. Incomplete subtopics at user's level
      // 4. Next subtopic in sequence

      // Check for overdue reviews
      const overdueReview = reviews.find((r) => r.overdue);
      if (overdueReview) {
        setRecommendation({
          type: 'overdue_review',
          topicName: overdueReview.topicName,
          subtopicName: overdueReview.subtopicName,
          subtopicId: overdueReview.subtopicId,
          level: detail.level,
          reason: `Este repaso está atrasado ${overdueReview.daysSinceLastReview} días. Es importante repasarlo para mantener tu dominio.`,
          effectiveness: overdueReview.masteryLevel * 20, // Convert 0-5 to percentage
        });
        return;
      }

      // Check for low effectiveness subtopics
      for (const topic of detail.topics) {
        for (const subtopic of topic.subtopics) {
          if (subtopic.effectiveness < 70 && subtopic.questionsAnswered > 0) {
            setRecommendation({
              type: 'low_effectiveness',
              topicName: topic.name,
              subtopicName: subtopic.name,
              subtopicId: subtopic.id,
              level: detail.level,
              reason: `Tu efectividad en este subtema es ${subtopic.effectiveness.toFixed(1)}%. Necesitas reforzarlo.`,
              effectiveness: subtopic.effectiveness,
            });
            return;
          }
        }
      }

      // Check for reviews due today
      const todayReview = reviews.find((r) => !r.overdue && r.priority === 'HIGH');
      if (todayReview) {
        setRecommendation({
          type: 'scheduled_review',
          topicName: todayReview.topicName,
          subtopicName: todayReview.subtopicName,
          subtopicId: todayReview.subtopicId,
          level: detail.level,
          reason: 'Este repaso está programado para hoy. Mantén tu racha de estudio.',
          effectiveness: todayReview.masteryLevel * 20,
        });
        return;
      }

      // Check for incomplete subtopics
      for (const topic of detail.topics) {
        for (const subtopic of topic.subtopics) {
          if (subtopic.questionsAnswered === 0) {
            setRecommendation({
              type: 'new_content',
              topicName: topic.name,
              subtopicName: subtopic.name,
              subtopicId: subtopic.id,
              level: detail.level,
              reason: 'Aún no has estudiado este subtema. Es el siguiente en tu secuencia de aprendizaje.',
              effectiveness: 0,
            });
            return;
          }
        }
      }

      // No specific recommendation
      setRecommendation(null);
    };

    const handleStartRecommendation = () => {
      if (!recommendation) return;

      if (recommendation.type === 'overdue_review' || recommendation.type === 'scheduled_review') {
        router.push(`/reviews?subtopic=${recommendation.subtopicId}`);
      } else {
        // Navigate to lesson
        router.push(`/lesson/${subjectId}`); // This would ideally navigate to specific subtopic
        console.log('Navigating to lesson...');
      }
    };

    const handleStartReview = async (subtopicId: string) => {
      router.push(`/reviews?subtopic=${subtopicId}`);
    };

    const handleBack = () => {
      router.back();
    };

    // Loading state
    if (isLoading || loadingData) {
      return (
        <div
          ref={ref}
          className="min-h-screen flex items-center justify-center bg-background-white dark:bg-[#171B22]"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            <p className="text-grey-600 dark:text-grey-400 text-sm">Cargando contenido...</p>
          </div>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div
          ref={ref}
          className="min-h-screen flex items-center justify-center bg-background-white dark:bg-[#171B22] p-6"
        >
          <div className="max-w-md w-full space-y-4">
            <Alert variant="destructive">
              <p className="font-medium">Error al cargar el contenido</p>
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

    if (!hierarchy || !subjectDetail) {
      return null;
    }

    const getLevelColor = () => {
      switch (subjectDetail.level) {
        case 'BASICO':
          return 'bg-red-500';
        case 'INTERMEDIO':
          return 'bg-yellow-500';
        case 'AVANZADO':
          return 'bg-green-500';
      }
    };

    return (
      <div ref={ref} className="min-h-screen bg-grey-50 dark:bg-[#171B22]">
        {/* Header */}
        <div className="bg-white dark:bg-[#1E242D] border-b border-grey-200 dark:border-[#374151] sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <button
              onClick={handleBack}
              className={cn(
                'flex items-center gap-2 mb-4',
                'text-dark-900 dark:text-white hover:text-primary-blue dark:hover:text-primary-green',
                'transition-colors'
              )}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Volver</span>
            </button>

            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{hierarchy.subject.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {hierarchy.subject.description}
                  </p>
                </div>
                <div className={cn('px-3 py-1 rounded-full text-white text-sm font-medium', getLevelColor())}>
                  {subjectDetail.level}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Efectividad</span>
                  <span className="font-medium">{subjectDetail.effectiveness.toFixed(1)}%</span>
                </div>
                <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'absolute left-0 top-0 h-full transition-all rounded-full',
                      subjectDetail.effectiveness >= 80
                        ? 'bg-green-600'
                        : subjectDetail.effectiveness >= 50
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                    )}
                    style={{ width: `${subjectDetail.effectiveness}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          {/* Recommendation Card */}
          {recommendation && (
            <RecommendationCard
              topicName={recommendation.topicName}
              subtopicName={recommendation.subtopicName}
              level={recommendation.level}
              reason={recommendation.reason}
              effectiveness={recommendation.effectiveness}
              onStart={handleStartRecommendation}
            />
          )}

          {/* Pending Reviews */}
          {pendingReviews.length > 0 && (
            <ReviewsListCard
              reviews={pendingReviews}
              onStartReview={handleStartReview}
            />
          )}

          {/* Grid: Hierarchy + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hierarchy */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Temas y Subtemas</CardTitle>
                </CardHeader>
                <CardContent>
                  <AccordionRoot type="multiple" className="space-y-2">
                    {hierarchy.topics
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((topic) => {
                        const topicProgress = subjectDetail.topics.find((t) => t.id === topic._id);
                        const isCompleted = topicProgress?.progress.completed || false;

                        return (
                          <AccordionItem key={topic._id} value={topic._id}>
                            <AccordionTrigger>
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={cn(
                                      'w-2 h-2 rounded-full',
                                      isCompleted
                                        ? 'bg-green-500'
                                        : topicProgress?.progress.questionsAnswered
                                        ? 'bg-yellow-500'
                                        : 'bg-gray-300'
                                    )}
                                  />
                                  <span>{topic.name}</span>
                                </div>
                                {topicProgress && (
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {topicProgress.progress.correctAnswers} /{' '}
                                    {topicProgress.progress.questionsAnswered}
                                  </span>
                                )}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 pl-4">
                                {topic.subtopics
                                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                                  .map((subtopic) => {
                                    const subtopicProgress = topicProgress?.subtopics.find(
                                      (s) => s.id === subtopic._id
                                    );

                                    return (
                                      <div
                                        key={subtopic._id}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                      >
                                        <div className="flex-1">
                                          <p className="font-medium text-sm">{subtopic.name}</p>
                                          {subtopicProgress && (
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 dark:text-gray-400">
                                              <span>
                                                Progreso: {subtopicProgress.correctAnswers} /{' '}
                                                {subtopicProgress.questionsAnswered}
                                              </span>
                                              <span
                                                className={cn(
                                                  'px-2 py-0.5 rounded',
                                                  subtopicProgress.effectiveness >= 80
                                                    ? 'bg-green-100 text-green-700'
                                                    : subtopicProgress.effectiveness >= 50
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                                )}
                                              >
                                                {subtopicProgress.effectiveness.toFixed(0)}%
                                              </span>
                                              {subtopicProgress.nextReviewDate && (
                                                <span className="text-yellow-600">
                                                  Repaso programado
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                  </AccordionRoot>
                </CardContent>
              </Card>
            </div>

            {/* Subject Stats */}
            <div className="lg:col-span-1">
              <SubjectStats subjectDetail={subjectDetail} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

EnhancedLessonView.displayName = 'EnhancedLessonView';
