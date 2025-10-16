'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { QuizContainer, type QuizResults } from '@/features/diagnostic-test';
import {
  QuestionnaireLayout,
  QuestionnaireResults,
  useSubjectQuestionnaire,
} from '@/features/questionnaire';
import { Alert } from '@/shared/ui';

/**
 * QuestionnairePage Component
 *
 * Dynamic route for subject-specific questionnaires.
 * Shows quiz interface and results screen upon completion.
 */
export default function QuestionnairePage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = parseInt(params.subjectId as string, 10);

  // State management
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);

  // Get questionnaire data
  const { config, subjectInfo, hasQuestionnaire, error } =
    useSubjectQuestionnaire(subjectId);

  // Handle quiz completion
  const handleQuizComplete = (results: QuizResults) => {
    console.log('Quiz completed with results:', results);
    setQuizResults(results);
    setShowResults(true);

    // TODO: Send results to backend API
    // await saveQuestionnaireResults(subjectId, results);
  };

  // Handle exit
  const handleExit = () => {
    router.push('/home');
  };

  // Handle go to daily session
  const handleGoToDailySession = () => {
    router.push('/home');
  };

  // Error state - questionnaire not found
  if (!hasQuestionnaire || error) {
    return (
      <QuestionnaireLayout
        title="Cuestionario no disponible"
        showExitButton={true}
        onExit={handleExit}
      >
        <div className="max-w-2xl mx-auto mt-8">
          <Alert variant="destructive">
            <p className="font-medium">
              {error || 'El cuestionario solicitado no está disponible.'}
            </p>
            <p className="text-sm mt-2">
              Por favor, regresa al inicio y selecciona otra materia.
            </p>
          </Alert>
        </div>
      </QuestionnaireLayout>
    );
  }

  // Results screen
  if (showResults && quizResults) {
    // Calculate effectiveness percentage based on correct answers
    const effectivenessPercentage = Math.round(
      (quizResults.correctCount / quizResults.totalQuestions) * 100
    );

    // Create effectiveness areas array with the current subject
    const effectivenessAreas = subjectInfo
      ? [
          {
            name: subjectInfo.name,
            percentage: effectivenessPercentage,
          },
        ]
      : [];

    return (
      <div className="min-h-screen bg-grey-50 flex items-center justify-center">
        <QuestionnaireResults
          correctAnswers={quizResults.correctCount}
          totalQuestions={quizResults.totalQuestions}
          effectivenessAreas={effectivenessAreas}
          progressPercentage={effectivenessPercentage}
          onGoToDailySession={handleGoToDailySession}
        />
      </div>
    );
  }

  // Quiz interface
  return (
    <QuestionnaireLayout
      title={config?.title}
      showExitButton={true}
      onExit={handleExit}
    >
      <QuizContainer
        config={config!}
        onComplete={handleQuizComplete}
        showTimer={true}
        showProgress={true}
        subjectName={subjectInfo?.name}
      />
    </QuestionnaireLayout>
  );
}
