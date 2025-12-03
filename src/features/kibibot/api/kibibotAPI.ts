import apiClient from '@/features/authentication/api/config';
import type {
  KibiBotStatus,
  SubjectButton,
  GetSessionsResponse,
  GetSessionsParams,
  CreateSessionResponse,
  KibiBotSessionDetail,
  SendMessageResponse,
  SelectSubjectResponse,
  RenameSessionResponse,
  ToggleFavoriteResponse,
  DeleteSessionResponse,
} from './types';

const KIBIBOT_BASE_URL = '/kibibot';

export const kibibotAPI = {
  /**
   * GET /kibibot/status
   * Get the current status of KibiBot for the user
   * Includes limits, active sessions count, and ability to create new chats
   */
  getStatus: async (): Promise<KibiBotStatus> => {
    const response = await apiClient.get(`${KIBIBOT_BASE_URL}/status`);
    return response.data;
  },

  /**
   * GET /kibibot/subjects
   * Get available subjects based on user's plan
   * FREE: C (Matemáticas), F (Inglés)
   * GOLD/DIAMOND: A-F + "Otro"
   */
  getSubjects: async (): Promise<SubjectButton[]> => {
    const response = await apiClient.get(`${KIBIBOT_BASE_URL}/subjects`);
    return response.data;
  },

  /**
   * GET /kibibot/sessions
   * Get all chat sessions with pagination and filters
   */
  getSessions: async (params?: GetSessionsParams): Promise<GetSessionsResponse> => {
    const response = await apiClient.get(`${KIBIBOT_BASE_URL}/sessions`, {
      params: {
        search: params?.search,
        page: params?.page || 1,
        limit: params?.limit || 20,
        favoritesOnly: params?.favoritesOnly || false,
      },
    });
    return response.data;
  },

  /**
   * POST /kibibot/sessions
   * Create a new chat session
   * Returns welcome message and quick actions
   */
  createSession: async (): Promise<CreateSessionResponse> => {
    const response = await apiClient.post(`${KIBIBOT_BASE_URL}/sessions`);
    return response.data;
  },

  /**
   * GET /kibibot/sessions/:sessionId
   * Get a specific session with all messages
   */
  getSession: async (sessionId: string): Promise<KibiBotSessionDetail> => {
    const response = await apiClient.get(`${KIBIBOT_BASE_URL}/sessions/${sessionId}`);
    return response.data;
  },

  /**
   * POST /kibibot/sessions/:sessionId/messages
   * Send a message to KibiBot and get AI response
   */
  sendMessage: async (sessionId: string, message: string): Promise<SendMessageResponse> => {
    const response = await apiClient.post(
      `${KIBIBOT_BASE_URL}/sessions/${sessionId}/messages`,
      { message }
    );
    return response.data;
  },

  /**
   * POST /kibibot/sessions/:sessionId/select-subject
   * Select a subject to get content recommendation
   */
  selectSubject: async (sessionId: string, subjectLetter: string): Promise<SelectSubjectResponse> => {
    const response = await apiClient.post(
      `${KIBIBOT_BASE_URL}/sessions/${sessionId}/select-subject`,
      { subjectLetter }
    );
    return response.data;
  },

  /**
   * PUT /kibibot/sessions/:sessionId/rename
   * Rename a chat session
   */
  renameSession: async (sessionId: string, title: string): Promise<RenameSessionResponse> => {
    const response = await apiClient.put(
      `${KIBIBOT_BASE_URL}/sessions/${sessionId}/rename`,
      { title }
    );
    return response.data;
  },

  /**
   * PUT /kibibot/sessions/:sessionId/favorite
   * Toggle favorite status of a session
   */
  toggleFavorite: async (sessionId: string): Promise<ToggleFavoriteResponse> => {
    const response = await apiClient.put(
      `${KIBIBOT_BASE_URL}/sessions/${sessionId}/favorite`
    );
    return response.data;
  },

  /**
   * DELETE /kibibot/sessions/:sessionId
   * Delete a chat session
   */
  deleteSession: async (sessionId: string): Promise<DeleteSessionResponse> => {
    const response = await apiClient.delete(
      `${KIBIBOT_BASE_URL}/sessions/${sessionId}`
    );
    return response.data;
  },
};
