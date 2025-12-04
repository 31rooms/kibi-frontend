'use client';

import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/features/dashboard';
import { FreeLessonView } from '@/features/free-class';

/**
 * Free Class Lesson Page with Dashboard Layout
 * Route: /free-class/lesson/[id]
 *
 * Displays free class lessons with content sections and practice questions
 * Wrapped in the dashboard layout (top menu + sidebar)
 */
export default function FreeLessonPage() {
  const params = useParams();
  const lessonId = params.id as string;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <FreeLessonView lessonId={lessonId} />
        </main>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
