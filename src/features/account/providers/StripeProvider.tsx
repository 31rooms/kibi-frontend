'use client';

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Inicializar Stripe con la clave pública
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
}

/**
 * StripeProvider Component
 *
 * Wrapper que provee el contexto de Stripe Elements a los componentes hijos.
 * Debe envolver cualquier componente que use Stripe Elements (CardElement, etc.)
 */
export const StripeProvider: React.FC<StripeProviderProps> = ({
  children,
  clientSecret,
}) => {
  // Memorizar las options para evitar re-renders innecesarios
  const options = React.useMemo(
    () => {
      const baseOptions = {
        appearance: {
          theme: 'stripe' as const,
          variables: {
            colorPrimary: '#95C16B', // primary-green de Kibi
            colorBackground: '#ffffff',
            colorText: '#171B22',
            colorDanger: '#dc3545',
            fontFamily: 'var(--font-rubik), Rubik, sans-serif',
            borderRadius: '8px',
            // Variables específicas para Link
            colorTextPlaceholder: '#6b7280',
            spacingUnit: '4px',
          },
          rules: {
            '.Tab': {
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              color: '#171B22',
              boxShadow: 'none',
            },
            '.Tab:hover': {
              backgroundColor: '#f9fafb',
              color: '#171B22',
              border: '1px solid #95C16B',
            },
            '.Tab:focus': {
              backgroundColor: '#ffffff',
              border: '1px solid #95C16B',
              boxShadow: '0 0 0 2px rgba(149, 193, 107, 0.2)',
            },
            '.Tab--selected': {
              backgroundColor: '#ffffff',
              color: '#171B22',
              border: '1px solid #95C16B',
              boxShadow: 'none',
            },
            '.Tab--selected:hover': {
              backgroundColor: '#f9fafb',
              color: '#171B22',
            },
            '.TabLabel': {
              color: '#171B22',
            },
            '.TabIcon': {
              fill: '#171B22',
            },
            '.TabIcon--selected': {
              fill: '#95C16B',
            },
            '.Input': {
              backgroundColor: '#ffffff',
              color: '#171B22',
              boxShadow: 'none',
            },
            '.Label': {
              color: '#171B22',
              fontWeight: '500',
            },
          },
        },
      };

      return clientSecret
        ? { ...baseOptions, clientSecret }
        : baseOptions;
    },
    [clientSecret]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};
