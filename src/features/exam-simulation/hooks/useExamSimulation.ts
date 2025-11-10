'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Question, QuizAnswer, ExamConfig } from '../types';
import { QuestionType } from '@/features/diagnostic-test/types/quiz.types';

export interface UseExamSimulationOptions {
  /** Exam configuration */
  config: ExamConfig;

  /** Callback when exam is completed */
  onComplete?: (answers: QuizAnswer[]) => void;
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

  /** Timer state */
  timeRemaining: number;
  isTimerRunning: boolean;
  initialTime: number;
  pauseTimer: () => void;
  resumeTimer: () => void;
  restartTimer: (time: number) => void;
}

/**
 * Custom hook for managing exam simulation state
 *
 * Simplified version of useQuizState from diagnostic-test
 * Focuses on exam-specific functionality
 */
export function useExamSimulation({
  config,
  onComplete,
}: UseExamSimulationOptions): UseExamSimulationReturn {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(
    config.defaultTimePerQuestion || 60
  );
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const questions = config.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const initialTime = currentQuestion.timeLimit || config.defaultTimePerQuestion || 60;

  // Complete the exam (defined early for use in other callbacks)
  const completeExam = useCallback(() => {
    setIsCompleted(true);
    setIsTimerRunning(false);
    if (onComplete) {
      onComplete(answers);
    }
  }, [answers, onComplete]);

  // Skip question function (defined here to use in timer)
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

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up - auto skip
            setIsTimerRunning(false);
            skipQuestion();
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
  }, [isTimerRunning, timeRemaining, skipQuestion]);

  // Reset timer when question changes
  useEffect(() => {
    const newTime = currentQuestion.timeLimit || config.defaultTimePerQuestion || 60;
    setTimeRemaining(newTime);
    setIsTimerRunning(true);

    // Load previously selected answer if exists
    const existingAnswer = getAnswer(currentQuestion.id);
    if (existingAnswer) {
      setSelectedAnswers(existingAnswer.selectedAnswer);
    } else {
      setSelectedAnswers([]);
    }

    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex, currentQuestion.id]);

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

  // Reset exam state
  const resetExam = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsCompleted(false);
    setSelectedAnswers([]);
    setQuestionStartTime(Date.now());
    setTimeRemaining(config.defaultTimePerQuestion || 60);
    setIsTimerRunning(true);
  }, [config.defaultTimePerQuestion]);

  // Timer controls
  const pauseTimer = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsTimerRunning(true);
  }, []);

  const restartTimer = useCallback((time: number) => {
    setTimeRemaining(time);
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
    timeRemaining,
    isTimerRunning,
    initialTime,
    pauseTimer,
    resumeTimer,
    restartTimer,
  };
}
