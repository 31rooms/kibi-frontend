'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Clock, Target, Zap, Calendar, Lock, CheckCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface TestCardProps {
  type: 'daily' | 'mock';
  title: string;
  description?: string;
  available?: boolean;
  timeLimit?: number; // in minutes
  questions?: number;
  lastAttempt?: string;
  nextAvailable?: string;
  onStart?: () => void;
  premium?: boolean;
  completed?: boolean;
  className?: string;
}

export const TestCard: React.FC<TestCardProps> = ({
  type,
  title,
  description,
  available = true,
  timeLimit,
  questions,
  lastAttempt,
  nextAvailable,
  onStart,
  premium = false,
  completed = false,
  className
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'daily':
        return <Zap className="w-5 h-5" />;
      case 'mock':
        return <Target className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'daily':
        return 'bg-blue-500';
      case 'mock':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimeLimit = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}min` : ''}`;
    }
    return `${mins} min`;
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200',
        available && !completed && 'hover:shadow-lg hover:scale-[1.02]',
        !available && 'opacity-75',
        className
      )}
    >
      {premium && (
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
            DIAMOND
          </Badge>
        </div>
      )}

      <CardHeader>
        <div className="flex items-start gap-3">
          <div className={cn(
            'p-2 rounded-lg text-white',
            getTypeColor()
          )}>
            {getTypeIcon()}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {questions && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {questions} preguntas
              </span>
            </div>
          )}

          {timeLimit && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatTimeLimit(timeLimit)}
              </span>
            </div>
          )}

          {lastAttempt && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground text-xs">
                Último: {new Date(lastAttempt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {!available && nextAvailable && (
          <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Lock className="w-4 h-4 text-yellow-600" />
            <span className="text-xs text-yellow-700 dark:text-yellow-400">
              Disponible: {new Date(nextAvailable).toLocaleDateString()}
            </span>
          </div>
        )}

        {completed && (
          <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700 dark:text-green-400">
              Completado hoy
            </span>
          </div>
        )}

        <Button
          onClick={onStart}
          disabled={!available || completed}
          className="w-full"
          variant={type === 'daily' ? 'default' : 'secondary'}
        >
          {completed ? 'Completado' : available ? 'Comenzar' : 'No disponible'}
        </Button>
      </CardContent>
    </Card>
  );
};