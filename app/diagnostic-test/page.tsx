'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  DiagnosticTestLayout,
  QuizContainer,
  type QuizConfig,
  type QuizResults as QuizResultsType,
  QuestionType,
  QuestionDifficultyLevel,
} from '@/features/diagnostic-test';

/**
 * Sample quiz data for demonstration
 * Aligned with backend schema (questions.schema.ts)
 * This would typically come from an API or database
 */
const sampleQuizConfig: QuizConfig = {
  title: 'Test Diagnóstico General',
  description: 'Evalúa tu nivel de conocimiento en diversas áreas',
  questions: [
    // 1. Inglés - SINGLE_CHOICE
    {
      id: 'q1',
      statement: 'What is the correct past tense of "go"?',
      type: QuestionType.SINGLE_CHOICE,
      options: [
        { id: 'a', text: 'goed' },
        { id: 'b', text: 'went' },
        { id: 'c', text: 'gone' },
        { id: 'd', text: 'going' },
      ],
      correctAnswers: ['b'],
      difficultyLevel: QuestionDifficultyLevel.BASIC,
      subjectId: 'ingles',
      timeLimit: 30,
    },
    // 2. Aritmética - MULTIPLE_CHOICE (múltiples correctas)
    {
      id: 'q2',
      statement: '¿Cuáles de las siguientes operaciones dan como resultado 12? (Selecciona todas las correctas)',
      type: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: 'a', text: '3 × 4' },
        { id: 'b', text: '6 + 6' },
        { id: 'c', text: '25 ÷ 2' },
        { id: 'd', text: '15 - 3' },
      ],
      correctAnswers: ['a', 'b', 'd'],
      difficultyLevel: QuestionDifficultyLevel.BASIC,
      subjectId: 'aritmetica',
      timeLimit: 45,
    },
    // 3. Geografía - TRUE_FALSE
    {
      id: 'q3',
      statement: 'El Monte Everest es la montaña más alta del mundo.',
      type: QuestionType.TRUE_FALSE,
      options: [
        { id: 'true', text: 'Verdadero' },
        { id: 'false', text: 'Falso' },
      ],
      correctAnswers: ['true'],
      difficultyLevel: QuestionDifficultyLevel.BASIC,
      subjectId: 'geografia',
      timeLimit: 25,
    },
    // 4. Historia Universal - SINGLE_CHOICE
    {
      id: 'q4',
      statement: '¿Quién pintó la Mona Lisa?',
      type: QuestionType.SINGLE_CHOICE,
      options: [
        { id: 'a', text: 'Miguel Ángel' },
        { id: 'b', text: 'Leonardo da Vinci' },
        { id: 'c', text: 'Rafael' },
        { id: 'd', text: 'Donatello' },
      ],
      correctAnswers: ['b'],
      difficultyLevel: QuestionDifficultyLevel.INTERMEDIATE,
      subjectId: 'historia-universal',
      timeLimit: 35,
    },
    // 5. Química - SINGLE_CHOICE
    {
      id: 'q5',
      statement: '¿Cuál es el número atómico del oxígeno?',
      type: QuestionType.SINGLE_CHOICE,
      options: [
        { id: 'a', text: '6' },
        { id: 'b', text: '7' },
        { id: 'c', text: '8' },
        { id: 'd', text: '9' },
      ],
      correctAnswers: ['c'],
      difficultyLevel: QuestionDifficultyLevel.INTERMEDIATE,
      subjectId: 'quimica',
      timeLimit: 35,
    },
    // 6. Biología - TEXT_RESPONSE
    {
      id: 'q6',
      statement: 'Explica brevemente qué es la mitosis y cuál es su función principal en los organismos.',
      type: QuestionType.TEXT_RESPONSE,
      options: [],
      correctAnswers: [],
      difficultyLevel: QuestionDifficultyLevel.INTERMEDIATE,
      subjectId: 'biologia',
      timeLimit: 90,
    },
    // 7. Física - MULTIPLE_CHOICE
    {
      id: 'q7',
      statement: '¿Cuáles de las siguientes son formas de energía? (Selecciona todas las correctas)',
      type: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: 'a', text: 'Energía cinética' },
        { id: 'b', text: 'Energía potencial' },
        { id: 'c', text: 'Energía térmica' },
        { id: 'd', text: 'Energía gravitacional' },
      ],
      correctAnswers: ['a', 'b', 'c'],
      difficultyLevel: QuestionDifficultyLevel.INTERMEDIATE,
      subjectId: 'fisica',
      timeLimit: 50,
    },
    // 8. Álgebra - TRUE_FALSE
    {
      id: 'q8',
      statement: 'La ecuación x² + 1 = 0 tiene soluciones reales.',
      type: QuestionType.TRUE_FALSE,
      options: [
        { id: 'true', text: 'Verdadero' },
        { id: 'false', text: 'Falso' },
      ],
      correctAnswers: ['false'],
      difficultyLevel: QuestionDifficultyLevel.ADVANCED,
      subjectId: 'algebra',
      timeLimit: 40,
    },
    // 9. Economía - SINGLE_CHOICE
    {
      id: 'q9',
      statement: '¿Qué significa el término "oferta y demanda"?',
      type: QuestionType.SINGLE_CHOICE,
      options: [
        { id: 'a', text: 'La cantidad de dinero en circulación' },
        { id: 'b', text: 'La relación entre la cantidad disponible de un bien y su deseo de compra' },
        { id: 'c', text: 'El precio fijo de los productos' },
        { id: 'd', text: 'La tasa de inflación' },
      ],
      correctAnswers: ['b'],
      difficultyLevel: QuestionDifficultyLevel.INTERMEDIATE,
      subjectId: 'economia',
      timeLimit: 40,
    },
    // 10. Literatura - TEXT_RESPONSE
    {
      id: 'q10',
      statement: 'Describe en tus propias palabras qué es una metáfora y proporciona un ejemplo.',
      type: QuestionType.TEXT_RESPONSE,
      options: [],
      correctAnswers: [],
      difficultyLevel: QuestionDifficultyLevel.BASIC,
      subjectId: 'literatura',
      timeLimit: 90,
    },
  ],
  defaultTimePerQuestion: 40,
  allowReview: true,
  showTimer: true,
  showProgress: true,
};

export default function DiagnosticTestPage() {
  const router = useRouter();

  const handleExit = () => {
    router.push('/form-diagnostic-test');
  };

  const handleQuizComplete = (quizResults: QuizResultsType) => {
    console.log('Quiz completed with results:', quizResults);
    // Optionally send results to backend API here
    // The QuizContainer component handles the UI flow internally
  };

  return (
    <DiagnosticTestLayout
      showExitButton={true}
      onExit={handleExit}
    >
      <QuizContainer
        config={sampleQuizConfig}
        onComplete={handleQuizComplete}
        showTimer={true}
        showProgress={true}
      />
    </DiagnosticTestLayout>
  );
}
