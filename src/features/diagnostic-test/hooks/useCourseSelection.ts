'use client';

import { useState, useMemo } from 'react';
import type {
  CourseOption,
  CourseSelectionData,
  CourseSelectionErrors,
} from '../types/course-selection.types';

/**
 * Custom hook for managing course selection form state and logic
 * Handles form data, validation, and submission for course selection
 */
export function useCourseSelection() {
  // Form state
  const [formData, setFormData] = useState<CourseSelectionData>({
    selectedCourseId: '',
    customCourseName: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<CourseSelectionErrors>({});

  // Control when to show errors (only after first submit attempt)
  const [showErrors, setShowErrors] = useState(false);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Default course options
   * Memoized list of available courses
   */
  const courseOptions = useMemo<CourseOption[]>(
    () => [
      { id: 'ninguno', label: 'No estoy en ningún curso' },
      { id: 'curso-1', label: 'Curso 1' },
      { id: 'curso-2', label: 'Curso 2' },
      { id: 'curso-3', label: 'Curso 3' },
      { id: 'curso-4', label: 'Curso 4' },
      { id: 'otro', label: 'Otro' },
    ],
    []
  );

  /**
   * Check if "Otro" option is selected
   */
  const isOtherSelected = formData.selectedCourseId === 'otro';

  /**
   * Handle course selection
   * @param courseId - ID of the selected course
   */
  const handleCourseSelect = (courseId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCourseId: courseId,
      // Clear custom course name if switching away from "Otro"
      customCourseName: courseId === 'otro' ? prev.customCourseName : '',
    }));

    // Clear error for selectedCourseId ONLY if errors are already being shown
    if (showErrors && errors.selectedCourseId) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.selectedCourseId;
        return newErrors;
      });
    }
  };

  /**
   * Handle custom course name input
   * @param value - Custom course name value
   */
  const handleCustomInput = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      customCourseName: value,
    }));

    // Clear error for customCourseName ONLY if errors are already being shown
    if (showErrors && errors.customCourseName) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.customCourseName;
        return newErrors;
      });
    }
  };

  /**
   * Validate form data
   * @returns true if form is valid, false otherwise
   */
  const validate = (): boolean => {
    const newErrors: CourseSelectionErrors = {};

    // Validate course selection
    if (!formData.selectedCourseId) {
      newErrors.selectedCourseId = 'Debes seleccionar un curso';
    }

    // Validate custom course name if "Otro" is selected
    if (formData.selectedCourseId === 'otro' && !formData.customCourseName?.trim()) {
      newErrors.customCourseName = 'Debes ingresar el nombre del curso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param onSuccess - Callback function to execute on successful validation
   */
  const handleSubmit = (onSuccess: (data: CourseSelectionData) => void) => {
    // Enable error display on first submit
    setShowErrors(true);

    if (validate()) {
      setIsSubmitting(true);
      try {
        onSuccess(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    formData,
    errors,
    showErrors,
    isSubmitting,
    courseOptions,
    isOtherSelected,
    handleCourseSelect,
    handleCustomInput,
    handleSubmit,
  };
}
