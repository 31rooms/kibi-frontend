import { apiClient } from '@/features/authentication/api/config';

export interface SimulationQuota {
  totalPurchased: number;
  totalUsed: number;
  remaining: number;
  canPurchaseMore: boolean;
  maxPurchasable: number;
}

export interface PurchaseSimulationsRequest {
  quantity: number;
}

export interface PurchaseSimulationsResponse {
  clientSecret: string;
  paymentIntentId: string;
  quantity: number;
  pricePerSimulation: number;
  totalAmount: number;
  currency: string;
}

export interface StartSimulationResponse {
  success: boolean;
  remainingSimulations: number;
  message: string;
}

export interface SimulationPurchaseHistoryItem {
  _id: string;
  purchaseType: string;
  maxAttempts: number;
  attemptsUsed: number;
  remaining: number;
  pricePerSimulation: number;
  totalAmount: number;
  purchasedAt: string;
}

export interface SimulationHistoryResponse {
  purchases: SimulationPurchaseHistoryItem[];
  totalPurchased: number;
  totalUsed: number;
  remaining: number;
}

export const simulationsAPI = {
  /**
   * Get user's simulation quota
   */
  getQuota: async (): Promise<SimulationQuota> => {
    const response = await apiClient.get('/simulations/quota');
    return response.data;
  },

  /**
   * Purchase simulations - creates PaymentIntent
   */
  purchaseSimulations: async (
    data: PurchaseSimulationsRequest
  ): Promise<PurchaseSimulationsResponse> => {
    const response = await apiClient.post('/simulations/purchase', data);
    return response.data;
  },

  /**
   * Start a simulation - consumes one from quota
   */
  startSimulation: async (): Promise<StartSimulationResponse> => {
    const response = await apiClient.post('/simulations/start');
    return response.data;
  },

  /**
   * Get simulation purchase history
   */
  getHistory: async (): Promise<SimulationHistoryResponse> => {
    const response = await apiClient.get('/simulations/history');
    return response.data;
  },
};
