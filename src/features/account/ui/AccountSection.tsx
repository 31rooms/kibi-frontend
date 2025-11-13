'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import { useAuth } from '@/features/authentication';
import { format } from 'date-fns';
import { Card, Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, ModalHeader, EditButton, Alert, Checkbox, PasswordInput, SuccessModal, Calendar } from '@/shared/ui';
import { CheckCircle, ArrowLeft, Home, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useChangePassword } from '../hooks/useChangePassword';
import { accountAPI } from '../api/account-service';
import { CheckoutView } from './views';
import { StripeProvider } from '../providers';
import {
  isReportFormComplete,
  getPlanEnum,
  getUserPlanData,
  getPlanDataByType
} from './utils';
import type { ViewMode, SelectedPlan, ReportData, TransferData } from './types';

/**
 * Account Section Component
 * User profile and account settings with subscription info
 */
export const AccountSection = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const { user, updateUser } = useAuth();
    const { changePassword, isLoading, error, success, setError, setSuccess } = useChangePassword();
    const [viewMode, setViewMode] = useState<ViewMode>('view');
    const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('/illustrations/avatar.svg');
    const [formData, setFormData] = useState({
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      career: typeof user?.desiredCareer === 'string' ? user.desiredCareer : user?.desiredCareer?.name || '',
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: ''
    });
    const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const [contactData, setContactData] = useState({
      subject: '',
      message: ''
    });
    const [paymentMethod, setPaymentMethod] = useState<'credit' | 'transfer'>('credit');
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [reportData, setReportData] = useState({
      referenceNumber: '',
      paymentDate: '',
      amount: ''
    });
    const calendarRef = useRef<HTMLDivElement>(null);

    // Cerrar calendario al hacer clic fuera
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
          setShowCalendar(false);
        }
      };

      if (showCalendar) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showCalendar]);

    // Datos hardcodeados para transferencia
    const transferData: TransferData = {
      accountNumber: '1234-5678-9012-3456',
      idNumber: '9876-5432-1098-7654',
      amount: selectedPlan?.price || '0,00 $'
    };

    const handlePayment = async (method?: 'credit' | 'transfer') => {
      const selectedMethod = method || paymentMethod;

      if (selectedMethod === 'transfer') {
        // Si es transferencia, ir a la vista de reportar pago
        setReportData({
          referenceNumber: '',
          paymentDate: '',
          amount: transferData.amount
        });
        setViewMode('report-payment');
      } else {
        // Si es tarjeta con Stripe, el webhook actualizará la suscripción automáticamente
        // Solo mostramos el modal de éxito y volvemos a la vista principal
        setSuccessModalOpen(true);
        setViewMode('view');

        // Opcional: Actualizar el plan localmente para reflejar el cambio inmediatamente
        // (el webhook lo hará definitivamente en el backend)
        if (selectedPlan && user) {
          const subscriptionPlan = getPlanEnum(selectedPlan.name);
          updateUser({
            ...user,
            subscriptionPlan: subscriptionPlan
          });
        }
      }
    };

    // Función para enviar el reporte de pago
    const handleSubmitReport = async () => {
      try {
        if (!selectedPlan || !user) return;

        const subscriptionPlan = getPlanEnum(selectedPlan.name);
        await accountAPI.updateSubscription(subscriptionPlan);

        // Actualizar el usuario global con el nuevo plan
        updateUser({
          ...user,
          subscriptionPlan: subscriptionPlan
        });

        // Si la actualización fue exitosa, mostrar modal
        setSuccessModalOpen(true);
      } catch (error) {
        console.error('Error updating subscription:', error);
        alert(error instanceof Error ? error.message : 'Error al procesar el pago');
      }
    };

    // Renderizar modal de éxito (usado en todas las vistas)
    const renderSuccessModal = () => (
      <SuccessModal
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
        title="Pago recibido con éxito"
        description="Su pago a sido validado"
        confirmText="Continuar"
        onConfirm={() => {
          setSuccessModalOpen(false);
          setViewMode('view');
        }}
      />
    );

    // Vista de contacto
    if (viewMode === 'contact') {
      return (
        <>
        <main
          ref={ref}
          className={cn(
            "flex-1 overflow-y-auto p-6 md:p-8",
            "bg-grey-50 dark:bg-[#171B22]",
            className
          )}
          {...props}
        >
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <button
              onClick={() => setViewMode('view')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <ArrowLeft className="h-5 w-5 text-primary-green group-hover:text-primary-green/80 transition-colors" />
              <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] group-hover:text-primary-green transition-colors">
                Volver
              </h2>
            </button>

            {/* Card con mensaje y Kibi Icon - estilo FeedbackToast */}
            <div className="flex flex-col items-center gap-4">
              {/* Card principal con triángulo */}
              <div className="relative bg-white dark:bg-[#272E3A] rounded-[20px] shadow-[0px_12px_40px_15px_#0000001A] px-6 py-6 text-center w-full max-w-md">
                <p className="text-dark-900 dark:text-white font-medium text-base leading-snug font-[family-name:var(--font-rubik)]">
                  Tu opinión es muy importante, leo atento tus mensajes
                </p>

                {/* Triangle/Bonete - pointing down */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
                  style={{
                    borderLeft: '12px solid transparent',
                    borderRight: '12px solid transparent',
                    borderTop: '12px solid #272E3A',
                    filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.05))',
                  }}
                />
                <div
                  className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 dark:hidden"
                  style={{
                    borderLeft: '12px solid transparent',
                    borderRight: '12px solid transparent',
                    borderTop: '12px solid white',
                    filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.05))',
                  }}
                />
              </div>

              {/* Kibi Icon */}
              <div className="flex-shrink-0">
                <Image
                  src="/illustrations/Kibi Icon.svg"
                  alt="Kibi Icon"
                  width={80}
                  height={80}
                  className="dark:hidden"
                />
                <Image
                  src="/illustrations/Kibi Icon blanco.svg"
                  alt="Kibi Icon White"
                  width={80}
                  height={80}
                  className="hidden dark:block"
                />
              </div>
            </div>

            {/* Formulario de contacto */}
            <div className="space-y-6">
              {/* Asunto */}
              <div>
                <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2 font-[family-name:var(--font-rubik)]">
                  Asunto
                </label>
                <Input
                  value={contactData.subject}
                  onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                  placeholder="Ejemplo:"
                />
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2 font-[family-name:var(--font-rubik)]">
                  Mensaje
                </label>
                <div className="relative">
                  <textarea
                    value={contactData.message}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) {
                        setContactData({ ...contactData, message: e.target.value });
                      }
                    }}
                    placeholder="Ejemplo:"
                    maxLength={200}
                    rows={6}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg",
                      "bg-white dark:bg-[#171B22]",
                      "border-2 border-grey-300 dark:border-[#374151]",
                      "text-dark-900 dark:text-white",
                      "placeholder:text-grey-500 dark:placeholder:text-grey-600",
                      "focus:outline-none focus:border-primary-green",
                      "transition-colors",
                      "font-[family-name:var(--font-rubik)]"
                    )}
                  />
                  <div className="absolute bottom-3 right-3 text-sm text-grey-500 dark:text-grey-600 font-[family-name:var(--font-rubik)]">
                    {contactData.message.length}/200
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <Button
                  variant="secondary"
                  color="blue"
                  size="medium"
                  onClick={() => setViewMode('view')}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  color="green"
                  size="medium"
                  onClick={() => {
                    // Aquí iría la lógica para enviar el mensaje
                    setContactData({ subject: '', message: '' });
                    setViewMode('view');
                  }}
                >
                  Enviar mensaje
                </Button>
              </div>
            </div>
          </div>
        </main>
        {renderSuccessModal()}
        </>
      );
    }

    // Vista de cambio de contraseña
    if (viewMode === 'change-password') {
      const handlePasswordChange = async () => {
        const isSuccess = await changePassword(
          passwordData.currentPassword,
          passwordData.newPassword,
          passwordData.confirmPassword
        );

        if (isSuccess) {
          // Clear form
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          // Auto-close after 2 seconds
          setTimeout(() => {
            setSuccess(false);
            setViewMode('view');
          }, 2000);
        }
      };

      const handleCancel = () => {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setError(null);
        setSuccess(false);
        setViewMode('view');
      };

      return (
        <>
        <main
          ref={ref}
          className={cn(
            "flex-1 overflow-y-auto p-6 md:p-8",
            "bg-grey-50 dark:bg-[#171B22]",
            className
          )}
          {...props}
        >
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <button
              onClick={handleCancel}
              className="flex items-center gap-3 cursor-pointer group"
              disabled={isLoading}
            >
              <ArrowLeft className="h-5 w-5 text-primary-green group-hover:text-primary-green/80 transition-colors" />
              <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] group-hover:text-primary-green transition-colors">
                Volver
              </h2>
            </button>

            {/* Título centrado */}
            <h1 className="text-[24px] lg:text-[28px] font-bold text-primary-green text-center font-[family-name:var(--font-quicksand)]">
              Cambiar contraseña
            </h1>

            {/* Success/Error Alert */}
            {success && (
              <Alert variant="success" className="animate-in fade-in">
                ¡Contraseña cambiada exitosamente!
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="animate-in fade-in">
                {error}
              </Alert>
            )}

            {/* Formulario de contraseñas */}
            <div className="space-y-6">
              {/* Contraseña actual */}
              <div>
                <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2 font-[family-name:var(--font-rubik)]">
                  Contraseña actual
                </label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, currentPassword: e.target.value });
                    if (error) setError(null);
                  }}
                  placeholder=""
                  disabled={isLoading}
                />
              </div>

              {/* Nueva Contraseña */}
              <div>
                <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2 font-[family-name:var(--font-rubik)]">
                  Nueva Contraseña
                </label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, newPassword: e.target.value });
                    if (error) setError(null);
                  }}
                  placeholder=""
                  disabled={isLoading}
                  helperText="Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial"
                />
              </div>

              {/* Validar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2 font-[family-name:var(--font-rubik)]">
                  Validar Contraseña
                </label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                    if (error) setError(null);
                  }}
                  placeholder=""
                  disabled={isLoading}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <Button
                  variant="secondary"
                  color="blue"
                  size="medium"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  color="green"
                  size="medium"
                  onClick={handlePasswordChange}
                  disabled={isLoading}
                >
                  {isLoading ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </div>
          </div>
        </main>
        {renderSuccessModal()}
        </>
      );
    }

    // Vista de reportar pago
    if (viewMode === 'report-payment' && selectedPlan) {
      return (
        <>
        <main
          ref={ref}
          className={cn(
            "flex-1 overflow-y-auto p-6 md:p-8",
            "bg-grey-50 dark:bg-[#171B22]",
            className
          )}
          {...props}
        >
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <div
              className="pb-4 mb-4 border-b border-[#DFE4EA] dark:border-[#374151]"
            >
              <div className="flex items-center gap-2 text-sm" style={{ color: '#7B7B7B' }}>
                <button
                  onClick={() => setViewMode('view')}
                  className="hover:text-primary-green transition-colors"
                >
                  <Home className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4" />
                <button
                  onClick={() => setViewMode('view')}
                  className="hover:text-primary-green transition-colors"
                >
                  Cuenta
                </button>
                <ChevronRight className="w-4 h-4" />
                <button
                  onClick={() => setViewMode('plans')}
                  className="hover:text-primary-green transition-colors"
                >
                  Planes
                </button>
                <ChevronRight className="w-4 h-4" />
                <button
                  onClick={() => setViewMode('checkout')}
                  className="hover:text-primary-green transition-colors"
                >
                  Check out
                </button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-primary-green">Reportar pago</span>
              </div>
            </div>

            {/* Título centrado */}
            <h1 className="text-[32px] lg:text-[40px] font-bold text-primary-green text-center font-[family-name:var(--font-quicksand)] mb-8">
              Check out
            </h1>

            {/* Contenedor con max-width para el formulario */}
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
              <div
                className={cn(
                  "hidden md:block relative pt-8 pb-6 px-6 rounded-[8px] border",
                  // Plan Oro colors
                  selectedPlan.name === 'Plan Oro' && "bg-[#FFFAE6] dark:bg-[#FFC80033] border-[#E8B600] dark:border-[#FFC800]",
                  // Plan Diamante colors
                  selectedPlan.name === 'Plan Diamante' && "bg-[#EAF0FE] dark:bg-[#2D68F833] border-[#2D68F8]",
                  // Plan Free colors
                  selectedPlan.name === 'Plan Free' && "bg-[#E7FFE7] dark:bg-[#1DA53433] border-[#47830E] dark:border-[#95C16B]"
                )}
              >
                {/* Header: Icon + Name + Price */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={selectedPlan.colors.border}/>
                      </svg>
                    </div>
                    <h3 className="text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                      {selectedPlan.name}
                    </h3>
                  </div>
                  <span className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                    {selectedPlan.price}
                  </span>
                </div>

                {/* Separador */}
                <div
                  className={cn(
                    "border-b mb-4 opacity-30",
                    selectedPlan.name === 'Plan Oro' && "border-[#E8B600] dark:border-[#FFC800]",
                    selectedPlan.name === 'Plan Diamante' && "border-[#2D68F8]",
                    selectedPlan.name === 'Plan Free' && "border-[#47830E] dark:border-[#95C16B]"
                  )}
                ></div>

                {/* Features List */}
                <div className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          selectedPlan.name === 'Plan Oro' && "text-[#E8B600] dark:text-[#FFC800]",
                          selectedPlan.name === 'Plan Diamante' && "text-[#2D68F8]",
                          selectedPlan.name === 'Plan Free' && "text-[#47830E] dark:text-[#95C16B]"
                        )}
                      />
                      <span className="text-[13px] text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card con formulario de reportar pago (y plan info en mobile) */}
              <Card className="p-6">
                {/* Mobile: Plan info dentro de la Card */}
                <div className="md:hidden mb-6">
                  {/* Plan name */}
                  <h3 className="text-[16px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] text-center mb-2">
                    {selectedPlan.name}
                  </h3>

                  {/* Price */}
                  <p className="text-[20px] font-bold text-primary-green font-[family-name:var(--font-quicksand)] text-center mb-4">
                    {selectedPlan.price}
                  </p>

                  {/* Separator */}
                  <div className="border-b border-[#DFE4EA] dark:border-[#374151] mb-6"></div>
                </div>
                <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-4">
                  Reportar pago
                </h2>

                <div className="space-y-4">
                  {/* Número de Referencia */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 mb-2 font-[family-name:var(--font-rubik)]">
                      Numero de Referencia
                    </label>
                    <Input
                      placeholder=""
                      value={reportData.referenceNumber}
                      onChange={(e) => setReportData({ ...reportData, referenceNumber: e.target.value })}
                    />
                  </div>

                  {/* Fecha del pago */}
                  <div className="relative" ref={calendarRef}>
                    <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 mb-2 font-[family-name:var(--font-rubik)]">
                      Fecha del pago
                    </label>
                    <Input
                      placeholder="dd/mm/aa"
                      value={selectedDate ? format(selectedDate, 'dd/MM/yy') : ''}
                      onClick={() => setShowCalendar(!showCalendar)}
                      readOnly
                      className="cursor-pointer"
                    />
                    {showCalendar && (
                      <div className="absolute z-50 bottom-full mb-2 left-0 right-0">
                        <Calendar
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setReportData({ ...reportData, paymentDate: format(date, 'dd/MM/yy') });
                            setShowCalendar(false);
                          }}
                          showActions={false}
                        />
                      </div>
                    )}
                  </div>

                  {/* Monto */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 mb-2 font-[family-name:var(--font-rubik)]">
                      Monto
                    </label>
                    <Input
                      value={reportData.amount}
                      onChange={(e) => setReportData({ ...reportData, amount: e.target.value })}
                      placeholder="0,00"
                    />
                  </div>
                </div>

                {/* Botones dentro de la Card (solo mobile) */}
                <div className="md:hidden flex gap-4 justify-around mt-6">
                  <Button
                    variant="secondary"
                    color="green"
                    size="large"
                    onClick={() => setViewMode('checkout')}
                    className="flex-1 max-w-[200px]"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    color="green"
                    size="large"
                    className="flex-1 max-w-[200px]"
                    onClick={handleSubmitReport}
                    disabled={!isReportFormComplete(reportData.referenceNumber, reportData.paymentDate, reportData.amount)}
                  >
                    Pagar
                  </Button>
                </div>
              </Card>

              {/* Botones fuera de la Card (solo desktop) */}
              <div className="hidden md:flex gap-4 justify-around">
                <Button
                  variant="secondary"
                  color="green"
                  size="large"
                  onClick={() => setViewMode('checkout')}
                  className="flex-1 max-w-[200px]"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  color="green"
                  size="large"
                  className="flex-1 max-w-[200px]"
                  onClick={handleSubmitReport}
                  disabled={!isReportFormComplete(reportData.referenceNumber, reportData.paymentDate, reportData.amount)}
                >
                  Pagar
                </Button>
              </div>
            </div>
          </div>
        </main>
        {renderSuccessModal()}
        </>
      );
    }

    // Vista de checkout
    if (viewMode === 'checkout' && selectedPlan) {
      return (
        <>
          <StripeProvider>
            <CheckoutView
              selectedPlan={selectedPlan}
              onBack={() => setViewMode('view')}
              onCancel={() => setViewMode('plans')}
              onPayment={handlePayment}
              className={className}
            />
          </StripeProvider>
          {renderSuccessModal()}
        </>
      );
    }

    // Vista de planes premium
    if (viewMode === 'plans') {
      // Get user's current plan (default to 'FREE' if not set)
      const currentPlan = user?.subscriptionPlan?.toUpperCase() || 'FREE';

      return (
        <>
        <main
          ref={ref}
          className={cn(
            "flex-1 overflow-y-auto p-6 md:p-8",
            "bg-grey-50 dark:bg-[#171B22]",
            className
          )}
          {...props}
        >
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <div
              className="pb-4 mb-4 border-b border-[#DFE4EA] dark:border-[#374151]"
            >
              <div className="flex items-center gap-2 text-sm" style={{ color: '#7B7B7B' }}>
                <button
                  onClick={() => setViewMode('view')}
                  className="hover:text-primary-green transition-colors"
                >
                  <Home className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4" />
                <button
                  onClick={() => setViewMode('view')}
                  className="hover:text-primary-green transition-colors"
                >
                  Cuenta
                </button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-primary-green">Planes</span>
              </div>
            </div>

            {/* Título centrado */}
            <h1 className="text-[32px] lg:text-[40px] font-bold text-primary-green text-center font-[family-name:var(--font-quicksand)] mb-8">
              Planes
            </h1>

            {/* Grid de 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan Free */}
              <div className="relative flex flex-col">
                {/* Tag "Actual" - Only show if current plan is FREE */}
                {currentPlan === 'FREE' && (
                  <div className="absolute -top-3 left-4 z-10">
                    <span
                      className="inline-flex items-center px-3 py-1.5 text-sm font-bold rounded text-white font-[family-name:var(--font-rubik)]"
                      style={{ backgroundColor: '#22AD5C' }}
                    >
                      Actual
                    </span>
                  </div>
                )}

                {/* Card */}
                <div
                  className="relative pt-8 pb-6 px-6 rounded-[8px] flex flex-col h-full bg-[#E7FFE7] dark:bg-[#1DA53433] border border-[#47830E] dark:border-[#95C16B]"
                >
                  {/* Header: Icon + Name + Price */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/icons/start-50.svg"
                        alt="Plan Icon"
                        width={24}
                        height={24}
                        className="flex-shrink-0"
                      />
                      <h3 className="text-[15px] lg:text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                        Plan Free
                      </h3>
                    </div>
                    <span className="text-[18px] lg:text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] whitespace-nowrap">
                      Gratis
                    </span>
                  </div>

                  {/* Separador */}
                  <div className="border-b border-[#47830E] dark:border-[#95C16B] mb-4 opacity-30"></div>

                  {/* Features List */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-[#47830E] dark:text-[#95C16B] flex-shrink-0 mt-0.5" />
                      <span className="text-[12px] lg:text-[13px] text-dark-900 dark:text-white font-[family-name:var(--font-rubik)] leading-snug">
                        Asignaturas habilitadas: Algebra
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-[#47830E] dark:text-[#95C16B] flex-shrink-0 mt-0.5" />
                      <span className="text-[12px] lg:text-[13px] text-dark-900 dark:text-white font-[family-name:var(--font-rubik)] leading-snug">
                        Kibi bot: Bloqueado
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Oro */}
              <div className="relative flex flex-col">
                {/* Tag - "Actual" if user has GOLD, otherwise "Recomendado" */}
                <div className="absolute -top-3 left-4 z-10">
                  <span
                    className="inline-flex items-center px-3 py-1.5 text-sm font-bold rounded text-white font-[family-name:var(--font-rubik)]"
                    style={{ backgroundColor: currentPlan === 'GOLD' ? '#22AD5C' : '#E8B600' }}
                  >
                    {currentPlan === 'GOLD' ? 'Actual' : 'Recomendado'}
                  </span>
                </div>

                {/* Card */}
                <div
                  className="relative pt-8 pb-6 px-6 rounded-[8px] flex flex-col h-full bg-[#FFFAE6] dark:bg-[#FFC80033] border border-[#E8B600] dark:border-[#FFC800]"
                >
                  {/* Header: Icon + Name + Price */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#E8B600"/>
                        </svg>
                      </div>
                      <h3 className="text-[15px] lg:text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                        Plan Oro
                      </h3>
                    </div>
                    <span className="text-[18px] lg:text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] whitespace-nowrap">
                      299,00 $
                    </span>
                  </div>

                  {/* Separador */}
                  <div className="border-b border-[#E8B600] dark:border-[#FFC800] mb-4 opacity-30"></div>

                  {/* Features List */}
                  <div className="space-y-2 mb-6 flex-1">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-[#E8B600] dark:text-[#FFC800] flex-shrink-0 mt-0.5" />
                      <span className="text-[12px] lg:text-[13px] text-dark-900 dark:text-white font-[family-name:var(--font-rubik)] leading-snug">
                        Asignaturas habilitadas: Todas
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-[#E8B600] dark:text-[#FFC800] flex-shrink-0 mt-0.5" />
                      <span className="text-[12px] lg:text-[13px] text-dark-900 dark:text-white font-[family-name:var(--font-rubik)] leading-snug">
                        Kibi bot: Limitado
                      </span>
                    </div>
                  </div>

                  {/* Upgrade Button - Only show if user doesn't have this plan */}
                  {currentPlan !== 'GOLD' && (
                    <div className="flex justify-center lg:justify-end">
                      <Button
                        style={{ backgroundColor: '#FFC800', color: '#000000' }}
                        className="w-full lg:w-auto lg:min-w-[160px] hover:opacity-90 font-[family-name:var(--font-rubik)] dark:text-black"
                        size="medium"
                        onClick={() => {
                          setSelectedPlan(getPlanDataByType('GOLD'));
                          setViewMode('checkout');
                        }}
                      >
                        Comprar
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Plan Diamante */}
              <div className="relative flex flex-col">
                {/* Tag - "Actual" if user has DIAMOND, otherwise "Experto" */}
                <div className="absolute -top-3 left-4 z-10">
                  <span
                    className="inline-flex items-center px-3 py-1.5 text-sm font-bold rounded text-white font-[family-name:var(--font-rubik)]"
                    style={{ backgroundColor: currentPlan === 'DIAMOND' ? '#22AD5C' : '#3758F9' }}
                  >
                    {currentPlan === 'DIAMOND' ? 'Actual' : 'Experto'}
                  </span>
                </div>

                {/* Card */}
                <div
                  className="relative pt-8 pb-6 px-6 rounded-[8px] flex flex-col h-full bg-[#EAF0FE] dark:bg-[#2D68F833] border border-[#2D68F8]"
                >
                  {/* Header: Icon + Name + Price */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L4 7V12C4 16.55 7.84 20.74 12 22C16.16 20.74 20 16.55 20 12V7L12 2Z" fill="#2D68F8"/>
                        </svg>
                      </div>
                      <h3 className="text-[15px] lg:text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                        Plan Diamante
                      </h3>
                    </div>
                    <span className="text-[18px] lg:text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] whitespace-nowrap">
                      499,00 $
                    </span>
                  </div>

                  {/* Separador */}
                  <div className="border-b border-[#2D68F8] mb-4 opacity-30"></div>

                  {/* Features List */}
                  <div className="space-y-2 mb-6 flex-1">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-[#2D68F8] flex-shrink-0 mt-0.5" />
                      <span className="text-[12px] lg:text-[13px] text-dark-900 dark:text-white font-[family-name:var(--font-rubik)] leading-snug">
                        Asignaturas habilitadas: Todas
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-[#2D68F8] flex-shrink-0 mt-0.5" />
                      <span className="text-[12px] lg:text-[13px] text-dark-900 dark:text-white font-[family-name:var(--font-rubik)] leading-snug">
                        Kibi bot: Todas las funciones activas
                      </span>
                    </div>
                  </div>

                  {/* Upgrade Button - Only show if user doesn't have this plan */}
                  {currentPlan !== 'DIAMOND' && (
                    <div className="flex justify-center lg:justify-end">
                      <Button
                        style={{ backgroundColor: '#2D68F8' }}
                        className="w-full lg:w-auto lg:min-w-[160px] text-white hover:opacity-90 font-[family-name:var(--font-rubik)]"
                        size="medium"
                        onClick={() => {
                          setSelectedPlan(getPlanDataByType('DIAMOND'));
                          setViewMode('checkout');
                        }}
                      >
                        Comprar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        {renderSuccessModal()}
        </>
      );
    }

    // Vista de edición de perfil
    if (viewMode === 'edit') {
      return (
        <>
        <main
          ref={ref}
          className={cn(
            "flex-1 overflow-y-auto p-6 md:p-8",
            "bg-grey-50 dark:bg-[#171B22]",
            className
          )}
          {...props}
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header - fuera de card */}
            <button
              onClick={() => setViewMode('view')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <ArrowLeft className="h-5 w-5 text-primary-green group-hover:text-primary-green/80 transition-colors" />
              <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] group-hover:text-primary-green transition-colors">
                Volver
              </h2>
            </button>

            {/* Avatar Card */}
            <Card>
              <div className="flex items-center gap-4">
                <Image
                  src={selectedAvatar}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full"
                />
                <Button
                  variant="primary"
                  color="green"
                  size="small"
                  onClick={() => setAvatarModalOpen(true)}
                >
                  Cambiar
                </Button>
              </div>
            </Card>

            {/* Form Content - sin card principal */}
            <div className="space-y-6">

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2 font-[family-name:var(--font-rubik)]">
                    E-Mail
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="usuario@email.com"
                  />
                </div>

                {/* Nombre y Apellido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2 font-[family-name:var(--font-rubik)]">
                      Nombre
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2 font-[family-name:var(--font-rubik)]">
                      Apellido
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Apellido"
                    />
                  </div>
                </div>

                {/* Carrera y Teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2 font-[family-name:var(--font-rubik)]">
                      Carrera
                    </label>
                    <Select value={formData.career} onValueChange={(value) => setFormData({ ...formData, career: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ingenieria">Ingeniería</SelectItem>
                        <SelectItem value="medicina">Medicina</SelectItem>
                        <SelectItem value="derecho">Derecho</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2 font-[family-name:var(--font-rubik)]">
                      Teléfono
                    </label>
                    <Input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+57"
                    />
                  </div>
                </div>

                {/* Fecha de nacimiento y Género */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2 font-[family-name:var(--font-rubik)]">
                      Fecha de nacimiento
                    </label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      placeholder="dd/mm/aaaa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-900 dark:text-white mb-2 font-[family-name:var(--font-rubik)]">
                      Genero
                    </label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <Button
                  variant="secondary"
                  color="blue"
                  size="medium"
                  onClick={() => setViewMode('view')}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  color="green"
                  size="medium"
                  onClick={() => {
                    // Aquí iría la lógica para guardar
                    setViewMode('view');
                  }}
                >
                  Guardar cambios
                </Button>
              </div>
            </div>

            {/* Avatar Selection Modal */}
            <ModalHeader
              open={avatarModalOpen}
              onOpenChange={setAvatarModalOpen}
              title="Avatar"
              subtitle="Seleccionar avatar"
              size="default"
            >
              <div className="grid grid-cols-3 gap-6 justify-items-center">
                <button
                  className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setSelectedAvatar('/illustrations/avatar.svg');
                    setAvatarModalOpen(false);
                  }}
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-[#E8774A] flex items-center justify-center">
                    <Image
                      src="/illustrations/avatar.svg"
                      alt="Avatar 1"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-dark-700 dark:text-white font-[family-name:var(--font-rubik)]">
                    Albert Einstein
                  </span>
                </button>
                <button
                  className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setSelectedAvatar('/illustrations/avatar1.svg');
                    setAvatarModalOpen(false);
                  }}
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-[#F4D58D] flex items-center justify-center">
                    <Image
                      src="/illustrations/avatar1.svg"
                      alt="Avatar 2"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-dark-700 dark:text-white font-[family-name:var(--font-rubik)]">
                    Platón
                  </span>
                </button>
                <button
                  className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setSelectedAvatar('/illustrations/avatar2.svg');
                    setAvatarModalOpen(false);
                  }}
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-[#8DA7BE] flex items-center justify-center">
                    <Image
                      src="/illustrations/avatar2.svg"
                      alt="Avatar 3"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-dark-700 dark:text-white font-[family-name:var(--font-rubik)]">
                    Nightingale Florence
                  </span>
                </button>
              </div>
            </ModalHeader>
          </div>
        </main>
        {renderSuccessModal()}
        </>
      );
    }

    // Vista principal
    return (
      <>
      <main
        ref={ref}
        className={cn(
          "flex-1 overflow-y-auto p-6 md:p-8",
          "bg-grey-50 dark:bg-[#171B22]",
          className
        )}
        {...props}
      >
        <div className="max-w-6xl mx-auto space-y-6">
          {/* FILA 1: Profile Card - 100% width */}
          <Card className="relative">
            <div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_auto_1fr_1fr_1fr_auto] gap-4 lg:gap-6 items-center justify-start">
              {/* Columna 1: Avatar */}
              <div className="relative flex-shrink-0">
                <Image
                  src={selectedAvatar}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full"
                />
              </div>

              {/* Columna 2: Nombre + Tag + Email (vertical stack) */}
              <div className="flex flex-col gap-1.5">
                <h2 className="text-[16px] lg:text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                  {user?.firstName || 'Yohanna'}
                </h2>
                <span
                  className="inline-flex items-center px-2 py-0.5 lg:px-2.5 lg:py-1 text-xs lg:text-sm font-medium rounded font-[family-name:var(--font-rubik)] w-fit"
                  style={{
                    backgroundColor: 'rgba(71, 131, 14, 0.2)',
                    color: '#47830E'
                  }}
                >
                  Aspirante a ingeniería
                </span>
                <p
                  className="text-[13px] lg:text-[15px] font-[family-name:var(--font-rubik)]"
                  style={{ color: '#7B7B7B' }}
                >
                  {user?.email || 'usuario@email.com'}
                </p>
              </div>

              {/* Columna 3: Fecha de nacimiento - Hidden on mobile */}
              <div className="hidden lg:flex flex-col">
                <p
                  className="text-[15px] font-[family-name:var(--font-rubik)] mb-1"
                  style={{ color: '#7B7B7B' }}
                >
                  Fecha de nacimiento
                </p>
                <p className="text-[18px] font-medium text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
                  20/06/1996
                </p>
              </div>

              {/* Columna 4: Teléfono - Hidden on mobile */}
              <div className="hidden lg:flex flex-col">
                <p
                  className="text-[15px] font-[family-name:var(--font-rubik)] mb-1"
                  style={{ color: '#7B7B7B' }}
                >
                  Teléfono
                </p>
                <p className="text-[18px] font-medium text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
                  {user?.phoneNumber || '+58 777 123456789'}
                </p>
              </div>

              {/* Columna 5: Género - Hidden on mobile */}
              <div className="hidden lg:flex flex-col">
                <p
                  className="text-[15px] font-[family-name:var(--font-rubik)] mb-1"
                  style={{ color: '#7B7B7B' }}
                >
                  Género
                </p>
                <p className="text-[18px] font-medium text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
                  Femenino
                </p>
              </div>

              {/* Columna 6: Botón de editar */}
              <EditButton
                size="responsive"
                onClick={() => setViewMode('edit')}
                aria-label="Editar perfil"
              />
            </div>
          </Card>

          {/* FILA 2: Two Column Layout - Left (Password + Help) | Right (Plan) */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT COLUMN: Password + Help */}
            <div className="flex flex-col gap-4 lg:w-[40%] order-1 lg:order-1">
              {/* Change Password Card */}
              <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600 dark:text-blue-400">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
                    Cambiar contraseña
                  </span>
                </div>
                <EditButton
                  size="medium"
                  onClick={() => setViewMode('change-password')}
                  aria-label="Editar contraseña"
                />
              </div>
            </Card>

              {/* Help Card */}
              <Card className="border-2 border-blue-500 dark:border-blue-600 bg-[#EAF0FE] dark:bg-[#2D68F833]" padding="small">
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
                  {/* Columna 1: Icono Kibi (sin círculo) */}
                  <div className="flex-shrink-0">
                    <Image
                      src="/illustrations/Kibi Icon.svg"
                      alt="Kibi Icon"
                      width={48}
                      height={48}
                      className="dark:hidden"
                    />
                    <Image
                      src="/illustrations/Kibi Icon blanco.svg"
                      alt="Kibi Icon White"
                      width={48}
                      height={48}
                      className="hidden dark:block"
                    />
                  </div>

                  {/* Columna 2: ¿Requieres ayuda? */}
                  <p className="text-[17px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
                    ¿Requieres ayuda?
                  </p>

                  {/* Columna 3: Contáctanos */}
                  <button
                    onClick={() => setViewMode('contact')}
                    className="text-[17px] font-medium text-blue-600 dark:text-blue-400 hover:underline font-[family-name:var(--font-rubik)] whitespace-nowrap cursor-pointer"
                  >
                    Contáctanos
                  </button>
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN: Subscription Plan - Order 2 in mobile */}
            <div className="lg:flex-1 order-2">
              {(() => {
                const planData = getUserPlanData(user?.subscriptionPlan);
                const userPlan = user?.subscriptionPlan?.toUpperCase() || 'FREE';

                return (
                  <Card
                    variant="elevated"
                    className={cn(
                      "relative pt-8",
                      userPlan === 'GOLD' && "bg-[#FFFAE6] dark:bg-[#FFC80033] border-2 border-[#E8B600] dark:border-[#FFC800]",
                      userPlan === 'DIAMOND' && "bg-[#EAF0FE] dark:bg-[#2D68F833] border-2 border-[#2D68F8]",
                      userPlan === 'FREE' && "bg-[#E7FFE7] dark:bg-[#1DA53433] border-2 border-[#47830E] dark:border-[#95C16B]"
                    )}
                  >
                    {/* Tag "Actual" */}
                    <div className="absolute -top-3 left-4">
                      <span
                        className="inline-flex items-center px-3 py-1.5 text-sm font-bold rounded text-white font-[family-name:var(--font-rubik)]"
                        style={{ backgroundColor: '#22AD5C' }}
                      >
                        Actual
                      </span>
                    </div>

                    {/* Header: Icon + Name + Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {userPlan === 'GOLD' && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={planData.colors.icon}/>
                          </svg>
                        )}
                        {userPlan === 'DIAMOND' && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L4 7V12C4 16.55 7.84 20.74 12 22C16.16 20.74 20 16.55 20 12V7L12 2Z" fill={planData.colors.icon}/>
                          </svg>
                        )}
                        {userPlan === 'FREE' && (
                          <Image
                            src="/icons/start-50.svg"
                            alt="Plan Icon"
                            width={24}
                            height={24}
                          />
                        )}
                        <h3 className="text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                          {planData.name}
                        </h3>
                      </div>
                      <span className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                        {planData.price}
                      </span>
                    </div>

                    {/* Separador */}
                    <div
                      className={cn(
                        "border-b mb-4 opacity-30",
                        userPlan === 'GOLD' && "border-[#E8B600] dark:border-[#FFC800]",
                        userPlan === 'DIAMOND' && "border-[#2D68F8]",
                        userPlan === 'FREE' && "border-[#47830E] dark:border-[#95C16B]"
                      )}
                    ></div>

                    {/* Features List */}
                    <div className="space-y-2 mb-4">
                      {planData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle
                            className={cn(
                              "h-5 w-5 flex-shrink-0",
                              userPlan === 'GOLD' && "text-[#E8B600] dark:text-[#FFC800]",
                              userPlan === 'DIAMOND' && "text-[#2D68F8]",
                              userPlan === 'FREE' && "text-[#47830E] dark:text-[#95C16B]"
                            )}
                          />
                          <span className="text-[13px] text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Change Plan Button */}
                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        color="green"
                        size="medium"
                        className="w-full max-w-[200px]"
                        onClick={() => setViewMode('plans')}
                      >
                        Cambiar plan
                      </Button>
                    </div>
                  </Card>
                );
              })()}
            </div>
          </div>
        </div>
      </main>

      {renderSuccessModal()}
      </>
    );
  }
);

AccountSection.displayName = 'AccountSection';
