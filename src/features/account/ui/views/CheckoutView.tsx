'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Card, Button, Input, Radio } from '@/shared/ui';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { Breadcrumb } from '../components';
import { PlanCard } from '../components';
import { formatCardNumber, formatExpiryDate, formatCvv, isCardFormComplete } from '../utils';
import type { SelectedPlan, TransferData } from '../types';

interface CheckoutViewProps {
  selectedPlan: SelectedPlan;
  onBack: () => void;
  onCancel: () => void;
  onPayment: () => void;
  className?: string;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  selectedPlan,
  onBack,
  onCancel,
  onPayment,
  className
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'transfer'>('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCardNumber, setShowCardNumber] = useState(true);
  const [showExpiryDate, setShowExpiryDate] = useState(true);
  const [showCvv, setShowCvv] = useState(true);

  const transferData: TransferData = {
    accountNumber: '1234-5678-9012-3456',
    idNumber: '9876-5432-1098-7654',
    amount: selectedPlan.price
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value, expiryDate));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(formatCvv(e.target.value));
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isFormComplete = paymentMethod === 'credit'
    ? isCardFormComplete(cardNumber, expiryDate, cvv)
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
              />
              <Radio
                name="paymentMethod"
                checked={paymentMethod === 'transfer'}
                onCheckedChange={() => setPaymentMethod('transfer')}
                label="Transferencia"
                labelClassName="text-[14px] font-[family-name:var(--font-rubik)]"
              />
            </div>

            {/* Campos de tarjeta (solo si es crédito/débito) */}
            {paymentMethod === 'credit' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 mb-2">
                    Numero de Tarjeta
                  </label>
                  <Input
                    type={showCardNumber ? 'text' : 'password'}
                    placeholder=""
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    trailingIcon={
                      <button
                        type="button"
                        onClick={() => setShowCardNumber(!showCardNumber)}
                        className="cursor-pointer hover:text-primary-green transition-colors"
                      >
                        {showCardNumber ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 mb-2">
                      Vencimiento
                    </label>
                    <Input
                      type={showExpiryDate ? 'text' : 'password'}
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      maxLength={5}
                      trailingIcon={
                        <button
                          type="button"
                          onClick={() => setShowExpiryDate(!showExpiryDate)}
                          className="cursor-pointer hover:text-primary-green transition-colors"
                        >
                          {showExpiryDate ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 mb-2">
                      CVV
                    </label>
                    <Input
                      type={showCvv ? 'text' : 'password'}
                      placeholder=""
                      value={cvv}
                      onChange={handleCvvChange}
                      maxLength={3}
                      trailingIcon={
                        <button
                          type="button"
                          onClick={() => setShowCvv(!showCvv)}
                          className="cursor-pointer hover:text-primary-green transition-colors"
                        >
                          {showCvv ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      }
                    />
                  </div>
                </div>
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
              <Button variant="secondary" color="green" size="large" onClick={onCancel} className="flex-1 max-w-[200px]">
                Cancelar
              </Button>
              <Button
                variant="primary"
                color="green"
                size="large"
                className="flex-1 max-w-[200px]"
                onClick={onPayment}
                disabled={!isFormComplete}
              >
                Pagar
              </Button>
            </div>
          </Card>

          {/* Botones fuera de la Card (solo desktop) */}
          <div className="hidden md:flex gap-4 justify-around">
            <Button variant="secondary" color="green" size="large" onClick={onCancel} className="flex-1 max-w-[200px]">
              Cancelar
            </Button>
            <Button
              variant="primary"
              color="green"
              size="large"
              className="flex-1 max-w-[200px]"
              onClick={onPayment}
              disabled={!isFormComplete}
            >
              Pagar
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};
