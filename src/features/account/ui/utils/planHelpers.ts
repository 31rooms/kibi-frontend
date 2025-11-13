/**
 * Plan-related helper functions
 */

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
  if (planName.includes('Oro')) return 'GOLD';
  if (planName.includes('Diamante')) return 'DIAMOND';
  return 'FREE';
};

/**
 * Gets plan data based on subscription plan
 */
export const getPlanDataByType = (plan: 'FREE' | 'GOLD' | 'DIAMOND'): PlanData => {
  if (plan === 'GOLD') {
    return {
      name: 'Plan Oro',
      price: '299,00 $',
      features: ['Asignaturas habilitadas: Todas', 'Kibi bot: Limitado'],
      colors: {
        bg: '#FFFAE6',
        bgDark: '#FFC80033',
        border: '#E8B600',
        borderDark: '#FFC800',
        icon: '#E8B600',
        iconDark: '#FFC800'
      }
    };
  } else if (plan === 'DIAMOND') {
    return {
      name: 'Plan Diamante',
      price: '499,00 $',
      features: ['Asignaturas habilitadas: Todas', 'Kibi bot: Todas las funciones activas'],
      colors: {
        bg: '#EAF0FE',
        bgDark: '#2D68F833',
        border: '#2D68F8',
        borderDark: '#2D68F8',
        icon: '#2D68F8',
        iconDark: '#2D68F8'
      }
    };
  } else {
    return {
      name: 'Plan Free',
      price: 'Gratis',
      features: ['Asignaturas habilitadas: Algebra', 'Kibi bot: Bloqueado'],
      colors: {
        bg: '#E7FFE7',
        bgDark: '#1DA53433',
        border: '#47830E',
        borderDark: '#95C16B',
        icon: '#47830E',
        iconDark: '#95C16B'
      }
    };
  }
};

/**
 * Gets user's current plan data
 */
export const getUserPlanData = (subscriptionPlan?: string): PlanData => {
  const userPlan = (subscriptionPlan?.toUpperCase() || 'FREE') as 'FREE' | 'GOLD' | 'DIAMOND';
  return getPlanDataByType(userPlan);
};
