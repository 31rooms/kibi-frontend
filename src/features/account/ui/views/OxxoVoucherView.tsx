'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Card, Button } from '@/shared/ui';
import { Copy, ExternalLink, Check, Clock, Store } from 'lucide-react';
import { Breadcrumb } from '../components';
import type { OxxoVoucherData } from '../types';

interface OxxoVoucherViewProps {
  voucherData: OxxoVoucherData;
  onClose: () => void;
  className?: string;
}

/**
 * OxxoVoucherView Component
 * Muestra el voucher de OXXO generado por Stripe con toda la información necesaria para el pago.
 */
export const OxxoVoucherView: React.FC<OxxoVoucherViewProps> = ({
  voucherData,
  onClose,
  className
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReference = () => {
    navigator.clipboard.writeText(voucherData.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenVoucher = () => {
    window.open(voucherData.voucherUrl, '_blank', 'noopener,noreferrer');
  };

  // Formatear fecha de expiración
  const formatExpirationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
            { label: 'Home', onClick: onClose },
            { label: 'Cuenta', onClick: onClose },
            { label: 'Voucher OXXO', isActive: true }
          ]}
        />

        {/* Titulo */}
        <h1 className="text-[32px] lg:text-[40px] font-bold text-primary-green text-center font-[family-name:var(--font-quicksand)] mb-8">
          Voucher OXXO
        </h1>

        {/* Contenedor principal */}
        <div className="w-full max-w-[520px] mx-auto space-y-6">
          {/* Card con icono de OXXO y estado */}
          <Card className="p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-[#CC0000] rounded-full flex items-center justify-center">
                <Store className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] text-center mb-2">
              {voucherData.planName}
            </h2>

            <p className="text-[24px] font-bold text-primary-green font-[family-name:var(--font-quicksand)] text-center mb-6">
              {voucherData.amount}
            </p>

            {/* Separador */}
            <div className="border-b border-[#DFE4EA] dark:border-[#374151] mb-6"></div>

            {/* Número de referencia */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 mb-2 font-[family-name:var(--font-rubik)]">
                Número de referencia
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0 bg-grey-100 dark:bg-dark-800 rounded-lg px-3 sm:px-4 py-3 font-mono text-sm sm:text-lg text-dark-900 dark:text-white break-all">
                  {voucherData.reference}
                </div>
                <button
                  type="button"
                  onClick={handleCopyReference}
                  className={cn(
                    "p-3 rounded-lg transition-colors",
                    copied
                      ? "bg-success-100 text-success-600 dark:bg-success-900/20 dark:text-success-400"
                      : "bg-grey-100 dark:bg-dark-800 text-grey-600 dark:text-grey-400 hover:text-primary-green"
                  )}
                  title="Copiar referencia"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Fecha de expiración */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
              <Clock className="h-5 w-5 text-warning-600 dark:text-warning-400 flex-shrink-0" />
              <div className="text-sm text-dark-700 dark:text-grey-300 font-[family-name:var(--font-rubik)]">
                <span className="font-medium">Expira:</span>{' '}
                {formatExpirationDate(voucherData.expiresAt)}
              </div>
            </div>

            {/* Instrucciones */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-3">
                Instrucciones de pago
              </h3>
              <ol className="space-y-2 text-sm text-dark-700 dark:text-grey-300 font-[family-name:var(--font-rubik)]">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[20px]">1.</span>
                  <span>Acude a cualquier tienda OXXO</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[20px]">2.</span>
                  <span>Indica que deseas realizar un pago de servicio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[20px]">3.</span>
                  <span>Proporciona el número de referencia o muestra el voucher</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[20px]">4.</span>
                  <span>Realiza el pago en efectivo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[20px]">5.</span>
                  <span>Tu plan se activará automáticamente en máximo 24 horas</span>
                </li>
              </ol>
            </div>

            {/* Nota importante */}
            <p className="text-xs text-grey-600 dark:text-grey-400 font-[family-name:var(--font-rubik)] text-center mb-6">
              Guarda tu comprobante de pago hasta que tu plan se active. Si tienes algún problema, contacta a soporte.
            </p>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                color="green"
                size="large"
                className="flex-1"
                onClick={handleOpenVoucher}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Voucher
              </Button>
              <Button
                variant="primary"
                color="green"
                size="large"
                className="flex-1"
                onClick={onClose}
              >
                Entendido
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};
