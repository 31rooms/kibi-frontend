'use client';

import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DailyLessonView } from '@/features/daily-session';

/**
 * Daily Session Lesson Page
 * Route: /daily-session/lesson/[id]
 *
 * Displays daily session lessons with practice questions
 * Uses reused lesson styles and components
 */
export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;

  return (
    <ProtectedRoute>
      <DailyLessonView lessonId={lessonId} />
    </ProtectedRoute>
  );
}
