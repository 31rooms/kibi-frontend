import { LessonView } from '@/features/lesson';

/**
 * Lesson Page
 * Route: /lesson/[subjectId]
 *
 * Displays the subject hierarchy with topics and lessons
 * This is a thin wrapper that extracts the subjectId from route params
 * and passes it to the LessonView feature component
 */
export default async function LessonPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  return <LessonView subjectId={subjectId} />;
}
