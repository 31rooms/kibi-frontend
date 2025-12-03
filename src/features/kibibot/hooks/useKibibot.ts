'use client';

import { useState, useEffect, useCallback } from 'react';
import { kibibotAPI } from '../api/kibibotAPI';
import type {
  KibiBotStatus,
  KibiBotSession,
  KibiBotSessionDetail,
  KibiBotMessage,
  SubjectButton,
  CreateSessionResponse,
  QuickAction,
} from '../api/types';

interface UseKibibotReturn {
  // State
  status: KibiBotStatus | null;
  sessions: KibiBotSession[];
  currentSession: KibiBotSessionDetail | null;
  subjects: SubjectButton[];
  loading: boolean;
  sendingMessage: boolean;
  error: string | null;

  // Actions
  refreshStatus: () => Promise<void>;
  loadSessions: (search?: string, favoritesOnly?: boolean) => Promise<void>;
  createSession: () => Promise<CreateSessionResponse | null>;
  loadSession: (sessionId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  selectSubject: (letter: string) => Promise<void>;
  renameSession: (sessionId: string, title: string) => Promise<void>;
  toggleFavorite: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearCurrentSession: () => void;
  clearError: () => void;
}

export function useKibibot(): UseKibibotReturn {
  const [status, setStatus] = useState<KibiBotStatus | null>(null);
  const [sessions, setSessions] = useState<KibiBotSession[]>([]);
  const [currentSession, setCurrentSession] = useState<KibiBotSessionDetail | null>(null);
  const [subjects, setSubjects] = useState<SubjectButton[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [statusRes, sessionsRes, subjectsRes] = await Promise.all([
          kibibotAPI.getStatus(),
          kibibotAPI.getSessions(),
          kibibotAPI.getSubjects(),
        ]);
        setStatus(statusRes);
        setSessions(sessionsRes.sessions);
        setSubjects(subjectsRes);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error cargando KibiBot';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      const statusRes = await kibibotAPI.getStatus();
      setStatus(statusRes);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando estado';
      setError(errorMessage);
    }
  }, []);

  const loadSessions = useCallback(async (search?: string, favoritesOnly?: boolean) => {
    try {
      const sessionsRes = await kibibotAPI.getSessions({
        search,
        favoritesOnly,
      });
      setSessions(sessionsRes.sessions);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando sesiones';
      setError(errorMessage);
    }
  }, []);

  const createSession = useCallback(async (): Promise<CreateSessionResponse | null> => {
    try {
      const response = await kibibotAPI.createSession();

      // Create the new session object for the list
      const newSession: KibiBotSession = {
        _id: response.sessionId,
        title: response.title,
        messageCount: 1,
        isFavorite: false,
        createdAt: new Date(),
      };

      // Add to sessions list at the beginning
      setSessions((prev) => [newSession, ...prev]);

      // Create the welcome message
      const welcomeMessage: KibiBotMessage = {
        role: 'ASSISTANT',
        content: response.welcomeMessage,
        timestamp: new Date(),
        quickActions: response.quickActions,
      };

      // Set as current session
      setCurrentSession({
        session: newSession,
        messages: [welcomeMessage],
      });

      // Refresh status to update limits
      await refreshStatus();

      return response;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error creando sesión');
      } else {
        setError('Error creando sesión');
      }
      return null;
    }
  }, [refreshStatus]);

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      const sessionDetail = await kibibotAPI.getSession(sessionId);
      setCurrentSession(sessionDetail);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando sesión';
      setError(errorMessage);
    }
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!currentSession) return;

    setSendingMessage(true);
    try {
      const response = await kibibotAPI.sendMessage(currentSession.session._id, message);

      // Add both messages to the current session
      setCurrentSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, response.userMessage, response.assistantMessage],
          session: {
            ...prev.session,
            messageCount: prev.session.messageCount + 2,
            lastMessageAt: new Date(),
          },
        };
      });

      // Update the session in the list
      setSessions((prev) =>
        prev.map((s) =>
          s._id === currentSession.session._id
            ? { ...s, messageCount: s.messageCount + 2, lastMessageAt: new Date() }
            : s
        )
      );
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error enviando mensaje');
      } else {
        setError('Error enviando mensaje');
      }
    } finally {
      setSendingMessage(false);
    }
  }, [currentSession]);

  const selectSubject = useCallback(async (letter: string) => {
    if (!currentSession) return;

    setSendingMessage(true);
    try {
      const response = await kibibotAPI.selectSubject(currentSession.session._id, letter);

      // Find the subject name
      const subject = subjects.find((s) => s.letter === letter);
      const subjectName = subject?.name || letter;

      // Create user message for the subject selection
      const userMessage: KibiBotMessage = {
        role: 'USER',
        content: subjectName,
        timestamp: new Date(),
      };

      // Create assistant message with recommendation
      const assistantMessage: KibiBotMessage = {
        role: 'ASSISTANT',
        content: response.message,
        timestamp: new Date(),
        recommendedLesson: response.recommendedLesson,
      };

      // Add both messages to the current session
      setCurrentSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, userMessage, assistantMessage],
          session: {
            ...prev.session,
            messageCount: prev.session.messageCount + 2,
            lastMessageAt: new Date(),
          },
        };
      });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error seleccionando asignatura');
      } else {
        setError('Error seleccionando asignatura');
      }
    } finally {
      setSendingMessage(false);
    }
  }, [currentSession, subjects]);

  const renameSession = useCallback(async (sessionId: string, title: string) => {
    try {
      await kibibotAPI.renameSession(sessionId, title);

      // Update in sessions list
      setSessions((prev) =>
        prev.map((s) => (s._id === sessionId ? { ...s, title } : s))
      );

      // Update current session if it's the one being renamed
      setCurrentSession((prev) => {
        if (prev?.session._id === sessionId) {
          return { ...prev, session: { ...prev.session, title } };
        }
        return prev;
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error renombrando sesión';
      setError(errorMessage);
    }
  }, []);

  const toggleFavorite = useCallback(async (sessionId: string) => {
    try {
      const response = await kibibotAPI.toggleFavorite(sessionId);

      // Update in sessions list
      setSessions((prev) =>
        prev.map((s) =>
          s._id === sessionId ? { ...s, isFavorite: response.isFavorite } : s
        )
      );

      // Update current session if it's the one being toggled
      setCurrentSession((prev) => {
        if (prev?.session._id === sessionId) {
          return {
            ...prev,
            session: { ...prev.session, isFavorite: response.isFavorite },
          };
        }
        return prev;
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando favorito';
      setError(errorMessage);
    }
  }, []);

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      await kibibotAPI.deleteSession(sessionId);

      // Remove from sessions list
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));

      // Clear current session if it's the one being deleted
      if (currentSession?.session._id === sessionId) {
        setCurrentSession(null);
      }

      // Refresh status to update limits
      await refreshStatus();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error eliminando sesión';
      setError(errorMessage);
    }
  }, [currentSession, refreshStatus]);

  const clearCurrentSession = useCallback(() => {
    setCurrentSession(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    status,
    sessions,
    currentSession,
    subjects,
    loading,
    sendingMessage,
    error,
    refreshStatus,
    loadSessions,
    createSession,
    loadSession,
    sendMessage,
    selectSubject,
    renameSession,
    toggleFavorite,
    deleteSession,
    clearCurrentSession,
    clearError,
  };
}
