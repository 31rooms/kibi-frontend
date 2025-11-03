'use client';

import React, { use } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ReviewSession } from '@/features/review/components/ReviewSession';

/**
 * Review Session Page
 * Route: /reviews/[sessionId]
 *
 * Complete review session with:
 * - Session info (subtopic, level, effectiveness)
 * - Immediate feedback on answers
 * - Step-by-step explanations
 * - Streak tracking
 * - Progress visualization
 * - Session results with next review date
 */
export default function ReviewSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const unwrappedParams = use(params);
  const sessionId = unwrappedParams.sessionId;

  return (
    <ProtectedRoute>
      <ReviewSession sessionId={sessionId} />
    </ProtectedRoute>
  );
}
