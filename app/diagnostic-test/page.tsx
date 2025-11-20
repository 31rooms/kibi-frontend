'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DiagnosticTestLayout,
  QuizContainer,
  type QuizConfig,
  type QuizResults as QuizResultsType,
  QuestionType,
  QuestionDifficultyLevel,
} from '@/features/diagnostic-test';
import { useAuth } from '@/features/authentication';
import { accountAPI } from '@/features/account';
import { Modal } from '@/shared/ui';

/**
 * Simple diagnostic test with 2 TRUE/FALSE questions
 */
const sampleQuizConfig: QuizConfig = {
  title: 'Test Diagnóstico',
  description: 'Responde estas preguntas para conocer tu nivel',
  questions: [
    {
      id: 'q1',
      statement: 'El agua hierve a 100 grados Celsius al nivel del mar.',
      type: QuestionType.TRUE_FALSE,
      options: [
        { id: 'true', text: 'Verdadero' },
        { id: 'false', text: 'Falso' },
      ],
      correctAnswers: ['true'],
      difficultyLevel: QuestionDifficultyLevel.BASIC,
      subjectId: 'ciencias',
      timeLimit: 30,
    },
    {
      id: 'q2',
      statement: 'La Tierra es el planeta más grande del sistema solar.',
      type: QuestionType.TRUE_FALSE,
      options: [
        { id: 'true', text: 'Verdadero' },
        { id: 'false', text: 'Falso' },
      ],
      correctAnswers: ['false'],
      difficultyLevel: QuestionDifficultyLevel.BASIC,
      subjectId: 'ciencias',
      timeLimit: 30,
    },
  ],
  defaultTimePerQuestion: 30,
  allowReview: false,
  showTimer: true,
  showProgress: true,
};

export default function DiagnosticTestPage() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleExit = () => {
    router.push('/form-diagnostic-test');
  };

  const handleQuizComplete = (quizResults: QuizResultsType) => {
    console.log('Quiz completed with results:', quizResults);
    // Show completion modal instead of updating immediately
    setShowCompletionModal(true);
  };

  const handleConfirmCompletion = async () => {
    setIsUpdating(true);
    try {
      // Update user's diagnosticCompleted to true
      const updatedUser = await accountAPI.updateProfile({
        diagnosticCompleted: true,
      });

      // Update user in context
      updateUser(updatedUser);

      // Redirect to home
      router.push('/home');
    } catch (error) {
      console.error('Failed to update diagnosticCompleted:', error);
      // Still redirect to home even if update fails
      router.push('/home');
    } finally {
      setIsUpdating(false);
    }
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
        skipInternalModals={true}
      />

      {/* Completion Modal */}
      <Modal
        open={showCompletionModal}
        onOpenChange={setShowCompletionModal}
        state="success"
        title="¡Test completado!"
        description="Has completado el test diagnóstico. Ahora podrás acceder a todas las funcionalidades de Kibi."
        confirmText={isUpdating ? "Cargando..." : "Continuar"}
        showCloseButton={false}
        singleButton={true}
        onConfirm={handleConfirmCompletion}
      />
    </DiagnosticTestLayout>
  );
}
