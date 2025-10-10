'use client';

import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipProvider } from '@/components/ui/Tooltip';
import { Info, HelpCircle, AlertCircle } from 'lucide-react';

export default function TestTooltip() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Tooltips - Kibi Design System</h1>

      {/* Variantes de Color */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Variantes de Color</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <Tooltip content="Tooltip por defecto" variant="default">
            <Button variant="primary" color="blue">Default</Button>
          </Tooltip>

          <Tooltip content="Tooltip oscuro" variant="dark">
            <Button variant="primary" color="blue">Dark</Button>
          </Tooltip>

          <Tooltip content="Tooltip claro" variant="light">
            <Button variant="primary" color="blue">Light</Button>
          </Tooltip>

          <Tooltip content="Operación exitosa" variant="success">
            <Button variant="primary" color="green">Success</Button>
          </Tooltip>

          <Tooltip content="Ten cuidado" variant="warning">
            <Button variant="primary" color="blue">Warning</Button>
          </Tooltip>

          <Tooltip content="Error crítico" variant="danger">
            <Button variant="primary" color="blue">Danger</Button>
          </Tooltip>

          <Tooltip content="Información adicional" variant="info">
            <Button variant="primary" color="blue">Info</Button>
          </Tooltip>
        </div>
      </section>

      {/* Posiciones */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Posiciones</h2>
        <div className="flex justify-center items-center gap-12 min-h-[300px]">
          <Tooltip content="Tooltip arriba" side="top">
            <Button variant="outline" color="primary-green">Top</Button>
          </Tooltip>

          <Tooltip content="Tooltip derecha" side="right">
            <Button variant="outline" color="primary-green">Right</Button>
          </Tooltip>

          <Tooltip content="Tooltip abajo" side="bottom">
            <Button variant="outline" color="primary-green">Bottom</Button>
          </Tooltip>

          <Tooltip content="Tooltip izquierda" side="left">
            <Button variant="outline" color="primary-green">Left</Button>
          </Tooltip>
        </div>
      </section>

      {/* Con Iconos */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Con Iconos</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <Tooltip content="Más información disponible" variant="info">
            <button className="p-2 hover:bg-grey-100 rounded-full transition-colors">
              <Info className="w-5 h-5 text-cyan-500" />
            </button>
          </Tooltip>

          <Tooltip content="¿Necesitas ayuda?" variant="default">
            <button className="p-2 hover:bg-grey-100 rounded-full transition-colors">
              <HelpCircle className="w-5 h-5 text-blue-500" />
            </button>
          </Tooltip>

          <Tooltip content="Acción requiere atención" variant="warning">
            <button className="p-2 hover:bg-grey-100 rounded-full transition-colors">
              <AlertCircle className="w-5 h-5 text-warning-500" />
            </button>
          </Tooltip>
        </div>
      </section>

      {/* Texto Largo */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Texto Largo</h2>
        <div className="flex gap-6">
          <Tooltip
            content="Este es un tooltip con mucho más texto para demostrar cómo se comporta con contenido largo. El tooltip se ajustará automáticamente."
            variant="default"
            className="max-w-xs"
          >
            <Button variant="outline" color="blue">Hover para ver tooltip largo</Button>
          </Tooltip>

          <Tooltip
            content={
              <div className="space-y-1">
                <p className="font-semibold">Título del Tooltip</p>
                <p className="text-xs opacity-90">Descripción adicional con más detalles.</p>
              </div>
            }
            variant="dark"
          >
            <Button variant="outline" color="blue">Tooltip con formato</Button>
          </Tooltip>
        </div>
      </section>

      {/* Delay Personalizado */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Delay Personalizado</h2>
        <div className="flex gap-6">
          <Tooltip content="Sin delay" delayDuration={0}>
            <Button variant="text" color="blue">Sin delay</Button>
          </Tooltip>

          <Tooltip content="200ms delay (default)" delayDuration={200}>
            <Button variant="text" color="blue">200ms</Button>
          </Tooltip>

          <Tooltip content="500ms delay" delayDuration={500}>
            <Button variant="text" color="blue">500ms</Button>
          </Tooltip>

          <Tooltip content="1000ms delay" delayDuration={1000}>
            <Button variant="text" color="blue">1000ms</Button>
          </Tooltip>
        </div>
      </section>

      {/* Casos de Uso */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Casos de Uso</h2>

        <div className="space-y-8">
          {/* Formulario */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Formulario con Ayuda</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <span>Nombre de usuario</span>
                  <Tooltip
                    content="El nombre de usuario debe tener entre 3 y 20 caracteres"
                    variant="info"
                    side="right"
                  >
                    <Info className="w-4 h-4 text-grey-500 cursor-help" />
                  </Tooltip>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-grey-300 rounded-lg"
                  placeholder="usuario123"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2">
                  <span>Contraseña</span>
                  <Tooltip
                    content="Mínimo 8 caracteres, incluye números y símbolos"
                    variant="warning"
                    side="right"
                  >
                    <AlertCircle className="w-4 h-4 text-warning-500 cursor-help" />
                  </Tooltip>
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-grey-300 rounded-lg"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Dashboard con Tooltips</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-grey-600">Usuarios Activos</span>
                  <Tooltip content="Usuarios que iniciaron sesión en los últimos 7 días" variant="dark">
                    <HelpCircle className="w-4 h-4 text-grey-400 cursor-help" />
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold">1,234</p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-grey-600">Tasa de Conversión</span>
                  <Tooltip content="Porcentaje de visitantes que se registraron" variant="success">
                    <Info className="w-4 h-4 text-grey-400 cursor-help" />
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold">24.5%</p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-grey-600">Ingresos</span>
                  <Tooltip content="Total de ingresos del mes actual" variant="info">
                    <Info className="w-4 h-4 text-grey-400 cursor-help" />
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold">$12,345</p>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Acciones con Tooltips</h3>
            <div className="flex gap-2">
              <Tooltip content="Guardar cambios" variant="success">
                <Button variant="primary" color="green">Guardar</Button>
              </Tooltip>

              <Tooltip content="Cancelar y descartar cambios" variant="default">
                <Button variant="secondary" color="blue">Cancelar</Button>
              </Tooltip>

              <Tooltip content="Eliminar permanentemente (no se puede deshacer)" variant="danger">
                <Button variant="primary" color="blue" className="bg-error-500 hover:bg-error-600">
                  Eliminar
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </section>

      {/* Proveedor Global Demo */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Con Proveedor Global</h2>
        <p className="text-sm text-grey-600 mb-4">
          Múltiples tooltips con un solo proveedor (mejor rendimiento)
        </p>

        <TooltipProvider delayDuration={300}>
          <div className="flex gap-4">
            <Tooltip content="Tooltip 1">
              <Button variant="outline" color="primary-green">Botón 1</Button>
            </Tooltip>
            <Tooltip content="Tooltip 2">
              <Button variant="outline" color="primary-green">Botón 2</Button>
            </Tooltip>
            <Tooltip content="Tooltip 3">
              <Button variant="outline" color="primary-green">Botón 3</Button>
            </Tooltip>
          </div>
        </TooltipProvider>
      </section>
    </div>
  );
}
