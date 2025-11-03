'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { progressAPI } from '@/features/progress/api/progressAPI';
import type { SubjectsEffectiveness, ProjectedScore } from '@/features/progress/api/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { ProjectedScore as ProjectedScoreComponent } from '@/shared/ui/ProjectedScore';
import { SubjectEffectiveness } from '@/shared/ui/SubjectEffectiveness';
import { TrendIndicator } from '@/shared/ui/TrendIndicator';
import { TrendingUp, Target, BookOpen, Brain } from 'lucide-react';

export default function ProgressPage() {
  const router = useRouter();
  const [effectiveness, setEffectiveness] = useState<SubjectsEffectiveness | null>(null);
  const [projectedScore, setProjectedScore] = useState<ProjectedScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [effectivenessData, scoreData] = await Promise.all([
        progressAPI.getSubjectsEffectiveness(),
        progressAPI.getProjectedScore()
      ]);
      setEffectiveness(effectivenessData);
      setProjectedScore(scoreData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
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
      <div className="container max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="w-8 h-8" />
            Mi Progreso
          </h1>
          <p className="text-muted-foreground mt-2">
            Analiza tu desempeño y áreas de mejora
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projected Score Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Puntaje Proyectado</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {projectedScore && (
                <ProjectedScoreComponent
                  score={projectedScore.currentScore}
                  confidence={projectedScore.confidence}
                  trend={projectedScore.trend === 'IMPROVING' ? 'UP' :
                         projectedScore.trend === 'DECLINING' ? 'DOWN' : 'STABLE'}
                  size="lg"
                  showDetails={true}
                />
              )}
            </CardContent>
          </Card>

          {/* Overall Stats */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas Generales</CardTitle>
            </CardHeader>
            <CardContent>
              {effectiveness && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Efectividad General</p>
                      <p className="text-3xl font-bold">{effectiveness.overall.effectiveness.toFixed(1)}%</p>
                    </div>
                    <TrendIndicator
                      trend={effectiveness.overall.trend}
                      size="lg"
                      showIcon={true}
                      showLabel={true}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Materias Fuertes</p>
                      <div className="space-y-1">
                        {effectiveness.overall.strongSubjects.slice(0, 3).map((subject, i) => (
                          <p key={i} className="text-sm text-green-600 font-medium">✓ {subject}</p>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Necesitan Refuerzo</p>
                      <div className="space-y-1">
                        {effectiveness.overall.weakSubjects.slice(0, 3).map((subject, i) => (
                          <p key={i} className="text-sm text-orange-600 font-medium">⚠ {subject}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Projected Score Breakdown */}
        {projectedScore && projectedScore.breakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Desglose por Materia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectedScore.breakdown.map((subject) => (
                  <div key={subject.subjectId} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{subject.subjectName}</span>
                        <span className="text-sm text-muted-foreground">
                          {subject.projectedScore.toFixed(0)} pts ({subject.effectiveness.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                          style={{ width: `${subject.effectiveness}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subjects Grid */}
        {effectiveness && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Progreso por Materia
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {effectiveness.subjects.map((subject) => (
                <SubjectEffectiveness
                  key={subject.id}
                  name={subject.name}
                  effectiveness={subject.effectiveness}
                  trend={subject.trend}
                  questionsAnswered={subject.questionsAnswered}
                  level={subject.level}
                  showDetails={true}
                  onClick={() => router.push(`/lesson/${subject.id}`)}
                />
              ))}
            </div>
          </>
        )}

        {/* Improvement Projections */}
        {projectedScore?.projectedImprovement && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Proyección de Mejora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">En 7 días</p>
                  <p className="text-2xl font-bold text-blue-600">
                    +{projectedScore.projectedImprovement.in7Days}
                  </p>
                </div>
                <div className="text-center p-4 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">En 30 días</p>
                  <p className="text-2xl font-bold text-purple-600">
                    +{projectedScore.projectedImprovement.in30Days}
                  </p>
                </div>
                <div className="text-center p-4 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Meta</p>
                  <p className="text-2xl font-bold text-green-600">
                    {projectedScore.projectedImprovement.targetScore}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}