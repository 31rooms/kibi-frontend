import { apiClient } from '@/features/authentication/api/config';

export interface ReferralCodeResponse {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  successfulReferrals: number;
  rewards: {
    simulations: number;
    message: string;
  };
}

export const referralsAPI = {
  /**
   * Get user's referral code and statistics
   */
  getReferralCode: async (): Promise<ReferralCodeResponse> => {
    const response = await apiClient.get('/referrals/code');
    return response.data;
  },
};
