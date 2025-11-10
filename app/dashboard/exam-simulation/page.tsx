'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Feature imports
import { useExamSimulation } from '@/features/exam-simulation/hooks/useExamSimulation';
import { ExamQuestionView } from '@/features/exam-simulation/ui/ExamQuestionView';
import { ExamSummaryView } from '@/features/exam-simulation/ui/ExamSummaryView';
import { ExamResultsView } from '@/features/exam-simulation/ui/ExamResultsView';
import { mockExamQuestions } from '@/features/exam-simulation/mocks/questions';
import type { ExamConfig } from '@/features/exam-simulation/types';

// Dashboard Layout
import { DashboardLayout } from '@/features/dashboard';

// UI Components
import { QuestionType } from '@/features/diagnostic-test/types/quiz.types';
import { Button } from '@/shared/ui/Button';
import { Activity } from 'lucide-react';
import Image from 'next/image';

export default function ExamSimulationPage() {
  const router = useRouter();
  const [showSummary, setShowSummary] = useState(false);

  // Exam configuration
  const examConfig: ExamConfig = {
    questions: mockExamQuestions,
    defaultTimePerQuestion: 60,
    showTimer: true,
    showProgress: true,
    title: 'Simulacro de Examen',
    subjectName: 'Matemáticas',
  };

  const exam = useExamSimulation({
    config: examConfig,
    onComplete: (answers) => {
      console.log('Exam completed with answers:', answers);
    },
  });

  // Handle exit
  const handleExit = () => {
    setShowSummary(false);
    exam.resetExam();
    router.push('/dashboard');
  };

  // Auto-show summary when last question is answered or reached
  useEffect(() => {
    // Check if we're on the last question and all questions have been visited
    if (exam.currentQuestionIndex === exam.totalQuestions - 1) {
      // Check if the last question has an answer (was answered or skipped)
      const lastQuestionAnswer = exam.answers.find(
        (a) => a.questionId === exam.currentQuestion.id
      );

      if (lastQuestionAnswer) {
        // Automatically show summary after answering/skipping last question
        setShowSummary(true);
      }
    }
  }, [exam.currentQuestionIndex, exam.totalQuestions, exam.answers, exam.currentQuestion.id]);

  // Handle option selection
  const handleSelectOption = (optionId: string) => {
    const isMultipleChoice = exam.currentQuestion.type === QuestionType.MULTIPLE_CHOICE;

    if (isMultipleChoice) {
      // Multiple choice - toggle selection
      if (exam.selectedAnswers.includes(optionId)) {
        exam.setSelectedAnswers(exam.selectedAnswers.filter((id) => id !== optionId));
      } else {
        exam.setSelectedAnswers([...exam.selectedAnswers, optionId]);
      }
    } else {
      // Single choice - replace selection
      exam.setSelectedAnswers([optionId]);
    }
  };

  // Calculate statistics for summary
  const totalAnswered = exam.answers.filter((a) => a.selectedAnswer.length > 0).length;
  const totalCorrect = exam.answers.filter((a) => {
    const question = exam.questions.find((q) => q.id === a.questionId);
    if (!question) return false;

    const sortedUserAnswer = [...a.selectedAnswer].sort();
    const sortedCorrect = [...question.correctAnswers].sort();

    return (
      sortedUserAnswer.length === sortedCorrect.length &&
      sortedUserAnswer.every((val, idx) => val === sortedCorrect[idx])
    );
  }).length;

  // RESULTS VIEW - After completing exam
  if (exam.isCompleted) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <ExamResultsView
            totalAnswered={totalAnswered}
            totalQuestions={exam.totalQuestions}
            totalCorrect={totalCorrect}
            totalIncorrect={totalAnswered - totalCorrect}
            score={totalCorrect}
            onGoHome={() => router.push('/home?section=examen')}
          />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  // SUMMARY VIEW
  if (showSummary) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex-1 overflow-y-auto bg-white dark:bg-[#171B22]">
            <ExamSummaryView
              questionStates={exam.questions.map((question) => {
                const answer = exam.answers.find((a) => a.questionId === question.id);
                const isAnswered = answer ? answer.selectedAnswer.length > 0 : false;
                const isCorrect = answer && isAnswered
                  ? [...answer.selectedAnswer].sort().join(',') ===
                    [...question.correctAnswers].sort().join(',')
                  : false;

                return {
                  questionId: question.id,
                  selectedAnswer: answer?.selectedAnswer[0] || null,
                  isAnswered,
                  isSkipped: answer ? answer.selectedAnswer.length === 0 : false,
                  isCorrect,
                };
              })}
              totalAnswered={totalAnswered}
              totalCorrect={totalCorrect}
              totalQuestions={exam.totalQuestions}
              onResumeExam={() => setShowSummary(false)}
              onCompleteExam={() => exam.completeExam()}
              onGoToQuestion={(index) => {
                exam.goToQuestion(index);
                setShowSummary(false);
              }}
            />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  // QUESTION VIEW
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex-1 overflow-y-auto bg-grey-50 dark:bg-[#171B22] relative">
          {/* Top Header: Exit and View Summary Buttons */}
          <div className="max-w-3xl mx-auto px-4 pt-8 pb-4 md:pt-6 md:pb-4">
            <div className="flex items-center justify-between">
              {/* Exit Button - Left */}
              <button
                onClick={handleExit}
                className="flex items-center gap-2 text-grey-700 hover:text-grey-900 dark:text-grey-300 dark:hover:text-grey-100 transition-colors cursor-pointer"
                aria-label="Salir del examen"
              >
                <Image
                  src="/icons/close-square.svg"
                  alt="Salir"
                  width={24}
                  height={24}
                />
                <span className="text-sm font-medium">Salir</span>
              </button>

              {/* View Summary Button - Right */}
              <Button
                onClick={() => setShowSummary(true)}
                variant="secondary"
                size="small"
                className="flex items-center gap-2"
                aria-label="Ver resumen"
              >
                <Activity className="w-4 h-4" style={{ color: '#95C16B' }} />
                <span>Ver resumen</span>
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-3xl mx-auto px-4">
            <ExamQuestionView
              question={exam.currentQuestion}
              currentIndex={exam.currentQuestionIndex}
              totalQuestions={exam.totalQuestions}
              selectedAnswers={exam.selectedAnswers}
              isAnswered={exam.isAnswered}
              timeRemaining={exam.timeRemaining}
              initialTime={exam.initialTime}
              isTimerRunning={exam.isTimerRunning}
              subjectName={examConfig.subjectName}
              onSelectOption={handleSelectOption}
              onSkip={exam.skipQuestion}
              onSubmit={exam.submitAnswer}
              onViewSummary={() => setShowSummary(true)}
            />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
