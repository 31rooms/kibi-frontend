/**
 * Validation utilities for account forms
 */

/**
 * Validates if the credit card form is complete
 */
export const isCardFormComplete = (
  cardNumber: string,
  expiryDate: string,
  cvv: string
): boolean => {
  return (
    cardNumber.length === 19 && // 16 dígitos + 3 espacios
    expiryDate.length === 5 &&   // MM/YY
    cvv.length === 3              // 3 dígitos
  );
};

/**
 * Validates if the report payment form is complete
 */
export const isReportFormComplete = (
  referenceNumber: string,
  paymentDate: string,
  amount: string
): boolean => {
  return (
    referenceNumber.trim() !== '' &&
    paymentDate.trim() !== '' &&
    amount.trim() !== ''
  );
};
