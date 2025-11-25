import apiClient from '@/features/authentication/api/config';

/**
 * Plan Feature interface
 */
export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

/**
 * Plan interface from backend
 */
export interface Plan {
  _id: string;
  type: 'FREE' | 'GOLD' | 'DIAMOND';
  name: string;
  price: number;
  currency: string;
  durationMonths: number;
  features: PlanFeature[];
  discount?: {
    percentage: number;
    originalPrice: number;
    message: string;
  };
  recommended: boolean;
  order: number;
}

/**
 * Plans response interface
 */
export interface PlansResponse {
  plans: Plan[];
}

/**
 * Plan colors for UI
 */
export interface PlanColors {
  bg: string;
  bgDark: string;
  border: string;
  borderDark: string;
  icon: string;
  iconDark: string;
}

/**
 * Get plan colors by type
 */
export const getPlanColors = (type: 'FREE' | 'GOLD' | 'DIAMOND'): PlanColors => {
  switch (type) {
    case 'GOLD':
      return {
        bg: '#FFFAE6',
        bgDark: '#FFC80033',
        border: '#E8B600',
        borderDark: '#FFC800',
        icon: '#E8B600',
        iconDark: '#FFC800',
      };
    case 'DIAMOND':
      return {
        bg: '#EAF0FE',
        bgDark: '#2D68F833',
        border: '#2D68F8',
        borderDark: '#2D68F8',
        icon: '#2D68F8',
        iconDark: '#2D68F8',
      };
    default:
      return {
        bg: '#E7FFE7',
        bgDark: '#1DA53433',
        border: '#47830E',
        borderDark: '#95C16B',
        icon: '#47830E',
        iconDark: '#95C16B',
      };
  }
};

/**
 * Format plan price for display
 * - If price has no decimals (.00), show integer only
 */
export const formatPlanPrice = (price: number, _currency: string): string => {
  if (price === 0) return 'Gratis';

  // If price is a whole number, show without decimals
  const formattedPrice = price % 1 === 0 ? price.toString() : price.toFixed(2);

  return `$${formattedPrice}`;
};

/**
 * Plans API Service
 * Handles plans-related API calls
 */
export const plansAPI = {
  /**
   * Get all available plans
   * Public endpoint - no authentication required
   */
  async getPlans(): Promise<Plan[]> {
    try {
      console.log('📋 API: Calling GET /plans');

      const response = await apiClient.get<PlansResponse>('/plans');

      console.log('✅ API: Plans retrieved successfully');
      return response.data.plans;
    } catch (error) {
      console.error('❌ API: Plans retrieval failed');
      const errorResponse = error as {
        response?: {
          status?: number;
          data?: { message?: string | string[] };
        };
      };
      console.error('Status:', errorResponse.response?.status);
      console.error('Response:', errorResponse.response?.data);

      if (errorResponse.response?.data?.message) {
        const message = errorResponse.response.data.message;
        if (Array.isArray(message)) {
          throw new Error(message.join(', '));
        }
        throw new Error(message);
      }
      throw new Error('Failed to retrieve plans. Please try again.');
    }
  },
};
