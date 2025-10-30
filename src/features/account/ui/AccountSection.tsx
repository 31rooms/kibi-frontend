'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { useAuth } from '@/features/authentication';
import { Card, Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, ModalHeader } from '@/shared/ui';
import { SquarePen, CheckCircle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

/**
 * Account Section Component
 * User profile and account settings with subscription info
 */
export const AccountSection = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState<'view' | 'edit' | 'change-password' | 'contact'>('view');
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

    // Vista de contacto
    if (viewMode === 'contact') {
      return (
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('view')}
                className="text-primary-green hover:text-primary-green/80"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                Volver
              </h2>
            </div>

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
      );
    }

    // Vista de cambio de contraseña
    if (viewMode === 'change-password') {
      return (
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('view')}
                className="text-primary-green hover:text-primary-green/80"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                Volver
              </h2>
            </div>

            {/* Título centrado */}
            <h1 className="text-[24px] lg:text-[28px] font-bold text-primary-green text-center font-[family-name:var(--font-quicksand)]">
              Cambiar contraseña
            </h1>

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
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="######"
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
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="######"
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
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="######"
                />
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
                    // Aquí iría la lógica para cambiar contraseña
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setViewMode('view');
                  }}
                >
                  Guardar cambios
                </Button>
              </div>
            </div>
          </div>
        </main>
      );
    }

    // Vista de edición de perfil
    if (viewMode === 'edit') {
      return (
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('view')}
                className="text-primary-green hover:text-primary-green/80"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                Volver
              </h2>
            </div>

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
                      placeholder="dd/mm/aa"
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
      );
    }

    // Vista principal
    return (
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
              <button
                className="h-8 w-8 lg:h-11 lg:w-11 rounded-full border-2 border-grey-400 dark:border-[#374151] bg-white dark:bg-[#1E242D] flex items-center justify-center transition-all hover:border-primary-green flex-shrink-0"
                aria-label="Editar perfil"
                onClick={() => setViewMode('edit')}
              >
                <SquarePen className="h-4 w-4 lg:h-5 lg:w-5 text-primary-green" strokeWidth={2} />
              </button>
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
                <button
                  className="h-9 w-9 rounded-full border-2 border-grey-400 dark:border-[#374151] bg-white dark:bg-[#1E242D] flex items-center justify-center transition-all hover:border-primary-green"
                  aria-label="Editar contraseña"
                  onClick={() => setViewMode('change-password')}
                >
                  <SquarePen className="h-4 w-4 text-primary-green" strokeWidth={2} />
                </button>
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
                    className="text-[17px] font-medium text-blue-600 dark:text-blue-400 hover:underline font-[family-name:var(--font-rubik)] whitespace-nowrap"
                  >
                    Contáctanos
                  </button>
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN: Subscription Plan - Order 2 in mobile */}
            <div className="lg:flex-1 order-2">
              <Card variant="elevated" className="relative pt-8">
                {/* Tag "Actual" */}
                <div className="absolute -top-3 left-4">
                  <span
                    className="inline-flex items-center px-3 py-1.5 text-sm font-bold rounded text-white font-[family-name:var(--font-rubik)]"
                    style={{ backgroundColor: '#22AD5C' }}
                  >
                    Actual
                  </span>
                </div>

                {/* Header: 2 Columns - Icon+Name | Price+Discount */}
                <div className="grid grid-cols-2 gap-4 items-start mb-4">
                  {/* Columna 1: Icono + Plan Free */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/start-50.svg"
                      alt="Plan Icon"
                      width={24}
                      height={24}
                    />
                    <h3 className="text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                      Plan Free
                    </h3>
                  </div>

                  {/* Columna 2: Precio + Tag + Precio tachado */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                        0,00 $
                      </span>
                      <span
                        className="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded font-[family-name:var(--font-rubik)]"
                        style={{ backgroundColor: '#2563EB', color: 'white' }}
                      >
                        -30%
                      </span>
                    </div>
                    <p
                      className="text-[13px] line-through font-[family-name:var(--font-rubik)]"
                      style={{ color: '#7B7B7B' }}
                    >
                      0,00 $
                    </p>
                  </div>
                </div>

                {/* Separador */}
                <div className="border-b border-[#DEE2E6] dark:border-[#374151] mb-4"></div>

                {/* Features List */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary-green flex-shrink-0" />
                      <span className="text-[13px] text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
                        Asignaturas habilitadas: Algebra
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary-green flex-shrink-0" />
                      <span className="text-[13px] text-dark-900 dark:text-white font-[family-name:var(--font-rubik)]">
                        Kibi bot: Bloqueado
                      </span>
                    </div>
                  </div>

                {/* Upgrade Button */}
                <div className="flex justify-end">
                  <Button variant="primary" color="green" size="medium" className="w-full max-w-[200px]">
                    Cambiar a premium
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    );
  }
);

AccountSection.displayName = 'AccountSection';
