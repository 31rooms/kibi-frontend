'use client';

import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/shared/lib/utils';
import { ChevronDown } from 'lucide-react';
import type { Module } from '../types/lesson.types';
import { QuestionCard } from './QuestionCard';

export interface ModuleAccordionProps {
  modules: Module[];
  onQuestionAnswered?: (questionId: string, isCorrect: boolean) => void;
}

export const ModuleAccordion: React.FC<ModuleAccordionProps> = ({
  modules,
  onQuestionAnswered
}) => {
  // TODO: Get correct answers from API - for now using hardcoded value
  const getCorrectAnswers = (questionId: string): string[] => {
    // This should be fetched from the API or included in the question data
    return ['b'];
  };

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className="w-full rounded-lg border border-grey-300 bg-white overflow-hidden"
    >
      {modules.map((module) => {
        // Filter questions for lesson content only
        const lessonQuestions = module.questions?.filter(q =>
          q.purpose?.includes('LESSON_CONTENT')
        ) || [];

        if (lessonQuestions.length === 0) return null;

        return (
          <AccordionPrimitive.Item
            key={module._id}
            value={module._id}
            className="border-b border-grey-300 last:border-0"
          >
            {/* Accordion Trigger */}
            <AccordionPrimitive.Trigger
              className={cn(
                'flex w-full items-center justify-between py-4 px-6 text-left',
                'transition-all hover:bg-grey-50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2',
                '[&[data-state=open]>svg]:rotate-180'
              )}
            >
              <div className="flex-1 text-left">
                <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)] mb-1">
                  {module.name}
                </h3>
                {module.description && (
                  <p className="text-[14px] text-dark-700 font-[family-name:var(--font-rubik)]">
                    {module.description}
                  </p>
                )}
              </div>
              <ChevronDown className="h-5 w-5 text-dark-600 transition-transform duration-200 shrink-0 ml-4" />
            </AccordionPrimitive.Trigger>

            {/* Accordion Content */}
            <AccordionPrimitive.Content
              className={cn(
                'overflow-hidden transition-all',
                'data-[state=closed]:animate-accordion-up',
                'data-[state=open]:animate-accordion-down'
              )}
            >
              <div className="px-6 pb-6 pt-2">
                {/* Questions */}
                {lessonQuestions.map((question, questionIndex) => (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    questionNumber={questionIndex + 1}
                    correctAnswers={getCorrectAnswers(question._id)}
                    onAnswered={onQuestionAnswered}
                  />
                ))}
              </div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        );
      })}
    </AccordionPrimitive.Root>
  );
};
