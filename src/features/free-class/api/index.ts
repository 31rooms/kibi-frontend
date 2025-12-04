/**
 * Free Class API Service
 */

import { fetchJSON } from '@/shared/lib/api/fetchWithAuth';
import type {
  MySubjectsResponse,
  SearchLessonsResponse,
  SearchLessonsParams,
  LessonFullResponse,
  StartLessonRequest,
  StartLessonResponse,
  AnswerQuestionRequest,
  AnswerQuestionResponse,
  CompleteLessonRequest,
  CompleteLessonResponse,
} from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

/**
 * Get subjects for the authenticated user based on their career
 */
export async function getMySubjects(): Promise<MySubjectsResponse> {
  return fetchJSON<MySubjectsResponse>(`${API_BASE_URL}/subjects/my-subjects`);
}

/**
 * Search lessons with filters and pagination
 */
export async function searchLessons(params: SearchLessonsParams): Promise<SearchLessonsResponse> {
  const queryParams = new URLSearchParams();

  if (params.search) {
    queryParams.append('search', params.search);
  }
  if (params.subjectId) {
    queryParams.append('subjectId', params.subjectId);
  }
  if (params.difficultyLevel) {
    queryParams.append('difficultyLevel', params.difficultyLevel);
  }
  if (params.limit !== undefined) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params.offset !== undefined) {
    queryParams.append('offset', params.offset.toString());
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/lessons/search${queryString ? `?${queryString}` : ''}`;

  return fetchJSON<SearchLessonsResponse>(url);
}

// ============================================================================
// LESSON API (for lesson view)
// ============================================================================

/**
 * Get complete lesson with categorized questions
 */
export async function getLessonFull(lessonId: string): Promise<LessonFullResponse> {
  return fetchJSON<LessonFullResponse>(`${API_BASE_URL}/lessons/${lessonId}/full`);
}

/**
 * Start a lesson session
 */
export async function startLesson(
  lessonId: string,
  data: StartLessonRequest
): Promise<StartLessonResponse> {
  return fetchJSON<StartLessonResponse>(`${API_BASE_URL}/lessons/${lessonId}/start`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Answer a question in a lesson
 */
export async function answerQuestion(
  lessonId: string,
  questionId: string,
  data: AnswerQuestionRequest
): Promise<AnswerQuestionResponse> {
  return fetchJSON<AnswerQuestionResponse>(
    `${API_BASE_URL}/lessons/${lessonId}/questions/${questionId}/answer`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

/**
 * Complete a lesson session
 */
export async function completeLesson(
  lessonId: string,
  data: CompleteLessonRequest
): Promise<CompleteLessonResponse> {
  return fetchJSON<CompleteLessonResponse>(`${API_BASE_URL}/lessons/${lessonId}/complete`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
