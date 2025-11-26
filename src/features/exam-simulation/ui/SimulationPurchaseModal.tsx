'use client';

import React, { useState } from 'react';
import { X, CreditCard, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { StripeProvider } from '@/features/account/providers/StripeProvider';
import { SimulationCheckoutForm } from './SimulationCheckoutForm';

interface SimulationPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maxPurchasable: number;
  onSuccess: () => void;
}

const PRICE_PER_SIMULATION = 299;

export const SimulationPurchaseModal: React.FC<SimulationPurchaseModalProps> = ({
  open,
  onOpenChange,
  maxPurchasable,
  onSuccess,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  const totalPrice = quantity * PRICE_PER_SIMULATION;
  const availableOptions = Array.from({ length: Math.min(maxPurchasable, 3) }, (_, i) => i + 1);

  const handleClose = () => {
    setShowCheckout(false);
    setQuantity(1);
    onOpenChange(false);
  };

  const handleSuccess = () => {
    handleClose();
    onSuccess();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative bg-white dark:bg-[#171B22] rounded-2xl shadow-xl',
          'w-full max-w-md max-h-[90vh] overflow-y-auto'
        )}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-grey-500 hover:text-grey-700 dark:text-grey-400 dark:hover:text-grey-200 transition-colors z-10"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {showCheckout ? (
          <StripeProvider>
            <SimulationCheckoutForm
              quantity={quantity}
              totalAmount={totalPrice}
              onBack={() => setShowCheckout(false)}
              onSuccess={handleSuccess}
            />
          </StripeProvider>
        ) : (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center pt-2">
              <div className="mx-auto w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-primary-green" />
              </div>
              <h2 className="text-xl font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                Adquirir Simulaciones
              </h2>
              <p className="text-grey-600 dark:text-grey-400 text-sm mt-2 font-[family-name:var(--font-rubik)]">
                Selecciona cuántas simulaciones deseas comprar
              </p>
            </div>

            {/* Quantity Selection */}
            <div className="space-y-3">
              {availableOptions.map((num) => (
                <Card
                  key={num}
                  variant="default"
                  padding="medium"
                  onClick={() => setQuantity(num)}
                  className={cn(
                    'cursor-pointer transition-colors duration-200 border-2',
                    quantity === num
                      ? 'border-primary-green bg-success-50 dark:bg-success-900/20'
                      : 'border-grey-300 dark:border-dark-500 hover:border-grey-400 dark:hover:border-dark-400'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                          quantity === num
                            ? 'border-primary-green bg-primary-green'
                            : 'border-grey-400 dark:border-dark-400'
                        )}
                      >
                        {quantity === num && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="font-medium text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
                        {num} Simulación{num > 1 ? 'es' : ''}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                      ${num * PRICE_PER_SIMULATION} MXN
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-grey-50 dark:bg-dark-700 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-grey-600 dark:text-grey-400 font-[family-name:var(--font-rubik)]">
                  Total a pagar:
                </span>
                <span className="text-2xl font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                  ${totalPrice} MXN
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                color="blue"
                size="large"
                onClick={handleClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                color="green"
                size="large"
                onClick={() => setShowCheckout(true)}
                className="flex-1"
              >
                Pagar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
