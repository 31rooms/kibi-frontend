'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { reviewAPI } from '@/features/review/api/reviewAPI';
import type { PendingReviewsResponse } from '@/features/review/api/types';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { ReviewCard } from '@/shared/ui/ReviewCard';
import { RefreshCw, Clock, AlertCircle } from 'lucide-react';

function ReviewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subtopicId = searchParams?.get('subtopic');

  const [reviews, setReviews] = useState<PendingReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    if (subtopicId && reviews) {
      const review = reviews.reviews.find(r => r.subtopicId === subtopicId);
      if (review) {
        startReview(subtopicId);
      }
    }
  }, [subtopicId, reviews]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewAPI.getPendingReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const startReview = async (subtopicId: string) => {
    try {
      const session = await reviewAPI.generateReviewSession(subtopicId);
      router.push(`/reviews/${session.id}`);
    } catch (error) {
      console.error('Error starting review:', error);
    }
  };

  const skipReview = async (subtopicId: string) => {
    try {
      await reviewAPI.skipReview(subtopicId);
      await loadReviews();
    } catch (error) {
      console.error('Error skipping review:', error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <RefreshCw className="w-8 h-8" />
              Repasos Pendientes
            </h1>
            <p className="text-muted-foreground mt-2">
              Repasa los temas que necesitan refuerzo
            </p>
          </div>
          <Button onClick={loadReviews} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Statistics */}
        {reviews && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{reviews.statistics.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">{reviews.statistics.overdue}</p>
                  <p className="text-sm text-muted-foreground">Atrasados</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">{reviews.statistics.dueToday}</p>
                  <p className="text-sm text-muted-foreground">Hoy</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{reviews.statistics.dueThisWeek}</p>
                  <p className="text-sm text-muted-foreground">Esta semana</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reviews List */}
        {reviews && reviews.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.reviews.map((review) => (
              <ReviewCard
                key={review.subtopicId}
                review={review}
                onStart={() => startReview(review.subtopicId)}
                onSkip={() => skipReview(review.subtopicId)}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <Clock className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay repasos pendientes</h3>
              <p className="text-muted-foreground text-center">
                Todas tus lecciones están al día. Sigue estudiando para mantener tu progreso!
              </p>
              <Button onClick={() => router.push('/home')} className="mt-6">
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    }>
      <ReviewsContent />
    </Suspense>
  );
}