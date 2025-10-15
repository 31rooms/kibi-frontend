/**
 * Course Selection Types
 * Types for the course selection form after completing a diagnostic test
 */

/**
 * Course option interface
 * Represents a single course option in the selection list
 */
export interface CourseOption {
  /** Unique identifier for the course */
  id: string;
  /** Display label for the course option */
  label: string;
}

/**
 * Course selection form data
 * Data structure for the course selection form
 */
export interface CourseSelectionData {
  /** ID of the selected course */
  selectedCourseId: string;
  /** Custom course name when "Otro" is selected */
  customCourseName?: string;
}

/**
 * Course selection validation errors
 * Error messages for form validation
 */
export interface CourseSelectionErrors {
  selectedCourseId?: string;
  customCourseName?: string;
}

/**
 * Course selection component state
 * Complete state for the course selection form
 */
export interface CourseSelectionState {
  /** Current form data */
  formData: CourseSelectionData;
  /** Validation errors */
  errors: CourseSelectionErrors;
  /** Whether to display validation errors */
  showErrors: boolean;
  /** Whether the form is being submitted */
  isSubmitting: boolean;
}
