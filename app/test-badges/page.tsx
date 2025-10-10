'use client';

import { Badge, Tag } from '@/components/ui';
import { Info, AlertCircle } from 'lucide-react';

export default function TestBadges() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Badges y Tags - Kibi Design System</h1>

      {/* Badges Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Badges</h2>

        {/* Solid Badges */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Solid</h3>
          <div className="flex flex-wrap gap-3">
            <Badge variant="solid" color="primary">Primary</Badge>
            <Badge variant="solid" color="primary-green">Primary</Badge>
            <Badge variant="solid" color="dark">Primary</Badge>
            <Badge variant="solid" color="gray">Gray</Badge>
            <Badge variant="solid" color="light">Light</Badge>
            <Badge variant="solid" color="warning">Warning</Badge>
            <Badge variant="solid" color="danger">Danger</Badge>
            <Badge variant="solid" color="success">Success</Badge>
            <Badge variant="solid" color="info">Info</Badge>
          </div>
        </div>

        {/* Outline Badges */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Outline</h3>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" color="primary">Primary</Badge>
            <Badge variant="outline" color="primary-green">Primary</Badge>
            <Badge variant="outline" color="dark">Primary</Badge>
            <Badge variant="outline" color="gray">Gray</Badge>
            <Badge variant="outline" color="light">Light</Badge>
            <Badge variant="outline" color="warning">Warning</Badge>
            <Badge variant="outline" color="danger">Danger</Badge>
            <Badge variant="outline" color="success">Success</Badge>
            <Badge variant="outline" color="info">Info</Badge>
          </div>
        </div>

        {/* Subtle Badges */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Subtle</h3>
          <div className="flex flex-wrap gap-3">
            <Badge variant="subtle" color="primary">Primary</Badge>
            <Badge variant="subtle" color="primary-green">Primary</Badge>
            <Badge variant="subtle" color="dark">Primary</Badge>
            <Badge variant="subtle" color="gray">Gray</Badge>
            <Badge variant="subtle" color="light">Light</Badge>
            <Badge variant="subtle" color="warning">Warning</Badge>
            <Badge variant="subtle" color="danger">Danger</Badge>
            <Badge variant="subtle" color="success">Success</Badge>
            <Badge variant="subtle" color="info">Info</Badge>
          </div>
        </div>

        {/* Text Badges */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Text Only</h3>
          <div className="flex flex-wrap gap-3">
            <Badge variant="text" color="primary">Primary</Badge>
            <Badge variant="text" color="primary-green">Primary</Badge>
            <Badge variant="text" color="dark">Primary</Badge>
            <Badge variant="text" color="gray">Gray</Badge>
            <Badge variant="text" color="light">Light</Badge>
            <Badge variant="text" color="warning">Warning</Badge>
            <Badge variant="text" color="danger">Danger</Badge>
            <Badge variant="text" color="success">Success</Badge>
            <Badge variant="text" color="info">Info</Badge>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Casos de Uso</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Notificaciones:</span>
              <Badge variant="solid" color="danger">3 nuevas</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Estado:</span>
              <Badge variant="solid" color="success">Activo</Badge>
              <Badge variant="outline" color="warning">Pendiente</Badge>
              <Badge variant="subtle" color="danger">Inactivo</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Categorías:</span>
              <Badge variant="outline" color="primary">React</Badge>
              <Badge variant="outline" color="info">TypeScript</Badge>
              <Badge variant="outline" color="primary-green">Tailwind</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Tags Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Tags</h2>

        {/* Basic Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Básico</h3>
          <div className="flex flex-wrap gap-3">
            <Tag variant="solid" color="primary">Tag</Tag>
            <Tag variant="solid" color="primary-green">Tag</Tag>
            <Tag variant="solid" color="success">Tag</Tag>
            <Tag variant="solid" color="warning">Tag</Tag>
            <Tag variant="solid" color="danger">Tag</Tag>
            <Tag variant="solid" color="info">Tag</Tag>
          </div>
        </div>

        {/* Tags with Icons */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Con Icono</h3>
          <div className="flex flex-wrap gap-3">
            <Tag variant="subtle" color="primary" icon={<Info className="w-4 h-4" />}>
              Tag
            </Tag>
            <Tag variant="outline" color="warning" icon={<AlertCircle className="w-4 h-4" />}>
              Tag
            </Tag>
            <Tag variant="solid" color="info" icon={<Info className="w-4 h-4" />}>
              Tag
            </Tag>
          </div>
        </div>

        {/* Removable Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Con Botón Cerrar</h3>
          <div className="flex flex-wrap gap-3">
            <Tag
              variant="solid"
              color="primary"
              onRemove={() => alert('Tag removed!')}
            >
              Tag
            </Tag>
            <Tag
              variant="outline"
              color="primary-green"
              onRemove={() => alert('Tag removed!')}
            >
              Tag
            </Tag>
            <Tag
              variant="subtle"
              color="danger"
              onRemove={() => alert('Tag removed!')}
            >
              Tag
            </Tag>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Demo Interactivo</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Tags de filtro (click para eliminar):</p>
              <div className="flex flex-wrap gap-2">
                <Tag
                  variant="outline"
                  color="primary"
                  onRemove={() => console.log('Removed: React')}
                >
                  React
                </Tag>
                <Tag
                  variant="outline"
                  color="primary"
                  onRemove={() => console.log('Removed: TypeScript')}
                >
                  TypeScript
                </Tag>
                <Tag
                  variant="outline"
                  color="primary-green"
                  onRemove={() => console.log('Removed: Tailwind')}
                >
                  Tailwind
                </Tag>
                <Tag
                  variant="outline"
                  color="info"
                  onRemove={() => console.log('Removed: Next.js')}
                >
                  Next.js
                </Tag>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Tags con estado:</p>
              <div className="flex flex-wrap gap-2">
                <Tag variant="subtle" color="success" icon={<Info className="w-4 h-4" />}>
                  Completado
                </Tag>
                <Tag variant="subtle" color="warning" icon={<AlertCircle className="w-4 h-4" />}>
                  En progreso
                </Tag>
                <Tag variant="subtle" color="danger" icon={<AlertCircle className="w-4 h-4" />}>
                  Error
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Diferencias: Badge vs Tag</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3">Badge</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ Más pequeño y compacto</li>
              <li>✅ Para mostrar contadores o estados</li>
              <li>✅ No interactivo (solo visual)</li>
              <li>✅ Ideal para: notificaciones, estados, categorías</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <Badge variant="solid" color="danger">3</Badge>
              <Badge variant="solid" color="success">Nuevo</Badge>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3">Tag</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ Más grande, con padding</li>
              <li>✅ Para etiquetas y filtros</li>
              <li>✅ Puede ser interactivo (cerrar, click)</li>
              <li>✅ Ideal para: filtros, keywords, selección múltiple</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <Tag variant="outline" color="primary" onRemove={() => {}}>React</Tag>
              <Tag variant="solid" color="info" icon={<Info className="w-4 h-4" />}>Info</Tag>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
