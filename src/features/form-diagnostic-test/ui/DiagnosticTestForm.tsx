'use client';

import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Calendar,
} from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/lib/context';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDiagnosticForm } from '../hooks/useDiagnosticForm';

export function DiagnosticTestForm() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const {
    formData,
    errors,
    showErrors,
    showCalendar,
    dateButtonRef,
    handleInputChange,
    handleDateSelect,
    handleSubmit,
    setShowCalendar,
  } = useDiagnosticForm();

  // Handle successful form submission
  const onSuccess = () => {
    // TODO: Save form data to backend/context
    router.push('/auth/register/success');
  };

  // Handle skip
  const handleSkip = () => {
    // TODO: Navigate to dashboard or home
    router.push('/home');
  };

  return (
    <div className="w-full max-w-xl bg-white dark:bg-[#171B22] rounded-3xl shadow-lg p-6 md:p-10 border border-grey-200 dark:border-[#374151]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSuccess);
        }}
        className="flex flex-col items-center gap-6"
      >
        {/* Info Box */}
        <div className="w-full bg-success-50 dark:bg-[#1E242D] rounded-2xl py-4 px-5 md:py-5 md:px-6 border border-success-200 dark:border-[#374151]  ">
          <p className="text-[14px] md:text-[16px] text-dark-900 dark:text-white text-center font-[family-name:var(--font-rubik)] leading-relaxed">
            Antes de tomar tu Test Gratis de 20 Preguntas, completa los siguientes datos
          </p>
        </div>

        {/* Kibi Robot Icon */}
        <div className="flex justify-center">
          <Image
            src={isDarkMode ? "/illustrations/Kibi Icon blanco.svg" : "/illustrations/Kibi Icon.svg"}
            alt="Kibi Robot"
            width={100}
            height={100}
            priority
          />
        </div>

        {/* Form Fields */}
        <div className="w-full flex flex-col gap-4 md:gap-5">
          {/* First Name */}
          <Input
            label="Nombre"
            placeholder="Ingresa tu nombre"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            error={showErrors ? errors.firstName : undefined}
            containerClassName="w-full"
          />

          {/* Last Name */}
          <Input
            label="Apellido"
            placeholder="Ingresa tu apellido"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            error={showErrors ? errors.lastName : undefined}
            containerClassName="w-full"
          />

          {/* Gender Select */}
          <div className="w-full">
            <label className="mb-2 block text-sm font-medium text-grey-700 dark:text-grey-300">
              Género
            </label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
            >
              <SelectTrigger className={cn(showErrors && errors.gender && 'border-error-500')}>
                <SelectValue placeholder="Selecciona tu género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="femenino">Femenino</SelectItem>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="no-indicar">Prefiero no indicar</SelectItem>
              </SelectContent>
            </Select>
            {showErrors && errors.gender && (
              <p className="mt-1.5 text-xs text-error-500">{errors.gender}</p>
            )}
          </div>

          {/* Birth Date */}
          <div className="w-full relative">
            <label className="mb-2 block text-sm font-medium text-grey-700 dark:text-grey-300">
              Fecha de nacimiento
            </label>
            <button
              ref={dateButtonRef}
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className={cn(
                'flex h-11 w-full items-center justify-between rounded-lg border border-grey-300 dark:border-[#374151] bg-white dark:bg-[#171B22] px-3 py-2 text-sm',
                'hover:border-grey-400 dark:hover:border-grey-600 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                'text-dark-900 dark:text-white',
                showErrors && errors.birthDate && 'border-error-500',
                !formData.birthDate && 'text-grey-400 dark:text-grey-500'
              )}
            >
              {formData.birthDate
                ? format(formData.birthDate, 'dd/MM/yyyy', { locale: es })
                : 'Selecciona tu fecha de nacimiento'}
              <svg
                className="h-4 w-4 text-grey-400 dark:text-grey-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
            {showErrors && errors.birthDate && (
              <p className="mt-1.5 text-xs text-error-500">{errors.birthDate}</p>
            )}
          </div>
        </div>

        {/* Calendar Modal Popover */}
        {showCalendar && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowCalendar(false)}
            />

            {/* Calendar Popover */}
            <div
              id="calendar-popover"
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-sm"
            >
              <Calendar
                selected={formData.birthDate}
                onSelect={handleDateSelect}
                showActions={true}
                removeLabel="Cancelar"
                doneLabel="Aceptar"
                onRemove={() => setShowCalendar(false)}
                onDone={() => setShowCalendar(false)}
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          color="green"
          size="large"
          className="w-full mt-2"
        >
          Iniciar Test Gratis
        </Button>

        {/* Skip Link */}
        <button
          type="button"
          onClick={handleSkip}
          className="text-[14px] md:text-[16px] font-medium text-primary-green hover:underline transition-all font-[family-name:var(--font-rubik)]"
        >
          Omitir test por ahora
        </button>
      </form>
    </div>
  );
}
