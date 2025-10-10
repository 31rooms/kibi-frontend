'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ListDropdown,
} from '@/components/ui';

export default function TestDropdown() {
  const [selectValue, setSelectValue] = useState('');
  const [listValue, setListValue] = useState('item1');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dropdown & List Dropdown - Kibi Design System</h1>

      {/* Select/Dropdown Component */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Select (Dropdown)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Select */}
          <div>
            <label className="block text-sm font-medium mb-2">Label</label>
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger>
                <SelectValue placeholder="Dropdown" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="item1">Item 1</SelectItem>
                <SelectItem value="item2">Item 2</SelectItem>
                <SelectItem value="item3">Item 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* With Default Value */}
          <div>
            <label className="block text-sm font-medium mb-2">With Default Value</label>
            <Select defaultValue="item2">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="item1">Item 1</SelectItem>
                <SelectItem value="item2">Item 2</SelectItem>
                <SelectItem value="item3">Item 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Disabled Select */}
          <div>
            <label className="block text-sm font-medium mb-2">Disabled</label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Dropdown" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="item1">Item 1</SelectItem>
                <SelectItem value="item2">Item 2</SelectItem>
                <SelectItem value="item3">Item 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* With Many Items */}
          <div>
            <label className="block text-sm font-medium mb-2">Many Items (Scrollable)</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 15 }, (_, i) => (
                  <SelectItem key={i} value={`item${i + 1}`}>
                    Item {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* List Dropdown Component */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">List Dropdown</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic List */}
          <div>
            <h3 className="text-lg font-medium mb-4">Basic</h3>
            <ListDropdown
              items={[
                { value: 'item1', label: 'Item 1' },
                { value: 'item2', label: 'Item 2' },
                { value: 'item3', label: 'Item 3' },
              ]}
              value={listValue}
              onValueChange={setListValue}
            />
          </div>

          {/* With Disabled Item */}
          <div>
            <h3 className="text-lg font-medium mb-4">With Disabled Item</h3>
            <ListDropdown
              items={[
                { value: 'item1', label: 'Item 1' },
                { value: 'item2', label: 'Item 2 (disabled)', disabled: true },
                { value: 'item3', label: 'Item 3' },
              ]}
            />
          </div>

          {/* Many Items */}
          <div>
            <h3 className="text-lg font-medium mb-4">Many Items</h3>
            <ListDropdown
              items={Array.from({ length: 10 }, (_, i) => ({
                value: `item${i + 1}`,
                label: `Item ${i + 1}`,
              }))}
              className="max-h-60 overflow-y-auto"
            />
          </div>
        </div>
      </section>

      {/* Controlled Example */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Controlled Components</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Select</h3>
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 text-sm text-grey-600">
              Selected: <span className="font-medium">{selectValue || 'None'}</span>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">List Dropdown</h3>
            <ListDropdown
              items={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' },
              ]}
              value={listValue}
              onValueChange={setListValue}
            />
            <p className="mt-2 text-sm text-grey-600">
              Selected: <span className="font-medium">{listValue}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Casos de Uso</h2>

        <div className="space-y-8">
          {/* Form Example */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Formulario de Registro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">País</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu país" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mx">México</SelectItem>
                    <SelectItem value="us">Estados Unidos</SelectItem>
                    <SelectItem value="ca">Canadá</SelectItem>
                    <SelectItem value="es">España</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Género</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Femenino</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                    <SelectItem value="prefer-not">Prefiero no decir</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nivel Educativo</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">Preparatoria</SelectItem>
                    <SelectItem value="bachelor">Licenciatura</SelectItem>
                    <SelectItem value="master">Maestría</SelectItem>
                    <SelectItem value="phd">Doctorado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Área de Interés</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Elige un área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stem">STEM</SelectItem>
                    <SelectItem value="humanities">Humanidades</SelectItem>
                    <SelectItem value="arts">Artes</SelectItem>
                    <SelectItem value="business">Negocios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Settings Example */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Configuración</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Idioma</p>
                  <p className="text-sm text-grey-600">Selecciona el idioma de la interfaz</p>
                </div>
                <Select defaultValue="es">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Zona Horaria</p>
                  <p className="text-sm text-grey-600">Ajusta tu zona horaria</p>
                </div>
                <Select defaultValue="mx-city">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mx-city">Ciudad de México (GMT-6)</SelectItem>
                    <SelectItem value="ny">New York (GMT-5)</SelectItem>
                    <SelectItem value="london">London (GMT+0)</SelectItem>
                    <SelectItem value="tokyo">Tokyo (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation with List */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Navegación Lateral (List Dropdown)</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-grey-600 mb-3">Menú de navegación</p>
                <ListDropdown
                  items={[
                    { value: 'dashboard', label: 'Dashboard' },
                    { value: 'courses', label: 'Mis Cursos' },
                    { value: 'progress', label: 'Mi Progreso' },
                    { value: 'certificates', label: 'Certificados' },
                    { value: 'settings', label: 'Configuración' },
                  ]}
                  value={listValue}
                  onValueChange={setListValue}
                />
              </div>

              <div>
                <p className="text-sm text-grey-600 mb-3">Filtros rápidos</p>
                <ListDropdown
                  items={[
                    { value: 'all', label: 'Todos' },
                    { value: 'active', label: 'Activos' },
                    { value: 'completed', label: 'Completados' },
                    { value: 'pending', label: 'Pendientes' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
