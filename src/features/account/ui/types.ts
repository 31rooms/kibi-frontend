/**
 * Shared types for account UI
 */

import type { PlanData } from './utils/planHelpers';

export type ViewMode = 'view' | 'edit' | 'change-password' | 'contact' | 'plans' | 'checkout' | 'report-payment';

export type SelectedPlan = PlanData;

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
