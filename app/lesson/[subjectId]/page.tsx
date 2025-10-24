import { LessonView } from '@/features/lesson';

/**
 * Lesson Page
 * Route: /lesson/[subjectId]
 *
 * Displays the subject hierarchy with topics and lessons
 * This is a thin wrapper that extracts the subjectId from route params
 * and passes it to the LessonView feature component
 */
export default function LessonPage({
  params,
}: {
  params: { subjectId: string };
}) {
  return <LessonView subjectId={params.subjectId} />;
}
