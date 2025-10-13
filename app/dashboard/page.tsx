'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/context/AuthContext';
import { Button, Logo } from '@/components/ui';

function DashboardContent() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-grey-50">
      {/* Header */}
      <header className="bg-white border-b border-grey-300 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="small" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-dark-700 font-[family-name:var(--font-rubik)]">
              {user?.firstName} {user?.lastName}
            </span>
            <Button variant="outline" size="medium" onClick={logout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-dark-900 leading-tight font-[family-name:var(--font-quicksand)] mb-2">
            Dashboard
          </h1>
          <p className="text-[16px] text-dark-600 font-[family-name:var(--font-rubik)]">
            Bienvenido a tu panel de control
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-dark-800 mb-4 font-[family-name:var(--font-quicksand)]">
              Información del Usuario
            </h2>
            <div className="space-y-2 text-sm font-[family-name:var(--font-rubik)]">
              <p>
                <span className="font-semibold">Email:</span> {user?.email}
              </p>
              {user?.phoneNumber && (
                <p>
                  <span className="font-semibold">Teléfono:</span> {user.phoneNumber}
                </p>
              )}
              <p>
                <span className="font-semibold">Perfil:</span>{' '}
                {user?.profileComplete ? 'Completo' : 'Incompleto'}
              </p>
            </div>
          </div>

          {/* Placeholder Cards */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-dark-800 mb-4 font-[family-name:var(--font-quicksand)]">
              Mis Cursos
            </h2>
            <p className="text-sm text-dark-600 font-[family-name:var(--font-rubik)]">
              Próximamente disponible
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-dark-800 mb-4 font-[family-name:var(--font-quicksand)]">
              Progreso
            </h2>
            <p className="text-sm text-dark-600 font-[family-name:var(--font-rubik)]">
              Próximamente disponible
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2 font-[family-name:var(--font-quicksand)]">
            Autenticación Exitosa
          </h3>
          <p className="text-sm text-blue-800 font-[family-name:var(--font-rubik)]">
            Has iniciado sesión correctamente. Esta es una página temporal del dashboard.
            Las funcionalidades completas se implementarán próximamente.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}