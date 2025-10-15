/**
 * Form data for diagnostic test registration
 */
export interface DiagnosticFormData {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: Date | undefined;
}

/**
 * Validation errors for diagnostic form fields
 */
export interface DiagnosticFormErrors {
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthDate?: string;
}
