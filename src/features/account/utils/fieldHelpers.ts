/**
 * Check if a field value is empty/missing
 */
export const isFieldEmpty = (value: string | undefined | null): boolean => {
  return !value || value.trim() === '';
};

/**
 * Get display value or "Completar" if empty
 */
export const getDisplayValue = (value: string | undefined | null): string | null => {
  return isFieldEmpty(value) ? null : value!;
};

/**
 * Translate gender enum from backend to Spanish
 */
export const getGenderLabel = (gender: string | undefined): string => {
  const genderMap: Record<string, string> = {
    'MALE': 'Masculino',
    'FEMALE': 'Femenino',
    'OTHER': 'Otro',
    'PREFER_NOT_TO_SAY': 'Prefiero no decir',
  };

  return gender ? genderMap[gender] || gender : '';
};

/**
 * Format date from ISO string to dd/MM/yyyy (local date, no timezone conversion)
 * This prevents the date from shifting due to UTC timezone
 */
export const formatDateLocal = (isoDate: string | undefined): string => {
  if (!isoDate) return '';

  // Extract just the date part (YYYY-MM-DD) to avoid timezone issues
  const datePart = isoDate.split('T')[0];
  const [year, month, day] = datePart.split('-');

  return `${day}/${month}/${year}`;
};

/**
 * Convert ISO date string to YYYY-MM-DD format for input[type="date"]
 * Extracts only the date part to avoid timezone conversion
 */
export const formatDateForInput = (isoDate: string | undefined): string => {
  if (!isoDate) return '';

  // Extract just the date part (YYYY-MM-DD)
  return isoDate.split('T')[0];
};
