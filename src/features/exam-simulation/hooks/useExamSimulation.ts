'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Question, QuizAnswer, ExamConfig } from '../types';
import { QuestionType } from '@/features/diagnostic-test/types/quiz.types';
import { examStorage, DEFAULT_EXAM_DURATION, type PersistedExamState } from '../utils/exam-storage';

export interface UseExamSimulationOptions {
  /** Exam configuration */
  config: ExamConfig;

  /** Callback when exam is completed */
  onComplete?: (answers: QuizAnswer[]) => void;

  /** Callback when time runs out */
  onTimeUp?: (answers: QuizAnswer[]) => void;
}

export interface UseExamSimulationReturn {
  /** Current question index (0-based) */
  currentQuestionIndex: number;

  /** Current question object */
  currentQuestion: Question;

  /** All user answers collected so far */
  answers: QuizAnswer[];

  /** Whether the exam has been completed */
  isCompleted: boolean;

  /** Currently selected answers (array for multi-select support) */
  selectedAnswers: string[];

  /** Whether current question is answered */
  isAnswered: boolean;

  /** Total number of questions */
  totalQuestions: number;

  /** Get all questions */
  questions: Question[];

  /** Get answer for a specific question */
  getAnswer: (questionId: string) => QuizAnswer | undefined;

  /** Set selected answers for current question (does not submit) */
  setSelectedAnswers: (answers: string[]) => void;

  /** Submit current answer and move to next */
  submitAnswer: () => void;

  /** Skip current question and move to next */
  skipQuestion: () => void;

  /** Move to next question without submitting */
  goToNext: () => void;

  /** Move to previous question */
  goToPrevious: () => void;

  /** Jump to a specific question index */
  goToQuestion: (index: number) => void;

  /** Complete the exam */
  completeExam: () => void;

  /** Reset exam state */
  resetExam: () => void;

  /** Global timer state (entire exam) */
  globalTimeRemaining: number;
  isTimerRunning: boolean;
  initialGlobalTime: number;
  pauseTimer: () => void;
  resumeTimer: () => void;

  /** Format time as HH:MM:SS */
  formatTime: (seconds: number) => string;

  /** Check if there's a saved exam to resume */
  hasSavedExam: boolean;
}

/**
 * Custom hook for managing exam simulation state
 *
 * Features:
 * - Global timer for entire exam (3 hours default)
 * - Automatic state persistence to localStorage
 * - Resume capability after exit
 * - Auto-complete when time runs out
 */
export function useExamSimulation({
  config,
  onComplete,
  onTimeUp,
}: UseExamSimulationOptions): UseExamSimulationReturn {
  // Check for saved exam state on mount
  const [hasSavedExam, setHasSavedExam] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Core state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Global timer state
  const [globalTimeRemaining, setGlobalTimeRemaining] = useState(DEFAULT_EXAM_DURATION);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialGlobalTime = DEFAULT_EXAM_DURATION;

  const questions = config.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  // Format time as HH:MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Complete the exam
  const completeExam = useCallback(() => {
    setIsCompleted(true);
    setIsTimerRunning(false);
    examStorage.completeExam();
    if (onComplete) {
      onComplete(answers);
    }
  }, [answers, onComplete]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setIsCompleted(true);
    setIsTimerRunning(false);
    examStorage.completeExam();
    if (onTimeUp) {
      onTimeUp(answers);
    } else if (onComplete) {
      onComplete(answers);
    }
  }, [answers, onTimeUp, onComplete]);

  // Initialize state from localStorage or fresh
  useEffect(() => {
    if (isInitialized) return;

    const savedState = examStorage.loadState();

    if (savedState && savedState.isInProgress) {
      // Resume from saved state
      setCurrentQuestionIndex(savedState.currentQuestionIndex);
      setAnswers(savedState.answers);
      setGlobalTimeRemaining(savedState.globalTimeRemaining);
      setHasSavedExam(true);

      // Check if time has run out while away
      if (savedState.globalTimeRemaining <= 0) {
        setIsCompleted(true);
        setIsTimerRunning(false);
        examStorage.completeExam();
      }

      // Load selected answer for current question if exists
      const existingAnswer = savedState.answers.find(
        (a) => a.questionId === questions[savedState.currentQuestionIndex]?.id
      );
      if (existingAnswer) {
        setSelectedAnswers(existingAnswer.selectedAnswer);
      }
    } else {
      // Start fresh exam
      examStorage.startNewExam(totalQuestions);
      setHasSavedExam(false);
    }

    setIsInitialized(true);
    setQuestionStartTime(Date.now());
  }, [isInitialized, questions, totalQuestions]);

  // Save state whenever important values change
  useEffect(() => {
    if (!isInitialized || isCompleted) return;

    examStorage.saveState({
      currentQuestionIndex,
      answers,
      globalTimeRemaining,
      examStartedAt: Date.now() - (DEFAULT_EXAM_DURATION - globalTimeRemaining) * 1000,
      isInProgress: true,
    });
  }, [currentQuestionIndex, answers, globalTimeRemaining, isInitialized, isCompleted]);

  // Global timer effect
  useEffect(() => {
    if (!isInitialized || isCompleted) return;

    if (isTimerRunning && globalTimeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setGlobalTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up - complete exam
            setIsTimerRunning(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, globalTimeRemaining, handleTimeUp, isInitialized, isCompleted]);

  // Update selected answers when question changes
  useEffect(() => {
    if (!isInitialized) return;

    // Load previously selected answer if exists
    const existingAnswer = answers.find((a) => a.questionId === currentQuestion.id);
    if (existingAnswer) {
      setSelectedAnswers(existingAnswer.selectedAnswer);
    } else {
      setSelectedAnswers([]);
    }

    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex, currentQuestion.id, isInitialized]);

  // Get answer for a specific question
  const getAnswer = useCallback(
    (questionId: string) => {
      return answers.find((a) => a.questionId === questionId);
    },
    [answers]
  );

  // Check if current question is answered
  const isAnswered = selectedAnswers.length > 0;

  // Submit current answer
  const submitAnswer = useCallback(() => {
    if (selectedAnswers.length === 0) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    setAnswers((prev) => {
      // Remove existing answer for this question if any
      const filtered = prev.filter((a) => a.questionId !== currentQuestion.id);

      // Add new answer
      return [
        ...filtered,
        {
          questionId: currentQuestion.id,
          selectedAnswer: selectedAnswers,
          timeSpent,
          timestamp: new Date(),
        },
      ];
    });

    // Move to next (do not auto-complete on last question)
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [selectedAnswers, currentQuestion.id, currentQuestionIndex, totalQuestions, questionStartTime]);

  // Skip current question
  const skipQuestion = useCallback(() => {
    // Save empty answer if question was skipped
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== currentQuestion.id);
      return [
        ...filtered,
        {
          questionId: currentQuestion.id,
          selectedAnswer: [],
          timeSpent,
          timestamp: new Date(),
        },
      ];
    });

    // Move to next (do not auto-complete on last question)
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestion.id, currentQuestionIndex, totalQuestions, questionStartTime]);

  // Move to next question
  const goToNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  // Move to previous question
  const goToPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Jump to a specific question
  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalQuestions) {
        setCurrentQuestionIndex(index);
      }
    },
    [totalQuestions]
  );

  // Reset exam state (starts fresh)
  const resetExam = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsCompleted(false);
    setSelectedAnswers([]);
    setQuestionStartTime(Date.now());
    setGlobalTimeRemaining(DEFAULT_EXAM_DURATION);
    setIsTimerRunning(true);
    setHasSavedExam(false);
    examStorage.startNewExam(totalQuestions);
  }, [totalQuestions]);

  // Timer controls
  const pauseTimer = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsTimerRunning(true);
  }, []);

  return {
    currentQuestionIndex,
    currentQuestion,
    answers,
    isCompleted,
    selectedAnswers,
    isAnswered,
    totalQuestions,
    questions,
    getAnswer,
    setSelectedAnswers,
    submitAnswer,
    skipQuestion,
    goToNext,
    goToPrevious,
    goToQuestion,
    completeExam,
    resetExam,
    globalTimeRemaining,
    isTimerRunning,
    initialGlobalTime,
    pauseTimer,
    resumeTimer,
    formatTime,
    hasSavedExam,
  };
}
