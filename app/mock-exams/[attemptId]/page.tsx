'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { mockExamsAPI } from '@/features/mock-exams/api/mockExamsAPI';
import type { MockExamAttempt, MockExamQuestion } from '@/features/mock-exams/api/types';
import { MockExamSession } from '@/features/mock-exams/components/MockExamSession';

/**
 * Mock Exam Session Page
 * Route: /mock-exams/[attemptId]
 *
 * Complete mock exam session with:
 * - 180-minute timer with warnings
 * - Navigation grid for 120 questions
 * - Question states (answered, marked for review)
 * - Confirmation before submit
 * - Detailed results
 */
export default function MockExamSessionPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const unwrappedParams = use(params);
  const attemptId = unwrappedParams.attemptId;

  return (
    <ProtectedRoute>
      <MockExamSession attemptId={attemptId} />
    </ProtectedRoute>
  );
}
