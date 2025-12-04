'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Clock, Home, ChevronRight } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/shared/ui/Accordion';
import { FeedbackCard, MarkdownRenderer, QuizOption } from '@/shared/ui';
import type { Lesson, LessonQuestion, QuestionState } from '../types';
import {
  getLessonFull,
  startLesson,
  answerQuestion,
  completeLesson,
} from '../api';

export interface FreeLessonViewProps {
  lessonId: string;
}

/**
 * FreeLessonView Component
 * Displays free class lessons with accordion sections and practice questions
 * Similar to DailyLessonView but for the free class feature
 */
export const FreeLessonView = React.forwardRef<HTMLDivElement, FreeLessonViewProps>(
  ({ lessonId }, ref) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [questions, setQuestions] = useState<LessonQuestion[]>([]);
    const [questionStates, setQuestionStates] = useState<{
      [key: string]: QuestionState;
    }>({});
    const [startTime, setStartTime] = useState<number>(0);
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    useEffect(() => {
      if (lessonId) {
        loadLesson();
      }
    }, [lessonId]);

    const loadLesson = async () => {
      setLoading(true);
      try {
        const lessonData = await getLessonFull(lessonId);
        setLesson(lessonData.lesson);

        const practiceQuestions =
          lessonData.lesson.categorizedQuestions?.lessonContent || [];
        setQuestions(practiceQuestions);

        const initialStates: { [key: string]: QuestionState } = {};
        practiceQuestions.forEach((q) => {
          initialStates[q._id] = {
            questionId: q._id,
            selectedAnswer: null,
            isCorrect: null,
            answered: false,
            timeSpent: 0,
            showTemporaryFeedback: false,
            isValidated: false,
          };
        });
        setQuestionStates(initialStates);

        // TODO: Uncomment when backend is ready
        // const sessionResponse = await startLesson(lessonId, {
        //   type: 'FREE_CLASS',
        // });
        // setSessionId(sessionResponse.sessionId);
        setStartTime(Date.now());
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleSelectAnswer = (questionId: string, optionId: string) => {
      const state = questionStates[questionId];
      if (state?.isCorrect) return;

      setQuestionStates((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          selectedAnswer: optionId,
          showTemporaryFeedback: false,
        },
      }));
    };

    const cleanStepByStepExplanation = (markdown: string): string => {
      if (!markdown) return '';

      const lines = markdown.split('\n');
      const filteredLines = lines.filter((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return true;
        return (
          !trimmedLine.includes('Respuesta correcta') &&
          !trimmedLine.includes('✅') &&
          !trimmedLine.includes('Solución paso a paso') &&
          !trimmedLine.startsWith('**Solución paso a paso') &&
          !trimmedLine.startsWith('## Solución paso a paso') &&
          !trimmedLine.startsWith('### Solución paso a paso')
        );
      });

      return filteredLines.join('\n').trim();
    };

    const handleValidateAnswer = async (questionId: string) => {
      const state = questionStates[questionId];
      if (!state.selectedAnswer || state.isCorrect || !sessionId) {
        return;
      }

      try {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);

        const response = await answerQuestion(lessonId, questionId, {
          sessionId,
          givenAnswer: state.selectedAnswer,
          timeSpentSeconds: timeSpent,
        });

        setQuestionStates((prev) => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],
            isCorrect: response.isCorrect,
            answered: true,
            timeSpent,
            showTemporaryFeedback: true,
            isValidated: true,
          },
        }));

        if (!response.isCorrect) {
          setTimeout(() => {
            setQuestionStates((prev) => {
              const currentState = prev[questionId];
              if (currentState?.showTemporaryFeedback) {
                return {
                  ...prev,
                  [questionId]: {
                    ...currentState,
                    selectedAnswer: null,
                    showTemporaryFeedback: false,
                    answered: false,
                  },
                };
              }
              return prev;
            });
          }, 3000);
        }
      } catch (error) {
        console.error('Error validating answer:', error);
      }
    };

    const handleFinishLesson = async () => {
      // TODO: Uncomment when backend is ready
      // if (!sessionId) return;
      // try {
      //   const answeredCount = Object.values(questionStates).filter(
      //     (s) => s.answered
      //   ).length;
      //   const correctCount = Object.values(questionStates).filter(
      //     (s) => s.answered && s.isCorrect
      //   ).length;
      //   const totalTime = Math.floor((Date.now() - startTime) / 1000);
      //   await completeLesson(lessonId, {
      //     sessionId,
      //     questionsAnswered: answeredCount,
      //     correctAnswers: correctCount,
      //     timeSpentSeconds: totalTime,
      //   });
      // } catch (error) {
      //   console.error('Error completing lesson:', error);
      // }

      router.push('/home?section=clase-libre');
    };

    const getDifficultyBadge = () => {
      if (!lesson) return null;
      const colors = {
        BASIC: 'text-green-600 border-green-600 bg-green-50 dark:bg-green-950',
        INTERMEDIATE:
          'text-yellow-600 border-yellow-600 bg-yellow-50 dark:bg-yellow-950',
        ADVANCED: 'text-red-600 border-red-600 bg-red-50 dark:bg-red-950',
      };
      const labels = {
        BASIC: 'Básico',
        INTERMEDIATE: 'Intermedio',
        ADVANCED: 'Avanzado',
      };
      return (
        <Badge
          variant="outline"
          className={cn('border-2', colors[lesson.difficultyLevel])}
        >
          {labels[lesson.difficultyLevel]}
        </Badge>
      );
    };

    // Loading state
    if (loading) {
      return (
        <div
          ref={ref}
          className="min-h-screen flex items-center justify-center bg-grey-50 dark:bg-[#171B22]"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            <p className="text-grey-600 dark:text-grey-400 text-sm">
              Cargando lección...
            </p>
          </div>
        </div>
      );
    }

    if (!lesson) {
      return null;
    }

    return (
      <div ref={ref} className="h-full bg-grey-50 dark:bg-[#171B22] pb-12">
        {/* Header with breadcrumb */}
        <div>
          <div className="max-w-4xl mx-auto px-6 py-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-grey-600 dark:text-grey-400 mb-4">
              <button
                onClick={() => router.push('/home')}
                className="hover:text-primary-green transition-colors"
              >
                <Home className="w-4 h-4" />
              </button>
              <ChevronRight className="w-4 h-4" />
              <button
                onClick={() => router.push('/home?section=clase-libre')}
                className="hover:text-primary-green transition-colors"
              >
                Clase libre
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-primary-green">{lesson.title}</span>
            </div>

            {/* Title and metadata */}
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                {lesson.title}
              </h1>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-grey-600 dark:text-grey-400">
                  <Clock className="w-4 h-4" />
                  {lesson.estimatedMinutes} minutos
                </div>
                {getDifficultyBadge()}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Accordions with reusable components */}
          <AccordionRoot
            type="multiple"
            defaultValue={['what-you-will-learn', 'what-matters-for-exam']}
          >
            {/* ¿Qué aprenderás hoy? */}
            {lesson.whatYouWillLearn && (
              <AccordionItem value="what-you-will-learn">
                <AccordionTrigger>
                  <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                    ¿Qué aprenderás hoy?
                  </h3>
                </AccordionTrigger>
                <AccordionContent markdown>
                  {lesson.whatYouWillLearn}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Lo que importa para tu examen */}
            {lesson.whatMattersForExam && (
              <AccordionItem value="what-matters-for-exam">
                <AccordionTrigger>
                  <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                    Lo que importa para tu examen
                  </h3>
                </AccordionTrigger>
                <AccordionContent markdown>
                  {lesson.whatMattersForExam}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Main Content */}
            {lesson.mainContent && (
              <AccordionItem value="main-content">
                <AccordionTrigger>
                  <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                    Contenido principal
                  </h3>
                </AccordionTrigger>
                <AccordionContent markdown>
                  {lesson.mainContent}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Tips */}
            {lesson.tips && (
              <AccordionItem value="tips">
                <AccordionTrigger>
                  <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                    Tips y consejos
                  </h3>
                </AccordionTrigger>
                <AccordionContent markdown>{lesson.tips}</AccordionContent>
              </AccordionItem>
            )}

            {/* Summary */}
            {lesson.summary && (
              <AccordionItem value="summary">
                <AccordionTrigger>
                  <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                    Resumen
                  </h3>
                </AccordionTrigger>
                <AccordionContent markdown>{lesson.summary}</AccordionContent>
              </AccordionItem>
            )}

            {/* Learn More */}
            {lesson.learnMoreResources && (
              <AccordionItem value="learn-more">
                <AccordionTrigger>
                  <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                    Aprende más
                  </h3>
                </AccordionTrigger>
                <AccordionContent markdown>
                  {lesson.learnMoreResources}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Practice Questions */}
            {questions.length > 0 && (
              <AccordionItem value="practice-questions">
                <AccordionTrigger>
                  <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                    Practica como en el examen real
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-8">
                    {questions.map((question, questionIndex) => {
                      const state = questionStates[question._id];
                      if (!state) return null;

                      const hasSelectedAnswer = state.selectedAnswer !== null;

                      return (
                        <div key={question._id} className="space-y-4">
                          {/* Question Statement */}
                          <h4 className="text-[16px] font-semibold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                            Ejercicio {questionIndex + 1} -{' '}
                            {question.statement || question.questionText}
                          </h4>

                          {/* Options */}
                          <div className="space-y-3">
                            {question.options?.map((option, optionIndex) => {
                              const optionId = option.id || option._id;
                              const isSelected =
                                state.selectedAnswer === optionId;
                              const isDisabled = state.answered;

                              return (
                                <QuizOption
                                  key={
                                    optionId ||
                                    `option-${questionIndex}-${optionIndex}`
                                  }
                                  id={optionId || ''}
                                  text={option.text}
                                  selected={isSelected}
                                  multipleChoice={false}
                                  onSelect={() =>
                                    !isDisabled &&
                                    handleSelectAnswer(
                                      question._id,
                                      optionId || ''
                                    )
                                  }
                                  disabled={isDisabled}
                                />
                              );
                            })}
                          </div>

                          {/* Validate Button */}
                          {!state.isCorrect && hasSelectedAnswer && (
                            <div className="flex justify-center">
                              <Button
                                variant="primary"
                                color="green"
                                size="medium"
                                onClick={() =>
                                  handleValidateAnswer(question._id)
                                }
                              >
                                Validar
                              </Button>
                            </div>
                          )}

                          {/* Temporary Feedback Toast */}
                          {state.showTemporaryFeedback && (
                            <FeedbackCard
                              isCorrect={state.isCorrect || false}
                              showKibiIcon={true}
                            />
                          )}

                          {/* Step-by-step Explanation */}
                          {state.isValidated &&
                            !state.isCorrect &&
                            question.stepByStepExplanation && (
                              <div className="mt-4 p-4 border border-grey-300 dark:border-[#374151] rounded-lg bg-white dark:bg-[#1E242D]">
                                <h3 className="text-[16px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-3">
                                  Solución paso a paso:
                                </h3>
                                <MarkdownRenderer
                                  content={cleanStepByStepExplanation(
                                    question.stepByStepExplanation
                                  )}
                                  className="prose prose-sm max-w-none font-[family-name:var(--font-rubik)]"
                                />
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </AccordionRoot>

          {/* Finish Button */}
          <div className="flex justify-center">
            <Button
              variant="primary"
              color="green"
              size="medium"
              onClick={handleFinishLesson}
            >
              Finalizar lección
            </Button>
          </div>
        </div>

        {/* Completion Modal */}
        <Modal
          isOpen={showCompletionModal}
          onClose={() => {
            setShowCompletionModal(false);
            router.push('/home?section=clase-libre');
          }}
          state="success"
          title="¡Lección completada!"
          description="Has terminado esta lección. Sigue practicando para mejorar tu progreso."
          confirmText="Volver a Clase Libre"
          singleButton
          onConfirm={() => {
            setShowCompletionModal(false);
            router.push('/home?section=clase-libre');
          }}
        />
      </div>
    );
  }
);

FreeLessonView.displayName = 'FreeLessonView';
