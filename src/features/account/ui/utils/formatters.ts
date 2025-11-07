/**
 * Formatting utilities for account inputs
 */

/**
 * Formats a card number with spaces every 4 digits
 * Example: 1234567890123456 -> 1234 5678 9012 3456
 */
export const formatCardNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  const formatted = numbers.replace(/(\d{4})/g, '$1 ').trim();
  return formatted.substring(0, 19); // 16 dígitos + 3 espacios
};

/**
 * Formats an expiry date as MM/YY
 */
export const formatExpiryDate = (value: string, currentExpiryDate: string): string => {
  const numbers = value.replace(/\D/g, '');

  // Si el usuario está borrando y eliminó el /, solo mantener los números antes del /
  if (value.length < currentExpiryDate.length && value.endsWith('/')) {
    return numbers.substring(0, 2);
  }

  // Formatear según la cantidad de números
  if (numbers.length === 0) {
    return '';
  } else if (numbers.length <= 2) {
    return numbers;
  } else {
    // Agregar el / automáticamente después de 2 dígitos
    return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
  }
};

/**
 * Formats CVV to only contain digits (max 3)
 */
export const formatCvv = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.substring(0, 3);
};
