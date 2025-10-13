// Authentication Form Validation Utilities

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  if (!email.trim()) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password - minimum 6 characters for login
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validates password for registration - stronger requirements
 * At least 8 characters, one uppercase, one lowercase, and one number
 */
export const validatePasswordStrong = (password: string): boolean => {
  if (password.length < 8) return false;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
  return passwordRegex.test(password);
};

/**
 * Validates if two passwords match
 */
export const validatePasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword && password.length > 0;
};

/**
 * Validates phone number (optional field)
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone.trim()) return true; // Optional field
  // Basic phone validation - allows digits, spaces, dashes, parentheses
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Get email validation error message
 */
export const getEmailError = (email: string): string | null => {
  if (!email.trim()) {
    return 'Por favor ingresa tu correo electrónico';
  }
  if (!validateEmail(email)) {
    return 'Por favor ingresa un correo electrónico válido';
  }
  return null;
};

/**
 * Get password validation error message (for login)
 */
export const getPasswordError = (password: string): string | null => {
  if (!password) {
    return 'Por favor ingresa tu contraseña';
  }
  if (!validatePassword(password)) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  return null;
};

/**
 * Get password validation error message (for registration)
 */
export const getPasswordStrongError = (password: string): string | null => {
  if (!password) {
    return 'Por favor ingresa una contraseña';
  }
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  if (!validatePasswordStrong(password)) {
    return 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
  }
  return null;
};

/**
 * Get password confirmation error message
 */
export const getPasswordConfirmError = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Por favor confirma tu contraseña';
  }
  if (!validatePasswordsMatch(password, confirmPassword)) {
    return 'Las contraseñas no coinciden';
  }
  return null;
};
