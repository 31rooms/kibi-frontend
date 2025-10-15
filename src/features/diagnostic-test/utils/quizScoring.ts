import type {
  Question,
  QuizAnswer,
  QuizResults,
  QuestionResult,
} from '../types/quiz.types';
import { isAnswerCorrect } from './quizValidation';

/**
 * Calculate score for a single question
 * Aligned with backend schema (answers are always arrays)
 */
export function calculateQuestionScore(
  question: Question,
  userAnswer: string[]
): { isCorrect: boolean; points: number } {
  const isCorrect = isAnswerCorrect(userAnswer, question.correctAnswers);
  return {
    isCorrect,
    points: isCorrect ? 1 : 0,
  };
}

/**
 * Calculate results for individual questions
 */
export function calculateQuestionResults(
  questions: Question[],
  answers: QuizAnswer[]
): QuestionResult[] {
  return questions.map((question) => {
    const userAnswer = answers.find((a) => a.questionId === question.id);

    const selectedAnswer = userAnswer?.selectedAnswer || [];
    const timeSpent = userAnswer?.timeSpent || 0;

    const { isCorrect } = calculateQuestionScore(question, selectedAnswer);

    return {
      questionId: question.id,
      question,
      userAnswer: selectedAnswer,
      correctAnswer: question.correctAnswers,
      isCorrect,
      timeSpent,
    };
  });
}

/**
 * Calculate final quiz results
 */
export function calculateQuizResults(
  questions: Question[],
  answers: QuizAnswer[]
): QuizResults {
  const questionResults = calculateQuestionResults(questions, answers);

  const correctCount = questionResults.filter((r) => r.isCorrect).length;
  const totalQuestions = questions.length;
  const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

  const totalTimeSpent = answers.reduce((sum, answer) => sum + answer.timeSpent, 0);

  return {
    questionResults,
    score: Math.round(score),
    correctCount,
    totalQuestions,
    totalTimeSpent,
    completedAt: new Date(),
  };
}

/**
 * Calculate pass/fail based on threshold
 */
export function isPassingScore(score: number, passingThreshold: number = 70): boolean {
  return score >= passingThreshold;
}

/**
 * Get performance level based on score
 */
export function getPerformanceLevel(score: number): {
  level: 'excellent' | 'good' | 'average' | 'poor';
  message: string;
} {
  if (score >= 90) {
    return {
      level: 'excellent',
      message: 'Excelente! Dominas este tema.',
    };
  }
  if (score >= 70) {
    return {
      level: 'good',
      message: 'Buen trabajo! Tienes un buen entendimiento.',
    };
  }
  if (score >= 50) {
    return {
      level: 'average',
      message: 'Bien! Necesitas repasar algunos conceptos.',
    };
  }
  return {
    level: 'poor',
    message: 'Necesitas estudiar más este tema.',
  };
}

/**
 * Calculate average time per question
 */
export function calculateAverageTimePerQuestion(answers: QuizAnswer[]): number {
  if (answers.length === 0) return 0;
  const totalTime = answers.reduce((sum, answer) => sum + answer.timeSpent, 0);
  return Math.round(totalTime / answers.length);
}

/**
 * Get statistics summary
 */
export function getQuizStatistics(results: QuizResults) {
  const { score, correctCount, totalQuestions, totalTimeSpent } = results;

  const averageTimePerQuestion =
    results.questionResults.length > 0
      ? Math.round(
          results.questionResults.reduce((sum, r) => sum + r.timeSpent, 0) /
            results.questionResults.length
        )
      : 0;

  const incorrectCount = totalQuestions - correctCount;
  const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

  const performance = getPerformanceLevel(score);

  return {
    score,
    correctCount,
    incorrectCount,
    totalQuestions,
    accuracy: Math.round(accuracy),
    totalTimeSpent,
    averageTimePerQuestion,
    performance,
    isPassing: isPassingScore(score),
  };
}
