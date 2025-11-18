'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { cn } from '@/shared/lib/utils';
import { Card, Button, Input, Radio } from '@/shared/ui';
import { Copy, Loader2 } from 'lucide-react';
import { Breadcrumb, StripeCardInput } from '../components';
import { PlanCard } from '../components';
import { paymentsAPI } from '../../api/payments-service';
import { useNotificationContext } from '@/features/notifications';
import type { SelectedPlan, TransferData } from '../types';

interface CheckoutViewProps {
  selectedPlan: SelectedPlan;
  onBack: () => void;
  onCancel: () => void;
  onPayment?: (paymentMethod: 'credit' | 'transfer') => void;
  className?: string;
}

/**
 * Helper function para convertir precio string a centavos
 * Ejemplos: "50,00 $" → 5000 centavos | "0,00 $" → 0 centavos
 */
function getPlanAmount(price: string): number {
  // Si el precio es "0,00 $" o similar, retorna 0
  if (price.includes('0,00')) return 0;

  // Para precios reales, parsear correctamente
  // Ej: "50,00 $" → 5000 centavos
  const numStr = price.replace(/[^0-9,]/g, '').replace(',', '.');
  return Math.round(parseFloat(numStr) * 100);
}

/**
 * Helper function para obtener el tipo de plan
 */
function getPlanType(planName: string): 'GOLD' | 'DIAMOND' {
  if (planName.includes('Oro')) return 'GOLD';
  if (planName.includes('Diamante')) return 'DIAMOND';
  // Por defecto retornar GOLD si no se encuentra
  return 'GOLD';
}

/**
 * CheckoutForm Component
 * Maneja el formulario de pago con Stripe Elements
 */
const CheckoutForm: React.FC<CheckoutViewProps> = ({
  selectedPlan,
  onBack,
  onCancel,
  onPayment,
  className
}) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { refresh: refreshNotifications } = useNotificationContext();

  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'transfer'>('credit');

  // Stripe states
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string>('');
  const [cardComplete, setCardComplete] = useState(false);

  const transferData: TransferData = {
    accountNumber: '1234-5678-9012-3456',
    idNumber: '9876-5432-1098-7654',
    amount: selectedPlan.price
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleStripeCardChange = (isComplete: boolean, hasError: boolean) => {
    setCardComplete(isComplete);
    if (!hasError) {
      setCardError('');
    }
  };

  /**
   * Maneja el pago con Stripe
   */
  const handleStripePayment = async () => {
    if (!stripe || !elements) {
      setCardError('Stripe no está inicializado correctamente');
      return;
    }

    if (!cardComplete) {
      setCardError('Por favor completa la información de la tarjeta');
      return;
    }

    setIsProcessing(true);
    setCardError('');

    try {
      // 1. Obtener el monto y tipo de plan
      const amount = getPlanAmount(selectedPlan.price);
      const planType = getPlanType(selectedPlan.name);

      // Validar que no sea plan gratuito
      if (amount === 0) {
        setCardError('No puedes pagar por un plan gratuito');
        setIsProcessing(false);
        return;
      }

      // Log para debugging
      console.log('💳 Creating payment intent:', { planType, amount, amountInDollars: amount / 100 });

      // 2. Crear PaymentIntent en el backend
      const { clientSecret } = await paymentsAPI.createPaymentIntent({
        planType,
        amount, // Monto en centavos (ej: 29900 = $299.00)
      });

      // 3. Confirmar el pago con Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setCardError('Error al obtener la información de la tarjeta');
        setIsProcessing(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setCardError(error.message || 'Error al procesar el pago');
        setIsProcessing(false);
      } else if (paymentIntent?.status === 'succeeded') {
        // Pago exitoso - resetear estado y volver a la vista anterior
        setIsProcessing(false);
        setCardComplete(false);
        setCardError('');

        // Refrescar notificaciones después de 2 segundos para dar tiempo al webhook
        setTimeout(() => {
          console.log('🔔 Refreshing notifications after payment success...');
          refreshNotifications();
        }, 2000);

        // Llamar al callback de pago exitoso si existe
        if (onPayment) {
          onPayment('credit');
        } else {
          // Si no hay callback, volver a la vista de cuenta
          onBack();
        }
      } else {
        setCardError('El pago no pudo ser procesado. Intenta de nuevo.');
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error('Error en el pago:', error);
      setCardError(
        error.response?.data?.message ||
        error.message ||
        'Error al procesar el pago. Intenta de nuevo.'
      );
      setIsProcessing(false);
    }
  };

  /**
   * Maneja el click en el botón "Pagar"
   */
  const handlePayment = () => {
    if (paymentMethod === 'credit') {
      handleStripePayment();
    } else {
      // Para transferencia, llamar al callback que cambia a la vista de reportar pago
      if (onPayment) {
        onPayment('transfer');
      }
    }
  };

  const isFormComplete = paymentMethod === 'credit'
    ? cardComplete && !isProcessing
    : true;

  return (
    <main className={cn(
      "flex-1 overflow-y-auto p-6 md:p-8",
      "bg-grey-50 dark:bg-[#171B22]",
      className
    )}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', onClick: onBack },
            { label: 'Cuenta', onClick: onBack },
            { label: 'Planes', onClick: onCancel },
            { label: 'Check out', isActive: true }
          ]}
        />

        {/* Título centrado */}
        <h1 className="text-[32px] lg:text-[40px] font-bold text-primary-green text-center font-[family-name:var(--font-quicksand)] mb-8">
          Check out
        </h1>

        {/* Contenedor más acotado para el checkout */}
        <div className="w-full max-w-[474px] mx-auto space-y-6">
          {/* Tag (solo desktop) */}
          {selectedPlan.name.includes('Oro') && (
            <div className="hidden md:block relative">
              <div className="absolute -top-3 left-4 z-10">
                <span
                  className="inline-flex items-center px-3 py-1.5 text-sm font-bold rounded text-white font-[family-name:var(--font-rubik)]"
                  style={{ backgroundColor: '#E8B600' }}
                >
                  Recomendado
                </span>
              </div>
            </div>
          )}

          {/* Desktop: Plan card separado */}
          <div className="hidden md:block">
            <PlanCard plan={selectedPlan} />
          </div>

          {/* Card con método de pago (y plan info en mobile) */}
          <Card className="p-6">
            {/* Mobile: Plan info dentro de la Card */}
            <div className="md:hidden mb-6">
              <h3 className="text-[16px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] text-center mb-2">
                {selectedPlan.name}
              </h3>
              <p className="text-[20px] font-bold text-primary-green font-[family-name:var(--font-quicksand)] text-center mb-4">
                {selectedPlan.price}
              </p>
              <div className="border-b border-[#DFE4EA] dark:border-[#374151] mb-6"></div>
            </div>

            <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-4">
              Método de pago
            </h2>

            {/* Radio buttons para método de pago */}
            <div className="flex gap-8 mb-6">
              <Radio
                name="paymentMethod"
                checked={paymentMethod === 'credit'}
                onCheckedChange={() => setPaymentMethod('credit')}
                label="Crédito/Debito"
                labelClassName="text-[14px] font-[family-name:var(--font-rubik)]"
                disabled={isProcessing}
              />
              <Radio
                name="paymentMethod"
                checked={paymentMethod === 'transfer'}
                onCheckedChange={() => setPaymentMethod('transfer')}
                label="Transferencia"
                labelClassName="text-[14px] font-[family-name:var(--font-rubik)]"
                disabled={isProcessing}
              />
            </div>

            {/* Campos de tarjeta con Stripe (solo si es crédito/débito) */}
            {paymentMethod === 'credit' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 mb-2 font-[family-name:var(--font-rubik)]">
                    Información de la Tarjeta
                  </label>
                  <StripeCardInput
                    error={cardError}
                    onChange={handleStripeCardChange}
                  />
                  <p className="mt-2 text-xs text-grey-600 dark:text-grey-400 font-[family-name:var(--font-rubik)]">
                    Número de tarjeta, fecha de vencimiento y CVV en un solo campo seguro
                  </p>
                </div>

                {/* Indicador de procesamiento */}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-sm text-primary-green font-[family-name:var(--font-rubik)]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Procesando pago...</span>
                  </div>
                )}
              </div>
            )}

            {/* Campos de transferencia */}
            {paymentMethod === 'transfer' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 mb-2 font-[family-name:var(--font-rubik)]">
                    Número de cuenta
                  </label>
                  <Input
                    value={transferData.accountNumber}
                    readOnly
                    className="bg-grey-100 dark:bg-dark-800 cursor-default"
                    trailingIcon={
                      <button
                        type="button"
                        onClick={() => handleCopyToClipboard(transferData.accountNumber)}
                        className="cursor-pointer hover:text-primary-green transition-colors"
                        title="Copiar número de cuenta"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 mb-2 font-[family-name:var(--font-rubik)]">
                    Número de cédula
                  </label>
                  <Input
                    value={transferData.idNumber}
                    readOnly
                    className="bg-grey-100 dark:bg-dark-800 cursor-default"
                    trailingIcon={
                      <button
                        type="button"
                        onClick={() => handleCopyToClipboard(transferData.idNumber)}
                        className="cursor-pointer hover:text-primary-green transition-colors"
                        title="Copiar número de cédula"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 mb-2 font-[family-name:var(--font-rubik)]">
                    Monto
                  </label>
                  <Input
                    value={transferData.amount}
                    readOnly
                    className="bg-grey-100 dark:bg-dark-800 cursor-default"
                    trailingIcon={
                      <button
                        type="button"
                        onClick={() => handleCopyToClipboard(transferData.amount)}
                        className="cursor-pointer hover:text-primary-green transition-colors"
                        title="Copiar monto"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    }
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                  <ul className="space-y-1 text-sm text-dark-700 dark:text-grey-300 font-[family-name:var(--font-rubik)]">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                      <span>Realice el pago a la cuenta señalada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                      <span>Reporte su pago</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Botones dentro de la Card (solo mobile) */}
            <div className="md:hidden flex gap-4 justify-around mt-6">
              <Button
                variant="secondary"
                color="green"
                size="large"
                onClick={onCancel}
                className="flex-1 max-w-[200px]"
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                color="green"
                size="large"
                className="flex-1 max-w-[200px]"
                onClick={handlePayment}
                disabled={!isFormComplete || isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  paymentMethod === 'transfer' ? 'Continuar' : 'Pagar'
                )}
              </Button>
            </div>
          </Card>

          {/* Botones fuera de la Card (solo desktop) */}
          <div className="hidden md:flex gap-4 justify-around">
            <Button
              variant="secondary"
              color="green"
              size="large"
              onClick={onCancel}
              className="flex-1 max-w-[200px]"
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              color="green"
              size="large"
              className="flex-1 max-w-[200px]"
              onClick={handlePayment}
              disabled={!isFormComplete || isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando...
                </span>
              ) : (
                paymentMethod === 'transfer' ? 'Continuar' : 'Pagar'
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

/**
 * CheckoutView with Stripe Provider Wrapper
 * Este componente envuelve el CheckoutForm con StripeProvider
 */
export const CheckoutView: React.FC<CheckoutViewProps> = (props) => {
  // No importamos StripeProvider aquí porque debe estar en un nivel superior
  // El componente padre (AccountSection) debe envolver con StripeProvider
  return <CheckoutForm {...props} />;
};
