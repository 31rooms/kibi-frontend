'use client';

import { useState } from 'react';
import { TopMenu } from '@/components/ui';

export default function TestTopMenu() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const handleNotificationClick = () => {
    alert(`Tienes ${notificationCount} notificaciones`);
  };

  const handleStreakClick = () => {
    alert('¡Has mantenido tu racha por 5 días!');
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    alert(isDarkMode ? 'Modo claro activado' : 'Modo oscuro activado');
  };

  const handleMenuClick = () => {
    alert('Menú abierto');
  };

  return (
    <div className="min-h-screen bg-grey-50">
      <h1 className="text-3xl font-bold p-8">Top Menu - Kibi Design System</h1>

      {/* Variante 1: Sin Logo */}
      <section className="mb-12">
        <div className="px-8 mb-4">
          <h2 className="text-2xl font-semibold mb-2">Variante 1: Sin Logo</h2>
          <p className="text-sm text-grey-600">Con badge "Gratis" y racha activa</p>
        </div>

        <div className="bg-white border-y">
          <TopMenu
            showLogo={false}
            showFreeBadge={true}
            streakCount={5}
            notificationCount={0}
            onNotificationClick={handleNotificationClick}
            onStreakClick={handleStreakClick}
            onThemeToggle={handleThemeToggle}
            isDarkMode={isDarkMode}
          />
        </div>
      </section>

      {/* Variante 2: Con Logo */}
      <section className="mb-12">
        <div className="px-8 mb-4">
          <h2 className="text-2xl font-semibold mb-2">Variante 2: Con Logo</h2>
          <p className="text-sm text-grey-600">Logo centrado con menú hamburguesa</p>
        </div>

        <div className="bg-white border-y">
          <TopMenu
            showLogo={true}
            logoText="Kibi"
            streakCount={5}
            notificationCount={notificationCount}
            onNotificationClick={handleNotificationClick}
            onStreakClick={handleStreakClick}
            onThemeToggle={handleThemeToggle}
            onMenuClick={handleMenuClick}
            isDarkMode={isDarkMode}
          />
        </div>
      </section>

      {/* Variante 3: Con Logo Personalizado */}
      <section className="mb-12">
        <div className="px-8 mb-4">
          <h2 className="text-2xl font-semibold mb-2">Variante 3: Logo Personalizado</h2>
          <p className="text-sm text-grey-600">Con imagen de logo</p>
        </div>

        <div className="bg-white border-y">
          <TopMenu
            showLogo={true}
            logoSrc="/next.svg"
            logoText="Kibi"
            streakCount={10}
            notificationCount={0}
            onNotificationClick={handleNotificationClick}
            onStreakClick={handleStreakClick}
            onThemeToggle={handleThemeToggle}
            onMenuClick={handleMenuClick}
            isDarkMode={isDarkMode}
          />
        </div>
      </section>

      {/* Variante 4: Estados Mínimos */}
      <section className="mb-12">
        <div className="px-8 mb-4">
          <h2 className="text-2xl font-semibold mb-2">Variante 4: Estados Mínimos</h2>
          <p className="text-sm text-grey-600">Sin notificaciones ni racha</p>
        </div>

        <div className="bg-white border-y">
          <TopMenu
            showLogo={true}
            logoText="Kibi"
            streakCount={0}
            notificationCount={0}
            onThemeToggle={handleThemeToggle}
            onMenuClick={handleMenuClick}
            isDarkMode={isDarkMode}
          />
        </div>
      </section>

      {/* Demo Interactivo */}
      <section className="mb-12">
        <div className="px-8 mb-4">
          <h2 className="text-2xl font-semibold mb-2">Demo Interactivo</h2>
          <p className="text-sm text-grey-600 mb-4">
            Interactúa con el menú y observa los cambios
          </p>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setNotificationCount(prev => prev + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Agregar Notificación
            </button>
            <button
              onClick={() => setNotificationCount(prev => Math.max(0, prev - 1))}
              className="px-4 py-2 bg-grey-500 text-white rounded-lg hover:bg-grey-600"
            >
              Quitar Notificación
            </button>
          </div>
        </div>

        <div className="bg-white border-y">
          <TopMenu
            showLogo={true}
            logoText="Kibi"
            showFreeBadge={true}
            streakCount={5}
            notificationCount={notificationCount}
            onNotificationClick={handleNotificationClick}
            onStreakClick={handleStreakClick}
            onThemeToggle={handleThemeToggle}
            onMenuClick={handleMenuClick}
            isDarkMode={isDarkMode}
          />
        </div>
      </section>

      {/* Simulación Mobile */}
      <section className="mb-12">
        <div className="px-8 mb-4">
          <h2 className="text-2xl font-semibold mb-2">Simulación Mobile</h2>
          <p className="text-sm text-grey-600">Vista en dispositivo móvil</p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md border rounded-3xl overflow-hidden shadow-xl">
            {/* Status Bar Simulada */}
            <div className="bg-white px-6 py-2 flex justify-between items-center text-xs">
              <span className="font-semibold">9:41</span>
              <div className="flex gap-1 items-center">
                <div className="w-4 h-3 border border-black rounded-sm" />
                <div className="w-4 h-3 border border-black rounded-sm" />
                <div className="w-4 h-3 border border-black rounded-sm" />
              </div>
            </div>

            {/* Top Menu */}
            <TopMenu
              showLogo={true}
              logoText="Kibi"
              streakCount={5}
              notificationCount={3}
              onNotificationClick={handleNotificationClick}
              onStreakClick={handleStreakClick}
              onThemeToggle={handleThemeToggle}
              onMenuClick={handleMenuClick}
              isDarkMode={isDarkMode}
            />

            {/* Content Area */}
            <div className="bg-grey-50 h-96 p-6">
              <h3 className="text-xl font-bold mb-4">Contenido de la App</h3>
              <p className="text-grey-600">
                Este es un ejemplo de cómo se vería el Top Menu en una aplicación móvil real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Uso */}
      <section className="mb-12 px-8">
        <h2 className="text-2xl font-semibold mb-4">Casos de Uso</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-medium mb-3">📱 Pantalla Principal</h3>
            <ul className="space-y-2 text-sm text-grey-600">
              <li>✅ Logo centrado</li>
              <li>✅ Badge de plan "Gratis"</li>
              <li>✅ Racha de días activos</li>
              <li>✅ Notificaciones</li>
              <li>✅ Menú hamburguesa</li>
            </ul>
            <div className="mt-4 border-t pt-4">
              <TopMenu
                showLogo={true}
                logoText="Kibi"
                showFreeBadge={true}
                streakCount={7}
                notificationCount={2}
                onThemeToggle={handleThemeToggle}
                onMenuClick={handleMenuClick}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-medium mb-3">📚 Pantalla de Estudio</h3>
            <ul className="space-y-2 text-sm text-grey-600">
              <li>✅ Sin logo (más espacio)</li>
              <li>✅ Racha visible</li>
              <li>✅ Controles mínimos</li>
            </ul>
            <div className="mt-4 border-t pt-4">
              <TopMenu
                showLogo={false}
                streakCount={7}
                notificationCount={0}
                onStreakClick={handleStreakClick}
                onThemeToggle={handleThemeToggle}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
