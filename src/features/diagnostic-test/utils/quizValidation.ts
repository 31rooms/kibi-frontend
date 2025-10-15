import type { Question, QuizAnswer } from '../types/quiz.types';

/**
 * Validate if an answer is provided
 * Answer is always an array (aligned with backend schema)
 */
export function isAnswerProvided(answer: string[]): boolean {
  return answer.length > 0;
}

/**
 * Validate if an answer is correct
 * Both answers are always arrays (aligned with backend schema)
 */
export function isAnswerCorrect(
  userAnswer: string[],
  correctAnswer: string[]
): boolean {
  // Check if both arrays have the same length
  if (correctAnswer.length !== userAnswer.length) {
    return false;
  }

  // Sort both arrays and compare element by element
  const sortedCorrect = [...correctAnswer].sort();
  const sortedUser = [...userAnswer].sort();

  return sortedCorrect.every((answer, index) => answer === sortedUser[index]);
}

/**
 * Validate if all required questions are answered
 */
export function areAllQuestionsAnswered(
  questions: Question[],
  answers: QuizAnswer[]
): boolean {
  return questions.every((question) => {
    const answer = answers.find((a) => a.questionId === question.id);
    return answer && isAnswerProvided(answer.selectedAnswer);
  });
}

/**
 * Validate quiz configuration
 */
export function validateQuizConfig(config: {
  questions: Question[];
  defaultTimePerQuestion?: number;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.questions || config.questions.length === 0) {
    errors.push('Quiz must have at least one question');
  }

  config.questions.forEach((question, index) => {
    if (!question.id) {
      errors.push(`Question ${index + 1} is missing an ID`);
    }

    if (!question.statement || question.statement.trim() === '') {
      errors.push(`Question ${index + 1} is missing statement`);
    }

    if (!question.options || question.options.length < 2) {
      errors.push(`Question ${index + 1} must have at least 2 options`);
    }

    if (!question.correctAnswers || question.correctAnswers.length === 0) {
      errors.push(`Question ${index + 1} is missing correct answers`);
    }

    // Validate options
    question.options.forEach((option, optionIndex) => {
      if (!option.id) {
        errors.push(`Question ${index + 1}, option ${optionIndex + 1} is missing an ID`);
      }
      if (!option.text || option.text.trim() === '') {
        errors.push(`Question ${index + 1}, option ${optionIndex + 1} is missing text`);
      }
    });

    // Validate correct answers reference valid option IDs
    const optionIds = question.options.map((o) => o.id);

    question.correctAnswers.forEach((answerId) => {
      if (!optionIds.includes(answerId)) {
        errors.push(
          `Question ${index + 1} has invalid correct answer ID: ${answerId}`
        );
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get unanswered question IDs
 */
export function getUnansweredQuestions(
  questions: Question[],
  answers: QuizAnswer[]
): string[] {
  return questions
    .filter((question) => {
      const answer = answers.find((a) => a.questionId === question.id);
      return !answer || !isAnswerProvided(answer.selectedAnswer);
    })
    .map((question) => question.id);
}
