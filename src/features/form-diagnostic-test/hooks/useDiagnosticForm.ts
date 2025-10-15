'use client';

import { useState, useRef, useEffect } from 'react';
import type { DiagnosticFormData, DiagnosticFormErrors } from '../types/diagnostic.types';

export function useDiagnosticForm() {
  // Form state
  const [formData, setFormData] = useState<DiagnosticFormData>({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: undefined,
  });

  // Validation errors
  const [errors, setErrors] = useState<DiagnosticFormErrors>({});

  // Control when to show errors (only after first submit attempt)
  const [showErrors, setShowErrors] = useState(false);

  // Calendar visibility
  const [showCalendar, setShowCalendar] = useState(false);

  // Ref for calendar popover positioning
  const dateButtonRef = useRef<HTMLButtonElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCalendar && dateButtonRef.current && !dateButtonRef.current.contains(event.target as Node)) {
        // Check if click is not inside the calendar popover
        const calendarPopover = document.getElementById('calendar-popover');
        if (calendarPopover && !calendarPopover.contains(event.target as Node)) {
          setShowCalendar(false);
        }
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  // Handle input changes
  const handleInputChange = (field: keyof DiagnosticFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field ONLY if errors are already being shown
    if (showErrors && errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, birthDate: date }));
    // Clear error for birthDate ONLY if errors are already being shown
    if (showErrors && errors.birthDate) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.birthDate;
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: DiagnosticFormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    }

    if (!formData.gender) {
      newErrors.gender = 'Debes seleccionar un género';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Debes seleccionar tu fecha de nacimiento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (onSuccess: () => void) => {
    // Enable error display on first submit
    setShowErrors(true);

    if (validateForm()) {
      onSuccess();
    }
  };

  return {
    formData,
    errors,
    showErrors,
    showCalendar,
    dateButtonRef,
    handleInputChange,
    handleDateSelect,
    handleSubmit,
    setShowCalendar,
  };
}
