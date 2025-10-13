'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/features/authentication';
import {
  DashboardLayout,
  DashboardHeader,
  UserInfoCard,
  PlaceholderCard
} from '@/features/dashboard';

function DashboardContent() {
  const { user, logout } = useAuth();

  return (
    <DashboardLayout
      header={
        <DashboardHeader
          userName={`${user?.firstName} ${user?.lastName}`}
          onLogout={logout}
        />
      }
    >
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-dark-900 leading-tight font-[family-name:var(--font-quicksand)] mb-2">
          Dashboard
        </h1>
        <p className="text-[16px] text-dark-600 font-[family-name:var(--font-rubik)]">
          Bienvenido a tu panel de control
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UserInfoCard user={user} />
        <PlaceholderCard title="Mis Cursos" />
        <PlaceholderCard title="Progreso" />
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
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
