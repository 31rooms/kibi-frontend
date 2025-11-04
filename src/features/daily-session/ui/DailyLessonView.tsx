'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { ArrowLeft, Clock, Home, ChevronRight } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Progress } from '@/shared/ui/progress';
import { Modal } from '@/shared/ui/Modal';
import { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/ui/Accordion';
import { FeedbackCard, MarkdownRenderer } from '@/shared/ui';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Lesson, LessonQuestion } from '../api/types';
import { dailySessionAPI } from '../api/dailySessionAPI';
import { QuizOption } from '@/shared/ui';
import Image from 'next/image';

export interface DailyLessonViewProps {
  lessonId: string;
}

/**
 * Markdown Content Component (reutilizado de LessonContent)
 */
const MarkdownContent = ({ content }: { content: string }) => (
  <div className="prose prose-sm max-w-none font-[family-name:var(--font-rubik)]">
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ children }) => (
          <p className="text-[14px] text-dark-800 dark:text-white leading-relaxed mb-3 last:mb-0">
            {children}
          </p>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-blue-500 underline hover:text-blue-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-dark-900 dark:text-white">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-dark-800 dark:text-white">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-[14px] text-dark-800 dark:text-white">{children}</li>
        ),
        h1: ({ children }) => (
          <h1 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-3">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-2">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-[16px] font-semibold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-2">
            {children}
          </h3>
        ),
        code: ({ children }) => (
          <code className="bg-grey-100 dark:bg-[#272E3A] px-2 py-1 rounded text-[13px] font-mono text-dark-900 dark:text-white">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-grey-100 dark:bg-[#272E3A] p-4 rounded-lg overflow-x-auto mb-3">
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary-green pl-4 italic text-dark-700 dark:text-white my-3">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="border-grey-300 dark:border-[#374151] my-4" />,
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

/**
 * Question State for daily-session (tracks backend validation)
 */
interface DailyQuestionState {
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  answered: boolean;
  timeSpent: number;
  showTemporaryFeedback: boolean; // Controls temporary 3-second feedback display
  isValidated: boolean; // Permanently tracks if question has been validated at least once
}

/**
 * DailyLessonView Component
 * Displays daily session lessons with reused lesson styles
 */
export const DailyLessonView = React.forwardRef<HTMLDivElement, DailyLessonViewProps>(
  ({ lessonId }, ref) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [questions, setQuestions] = useState<LessonQuestion[]>([]);
    const [questionStates, setQuestionStates] = useState<{ [key: string]: DailyQuestionState }>({});
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
        const lessonData = await dailySessionAPI.getLessonFull(lessonId);
        setLesson(lessonData.lesson);

        const practiceQuestions = lessonData.lesson.categorizedQuestions?.lessonContent || [];
        setQuestions(practiceQuestions);

        const initialStates: { [key: string]: DailyQuestionState } = {};
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

        const sessionResponse = await dailySessionAPI.startLesson(lessonId, {
          type: 'DAILY_SESSION',
        });
        setSessionId(sessionResponse.sessionId);
        setStartTime(Date.now());
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleSelectAnswer = (questionId: string, optionId: string) => {
      const state = questionStates[questionId];
      // Allow selection if not permanently correct
      if (state?.isCorrect) return;

      setQuestionStates((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          selectedAnswer: optionId,
          // Hide feedback when changing answer
          showTemporaryFeedback: false,
          // Keep isValidated to maintain explanation visibility
        },
      }));
    };

    // Clean step-by-step explanation markdown to remove "Respuesta correcta" and "Solución paso a paso" lines
    // This function preserves HTML tags, LaTeX formulas, and multi-line content
    const cleanStepByStepExplanation = (markdown: string): string => {
      if (!markdown) return '';

      // Split by newlines while preserving empty lines
      const lines = markdown.split('\n');

      // Filter out lines that contain "Respuesta correcta", "Solución paso a paso", or checkmark
      // but preserve all other content including HTML and LaTeX
      const filteredLines = lines.filter(line => {
        const trimmedLine = line.trim();
        // Skip empty lines that we want to keep for formatting
        if (trimmedLine === '') return true;
        // Remove lines with unwanted headers
        return !trimmedLine.includes('Respuesta correcta') &&
               !trimmedLine.includes('✅') &&
               !trimmedLine.includes('Solución paso a paso') &&
               !trimmedLine.startsWith('**Solución paso a paso') &&
               !trimmedLine.startsWith('## Solución paso a paso') &&
               !trimmedLine.startsWith('### Solución paso a paso');
      });

      return filteredLines.join('\n').trim();
    };

    const handleValidateAnswer = async (questionId: string) => {
      const state = questionStates[questionId];
      if (!state.selectedAnswer || state.isCorrect || !sessionId) {
        console.log('❌ Validation blocked:', {
          hasSelectedAnswer: !!state.selectedAnswer,
          alreadyCorrect: state.isCorrect,
          hasSessionId: !!sessionId,
        });
        return;
      }

      try {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);

        console.log('📤 Sending answer:', {
          lessonId,
          questionId,
          payload: {
            sessionId,
            givenAnswer: state.selectedAnswer,
            timeSpentSeconds: timeSpent,
          },
        });

        const response = await dailySessionAPI.answerQuestion(lessonId, questionId, {
          sessionId,
          givenAnswer: state.selectedAnswer,
          timeSpentSeconds: timeSpent,
        });

        console.log('✅ Answer response:', response);

        // Update state with validation result
        setQuestionStates((prev) => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],
            isCorrect: response.isCorrect,
            answered: true,
            timeSpent,
            showTemporaryFeedback: true,
            isValidated: true, // Mark as validated to show explanation
          },
        }));

        // If incorrect, auto-clear feedback after 3 seconds and allow retry
        if (!response.isCorrect) {
          setTimeout(() => {
            setQuestionStates((prev) => {
              const currentState = prev[questionId];
              // Only reset if still showing feedback (user didn't interact)
              if (currentState?.showTemporaryFeedback) {
                return {
                  ...prev,
                  [questionId]: {
                    ...currentState,
                    selectedAnswer: null, // Clear selection to allow retry
                    showTemporaryFeedback: false, // Hide feedback
                    answered: false, // Allow re-validation
                  },
                };
              }
              return prev;
            });
          }, 3000);
        }
      } catch (error: any) {
        console.error('❌ Error validating answer:', {
          error,
          message: error?.message,
          response: error?.response,
          data: error?.response?.data,
          status: error?.response?.status,
        });

        // Mostrar un mensaje de error al usuario
        alert(`Error al validar respuesta: ${error?.message || 'Error desconocido'}`);
      }
    };

    const handleFinishLesson = async () => {
      if (!sessionId) return;

      try {
        const answeredCount = Object.values(questionStates).filter((s) => s.answered).length;
        const correctCount = Object.values(questionStates).filter(
          (s) => s.answered && s.isCorrect
        ).length;
        const totalTime = Math.floor((Date.now() - startTime) / 1000);

        await dailySessionAPI.completeLesson(lessonId, {
          sessionId,
          questionsAnswered: answeredCount,
          correctAnswers: correctCount,
          timeSpentSeconds: totalTime,
        });

        setShowCompletionModal(true);
      } catch (error) {
        console.error('Error completing lesson:', error);
      }
    };

    const getProgressPercentage = () => {
      const answeredCount = Object.values(questionStates).filter((s) => s.answered).length;
      return questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
    };

    const handleBack = () => {
      router.back();
    };

    const getDifficultyBadge = () => {
      if (!lesson) return null;
      const colors = {
        BASIC: 'text-green-600 border-green-600 bg-green-50 dark:bg-green-950',
        INTERMEDIATE: 'text-yellow-600 border-yellow-600 bg-yellow-50 dark:bg-yellow-950',
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
            <p className="text-grey-600 dark:text-grey-400 text-sm">Cargando lección...</p>
          </div>
        </div>
      );
    }

    if (!lesson) {
      return null;
    }

    return (
      <div ref={ref} className="h-full bg-grey-50 dark:bg-[#171B22] pb-12">
        {/* Header with breadcrumb - Background, border, and sticky removed */}
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
                onClick={() => router.push('/daily-session')}
                className="hover:text-primary-green transition-colors"
              >
                Sesión diaria
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-primary-green">{lesson.title}</span>
            </div>

            {/* Temporarily commented out - Back button */}
            {/* <button
              onClick={handleBack}
              className={cn(
                'flex items-center gap-2 mb-4',
                'text-dark-900 dark:text-white hover:text-primary-blue dark:hover:text-primary-green',
                'transition-colors'
              )}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium font-[family-name:var(--font-rubik)]">
                Volver
              </span>
            </button> */}

            {/* Title and metadata */}
            <div className="space-y-3">
              {/* Temporarily commented out - Subject badge */}
              {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-green/20 rounded-full mb-2">
                <div className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
                <span className="text-xs font-medium text-primary-green uppercase tracking-wide">
                  Cápsula de ciencia
                </span>
              </div> */}

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

            {/* Temporarily commented out - Progress Bar */}
            {/* {questions.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-grey-600 dark:text-grey-400">
                  <span>Progreso de ejercicios</span>
                  <span>
                    {Object.values(questionStates).filter((s) => s.answered).length} /{' '}
                    {questions.length}
                  </span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
              </div>
            )} */}
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
                <AccordionContent markdown>
                  {lesson.tips}
                </AccordionContent>
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
                <AccordionContent markdown>
                  {lesson.summary}
                </AccordionContent>
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
                  {/* Questions Section - Reutilizado de LessonQuestions */}
                  <div className="space-y-8">
                      {questions.map((question, questionIndex) => {
                        const state = questionStates[question._id];
                        if (!state) return null;

                        const hasSelectedAnswer = state.selectedAnswer !== null;

                        return (
                          <div key={question._id} className="space-y-4">
                            {/* Question Statement */}
                            <h4 className="text-[16px] font-semibold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                              Ejercicio {questionIndex + 1} - {question.statement}
                            </h4>

                            {/* Options usando QuizOption */}
                            <div className="space-y-3">
                              {question.options.map((option) => {
                                const isSelected = state.selectedAnswer === option.id;
                                const isDisabled = state.answered;

                                return (
                                  <QuizOption
                                    key={option.id}
                                    id={option.id}
                                    text={option.text}
                                    selected={isSelected}
                                    multipleChoice={false}
                                    onSelect={() => !isDisabled && handleSelectAnswer(question._id, option.id)}
                                    disabled={isDisabled}
                                  />
                                );
                              })}
                            </div>

                            {/* Validate Button */}
                            {/* Show button when has selected answer and NOT permanently correct */}
                            {!state.isCorrect && hasSelectedAnswer && (
                              <div className="flex justify-center">
                                <Button
                                  variant="primary"
                                  color="green"
                                  size="medium"
                                  onClick={() => handleValidateAnswer(question._id)}
                                >
                                  Validar
                                </Button>
                              </div>
                            )}

                            {/* Temporary Feedback Toast (shown for 3 seconds after validation) */}
                            {state.showTemporaryFeedback && (
                              <FeedbackCard
                                isCorrect={state.isCorrect || false}
                                showKibiIcon={true}
                              />
                            )}

                            {/* Step-by-step Explanation (permanently shown after first incorrect validation) */}
                            {state.isValidated && !state.isCorrect && question.stepByStepExplanation && (
                              <div className="mt-4 p-4 border border-grey-300 dark:border-[#374151] rounded-lg bg-white dark:bg-[#1E242D]">
                                <h3 className="text-[16px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-3">
                                  Solución paso a paso:
                                </h3>
                                <MarkdownRenderer
                                  content={cleanStepByStepExplanation(question.stepByStepExplanation)}
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
              Finalizar sesión
            </Button>
          </div>
        </div>

        {/* Completion Modal */}
        <Modal
          isOpen={showCompletionModal}
          onClose={() => {
            setShowCompletionModal(false);
            router.push('/home');
          }}
          state="success"
          title="¡Sesión completada!"
          description="Has terminado esta lección. Sigue practicando para mejorar tu progreso."
          confirmText="Volver al inicio"
          singleButton
          onConfirm={() => {
            setShowCompletionModal(false);
            router.push('/home');
          }}
        />
      </div>
    );
  }
);

DailyLessonView.displayName = 'DailyLessonView';
