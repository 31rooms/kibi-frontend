'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { mockExamsAPI } from '@/features/mock-exams/api/mockExamsAPI';
import type { MockExamAttempt, MockExamAvailability } from '@/features/mock-exams/api/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Alert, AlertDescription } from '@/shared/ui/Alert';
import { Target, Lock, AlertCircle, Trophy } from 'lucide-react';

export default function MockExamsPage() {
  const router = useRouter();
  const [availability, setAvailability] = useState<MockExamAvailability | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    setLoading(true);
    try {
      const data = await mockExamsAPI.checkAvailability();
      setAvailability(data);
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const startExam = async () => {
    setLoading(true);
    try {
      const response = await mockExamsAPI.startMockExam({ confirmStart: true });
      router.push(`/mock-exams/${response.attemptId}`);
    } catch (error) {
      console.error('Error starting exam:', error);
      setLoading(false);
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
      <div className="container max-w-4xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Target className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Simulacro de Examen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {availability?.canTakeExam ? (
              <>
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Examen completo de 120 preguntas - 3 horas
                  </p>
                  <div className="grid grid-cols-3 gap-4 py-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">120</p>
                      <p className="text-sm text-muted-foreground">Preguntas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">180</p>
                      <p className="text-sm text-muted-foreground">Minutos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{availability.remainingExams}</p>
                      <p className="text-sm text-muted-foreground">Restantes</p>
                    </div>
                  </div>
                </div>

                <Button onClick={startExam} className="w-full" size="lg" disabled={loading}>
                  Comenzar Simulacro
                </Button>
              </>
            ) : (
              <>
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    {availability?.message || 'No tienes simulacros disponibles'}
                  </AlertDescription>
                </Alert>
                {availability?.userPlan === 'FREE' && (
                  <Button onClick={() => router.push('/subscriptions')} className="w-full">
                    Upgrade a Premium
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}