/**
 * Careers API Types
 * Types for the careers/my-subjects endpoint
 */

/**
 * Career information from API
 */
export interface Career {
  _id: string;
  name: string;
  description: string;
  iconUrl: string | null;
}

/**
 * Subject information from API
 */
export interface ApiSubject {
  _id: string;
  name: string;
  icon: string | null;
  questionsInExam: number;
}

/**
 * Response from GET /careers/my-subjects
 */
export interface MySubjectsResponse {
  career: Career;
  subjects: ApiSubject[];
  totalQuestions: number;
}

/**
 * Subject with enabled/disabled state and icon path
 * Used in the UI after merging API data with local subjects
 */
export interface SubjectWithState {
  id: number;
  name: string;
  displayName: string;
  enabled: boolean;
  iconPath: string;
  questionsInExam?: number;
  apiId: string; // MongoDB _id from API (required for navigation)
}
