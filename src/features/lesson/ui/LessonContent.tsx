'use client';

import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/shared/lib/utils';
import { ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Lesson, Module } from '../types/lesson.types';
import { LessonQuestions } from './LessonQuestions';

export interface LessonContentProps {
  module: Module;
  lesson: Lesson;
  className?: string;
}

/**
 * Markdown Content Component
 * Renders markdown content with consistent styling
 */
const MarkdownContent = ({ content }: { content: string }) => (
  <div className="prose prose-sm max-w-none font-[family-name:var(--font-rubik)]">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className="text-[14px] text-dark-800 leading-relaxed mb-3 last:mb-0">
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
          <strong className="font-bold text-dark-900">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-dark-800">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-[14px] text-dark-800">{children}</li>
        ),
        h1: ({ children }) => (
          <h1 className="text-[20px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-3">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-[18px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-2">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-[16px] font-semibold text-dark-900 font-[family-name:var(--font-quicksand)] mb-2">
            {children}
          </h3>
        ),
        code: ({ children }) => (
          <code className="bg-grey-100 px-2 py-1 rounded text-[13px] font-mono text-dark-900">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-grey-100 p-4 rounded-lg overflow-x-auto mb-3">
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary-green pl-4 italic text-dark-700 my-3">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="border-grey-300 my-4" />,
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

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
      <div ref={ref} className={cn('space-y-6', className)}>
        {/* Module Title and Description - OUTSIDE accordions */}
        <div className="space-y-2">
          <h2 className="text-[24px] md:text-[28px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
            {module.name}
          </h2>
          {lesson.description && (
            <p className="text-[14px] md:text-[16px] text-dark-700 font-[family-name:var(--font-rubik)]">
              {lesson.description}
            </p>
          )}
        </div>

        {/* Accordions with custom Radix implementation */}
        <AccordionPrimitive.Root
          type="multiple"
          defaultValue={['what-you-will-learn', 'what-matters-for-exam']}
          className="space-y-4"
        >
          {/* Accordion 1: ¿Qué aprenderás hoy? */}
          {lesson.whatYouWillLearn && (
            <AccordionPrimitive.Item
              value="what-you-will-learn"
              className="w-full rounded-lg border border-grey-300 bg-white overflow-hidden"
            >
              <AccordionPrimitive.Trigger
                className={cn(
                  'flex w-full items-center justify-between py-4 px-6 text-left transition-all',
                  'hover:bg-grey-50',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2',
                  '[&[data-state=open]>svg]:rotate-180'
                )}
              >
                <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                  ¿Qué aprenderás hoy?
                </h3>
                <ChevronDown className="h-5 w-5 text-dark-600 transition-transform duration-200 shrink-0 ml-4" />
              </AccordionPrimitive.Trigger>
              <AccordionPrimitive.Content
                className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
              >
                <div className="px-6 pb-6 pt-2">
                  <MarkdownContent content={lesson.whatYouWillLearn} />
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          )}

          {/* Accordion 2: Lo que importa para tu examen */}
          {lesson.whatMattersForExam && (
            <AccordionPrimitive.Item
              value="what-matters-for-exam"
              className="w-full rounded-lg border border-grey-300 bg-white overflow-hidden"
            >
              <AccordionPrimitive.Trigger
                className={cn(
                  'flex w-full items-center justify-between py-4 px-6 text-left transition-all',
                  'hover:bg-grey-50',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2',
                  '[&[data-state=open]>svg]:rotate-180'
                )}
              >
                <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                  Lo que importa para tu examen
                </h3>
                <ChevronDown className="h-5 w-5 text-dark-600 transition-transform duration-200 shrink-0 ml-4" />
              </AccordionPrimitive.Trigger>
              <AccordionPrimitive.Content
                className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
              >
                <div className="px-6 pb-6 pt-2">
                  <MarkdownContent content={lesson.whatMattersForExam} />
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          )}

          {/* Accordion 3: Tips - CERRADO por defecto */}
          {lesson.tips && (
            <AccordionPrimitive.Item
              value="tips"
              className="w-full rounded-lg border border-grey-300 bg-white overflow-hidden"
            >
              <AccordionPrimitive.Trigger
                className={cn(
                  'flex w-full items-center justify-between py-4 px-6 text-left transition-all',
                  'hover:bg-grey-50',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2',
                  '[&[data-state=open]>svg]:rotate-180'
                )}
              >
                <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                  Tips
                </h3>
                <ChevronDown className="h-5 w-5 text-dark-600 transition-transform duration-200 shrink-0 ml-4" />
              </AccordionPrimitive.Trigger>
              <AccordionPrimitive.Content
                className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
              >
                <div className="px-6 pb-6 pt-2">
                  <MarkdownContent content={lesson.tips} />
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          )}

          {/* Accordion 4: Resumen - CERRADO por defecto */}
          {lesson.summary && (
            <AccordionPrimitive.Item
              value="summary"
              className="w-full rounded-lg border border-grey-300 bg-white overflow-hidden"
            >
              <AccordionPrimitive.Trigger
                className={cn(
                  'flex w-full items-center justify-between py-4 px-6 text-left transition-all',
                  'hover:bg-grey-50',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2',
                  '[&[data-state=open]>svg]:rotate-180'
                )}
              >
                <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                  Resumen
                </h3>
                <ChevronDown className="h-5 w-5 text-dark-600 transition-transform duration-200 shrink-0 ml-4" />
              </AccordionPrimitive.Trigger>
              <AccordionPrimitive.Content
                className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
              >
                <div className="px-6 pb-6 pt-2">
                  <MarkdownContent content={lesson.summary} />
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          )}

          {/* Accordion 5: Aprende más - CERRADO por defecto */}
          {lesson.learnMoreResources && (
            <AccordionPrimitive.Item
              value="learn-more"
              className="w-full rounded-lg border border-grey-300 bg-white overflow-hidden"
            >
              <AccordionPrimitive.Trigger
                className={cn(
                  'flex w-full items-center justify-between py-4 px-6 text-left transition-all',
                  'hover:bg-grey-50',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2',
                  '[&[data-state=open]>svg]:rotate-180'
                )}
              >
                <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                  Aprende más
                </h3>
                <ChevronDown className="h-5 w-5 text-dark-600 transition-transform duration-200 shrink-0 ml-4" />
              </AccordionPrimitive.Trigger>
              <AccordionPrimitive.Content
                className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
              >
                <div className="px-6 pb-6 pt-2">
                  <MarkdownContent content={lesson.learnMoreResources} />
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          )}

          {/* Accordion 6: Practica como en el examen real - CERRADO por defecto */}
          {lesson.questions && lesson.questions.length > 0 && (
            <AccordionPrimitive.Item
              value="practice-questions"
              className="w-full rounded-lg border border-grey-300 bg-white overflow-hidden"
            >
              <AccordionPrimitive.Trigger
                className={cn(
                  'flex w-full items-center justify-between py-4 px-6 text-left transition-all',
                  'hover:bg-grey-50',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2',
                  '[&[data-state=open]>svg]:rotate-180'
                )}
              >
                <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                  Practica como en el examen real
                </h3>
                <ChevronDown className="h-5 w-5 text-dark-600 transition-transform duration-200 shrink-0 ml-4" />
              </AccordionPrimitive.Trigger>
              <AccordionPrimitive.Content
                className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
              >
                <div className="px-6 pb-6 pt-2">
                  <LessonQuestions questions={lesson.questions} />
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          )}
        </AccordionPrimitive.Root>
      </div>
    );
  }
);

LessonContent.displayName = 'LessonContent';
