'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { cn } from '@/shared/lib/utils';
import { Card, Button, Input, Radio } from '@/shared/ui';
import { Copy, Loader2, Store } from 'lucide-react';
import { Breadcrumb, StripeCardInput } from '../components';
import { PlanCard } from '../components';
import { paymentsAPI } from '../../api/payments-service';
import { useNotificationContext } from '@/features/notifications';
import type { SelectedPlan, TransferData, OxxoVoucherData } from '../types';

interface CheckoutViewProps {
  selectedPlan: SelectedPlan;
  onBack: () => void;
  onCancel: () => void;
  onPayment?: (paymentMethod: 'credit' | 'transfer') => void;
  onOxxoVoucher?: (voucherData: OxxoVoucherData) => void;
  className?: string;
}

/**
 * Helper function para convertir precio a centavos
 * Usa upgradeCost si es un upgrade, sino priceNumber
 */
function getPlanAmountInCents(plan: SelectedPlan): number {
  // Si es un upgrade, usar el costo de upgrade
  if (plan.isUpgrade && plan.upgradeCost !== undefined && plan.upgradeCost > 0) {
    return Math.round(plan.upgradeCost * 100);
  }

  // Si tenemos priceNumber, usarlo directamente (convertir a centavos)
  if (plan.priceNumber !== undefined && plan.priceNumber > 0) {
    return Math.round(plan.priceNumber * 100);
  }

  // Fallback: parsear el string de precio
  // Formatos soportados: "$299.00", "299,00 $", "Gratis"
  if (plan.price === 'Gratis' || plan.price.includes('0.00') || plan.price.includes('0,00')) {
    return 0;
  }

  // Extraer solo números y punto/coma decimal
  const numStr = plan.price
    .replace(/[^0-9.,]/g, '')  // Eliminar todo excepto números, punto y coma
    .replace(',', '.');         // Normalizar coma a punto

  const amount = parseFloat(numStr);
  return isNaN(amount) ? 0 : Math.round(amount * 100);
}

/**
 * Helper function para obtener el precio a mostrar (upgrade o completo)
 */
function getDisplayPrice(plan: SelectedPlan): string {
  if (plan.isUpgrade && plan.upgradeCostDisplay) {
    return plan.upgradeCostDisplay;
  }
  return plan.price;
}

/**
 * Helper function para obtener el tipo de plan
 * Usa type directamente si está disponible, sino parsea el nombre
 */
function getPlanType(plan: SelectedPlan): 'GOLD' | 'DIAMOND' {
  // Si tenemos type, usarlo directamente
  if (plan.type && (plan.type === 'GOLD' || plan.type === 'DIAMOND')) {
    return plan.type;
  }

  // Fallback: parsear el nombre
  if (plan.name.includes('Oro') || plan.name.toUpperCase().includes('GOLD')) return 'GOLD';
  if (plan.name.includes('Diamante') || plan.name.toUpperCase().includes('DIAMOND')) return 'DIAMOND';
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
  onOxxoVoucher,
  className
}) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { refresh: refreshNotifications } = useNotificationContext();

  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'transfer' | 'oxxo'>('credit');

  // Stripe states
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string>('');
  const [cardComplete, setCardComplete] = useState(false);

  const displayPrice = getDisplayPrice(selectedPlan);
  
  const transferData: TransferData = {
    accountNumber: '1234-5678-9012-3456',
    idNumber: '9876-5432-1098-7654',
    amount: displayPrice
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
      const amount = getPlanAmountInCents(selectedPlan);
      const planType = getPlanType(selectedPlan);

      // Validar que no sea plan gratuito
      if (amount === 0) {
        setCardError('No puedes pagar por un plan gratuito');
        setIsProcessing(false);
        return;
      }

      // Log para debugging
      console.log('💳 Creating payment intent:', { 
        planType, 
        amount, 
        amountInPesos: amount / 100,
        isUpgrade: selectedPlan.isUpgrade,
        currentPlanType: selectedPlan.currentPlanType,
      });

      // 2. Crear PaymentIntent en el backend
      const { clientSecret } = await paymentsAPI.createPaymentIntent({
        planType,
        amount, // Monto en centavos (ej: 29900 = $299.00)
        isUpgrade: selectedPlan.isUpgrade,
        currentPlanType: selectedPlan.currentPlanType,
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
   * Maneja el pago con OXXO
   */
  const handleOxxoPayment = async () => {
    setIsProcessing(true);
    setCardError('');

    try {
      const amount = getPlanAmountInCents(selectedPlan);
      const planType = getPlanType(selectedPlan);

      // Validar monto mínimo para OXXO ($10 MXN = 1000 centavos)
      if (amount < 1000) {
        setCardError('OXXO requiere un monto mínimo de $10.00 MXN');
        setIsProcessing(false);
        return;
      }

      // Validar monto máximo para OXXO ($10,000 MXN = 1,000,000 centavos)
      if (amount > 1000000) {
        setCardError('OXXO tiene un monto máximo de $10,000.00 MXN');
        setIsProcessing(false);
        return;
      }

      console.log('🏪 Creating OXXO payment intent:', {
        planType,
        amount,
        amountInPesos: amount / 100,
        isUpgrade: selectedPlan.isUpgrade,
        currentPlanType: selectedPlan.currentPlanType,
      });

      const response = await paymentsAPI.createPaymentIntent({
        planType,
        amount,
        isUpgrade: selectedPlan.isUpgrade,
        currentPlanType: selectedPlan.currentPlanType,
        paymentMethodType: 'oxxo',
      });

      if (!response.oxxoVoucherUrl || !response.oxxoReference || !response.oxxoExpiresAt) {
        throw new Error('No se pudo generar el voucher OXXO');
      }

      // Llamar al callback con los datos del voucher
      if (onOxxoVoucher) {
        onOxxoVoucher({
          voucherUrl: response.oxxoVoucherUrl,
          reference: response.oxxoReference,
          expiresAt: response.oxxoExpiresAt,
          amount: getDisplayPrice(selectedPlan),
          planName: selectedPlan.name,
        });
      }
    } catch (error: any) {
      console.error('Error al generar voucher OXXO:', error);
      setCardError(
        error.response?.data?.message ||
        error.message ||
        'Error al generar voucher OXXO. Intenta de nuevo.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Maneja el click en el botón "Pagar"
   */
  const handlePayment = () => {
    if (paymentMethod === 'credit') {
      handleStripePayment();
    } else if (paymentMethod === 'oxxo') {
      handleOxxoPayment();
    } else {
      // Para transferencia, llamar al callback que cambia a la vista de reportar pago
      if (onPayment) {
        onPayment('transfer');
      }
    }
  };

  const isFormComplete = paymentMethod === 'credit'
    ? cardComplete && !isProcessing
    : !isProcessing;

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
          {selectedPlan.recommended && (
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
                {selectedPlan.isUpgrade ? `Mejorar a ${selectedPlan.name}` : selectedPlan.name}
              </h3>
              {selectedPlan.isUpgrade && selectedPlan.upgradeCost !== selectedPlan.priceNumber && (
                <p className="text-sm text-grey-600 dark:text-grey-400 font-[family-name:var(--font-rubik)] text-center mb-1">
                  Precio original: {selectedPlan.price}
                </p>
              )}
              <p className="text-[20px] font-bold text-primary-green font-[family-name:var(--font-quicksand)] text-center mb-0">
                {displayPrice}
              </p>
              {displayPrice !== 'Gratis' && (
                <p className="text-[10px] text-grey-600 dark:text-grey-400 font-[family-name:var(--font-rubik)] text-center mb-2">
                  MXN
                </p>
              )}
              {selectedPlan.isUpgrade && selectedPlan.upgradeCost !== selectedPlan.priceNumber && (
                <p className="text-xs text-grey-500 dark:text-grey-400 font-[family-name:var(--font-rubik)] text-center mb-4">
                  Solo pagas la diferencia
                </p>
              )}
              <div className="border-b border-[#DFE4EA] dark:border-[#374151] mb-6"></div>
            </div>

            <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-4">
              Método de pago
            </h2>

            {/* Radio buttons para método de pago */}
            <div className="flex flex-wrap gap-4 sm:gap-8 mb-6">
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
                checked={paymentMethod === 'oxxo'}
                onCheckedChange={() => setPaymentMethod('oxxo')}
                label="OXXO"
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

            {/* Información de OXXO */}
            {paymentMethod === 'oxxo' && (
              <div className="space-y-4">
                {/* Icono y descripción */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#CC0000] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                      Pago en OXXO
                    </h3>
                    <p className="text-sm text-grey-600 dark:text-grey-400 font-[family-name:var(--font-rubik)]">
                      Paga en efectivo en cualquier tienda OXXO
                    </p>
                  </div>
                </div>

                {/* Información importante */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-dark-700 dark:text-grey-300 font-[family-name:var(--font-rubik)] mb-3">
                    Al continuar, se generará un voucher con un número de referencia para pagar en cualquier tienda OXXO.
                  </p>
                  <ul className="space-y-1 text-xs text-grey-600 dark:text-grey-400 font-[family-name:var(--font-rubik)]">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                      <span>Tienes <strong>3 días</strong> para realizar el pago</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                      <span>Tu plan se activa automáticamente al confirmar el pago</span>
                    </li>
                  </ul>
                </div>

                {/* Error message */}
                {cardError && (
                  <p className="text-sm text-error-500 font-[family-name:var(--font-rubik)]">
                    {cardError}
                  </p>
                )}

                {/* Indicador de procesamiento */}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-sm text-primary-green font-[family-name:var(--font-rubik)]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generando voucher...</span>
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
                    {paymentMethod === 'oxxo' ? 'Generando...' : 'Procesando...'}
                  </span>
                ) : (
                  paymentMethod === 'transfer' ? 'Continuar' : paymentMethod === 'oxxo' ? 'Generar Voucher' : 'Pagar'
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
