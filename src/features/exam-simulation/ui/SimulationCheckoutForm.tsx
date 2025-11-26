'use client';

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { ArrowLeft, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { StripeCardInput } from '@/features/account/ui/components/StripeCardInput';
import { simulationsAPI } from '../api/simulations-service';

interface SimulationCheckoutFormProps {
  quantity: number;
  totalAmount: number;
  onBack: () => void;
  onSuccess: () => void;
}

export const SimulationCheckoutForm: React.FC<SimulationCheckoutFormProps> = ({
  quantity,
  totalAmount,
  onBack,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      setError('Stripe no está disponible. Intenta recargar la página.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // 1. Create PaymentIntent on backend
      const { clientSecret } = await simulationsAPI.purchaseSimulations({
        quantity,
      });

      // 2. Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Error al obtener los datos de la tarjeta');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: cardElement } }
      );

      if (stripeError) {
        setError(stripeError.message || 'Error al procesar el pago');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Wait a moment for webhook to process
        await new Promise((resolve) => setTimeout(resolve, 1500));
        onSuccess();
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Error al procesar la compra. Intenta de nuevo.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="p-2 hover:bg-grey-100 dark:hover:bg-dark-700 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5 text-dark-700 dark:text-grey-300" />
        </button>
        <h2 className="text-xl font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
          Pago con tarjeta
        </h2>
      </div>

      {/* Order Summary */}
      <Card
        variant="default"
        padding="medium"
        className="bg-grey-50 dark:bg-dark-700 border-grey-200 dark:border-dark-500"
      >
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-grey-600 dark:text-grey-400 font-[family-name:var(--font-rubik)]">
              Simulaciones:
            </span>
            <span className="font-medium text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
              {quantity}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-grey-600 dark:text-grey-400 font-[family-name:var(--font-rubik)]">
              Precio unitario:
            </span>
            <span className="font-medium text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
              $299 MXN
            </span>
          </div>
          <div className="border-t border-grey-200 dark:border-dark-500 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-medium text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
                Total:
              </span>
              <span className="text-xl font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                ${totalAmount} MXN
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Card Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 font-[family-name:var(--font-rubik)]">
          Datos de la tarjeta
        </label>
        <StripeCardInput
          error={error}
          onChange={(complete, hasError) => {
            setCardComplete(complete);
            if (hasError && !error) {
              setError('Verifica los datos de tu tarjeta');
            } else if (!hasError && error === 'Verifica los datos de tu tarjeta') {
              setError('');
            }
          }}
        />
      </div>

      {/* Error Message */}
      {error && error !== 'Verifica los datos de tu tarjeta' && (
        <p className="text-sm text-error-500 font-[family-name:var(--font-rubik)]">
          {error}
        </p>
      )}

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-xs text-grey-500 dark:text-grey-400">
        <Lock className="w-4 h-4" />
        <span className="font-[family-name:var(--font-rubik)]">
          Pago seguro procesado por Stripe
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          color="blue"
          size="large"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1"
        >
          Atrás
        </Button>
        <Button
          variant="primary"
          color="green"
          size="large"
          onClick={handleSubmit}
          disabled={!cardComplete || isProcessing || !stripe}
          className="flex-1"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Procesando...
            </span>
          ) : (
            `Pagar`
          )}
        </Button>
      </div>
    </div>
  );
};
