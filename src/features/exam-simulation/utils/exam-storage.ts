/**
 * Exam Simulation Storage Utilities
 * Persists exam state to localStorage to allow resuming after exit
 */

import type { QuizAnswer } from '../types';

const EXAM_STATE_KEY = 'kibi_exam_simulation_state';

/**
 * Persisted exam state structure
 */
export interface PersistedExamState {
  /** Current question index (0-based) */
  currentQuestionIndex: number;

  /** All user answers collected so far */
  answers: QuizAnswer[];

  /** Global time remaining for the entire exam (in seconds) */
  globalTimeRemaining: number;

  /** Timestamp when the exam was started */
  examStartedAt: number;

  /** Timestamp of last state save (for calculating elapsed time) */
  lastSavedAt: number;

  /** Whether the exam is in progress */
  isInProgress: boolean;
}

/**
 * Default exam duration: 3 hours in seconds
 */
export const DEFAULT_EXAM_DURATION = 3 * 60 * 60; // 10800 seconds

export const examStorage = {
  /**
   * Save exam state to localStorage
   */
  saveState(state: Omit<PersistedExamState, 'lastSavedAt'>): void {
    if (typeof window === 'undefined') return;

    try {
      const stateToSave: PersistedExamState = {
        ...state,
        lastSavedAt: Date.now(),
      };
      localStorage.setItem(EXAM_STATE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save exam state:', error);
    }
  },

  /**
   * Load exam state from localStorage
   * Adjusts time remaining based on elapsed time since last save
   */
  loadState(): PersistedExamState | null {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem(EXAM_STATE_KEY);
      if (!saved) return null;

      const state: PersistedExamState = JSON.parse(saved);

      // If exam is not in progress, return null
      if (!state.isInProgress) {
        this.clearState();
        return null;
      }

      // Calculate elapsed time since last save
      const elapsedSeconds = Math.floor((Date.now() - state.lastSavedAt) / 1000);

      // Adjust time remaining
      const adjustedTimeRemaining = Math.max(0, state.globalTimeRemaining - elapsedSeconds);

      // If time has run out, return state with 0 time (exam should complete)
      return {
        ...state,
        globalTimeRemaining: adjustedTimeRemaining,
        lastSavedAt: Date.now(),
      };
    } catch (error) {
      console.error('Failed to load exam state:', error);
      return null;
    }
  },

  /**
   * Check if there's a saved exam in progress
   */
  hasActiveExam(): boolean {
    const state = this.loadState();
    return state !== null && state.isInProgress && state.globalTimeRemaining > 0;
  },

  /**
   * Clear saved exam state
   */
  clearState(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(EXAM_STATE_KEY);
    } catch (error) {
      console.error('Failed to clear exam state:', error);
    }
  },

  /**
   * Start a new exam - initializes fresh state
   */
  startNewExam(totalQuestions: number): PersistedExamState {
    const newState: PersistedExamState = {
      currentQuestionIndex: 0,
      answers: [],
      globalTimeRemaining: DEFAULT_EXAM_DURATION,
      examStartedAt: Date.now(),
      lastSavedAt: Date.now(),
      isInProgress: true,
    };

    this.saveState(newState);
    return newState;
  },

  /**
   * Update specific fields in the exam state
   */
  updateState(updates: Partial<Omit<PersistedExamState, 'lastSavedAt'>>): void {
    const currentState = this.loadState();
    if (!currentState) return;

    this.saveState({
      ...currentState,
      ...updates,
    });
  },

  /**
   * Mark exam as completed (clears state)
   */
  completeExam(): void {
    this.clearState();
  },
};
