import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lecciones - Kibi',
  description: 'Aprende con las lecciones interactivas de Kibi',
};

/**
 * Lesson Layout
 * Minimal layout without navbar - just renders children
 * This allows the LessonView component to have full control over the page
 */
export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
