/**
 * Payments API Service
 * Handles Stripe payment operations
 */

import { apiClient } from '@/features/authentication/api/config';

export interface CreatePaymentIntentRequest {
  planType: 'GOLD' | 'DIAMOND';
  amount: number; // en centavos (ej: 5000 = $50.00)
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export const paymentsAPI = {
  /**
   * Crea un PaymentIntent en el backend para procesar un pago con Stripe
   * @param data - Información del plan y monto
   * @returns Client secret para confirmar el pago en el frontend
   */
  createPaymentIntent: async (
    data: CreatePaymentIntentRequest
  ): Promise<CreatePaymentIntentResponse> => {
    const response = await apiClient.post('/payments/create-intent', data);
    return response.data;
  },
};
