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
  title: 'Test Diagnóstico de Matemáticas',
  description: 'Evalúa tu nivel de comprensión en matemáticas básicas',
  questions: [
    {
      id: 'q1',
      statement: '¿Cuál es el resultado de 15 + 27?',
      type: QuestionType.SINGLE_CHOICE,
      options: [
        { id: 'a', text: '32' },
        { id: 'b', text: '42' },
        { id: 'c', text: '52' },
      ],
      correctAnswers: ['b'],
      difficultyLevel: QuestionDifficultyLevel.BASIC,
      subjectId: 'matematicas',
      timeLimit: 30,
    },
    // {
    //   id: 'q2',
    //   statement: '¿Qué operación matemática se debe realizar primero según el orden de operaciones?',
    //   type: QuestionType.SINGLE_CHOICE,
    //   options: [
    //     { id: 'a', text: 'Suma' },
    //     { id: 'b', text: 'Resta' },
    //     { id: 'c', text: 'Multiplicación' },
    //     { id: 'd', text: 'División' },
    //     { id: 'e', text: 'Paréntesis' },
    //   ],
    //   correctAnswers: ['e'],
    //   difficultyLevel: QuestionDifficultyLevel.INTERMEDIATE,
    //   subjectId: 'matematicas',
    //   timeLimit: 45,
    // },
    // {
    //   id: 'q3',
    //   statement: 'Si un triángulo tiene ángulos de 60°, 60° y 60°, ¿qué tipo de triángulo es?',
    //   type: QuestionType.SINGLE_CHOICE,
    //   options: [
    //     { id: 'a', text: 'Triángulo escaleno' },
    //     { id: 'b', text: 'Triángulo isósceles' },
    //     { id: 'c', text: 'Triángulo equilátero' },
    //     { id: 'd', text: 'Triángulo rectángulo' },
    //   ],
    //   correctAnswers: ['c'],
    //   difficultyLevel: QuestionDifficultyLevel.BASIC,
    //   subjectId: 'matematicas',
    //   timeLimit: 40,
    // },
    // {
    //   id: 'q4',
    //   statement: '¿Cuál es el resultado de 8 × 7?',
    //   type: QuestionType.SINGLE_CHOICE,
    //   options: [
    //     { id: 'a', text: '54' },
    //     { id: 'b', text: '56' },
    //     { id: 'c', text: '58' },
    //     { id: 'd', text: '60' },
    //   ],
    //   correctAnswers: ['b'],
    //   difficultyLevel: QuestionDifficultyLevel.BASIC,
    //   subjectId: 'matematicas',
    //   timeLimit: 30,
    // },
    // {
    //   id: 'q5',
    //   statement: '¿Cuáles de las siguientes son propiedades de los números pares? (Selecciona todas las correctas)',
    //   type: QuestionType.MULTIPLE_CHOICE,
    //   options: [
    //     { id: 'a', text: 'Son divisibles entre 2' },
    //     { id: 'b', text: 'Terminan en 0, 2, 4, 6 u 8' },
    //     { id: 'c', text: 'Son siempre mayores que los números impares' },
    //     { id: 'd', text: 'La suma de dos números pares siempre es par' },
    //   ],
    //   correctAnswers: ['a', 'b', 'd'],
    //   difficultyLevel: QuestionDifficultyLevel.INTERMEDIATE,
    //   subjectId: 'matematicas',
    //   timeLimit: 60,
    // },
    // {
    //   id: 'q6',
    //   statement: '¿Cuál es el perímetro de un cuadrado con lado de 5 cm?',
    //   type: QuestionType.SINGLE_CHOICE,
    //   options: [
    //     { id: 'a', text: '10 cm' },
    //     { id: 'b', text: '15 cm' },
    //     { id: 'c', text: '20 cm' },
    //   ],
    //   correctAnswers: ['c'],
    //   difficultyLevel: QuestionDifficultyLevel.BASIC,
    //   subjectId: 'matematicas',
    //   timeLimit: 35,
    // },
    // {
    //   id: 'q7',
    //   statement: 'Si María tiene 3 veces más manzanas que Juan, y Juan tiene 4 manzanas, ¿cuántas manzanas tiene María?',
    //   type: QuestionType.SINGLE_CHOICE,
    //   options: [
    //     { id: 'a', text: '7 manzanas' },
    //     { id: 'b', text: '12 manzanas' },
    //     { id: 'c', text: '16 manzanas' },
    //     { id: 'd', text: '9 manzanas' },
    //     { id: 'e', text: '20 manzanas' },
    //   ],
    //   correctAnswers: ['b'],
    //   difficultyLevel: QuestionDifficultyLevel.INTERMEDIATE,
    //   subjectId: 'matematicas',
    //   timeLimit: 45,
    // },
    // {
    //   id: 'q8',
    //   statement: '¿Cuál es el valor de X en la ecuación: X + 5 = 13?',
    //   type: QuestionType.SINGLE_CHOICE,
    //   options: [
    //     { id: 'a', text: '6' },
    //     { id: 'b', text: '7' },
    //     { id: 'c', text: '8' },
    //     { id: 'd', text: '9' },
    //   ],
    //   correctAnswers: ['c'],
    //   difficultyLevel: QuestionDifficultyLevel.INTERMEDIATE,
    //   subjectId: 'matematicas',
    //   timeLimit: 40,
    // },
    // {
    //   id: 'q9',
    //   statement: '¿Cuáles de los siguientes números son primos? (Selecciona todos los correctos)',
    //   type: QuestionType.MULTIPLE_CHOICE,
    //   options: [
    //     { id: 'a', text: '2' },
    //     { id: 'b', text: '9' },
    //     { id: 'c', text: '11' },
    //     { id: 'd', text: '15' },
    //     { id: 'e', text: '13' },
    //   ],
    //   correctAnswers: ['a', 'c', 'e'],
    //   difficultyLevel: QuestionDifficultyLevel.ADVANCED,
    //   subjectId: 'matematicas',
    //   timeLimit: 50,
    // },
    // {
    //   id: 'q10',
    //   statement: '¿Cuál es el área de un rectángulo con base de 8 cm y altura de 5 cm?',
    //   type: QuestionType.SINGLE_CHOICE,
    //   options: [
    //     { id: 'a', text: '13 cm²' },
    //     { id: 'b', text: '26 cm²' },
    //     { id: 'c', text: '40 cm²' },
    //   ],
    //   correctAnswers: ['c'],
    //   difficultyLevel: QuestionDifficultyLevel.BASIC,
    //   subjectId: 'matematicas',
    //   timeLimit: 35,
    // },
    // {
    //   id: 'q11',
    //   statement: '¿Cuál de las siguientes fracciones es equivalente a 1/2?',
    //   type: QuestionType.SINGLE_CHOICE,
    //   options: [
    //     { id: 'a', text: '2/4' },
    //     { id: 'b', text: '3/5' },
    //     { id: 'c', text: '4/6' },
    //     { id: 'd', text: '5/10' },
    //   ],
    //   correctAnswers: ['a'],
    //   difficultyLevel: QuestionDifficultyLevel.BASIC,
    //   subjectId: 'matematicas',
    //   timeLimit: 30,
    // },
    // {
    //   id: 'q12',
    //   statement: 'Si el doble de un número es 24, ¿cuál es ese número?',
    //   type: QuestionType.SINGLE_CHOICE,
    //   options: [
    //     { id: 'a', text: '10' },
    //     { id: 'b', text: '12' },
    //     { id: 'c', text: '14' },
    //     { id: 'd', text: '16' },
    //     { id: 'e', text: '18' },
    //   ],
    //   correctAnswers: ['b'],
    //   difficultyLevel: QuestionDifficultyLevel.INTERMEDIATE,
    //   subjectId: 'matematicas',
    //   timeLimit: 35,
    // },
  ],
  defaultTimePerQuestion: 40,
  allowReview: true,
  showTimer: true,
  showProgress: true,
};

export default function DiagnosticTestPage() {
  const router = useRouter();

  const handleExit = () => {
    router.push('/dashboard');
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
