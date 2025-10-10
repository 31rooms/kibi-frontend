'use client';

import { Button } from '@/components/ui/Button';

export default function TestButtons() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Sistema de Botones - Kibi Design System</h1>

      {/* Primary Green Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Primary Buttons - Green</h2>

        <div className="space-y-8">
          {/* Large */}
          <div>
            <h3 className="text-lg font-medium mb-4">Large</h3>
            <div className="flex flex-wrap gap-4">
              <Button size="large" variant="primary" color="green">
                Button
              </Button>
              <Button size="large" variant="secondary" color="green">
                Button
              </Button>
              <Button size="large" variant="text" color="green">
                Button
              </Button>
              <Button size="large" variant="elevated" color="green">
                Button
              </Button>
              <Button size="large" variant="primary" color="green" disabled>
                Button
              </Button>
            </div>
          </div>

          {/* Medium */}
          <div>
            <h3 className="text-lg font-medium mb-4">Medium</h3>
            <div className="flex flex-wrap gap-4">
              <Button size="medium" variant="primary" color="green">
                Button
              </Button>
              <Button size="medium" variant="secondary" color="green">
                Button
              </Button>
              <Button size="medium" variant="text" color="green">
                Button
              </Button>
              <Button size="medium" variant="elevated" color="green">
                Button
              </Button>
              <Button size="medium" variant="primary" color="green" disabled>
                Button
              </Button>
            </div>
          </div>

          {/* Small */}
          <div>
            <h3 className="text-lg font-medium mb-4">Small</h3>
            <div className="flex flex-wrap gap-4">
              <Button size="small" variant="primary" color="green">
                Button
              </Button>
              <Button size="small" variant="secondary" color="green">
                Button
              </Button>
              <Button size="small" variant="text" color="green">
                Button
              </Button>
              <Button size="small" variant="elevated" color="green">
                Button
              </Button>
              <Button size="small" variant="primary" color="green" disabled>
                Button
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Blue Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Primary Buttons - Blue</h2>

        <div className="space-y-8">
          {/* Large */}
          <div>
            <h3 className="text-lg font-medium mb-4">Large</h3>
            <div className="flex flex-wrap gap-4">
              <Button size="large" variant="primary" color="blue">
                Button
              </Button>
              <Button size="large" variant="secondary" color="blue">
                Button
              </Button>
              <Button size="large" variant="text" color="blue">
                Button
              </Button>
              <Button size="large" variant="elevated" color="blue">
                Button
              </Button>
              <Button size="large" variant="primary" color="blue" disabled>
                Button
              </Button>
            </div>
          </div>

          {/* Medium */}
          <div>
            <h3 className="text-lg font-medium mb-4">Medium</h3>
            <div className="flex flex-wrap gap-4">
              <Button size="medium" variant="primary" color="blue">
                Button
              </Button>
              <Button size="medium" variant="secondary" color="blue">
                Button
              </Button>
              <Button size="medium" variant="text" color="blue">
                Button
              </Button>
              <Button size="medium" variant="elevated" color="blue">
                Button
              </Button>
              <Button size="medium" variant="primary" color="blue" disabled>
                Button
              </Button>
            </div>
          </div>

          {/* Small */}
          <div>
            <h3 className="text-lg font-medium mb-4">Small</h3>
            <div className="flex flex-wrap gap-4">
              <Button size="small" variant="primary" color="blue">
                Button
              </Button>
              <Button size="small" variant="secondary" color="blue">
                Button
              </Button>
              <Button size="small" variant="text" color="blue">
                Button
              </Button>
              <Button size="small" variant="elevated" color="blue">
                Button
              </Button>
              <Button size="small" variant="primary" color="blue" disabled>
                Button
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Loading State</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" color="green" loading>
            Cargando...
          </Button>
          <Button variant="secondary" color="blue" loading>
            Procesando...
          </Button>
        </div>
      </section>

      {/* With Icons */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">With Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" color="green">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar
          </Button>
          <Button variant="secondary" color="blue">
            Descargar
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </Button>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Estados Interactivos</h2>
        <p className="mb-4 text-gray-600">Prueba hover, active y focus en estos botones:</p>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="primary"
            color="green"
            onClick={() => alert('¡Click en Primary Green!')}
          >
            Hover me (Primary)
          </Button>
          <Button
            variant="secondary"
            color="blue"
            onClick={() => alert('¡Click en Secondary Blue!')}
          >
            Hover me (Secondary)
          </Button>
          <Button
            variant="elevated"
            color="green"
            onClick={() => alert('¡Click en Elevated!')}
          >
            Hover me (Elevated)
          </Button>
          <Button
            variant="text"
            color="blue"
            onClick={() => alert('¡Click en Text!')}
          >
            Hover me (Text)
          </Button>
        </div>
      </section>
    </div>
  );
}
