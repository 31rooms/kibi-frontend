/**
 * Plan-related helper functions
 */

import type { Plan } from '../../api/plans-service';
import { getPlanColors, formatPlanPrice } from '../../api/plans-service';

/**
 * Gets the order (hierarchy level) of a plan from the plans list
 * Uses the 'order' property from the Plan entity
 */
export const getPlanOrder = (
  plans: Plan[],
  planType: 'FREE' | 'GOLD' | 'DIAMOND' | string | undefined
): number => {
  const normalizedType = (planType?.toUpperCase() || 'FREE') as 'FREE' | 'GOLD' | 'DIAMOND';
  const plan = plans.find((p) => p.type === normalizedType);
  return plan?.order ?? 0;
};

/**
 * Checks if user can upgrade from current plan to target plan
 * Only allows upgrading to a higher tier plan (based on order)
 */
export const canUpgradeToPlan = (
  currentPlanOrder: number,
  targetPlanOrder: number
): boolean => {
  return targetPlanOrder > currentPlanOrder;
};

/**
 * Calculates the upgrade cost (difference between plans)
 * Returns 0 if downgrade or same plan
 */
export const calculateUpgradeCost = (
  currentPlanPrice: number,
  targetPlanPrice: number
): number => {
  const difference = targetPlanPrice - currentPlanPrice;
  return difference > 0 ? difference : 0;
};

/**
 * Gets upgrade info for a target plan
 * Uses the 'order' property from Plan to determine hierarchy
 */
export interface UpgradeInfo {
  canUpgrade: boolean;
  upgradeCost: number;
  isCurrentPlan: boolean;
  isDowngrade: boolean;
}

export const getUpgradeInfo = (
  currentPlanOrder: number,
  currentPlanPrice: number,
  targetPlan: Plan
): UpgradeInfo => {
  const targetOrder = targetPlan.order;

  const isCurrentPlan = currentPlanOrder === targetOrder;
  const isDowngrade = targetOrder < currentPlanOrder;
  const canUpgrade = targetOrder > currentPlanOrder;
  const upgradeCost = canUpgrade ? calculateUpgradeCost(currentPlanPrice, targetPlan.price) : 0;

  return {
    canUpgrade,
    upgradeCost,
    isCurrentPlan,
    isDowngrade,
  };
};

export interface PlanColors {
  bg: string;
  bgDark: string;
  border: string;
  borderDark: string;
  icon: string;
  iconDark: string;
}

export interface PlanData {
  name: string;
  price: string;
  features: string[];
  colors: PlanColors;
}

/**
 * Maps plan name to subscription enum
 */
export const getPlanEnum = (planName: string): 'FREE' | 'GOLD' | 'DIAMOND' => {
  if (planName.includes('Oro') || planName.includes('GOLD')) return 'GOLD';
  if (planName.includes('Diamante') || planName.includes('DIAMOND')) return 'DIAMOND';
  return 'FREE';
};

/**
 * Convert Plan from API to PlanData for UI (fallback/default)
 */
export const planToPlanData = (plan: Plan): PlanData => {
  const colors = getPlanColors(plan.type);
  const featuresStrings = plan.features
    .filter((f) => f.included)
    .map((f) => f.limit ? `${f.name}: ${f.limit}` : f.name);

  return {
    name: plan.name,
    price: formatPlanPrice(plan.price, plan.currency),
    features: featuresStrings,
    colors,
  };
};

/**
 * Gets plan data based on subscription plan (fallback for when API is not available)
 */
export const getPlanDataByType = (plan: 'FREE' | 'GOLD' | 'DIAMOND'): PlanData => {
  if (plan === 'GOLD') {
    return {
      name: 'Plan Oro',
      price: '$299',
      features: ['Asignaturas habilitadas: Todas', 'Kibi bot: Limitado'],
      colors: getPlanColors('GOLD'),
    };
  } else if (plan === 'DIAMOND') {
    return {
      name: 'Plan Diamante',
      price: '$499',
      features: ['Asignaturas habilitadas: Todas', 'Kibi bot: Todas las funciones activas'],
      colors: getPlanColors('DIAMOND'),
    };
  } else {
    return {
      name: 'Plan Free',
      price: 'Gratis',
      features: ['Asignaturas habilitadas: Algebra', 'Kibi bot: Bloqueado'],
      colors: getPlanColors('FREE'),
    };
  }
};

/**
 * Gets user's current plan data (fallback)
 */
export const getUserPlanData = (subscriptionPlan?: string): PlanData => {
  const userPlan = (subscriptionPlan?.toUpperCase() || 'FREE') as 'FREE' | 'GOLD' | 'DIAMOND';
  return getPlanDataByType(userPlan);
};

/**
 * Gets user's current plan data from plans list
 */
export const getUserPlanDataFromPlans = (plans: Plan[], subscriptionPlan?: string): PlanData => {
  const userPlanType = (subscriptionPlan?.toUpperCase() || 'FREE') as 'FREE' | 'GOLD' | 'DIAMOND';
  const plan = plans.find((p) => p.type === userPlanType);

  if (plan) {
    return planToPlanData(plan);
  }

  return getUserPlanData(subscriptionPlan);
};

/**
 * Convert Plan from API to SelectedPlan for checkout
 */
export interface SelectedPlanData {
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
}

export const planToSelectedPlan = (plan: Plan): SelectedPlanData => {
  const colors = getPlanColors(plan.type);
  const featuresStrings = plan.features
    .filter((f) => f.included)
    .map((f) => f.limit ? `${f.name}: ${f.limit}` : f.name);

  return {
    _id: plan._id,
    type: plan.type,
    name: plan.name,
    price: formatPlanPrice(plan.price, plan.currency),
    priceNumber: plan.price,
    currency: plan.currency,
    durationMonths: plan.durationMonths,
    features: featuresStrings,
    colors,
    recommended: plan.recommended,
  };
};

/**
 * Convert Plan from API to SelectedPlan with upgrade information
 * Uses the 'order' property from Plan to determine upgrade eligibility
 */
export const planToSelectedPlanWithUpgrade = (
  plan: Plan,
  currentPlanType: 'FREE' | 'GOLD' | 'DIAMOND' | string | undefined,
  currentPlanOrder: number,
  currentPlanPrice: number
): SelectedPlanData & {
  isUpgrade: boolean;
  upgradeCost: number;
  upgradeCostDisplay: string;
  currentPlanType: 'FREE' | 'GOLD' | 'DIAMOND';
  currentPlanPrice: number;
} => {
  const basePlan = planToSelectedPlan(plan);
  const upgradeInfo = getUpgradeInfo(currentPlanOrder, currentPlanPrice, plan);
  const normalizedCurrentType = (currentPlanType?.toUpperCase() || 'FREE') as 'FREE' | 'GOLD' | 'DIAMOND';

  return {
    ...basePlan,
    isUpgrade: upgradeInfo.canUpgrade,
    upgradeCost: upgradeInfo.upgradeCost,
    upgradeCostDisplay: upgradeInfo.upgradeCost > 0
      ? formatPlanPrice(upgradeInfo.upgradeCost, plan.currency)
      : formatPlanPrice(plan.price, plan.currency),
    currentPlanType: normalizedCurrentType,
    currentPlanPrice,
  };
};
