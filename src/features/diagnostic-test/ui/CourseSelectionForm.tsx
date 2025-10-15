'use client';

import * as React from 'react';
import { Button, Input, Checkbox } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useCourseSelection } from '../hooks/useCourseSelection';
import type { CourseSelectionData } from '../types/course-selection.types';

/**
 * CourseSelectionForm Component Props
 */
export interface CourseSelectionFormProps {
  /**
   * Callback function called when form is successfully submitted
   * @param data - The validated course selection data
   */
  onSubmit: (data: CourseSelectionData) => void;

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * CourseSelectionForm Component
 *
 * Form for selecting a course after completing a diagnostic test.
 * Displays a list of course options (as radio buttons using Checkbox style="5")
 * and an optional custom input field when "Otro" is selected.
 *
 * @example
 * ```tsx
 * <CourseSelectionForm
 *   onSubmit={(data) => console.log('Selected:', data)}
 *   onSkip={() => console.log('Skipped')}
 * />
 * ```
 */
export const CourseSelectionForm = React.forwardRef<
  HTMLDivElement,
  CourseSelectionFormProps
>(({ onSubmit, className }, ref) => {
  const {
    formData,
    errors,
    showErrors,
    isSubmitting,
    courseOptions,
    isOtherSelected,
    handleCourseSelect,
    handleCustomInput,
    handleSubmit,
  } = useCourseSelection();

  /**
   * Handle form submission
   */
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit);
  };

  /**
   * Handle checkbox selection (radio button behavior)
   * Only one checkbox can be selected at a time
   */
  const handleCheckboxChange = (courseId: string) => {
    handleCourseSelect(courseId);
  };

  return (
    <div
      ref={ref}
      className={cn(
        'w-full max-w-xl p-6 md:p-10',
        className
      )}
    >
      <form onSubmit={onFormSubmit} className="flex flex-col items-center gap-6">
        {/* Info Box */}
        <div className="w-full bg-success-50 rounded-2xl py-4 px-5 md:py-5 md:px-6">
          <p className="text-[14px] md:text-[16px] text-dark-900 text-center font-[family-name:var(--font-rubik)] leading-relaxed">
            Antes de ver tus resultados, indícanos, ¿En qué curso estás inscrito
            actualmente?
          </p>
        </div>

        {/* Kibi Robot Icon */}
        <div className="flex justify-center">
          <Image
            src="/illustrations/Kibi Icon.svg"
            alt="Kibi Robot"
            width={100}
            height={100}
            priority
          />
        </div>

        {/* Course Options List */}
        <div className="w-full flex flex-col gap-4">
          {courseOptions.map((course) => (
            <div
              key={course.id}
              onClick={(e) => {
                e.preventDefault();
                if (!isSubmitting) {
                  handleCheckboxChange(course.id);
                }
              }}
              className="cursor-pointer"
            >
              <Checkbox
                style="2"
                checked={formData.selectedCourseId === course.id}
                onCheckedChange={() => {}}
                label={course.label}
                labelClassName={cn(
                  'text-[14px] md:text-[16px] font-[family-name:var(--font-rubik)] text-dark-900',
                  'cursor-pointer'
                )}
                disabled={isSubmitting}
              />
            </div>
          ))}

          {/* Show error for course selection */}
          {showErrors && errors.selectedCourseId && (
            <p className="text-xs text-error-500 -mt-2">
              {errors.selectedCourseId}
            </p>
          )}
        </div>

        {/* Custom Course Input (conditional) */}
        {isOtherSelected && (
          <div className="w-full">
            <Input
              label="Nombre del curso"
              placeholder="Ingresa el nombre del curso"
              value={formData.customCourseName}
              onChange={(e) => handleCustomInput(e.target.value)}
              error={showErrors ? errors.customCourseName : undefined}
              containerClassName="w-full"
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          color="green"
          size="large"
          className="w-full mt-2 gap-2"
          disabled={isSubmitting}
        >
          Ver mis resultados
          <ArrowRight className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
});

CourseSelectionForm.displayName = 'CourseSelectionForm';
