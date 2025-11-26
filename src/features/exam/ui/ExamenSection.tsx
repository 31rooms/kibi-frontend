'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';
import { Mail, MessageCircle, Copy, Share2, Loader2 } from 'lucide-react';
import { useSimulationQuota } from '@/features/exam-simulation/hooks/useSimulationQuota';
import { SimulationPurchaseModal } from '@/features/exam-simulation/ui/SimulationPurchaseModal';

const PRICE_PER_SIMULATION = 299;

export const ExamenSection = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const [referralLink, setReferralLink] = useState('https://www.loremiosumt/5...');
    const [copied, setCopied] = useState(false);
    const [startModalOpen, setStartModalOpen] = useState(false);
    const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    const { quota, loading, refetch, startSimulation } = useSimulationQuota();

    const handleCopy = () => {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = (platform: string) => {
      console.log(`Compartir en ${platform}`);
    };

    const handleStartSimulation = async () => {
      setIsStarting(true);
      const success = await startSimulation();
      setIsStarting(false);

      if (success) {
        setStartModalOpen(false);
        window.location.href = '/home?section=exam-simulation';
      }
    };

    const handlePurchaseSuccess = () => {
      refetch();
      setSuccessModalOpen(true);
    };

    // Calculate display values
    const totalUsed = quota?.totalUsed ?? 0;
    const totalPurchased = quota?.totalPurchased ?? 0;
    const remaining = quota?.remaining ?? 0;
    const canPurchaseMore = quota?.canPurchaseMore ?? true;
    const maxPurchasable = quota?.maxPurchasable ?? 3;

    return (
      <main
        ref={ref}
        className={cn(
          "flex-1 overflow-y-auto p-6 md:p-8",
          "bg-white dark:bg-[#171B22]",
          className
        )}
        {...props}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-[36px] font-bold text-[#95C16B] mb-2 font-[family-name:var(--font-quicksand)]">
              Simulación de examen
            </h1>
            <p className="text-[18px] text-dark-600 dark:text-grey-400 font-[family-name:var(--font-rubik)]">
              Pon a prueba tus conocimientos con la simulación del examen real
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card - Referral */}
            <Card
              variant="default"
              padding="large"
              className="bg-white dark:bg-dark-800 border-grey-500 dark:border-dark-500"
            >
              <div className="space-y-6">
                <p className="text-[16px] text-dark-700 dark:text-grey-300 font-[family-name:var(--font-rubik)] leading-relaxed">
                  Invita a tus amigos y si se suscriben a Kibi te regalamos un examen simulacro.
                </p>

                {/* Referral Link Input */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-dark-700 dark:text-grey-300 font-[family-name:var(--font-rubik)]">
                    Link de referido
                  </label>
                  <div className="flex gap-3">
                    <Input
                      value={referralLink}
                      onChange={(e) => setReferralLink(e.target.value)}
                      readOnly
                      className="flex-1 bg-white dark:bg-[#171B22] border-grey-500 dark:border-dark-500"
                    />
                    <Button
                      variant="primary"
                      color="green"
                      size="medium"
                      onClick={handleCopy}
                      className="px-6"
                      disabled
                    >
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-sm text-success-500 font-[family-name:var(--font-rubik)]">
                      ¡Enlace copiado!
                    </p>
                  )}
                </div>

                {/* Social Icons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleShare('email')}
                    className="w-12 h-12 rounded-full border border-grey-500 dark:border-dark-500 bg-white dark:bg-dark-800 flex items-center justify-center hover:bg-grey-100 dark:hover:bg-dark-700 transition-colors"
                    aria-label="Compartir por email"
                  >
                    <Mail className="w-5 h-5 text-primary-green dark:text-primary-green" />
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-12 h-12 rounded-full border border-grey-500 dark:border-dark-500 bg-white dark:bg-dark-800 flex items-center justify-center hover:bg-grey-100 dark:hover:bg-dark-700 transition-colors"
                    aria-label="Compartir por WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5 text-primary-green dark:text-primary-green" />
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-12 h-12 rounded-full border border-grey-500 dark:border-dark-500 bg-white dark:bg-dark-800 flex items-center justify-center hover:bg-grey-100 dark:hover:bg-dark-700 transition-colors"
                    aria-label="Compartir en Facebook"
                  >
                    <Share2 className="w-5 h-5 text-primary-green dark:text-primary-green" />
                  </button>
                  <button
                    onClick={() => handleShare('instagram')}
                    className="w-12 h-12 rounded-full border border-grey-500 dark:border-dark-500 bg-white dark:bg-dark-800 flex items-center justify-center hover:bg-grey-100 dark:hover:bg-dark-700 transition-colors"
                    aria-label="Compartir en Instagram"
                  >
                    <Share2 className="w-5 h-5 text-primary-green dark:text-primary-green" />
                  </button>
                </div>
              </div>
            </Card>

            {/* Right Card - Available Exams */}
            <Card
              variant="default"
              padding="large"
              className="bg-white dark:bg-dark-800 border-grey-500 dark:border-dark-500 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[20px] font-semibold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                    Examenes disponibles
                  </h3>
                  <span className="text-[48px] font-bold text-primary-green font-[family-name:var(--font-quicksand)]">
                    {loading ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      `${totalUsed}/${totalPurchased}`
                    )}
                  </span>
                </div>

                <Button
                  variant="primary"
                  color="green"
                  size="large"
                  className="w-full"
                  disabled={loading || remaining <= 0}
                  onClick={() => {
                    if (remaining > 0) {
                      setStartModalOpen(true);
                    }
                  }}
                >
                  {remaining <= 0 ? 'Sin simulaciones disponibles' : 'Empezar simulación'}
                </Button>

                {remaining <= 0 && totalPurchased === 0 && (
                  <p className="text-sm text-grey-500 dark:text-grey-400 text-center font-[family-name:var(--font-rubik)]">
                    Compra simulaciones para comenzar
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Purchase Section - Only show if can purchase more */}
          {canPurchaseMore && (
            <Card
              variant="default"
              padding="medium"
              className="mt-6 bg-[#E7FFE7] dark:bg-[#1E242D] border-grey-500 dark:border-dark-500"
            >
              <div className="space-y-4">
                {/* Title */}
                <h2 className="text-[24px] font-bold text-dark-900 dark:text-white text-center font-[family-name:var(--font-quicksand)]">
                  Adquiere hasta {maxPurchasable} simulación{maxPurchasable > 1 ? 'es' : ''}
                </h2>

                {/* Inner Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((index) => {
                    const isAvailable = index <= maxPurchasable;
                    return (
                      <Card
                        key={index}
                        variant="default"
                        padding="medium"
                        className={cn(
                          "bg-white dark:bg-[#171B22] border-grey-500 dark:border-dark-500",
                          !isAvailable && "opacity-50"
                        )}
                      >
                        <div className="text-center space-y-1">
                          <p className="text-[16px] text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
                            {index} Simulación{index > 1 ? 'es' : ''}
                          </p>
                          <p className="text-[32px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                            ${index * PRICE_PER_SIMULATION} MXN
                          </p>
                          {!isAvailable && (
                            <p className="text-xs text-grey-500 font-[family-name:var(--font-rubik)]">
                              No disponible
                            </p>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Buy Button */}
                <div className="flex justify-center">
                  <Button
                    variant="primary"
                    color="green"
                    size="large"
                    className="px-12"
                    onClick={() => setPurchaseModalOpen(true)}
                    disabled={loading}
                  >
                    Comprar simulación
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Message when all simulations purchased */}
          {!canPurchaseMore && totalPurchased >= 3 && (
            <Card
              variant="default"
              padding="medium"
              className="mt-6 bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800"
            >
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-success-700 dark:text-success-300 font-[family-name:var(--font-quicksand)]">
                  ¡Ya tienes todas tus simulaciones!
                </p>
                <p className="text-sm text-success-600 dark:text-success-400 font-[family-name:var(--font-rubik)]">
                  Has adquirido el máximo de 3 simulaciones. ¡Buena suerte en tus exámenes!
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Modal de Confirmación para Iniciar */}
        <Modal
          open={startModalOpen}
          onOpenChange={setStartModalOpen}
          state="warning"
          title="¿Listo para tu examen simulacro?"
          cancelText="Cancelar"
          confirmText={isStarting ? "Iniciando..." : "Comenzar"}
          onCancel={() => setStartModalOpen(false)}
          onConfirm={handleStartSimulation}
          className="[&_[class*='iconBg']]:!bg-[#FFD33333]"
        >
          <p className="text-center text-[#7b7b7b] dark:text-grey-400 font-['Inter',sans-serif] text-[16px] w-full">
            El examen que vas a presentar ahora es una simulación muy parecida al examen real que presentarás pronto.
          </p>
          <p className="text-center text-[#7b7b7b] dark:text-grey-400 font-['Inter',sans-serif] text-[16px] w-full mt-4">
            Antes de empezarlo es muy importante que apartes 3 horas de tu tiempo ya que no habrá pausas. Es una prueba que requiere compromiso, tiempo y mucha preparación.
          </p>
          <p className="text-center text-primary-green font-semibold font-['Inter',sans-serif] text-[14px] w-full mt-4">
            Te quedan {remaining} simulación{remaining !== 1 ? 'es' : ''} disponible{remaining !== 1 ? 's' : ''}
          </p>
        </Modal>

        {/* Modal de Compra */}
        <SimulationPurchaseModal
          open={purchaseModalOpen}
          onOpenChange={setPurchaseModalOpen}
          maxPurchasable={maxPurchasable}
          onSuccess={handlePurchaseSuccess}
        />

        {/* Modal de Éxito */}
        <Modal
          open={successModalOpen}
          onOpenChange={setSuccessModalOpen}
          state="success"
          title="¡Compra exitosa!"
          description="Tus simulaciones han sido añadidas a tu cuenta. ¡Ya puedes comenzar tu preparación!"
          confirmText="Entendido"
          singleButton
          onConfirm={() => setSuccessModalOpen(false)}
        />
      </main>
    );
  }
);

ExamenSection.displayName = 'ExamenSection';
