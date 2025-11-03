'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { achievementsAPI } from '@/features/achievements/api/achievementsAPI';
import type { UserAchievements } from '@/features/achievements/api/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { AchievementBadge } from '@/shared/ui/AchievementBadge';
import { Progress } from '@/shared/ui/progress';
import { Trophy, Star, Lock, TrendingUp } from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<UserAchievements | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    setLoading(true);
    try {
      const data = await achievementsAPI.getUserAchievements();
      setAchievements(data);
    } catch (error) {
      console.error('Error loading achievements:', error);
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

  if (!achievements) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Error al cargar logros</p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  const filteredUnlocked = selectedCategory === 'all'
    ? achievements.unlocked
    : achievements.unlocked.filter(a => a.category === selectedCategory);

  const filteredLocked = selectedCategory === 'all'
    ? achievements.locked
    : achievements.locked.filter(a => a.category === selectedCategory);

  return (
    <ProtectedRoute>
      <div className="container max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-500" />
            Mis Logros
          </h1>
          <p className="text-muted-foreground">
            Desbloquea logros mientras aprendes y mejoras tu puntaje
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-3xl font-bold">{achievements.statistics.unlocked}</p>
              <p className="text-sm text-muted-foreground">Desbloqueados</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Lock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-3xl font-bold">{achievements.locked.length}</p>
              <p className="text-sm text-muted-foreground">Bloqueados</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-3xl font-bold">{achievements.statistics.points}</p>
              <p className="text-sm text-muted-foreground">Puntos</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-3xl font-bold">{achievements.statistics.percentage.toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">Completado</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress to next rank */}
        {achievements.statistics.nextRank && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progreso de Rango</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge style={{ backgroundColor: achievements.statistics.rank.color }}>
                  {achievements.statistics.rank.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {achievements.statistics.pointsToNextRank} pts para {achievements.statistics.nextRank.name}
                </span>
              </div>
              <Progress
                value={(achievements.statistics.points / achievements.statistics.nextRank.minPoints) * 100}
                className="h-2"
              />
            </CardContent>
          </Card>
        )}

        {/* Category Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                Todos
              </Button>
              {achievements.categories.map((cat) => (
                <Button
                  key={cat.name}
                  variant={selectedCategory === cat.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.icon} {cat.name} ({cat.unlocked}/{cat.achievements})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <Tabs defaultValue="unlocked" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unlocked">
              Desbloqueados ({filteredUnlocked.length})
            </TabsTrigger>
            <TabsTrigger value="locked">
              Bloqueados ({filteredLocked.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unlocked" className="space-y-4">
            {filteredUnlocked.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {filteredUnlocked.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    size="lg"
                    showProgress={false}
                    animate={false}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">
                    No hay logros desbloqueados en esta categoría
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="locked" className="space-y-4">
            {filteredLocked.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {filteredLocked.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    size="lg"
                    showProgress={true}
                    animate={false}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">
                    No hay logros bloqueados en esta categoría
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}