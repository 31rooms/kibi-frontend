'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { mockExamsAPI } from '../api/mock-exams-service';
import type {
  MockExamQuestion,
  MockExamResults,
  CompleteMockExamResponse,
  AttemptSummaryResponse,
  StartMockExamResponse,
  StartDynamicMockExamResponse,
  ResumeAttemptResponse,
  LocalAnswer,
  LastCompletedAttemptInfo,
} from '../types/mock-exam.types';

// Local storage key for offline support
const ATTEMPT_STORAGE_KEY = 'kibi_mock_exam_attempt';

interface StoredAttemptState {
  attemptId: string;
  mockExamId?: string; // Optional for dynamic exams
  mockExamName: string;
  questions: MockExamQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, LocalAnswer>;
  timeRemainingSeconds: number;
  startedAt: string;
  lastSyncedAt: number;
  isDynamic?: boolean; // Flag for dynamic exams
}

export interface UseMockExamOptions {
  /** Mock exam ID (optional for dynamic exams) */
  mockExamId?: string;
  /** Purchase ID (required to start new attempt for pre-created exams) */
  purchaseId?: string;
  /** Use dynamic exam generation (doesn't require mockExamId) */
  dynamicMode?: boolean;
  /** Callback when exam is completed */
  onComplete?: (results: CompleteMockExamResponse) => void;
  /** Callback when time runs out */
  onTimeUp?: () => void;
}

export interface UseMockExamReturn {
  // State
  isLoading: boolean;
  error: string | null;
  hasActiveAttempt: boolean;
  attemptId: string | null;
  /** Info about the last completed attempt (for viewing previous results) */
  lastCompletedAttempt: LastCompletedAttemptInfo | null;

  // Exam data
  mockExamName: string;
  questions: MockExamQuestion[];
  currentQuestionIndex: number;
  currentQuestion: MockExamQuestion | null;
  totalQuestions: number;

  // Answers
  selectedAnswers: string[];
  getAnswer: (questionId: string) => string[] | undefined;
  answeredCount: number;

  // Timer
  timeRemainingSeconds: number;
  isTimerRunning: boolean;
  formatTime: (seconds: number) => string;

  // Results
  isCompleted: boolean;
  results: CompleteMockExamResponse | null;

  // Actions
  startExam: () => Promise<boolean>;
  resumeExam: () => Promise<boolean>;
  setSelectedAnswers: (answers: string[]) => void;
  submitAnswer: () => Promise<void>;
  skipQuestion: () => void;
  goToQuestion: (index: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  completeExam: () => Promise<void>;
}

/**
 * Hook for managing mock exam (simulacro) state
 *
 * Features:
 * - Syncs with backend for state persistence
 * - Local offline support
 * - Global timer (270 minutes / 4.5 hours)
 * - Auto-complete on time up
 * - No immediate feedback on answers
 */
export function useMockExam({
  mockExamId,
  purchaseId,
  dynamicMode = false,
  onComplete,
  onTimeUp,
}: UseMockExamOptions): UseMockExamReturn {
  // Loading and error state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDynamic, setIsDynamic] = useState(dynamicMode);

  // Attempt state
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [hasActiveAttempt, setHasActiveAttempt] = useState(false);

  // Exam data
  const [mockExamName, setMockExamName] = useState('');
  const [questions, setQuestions] = useState<MockExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Answers (questionId -> LocalAnswer)
  const [answers, setAnswers] = useState<Map<string, LocalAnswer>>(new Map());
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  // Timer
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  // Results
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<CompleteMockExamResponse | null>(null);

  // Last completed attempt (for viewing previous results)
  const [lastCompletedAttempt, setLastCompletedAttempt] = useState<LastCompletedAttemptInfo | null>(null);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] || null;
  const answeredCount = Array.from(answers.values()).filter(
    (a) => a.selectedAnswer.length > 0
  ).length;

  // Format time as HH:MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Save state to localStorage for offline support
  const saveToLocalStorage = useCallback(() => {
    if (!attemptId || !questions.length) return;

    const state: StoredAttemptState = {
      attemptId,
      mockExamId,
      mockExamName,
      questions,
      currentQuestionIndex,
      answers: Object.fromEntries(answers),
      timeRemainingSeconds,
      startedAt: new Date().toISOString(),
      lastSyncedAt: Date.now(),
      isDynamic,
    };

    try {
      localStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save exam state to localStorage:', e);
    }
  }, [attemptId, mockExamId, mockExamName, questions, currentQuestionIndex, answers, timeRemainingSeconds, isDynamic]);

  // Load state from localStorage
  const loadFromLocalStorage = useCallback((): StoredAttemptState | null => {
    try {
      const stored = localStorage.getItem(ATTEMPT_STORAGE_KEY);
      if (!stored) return null;

      const state: StoredAttemptState = JSON.parse(stored);

      // For dynamic exams, just check if it's a dynamic exam state
      // For static exams, verify it's for the same exam
      if (dynamicMode || isDynamic) {
        // For dynamic mode, accept any stored dynamic exam
        if (!state.isDynamic) {
          return null;
        }
      } else {
        // For static mode, must match the exam ID
        if (state.mockExamId !== mockExamId) {
          localStorage.removeItem(ATTEMPT_STORAGE_KEY);
          return null;
        }
      }

      // Calculate elapsed time since last sync
      const elapsedSeconds = Math.floor((Date.now() - state.lastSyncedAt) / 1000);
      state.timeRemainingSeconds = Math.max(0, state.timeRemainingSeconds - elapsedSeconds);

      return state;
    } catch (e) {
      console.error('Failed to load exam state from localStorage:', e);
      return null;
    }
  }, [mockExamId, dynamicMode, isDynamic]);

  // Clear localStorage
  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(ATTEMPT_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear exam state from localStorage:', e);
    }
  }, []);

  // Complete exam handler
  const completeExam = useCallback(async () => {
    if (!attemptId || isCompleted) return;

    setIsLoading(true);
    setIsTimerRunning(false);

    try {
      const response = await mockExamsAPI.completeAttempt(attemptId);
      setResults(response);
      setIsCompleted(true);
      clearLocalStorage();

      if (onComplete) {
        onComplete(response);
      }
    } catch (err: any) {
      console.error('Error completing exam:', err);
      setError(err.response?.data?.message || 'Error al completar el examen');
    } finally {
      setIsLoading(false);
    }
  }, [attemptId, isCompleted, onComplete, clearLocalStorage]);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || timeRemainingSeconds <= 0 || isCompleted) return;

    timerRef.current = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          // Time's up
          setIsTimerRunning(false);
          if (onTimeUp) {
            onTimeUp();
          }
          // Auto-complete exam
          completeExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, timeRemainingSeconds, isCompleted, onTimeUp, completeExam]);

  // Save to localStorage periodically
  useEffect(() => {
    if (!isTimerRunning) return;

    const saveInterval = setInterval(saveToLocalStorage, 10000); // Save every 10 seconds
    return () => clearInterval(saveInterval);
  }, [isTimerRunning, saveToLocalStorage]);

  // Check for active attempt on mount - runs only once
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    const checkActiveAttemptOnMount = async () => {
      setIsLoading(true);

      try {
        // First check localStorage
        try {
          const stored = localStorage.getItem(ATTEMPT_STORAGE_KEY);
          if (stored) {
            const localState = JSON.parse(stored);

            // For dynamic mode, accept stored dynamic exam
            // For static mode, must match exam ID
            const isValidState = dynamicMode
              ? localState.isDynamic
              : localState.mockExamId === mockExamId;

            if (isValidState && localState.timeRemainingSeconds > 0) {
              // Calculate elapsed time
              const elapsedSeconds = Math.floor((Date.now() - localState.lastSyncedAt) / 1000);
              const remainingTime = Math.max(0, localState.timeRemainingSeconds - elapsedSeconds);

              if (remainingTime > 0) {
                setAttemptId(localState.attemptId);
                setMockExamName(localState.mockExamName);
                setQuestions(localState.questions);
                setCurrentQuestionIndex(localState.currentQuestionIndex);
                setAnswers(new Map(Object.entries(localState.answers)));
                setTimeRemainingSeconds(remainingTime);
                setHasActiveAttempt(true);
                setIsTimerRunning(true);
                if (localState.isDynamic) {
                  setIsDynamic(true);
                }

                const currentAnswer = localState.answers[localState.questions[localState.currentQuestionIndex]?._id];
                if (currentAnswer) {
                  setSelectedAnswers(currentAnswer.selectedAnswer);
                }

                setIsLoading(false);
                return;
              }
            }
          }
        } catch (e) {
          console.error('Failed to load from localStorage:', e);
        }

        // For dynamic mode, check if there's an active attempt in the backend
        if (dynamicMode) {
          const activeCheck = await mockExamsAPI.checkActiveAttempt();

          // Save last completed attempt info (for viewing previous results)
          if (activeCheck.lastCompletedAttempt) {
            setLastCompletedAttempt(activeCheck.lastCompletedAttempt);
          }

          if (activeCheck.hasActiveAttempt && activeCheck.attemptId) {
            setAttemptId(activeCheck.attemptId);
            setMockExamName(activeCheck.mockExamName || 'Simulacro EXANI II');
            setTimeRemainingSeconds(activeCheck.timeRemainingSeconds || 0);
            setHasActiveAttempt(true);
            setIsDynamic(true);
            // Don't start timer yet - user needs to click "Continuar"
          } else {
            setHasActiveAttempt(false);
          }

          setIsLoading(false);
          return;
        }

        // For static mode, check backend for active attempt
        if (mockExamId) {
          const { hasActiveAttempt: hasActive, attemptId: activeId, summary } =
            await mockExamsAPI.getActiveAttempt(mockExamId);

          if (hasActive && activeId && summary) {
            setAttemptId(activeId);
            setHasActiveAttempt(true);
            setTimeRemainingSeconds(summary.timeRemainingSeconds);
          } else {
            setHasActiveAttempt(false);
          }
        } else {
          setHasActiveAttempt(false);
        }
      } catch (err: any) {
        console.error('Error checking active attempt:', err);
        setError(err.response?.data?.message || 'Error al verificar el estado del examen');
      } finally {
        setIsLoading(false);
      }
    };

    checkActiveAttemptOnMount();
  }, [mockExamId, dynamicMode]); // Only depend on props, not callbacks

  // Update selected answers when question changes
  useEffect(() => {
    if (!currentQuestion) return;

    const existingAnswer = answers.get(currentQuestion._id);
    if (existingAnswer) {
      setSelectedAnswers(existingAnswer.selectedAnswer);
    } else {
      setSelectedAnswers([]);
    }

    questionStartTimeRef.current = Date.now();
  }, [currentQuestionIndex, currentQuestion, answers]);

  // Start new exam
  const startExam = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Dynamic mode: use the new endpoint that generates exam on-the-fly
      if (dynamicMode) {
        const response = await mockExamsAPI.startDynamicExam();

        setAttemptId(response.attemptId);
        setMockExamName(response.mockExamName);
        setQuestions(response.questions);
        setTimeRemainingSeconds(response.timeRemainingSeconds);
        setCurrentQuestionIndex(0);
        setAnswers(new Map());
        setSelectedAnswers([]);
        setHasActiveAttempt(true);
        setIsTimerRunning(true);
        setIsCompleted(false);
        setResults(null);
        setIsDynamic(true);

        questionStartTimeRef.current = Date.now();

        return true;
      }

      // Static mode: use the pre-created exam endpoint
      if (!purchaseId) {
        setError('No se encontró la compra del simulacro');
        return false;
      }

      if (!mockExamId) {
        setError('No se encontró el ID del simulacro');
        return false;
      }

      const response = await mockExamsAPI.startAttempt(mockExamId, {
        mockExamPurchasedId: purchaseId,
      });

      setAttemptId(response.attemptId);
      setMockExamName(response.mockExamName);
      setQuestions(response.questions);
      setTimeRemainingSeconds(response.timeRemainingSeconds);
      setCurrentQuestionIndex(0);
      setAnswers(new Map());
      setSelectedAnswers([]);
      setHasActiveAttempt(true);
      setIsTimerRunning(true);
      setIsCompleted(false);
      setResults(null);

      questionStartTimeRef.current = Date.now();

      return true;
    } catch (err: any) {
      console.error('Error starting exam:', err);
      setError(err.response?.data?.message || 'Error al iniciar el examen');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [mockExamId, purchaseId, dynamicMode]);

  // Use ref to always have latest attemptId
  const attemptIdRef = useRef(attemptId);
  attemptIdRef.current = attemptId;

  // Resume existing exam
  const resumeExam = useCallback(async (): Promise<boolean> => {
    // Use ref to get the latest attemptId value
    const currentAttemptId = attemptIdRef.current;

    if (!currentAttemptId) {
      setError('No hay un intento activo para reanudar');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // If we already have questions loaded (from localStorage), just update time
      if (questions.length > 0) {
        const summary = await mockExamsAPI.getAttemptSummary(currentAttemptId);

        if (summary.status !== 'IN_PROGRESS') {
          setError('Este intento ya fue completado o expiró');
          return false;
        }

        setTimeRemainingSeconds(summary.timeRemainingSeconds);
        setIsTimerRunning(true);
        setHasActiveAttempt(true);
        return true;
      }

      // Otherwise fetch questions from backend using the resume endpoint
      const response = await mockExamsAPI.resumeAttempt(currentAttemptId);

      // Load the questions and state from backend
      setMockExamName(response.mockExamName);
      setQuestions(response.questions);
      setTimeRemainingSeconds(response.timeRemainingSeconds);
      setCurrentQuestionIndex(response.currentQuestionIndex);
      setHasActiveAttempt(true);
      setIsTimerRunning(true);

      // Reconstruct answers map from answeredQuestions (with actual givenAnswer)
      const answersMap = new Map<string, LocalAnswer>();
      for (const answerInfo of response.answeredQuestions || []) {
        answersMap.set(answerInfo.questionId, {
          questionId: answerInfo.questionId,
          selectedAnswer: answerInfo.givenAnswer, // Actual answer from backend
          timeSpentSeconds: 0,
          submittedToBackend: true,
        });
      }
      setAnswers(answersMap);

      // Update selected answers for current question (pre-select if already answered)
      const currentQ = response.questions[response.currentQuestionIndex];
      if (currentQ) {
        const existingAnswer = answersMap.get(currentQ._id);
        if (existingAnswer && existingAnswer.selectedAnswer.length > 0) {
          setSelectedAnswers(existingAnswer.selectedAnswer);
        } else {
          setSelectedAnswers([]);
        }
      }

      questionStartTimeRef.current = Date.now();

      return true;
    } catch (err: any) {
      console.error('Error resuming exam:', err);
      setError(err.response?.data?.message || 'Error al reanudar el examen');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [questions.length]); // attemptId is accessed via ref

  // Submit answer to backend
  const submitAnswer = useCallback(async () => {
    if (!attemptId || !currentQuestion || selectedAnswers.length === 0) return;

    const timeSpent = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);

    // Save locally first
    const localAnswer: LocalAnswer = {
      questionId: currentQuestion._id,
      selectedAnswer: selectedAnswers,
      timeSpentSeconds: timeSpent,
      submittedToBackend: false,
    };

    setAnswers((prev) => {
      const newMap = new Map(prev);
      newMap.set(currentQuestion._id, localAnswer);
      return newMap;
    });

    // Submit to backend (fire and forget, will retry on sync)
    try {
      await mockExamsAPI.submitAnswer(attemptId, {
        questionId: currentQuestion._id,
        selectedAnswer: selectedAnswers,
        timeSpentSeconds: timeSpent,
        timeRemainingSeconds: timeRemainingSeconds, // Save current timer for pause/resume
      });

      // Mark as synced
      setAnswers((prev) => {
        const newMap = new Map(prev);
        const answer = newMap.get(currentQuestion._id);
        if (answer) {
          newMap.set(currentQuestion._id, { ...answer, submittedToBackend: true });
        }
        return newMap;
      });
    } catch (err) {
      console.error('Error submitting answer (will retry):', err);
      // Don't block the user, we'll sync later
    }

    // Move to next question
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [attemptId, currentQuestion, selectedAnswers, currentQuestionIndex, totalQuestions, timeRemainingSeconds]);

  // Skip question - also sends to backend with empty answer
  const skipQuestion = useCallback(async () => {
    if (!currentQuestion) return;

    const timeSpent = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);

    // Save as empty answer locally
    const localAnswer: LocalAnswer = {
      questionId: currentQuestion._id,
      selectedAnswer: [],
      timeSpentSeconds: timeSpent,
      submittedToBackend: false,
    };

    setAnswers((prev) => {
      const newMap = new Map(prev);
      newMap.set(currentQuestion._id, localAnswer);
      return newMap;
    });

    // Submit to backend as skipped (empty array)
    if (attemptId) {
      try {
        await mockExamsAPI.submitAnswer(attemptId, {
          questionId: currentQuestion._id,
          selectedAnswer: [], // Empty = skipped
          timeSpentSeconds: timeSpent,
          timeRemainingSeconds: timeRemainingSeconds, // Save current timer for pause/resume
        });

        // Mark as synced
        setAnswers((prev) => {
          const newMap = new Map(prev);
          const answer = newMap.get(currentQuestion._id);
          if (answer) {
            newMap.set(currentQuestion._id, { ...answer, submittedToBackend: true });
          }
          return newMap;
        });
      } catch (err) {
        console.error('Error submitting skipped question:', err);
      }
    }

    // Move to next question
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [attemptId, currentQuestion, currentQuestionIndex, totalQuestions, timeRemainingSeconds]);

  // Navigation
  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalQuestions) {
        setCurrentQuestionIndex(index);
      }
    },
    [totalQuestions]
  );

  const goToNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const goToPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Get answer for a question
  const getAnswer = useCallback(
    (questionId: string): string[] | undefined => {
      return answers.get(questionId)?.selectedAnswer;
    },
    [answers]
  );

  return {
    // State
    isLoading,
    error,
    hasActiveAttempt,
    attemptId,
    lastCompletedAttempt,

    // Exam data
    mockExamName,
    questions,
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,

    // Answers
    selectedAnswers,
    getAnswer,
    answeredCount,

    // Timer
    timeRemainingSeconds,
    isTimerRunning,
    formatTime,

    // Results
    isCompleted,
    results,

    // Actions
    startExam,
    resumeExam,
    setSelectedAnswers,
    submitAnswer,
    skipQuestion,
    goToQuestion,
    goToNext,
    goToPrevious,
    completeExam,
  };
}
