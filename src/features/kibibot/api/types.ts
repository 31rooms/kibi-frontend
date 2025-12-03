// KibiBot Types - Aligned with backend API

// === Enums ===
export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';
export type QuickActionType = 'SUBJECT' | 'ACTION';
export type SubscriptionPlan = 'FREE' | 'GOLD' | 'DIAMOND';

// === Quick Actions ===
export interface QuickAction {
  type: QuickActionType;
  label: string;
  value: string;
}

// === Recommended Lesson ===
export interface RecommendedLesson {
  lessonId: string;
  title: string;
  url: string;
}

// === Messages ===
export interface KibiBotMessage {
  role: MessageRole;
  content: string;
  timestamp: Date | string;
  tokensUsed?: number;
  quickActions?: QuickAction[];
  recommendedLesson?: RecommendedLesson;
}

// === Sessions ===
export interface KibiBotSession {
  _id: string;
  title: string;
  messageCount: number;
  lastMessageAt?: Date | string;
  isFavorite: boolean;
  createdAt: Date | string;
}

export interface KibiBotSessionDetail {
  session: KibiBotSession;
  messages: KibiBotMessage[];
}

// === Status ===
export interface KibiBotStatus {
  canCreateNewChat: boolean;
  reason?: string;
  activeSessions: number;
  maxSessions: number | null;
  plan: SubscriptionPlan;
}

// === Subject Button ===
export interface SubjectButton {
  letter: string;
  name: string;
  subjectId?: string;
}

// === Request DTOs ===
export interface SendMessageDto {
  message: string;
}

export interface SelectSubjectDto {
  subjectLetter: string;
}

export interface RenameSessionDto {
  title: string;
}

export interface GetSessionsParams {
  search?: string;
  page?: number;
  limit?: number;
  favoritesOnly?: boolean;
}

// === Response Types ===
export interface GetSessionsResponse {
  sessions: KibiBotSession[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateSessionResponse {
  sessionId: string;
  title: string;
  welcomeMessage: string;
  quickActions: QuickAction[];
}

export interface SendMessageResponse {
  userMessage: KibiBotMessage;
  assistantMessage: KibiBotMessage;
  tokensUsed: number;
}

export interface SelectSubjectResponse {
  message: string;
  recommendedLesson?: RecommendedLesson;
}

export interface RenameSessionResponse {
  success: boolean;
  title: string;
}

export interface ToggleFavoriteResponse {
  success: boolean;
  isFavorite: boolean;
}

export interface DeleteSessionResponse {
  success: boolean;
}
