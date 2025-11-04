'use client';

import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/features/dashboard';
import { DailyLessonView } from '@/features/daily-session';

/**
 * Daily Session Lesson Page with Dashboard Layout
 * Route: /daily-session/lesson/[id]
 *
 * Displays daily session lessons with practice questions
 * Wrapped in the dashboard layout (top menu + sidebar)
 */
export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <main className="flex-1 overflow-auto">
          <DailyLessonView lessonId={lessonId} />
        </main>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
