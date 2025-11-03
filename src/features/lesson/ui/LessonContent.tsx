'use client';

import React from 'react';
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  MarkdownRenderer,
} from '@/shared/ui';
import type { Lesson, Module } from '../types/lesson.types';
import { LessonQuestions } from './LessonQuestions';

export interface LessonContentProps {
  module: Module;
  lesson: Lesson;
  className?: string;
}


/**
 * LessonContent Component
 * Renders a single lesson with up to six accordions and module title
 *
 * Structure:
 * 1. Module Title (outside accordions)
 * 2. Accordion 1: "¿Qué aprenderás hoy?" - OPEN by default
 * 3. Accordion 2: "Lo que importa para tu examen" - OPEN by default
 * 4. Accordion 3: "Tips" - CLOSED by default (optional)
 * 5. Accordion 4: "Resumen" - CLOSED by default (optional)
 * 6. Accordion 5: "Aprende más" - CLOSED by default (optional)
 * 7. Accordion 6: "Practica como en el examen real" - CLOSED by default
 *
 * Note: All lesson content fields contain markdown from the backend and are rendered using
 * react-markdown for safe and styled content rendering.
 */
export const LessonContent = React.forwardRef<HTMLDivElement, LessonContentProps>(
  ({ module, lesson, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        {/* Module Title and Description - OUTSIDE accordions */}
        <div className="space-y-2 mb-6">
          <h2 className="text-[24px] md:text-[28px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
            {module.name}
          </h2>
          {lesson.description && (
            <p className="text-[14px] md:text-[16px] text-dark-700 dark:text-white font-[family-name:var(--font-rubik)]">
              {lesson.description}
            </p>
          )}
        </div>

        {/* Accordions using new reusable components */}
        <AccordionRoot
          type="multiple"
          defaultValue={['what-you-will-learn', 'what-matters-for-exam']}
        >
          {/* Accordion 1: ¿Qué aprenderás hoy? - OPEN by default */}
          {lesson.whatYouWillLearn && (
            <AccordionItem value="what-you-will-learn">
              <AccordionTrigger>
                <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                  ¿Qué aprenderás hoy?
                </h3>
              </AccordionTrigger>
              <AccordionContent>
                <MarkdownRenderer
                  content={lesson.whatYouWillLearn}
                  className="prose prose-sm max-w-none font-[family-name:var(--font-rubik)]"
                />
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Accordion 2: Lo que importa para tu examen - OPEN by default */}
          {lesson.whatMattersForExam && (
            <AccordionItem value="what-matters-for-exam">
              <AccordionTrigger>
                <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                  Lo que importa para tu examen
                </h3>
              </AccordionTrigger>
              <AccordionContent>
                <MarkdownRenderer
                  content={lesson.whatMattersForExam}
                  className="prose prose-sm max-w-none font-[family-name:var(--font-rubik)]"
                />
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Accordion 3: Tips - CLOSED by default */}
          {lesson.tips && (
            <AccordionItem value="tips">
              <AccordionTrigger>
                <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                  Tips
                </h3>
              </AccordionTrigger>
              <AccordionContent>
                <MarkdownRenderer
                  content={lesson.tips}
                  className="prose prose-sm max-w-none font-[family-name:var(--font-rubik)]"
                />
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Accordion 4: Resumen - CLOSED by default */}
          {lesson.summary && (
            <AccordionItem value="summary">
              <AccordionTrigger>
                <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                  Resumen
                </h3>
              </AccordionTrigger>
              <AccordionContent>
                <MarkdownRenderer
                  content={lesson.summary}
                  className="prose prose-sm max-w-none font-[family-name:var(--font-rubik)]"
                />
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Accordion 5: Aprende más - CLOSED by default */}
          {lesson.learnMoreResources && (
            <AccordionItem value="learn-more">
              <AccordionTrigger>
                <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                  Aprende más
                </h3>
              </AccordionTrigger>
              <AccordionContent>
                <MarkdownRenderer
                  content={lesson.learnMoreResources}
                  className="prose prose-sm max-w-none font-[family-name:var(--font-rubik)]"
                />
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Accordion 6: Practica como en el examen real - CLOSED by default */}
          {lesson.questions && lesson.questions.length > 0 && (
            <AccordionItem value="practice-questions">
              <AccordionTrigger>
                <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                  Practica como en el examen real
                </h3>
              </AccordionTrigger>
              <AccordionContent>
                <LessonQuestions questions={lesson.questions} />
              </AccordionContent>
            </AccordionItem>
          )}
        </AccordionRoot>
      </div>
    );
  }
);

LessonContent.displayName = 'LessonContent';
