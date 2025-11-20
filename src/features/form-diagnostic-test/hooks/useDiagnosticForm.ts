'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/features/authentication';
import { accountAPI } from '@/features/account';
import type { DiagnosticFormData, DiagnosticFormErrors } from '../types/diagnostic.types';

export function useDiagnosticForm() {
  const { user, updateUser } = useAuth();

  // Form state - Initialize with user data if available
  const [formData, setFormData] = useState<DiagnosticFormData>(() => {
    let birthDate: Date | undefined;

    if (user?.dateOfBirth) {
      // Parse date without timezone conversion (extract YYYY-MM-DD and create local date)
      const dateStr = user.dateOfBirth.split('T')[0];
      const [year, month, day] = dateStr.split('-').map(Number);
      birthDate = new Date(year, month - 1, day);
    }

    return {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      gender: user?.gender || '',
      birthDate,
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Check if form is complete
  const isFormComplete = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.gender !== '' &&
      formData.birthDate !== undefined
    );
  };

  // Handle form submission
  const handleSubmit = async (onSuccess: () => void) => {
    // Enable error display on first submit
    setShowErrors(true);

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Format date to ISO string for backend
      const dateOfBirth = formData.birthDate
        ? formData.birthDate.toISOString().split('T')[0]
        : undefined;

      // Call API to update user profile
      const updatedUser = await accountAPI.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        dateOfBirth: dateOfBirth,
      });

      // Update user context
      updateUser(updatedUser);

      // Call success callback
      onSuccess();
    } catch (error) {
      console.error('Failed to update profile:', error);
      // You could set an error state here to show to the user
      alert('Error al guardar la información. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    showErrors,
    showCalendar,
    dateButtonRef,
    isSubmitting,
    isFormComplete: isFormComplete(),
    handleInputChange,
    handleDateSelect,
    handleSubmit,
    setShowCalendar,
  };
}
