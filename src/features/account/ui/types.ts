/**
 * Shared types for account UI
 */

import type { PlanColors } from './utils/planHelpers';

export type ViewMode = 'view' | 'edit' | 'change-password' | 'contact' | 'plans' | 'checkout' | 'report-payment' | 'oxxo-voucher';

export interface SelectedPlan {
  _id?: string;
  type: 'FREE' | 'GOLD' | 'DIAMOND';
  name: string;
  price: string;
  priceNumber: number;
  currency: string;
  durationMonths: number;
  features: string[];
  colors: PlanColors;
  recommended?: boolean;
  // Upgrade-specific fields
  isUpgrade?: boolean;
  upgradeCost?: number;
  upgradeCostDisplay?: string;
  currentPlanType?: 'FREE' | 'GOLD' | 'DIAMOND';
  currentPlanPrice?: number;
}

export interface ReportData {
  referenceNumber: string;
  paymentDate: string;
  amount: string;
}

export interface TransferData {
  accountNumber: string;
  idNumber: string;
  amount: string;
}

export interface OxxoVoucherData {
  voucherUrl: string;
  reference: string;
  expiresAt: string;
  amount: string;
  planName: string;
}
