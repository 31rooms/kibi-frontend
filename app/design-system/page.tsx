'use client';

import { useState } from 'react';
import {
  Button,
  Badge,
  Input,
  Checkbox,
  Toggle,
  Logo,
  Modal,
  Tooltip,
  TopMenu,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  ToggleWithText,
  CircleButton,
  Tag
} from '@/shared/ui';
import { ChevronRight, Settings, User, Search, Heart, Star } from 'lucide-react';

export default function DesignSystemPage() {
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [toggleWithTextValue, setToggleWithTextValue] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-grey-50">
      {/* Header */}
      <header className="bg-white border-b border-grey-300 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[36px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-1">
                Sistema de Diseño Kibi
              </h1>
              <p className="text-[16px] text-dark-600 font-[family-name:var(--font-rubik)]">
                Componentes UI reutilizables con Tailwind CSS v4 y CVA
              </p>
            </div>
            <Logo size="medium" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation */}
        <nav className="mb-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-[20px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-4">
            Navegación Rápida
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['Botones', 'Badges', 'Inputs', 'Checkboxes', 'Modales', 'Tooltips', 'Select', 'Tags', 'Menú', 'Colores', 'Tipografía'].map((section) => (
              <a
                key={section}
                href={`#${section.toLowerCase()}`}
                className="px-4 py-2 text-sm text-primary-blue hover:bg-blue-50 rounded-md transition-colors text-center font-[family-name:var(--font-rubik)]"
              >
                {section}
              </a>
            ))}
          </div>
        </nav>

        {/* Botones Section */}
        <section id="botones" className="mb-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-6">
            Botones
          </h2>

          <div className="space-y-8">
            {/* Primary Buttons */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Primary Buttons
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" color="green" size="small">Small Green</Button>
                <Button variant="primary" color="green" size="medium">Medium Green</Button>
                <Button variant="primary" color="green" size="large">Large Green</Button>
                <Button variant="primary" color="blue" size="medium">Blue</Button>
                <Button variant="primary" color="green" size="medium" disabled>Disabled</Button>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Secondary Buttons
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" color="green" size="small">Small</Button>
                <Button variant="secondary" color="green" size="medium">Medium</Button>
                <Button variant="secondary" color="blue" size="medium">Blue</Button>
                <Button variant="secondary" color="green" size="medium" disabled>Disabled</Button>
              </div>
            </div>

            {/* Icon Buttons */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Botones con Iconos
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" color="green" size="medium">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Con Icono
                </Button>
                <Button variant="secondary" color="blue" size="medium">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="elevated" color="green" size="medium">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section id="badges" className="mb-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-6">
            Badges
          </h2>

          <div className="space-y-6">
            {/* Solid Badges */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Solid Badges
              </h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="solid" color="success">Success</Badge>
                <Badge variant="solid" color="danger">Error</Badge>
                <Badge variant="solid" color="warning">Warning</Badge>
                <Badge variant="solid" color="info">Info</Badge>
                <Badge variant="solid" color="primary">Primary</Badge>
              </div>
            </div>

            {/* Subtle Badges */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Subtle Badges
              </h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="subtle" color="success">Success</Badge>
                <Badge variant="subtle" color="danger">Error</Badge>
                <Badge variant="subtle" color="warning">Warning</Badge>
                <Badge variant="subtle" color="info">Info</Badge>
              </div>
            </div>

            {/* Outline Badges */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Outline Badges
              </h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" color="success">Success</Badge>
                <Badge variant="outline" color="danger">Error</Badge>
                <Badge variant="outline" color="warning">Warning</Badge>
                <Badge variant="outline" color="info">Info</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs Section */}
        <section id="inputs" className="mb-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-6">
            Inputs
          </h2>

          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Default Input</label>
              <Input
                placeholder="Escribe algo..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Email Input</label>
              <Input
                type="email"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Password Input</label>
              <Input
                type="password"
                placeholder="Tu contraseña"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Disabled Input</label>
              <Input
                placeholder="Deshabilitado"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Input with Icon</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-grey-500" />
                <Input
                  placeholder="Buscar..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Checkboxes & Toggles Section */}
        <section id="checkboxes" className="mb-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-6">
            Checkboxes y Toggles
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Checkboxes
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={checkboxValue}
                    onCheckedChange={(checked) => setCheckboxValue(checked as boolean)}
                  />
                  <span className="text-dark-700">Acepto los términos y condiciones</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={true} disabled />
                  <span className="text-dark-400">Checkbox deshabilitado (checked)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={false} disabled />
                  <span className="text-dark-400">Checkbox deshabilitado (unchecked)</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Toggles
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Toggle
                    checked={toggleValue}
                    onCheckedChange={setToggleValue}
                  />
                  <span className="text-dark-700">Toggle básico</span>
                </div>
                <div className="flex items-center gap-3">
                  <Toggle
                    checked={false}
                    disabled
                  />
                  <span className="text-dark-400">Toggle deshabilitado</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Toggle con Texto
              </h3>
              <div className="space-y-4">
                <ToggleWithText
                  style="1"
                  checked={toggleWithTextValue}
                  onCheckedChange={setToggleWithTextValue}
                  offLabel="Auto Saver Off"
                  onLabel="Auto Saver On"
                />
                <ToggleWithText
                  style="2"
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
                <ToggleWithText
                  style="3"
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
                <ToggleWithText
                  style="4"
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Modales Section */}
        <section id="modales" className="mb-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-6">
            Modales
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Estados de Modal
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" color="blue" onClick={() => setModalOpen(true)}>
                  Abrir Modal
                </Button>
              </div>
            </div>

            <Modal
              open={modalOpen}
              onOpenChange={setModalOpen}
              state="success"
              title="Mensaje Enviado Exitosamente"
              description="Tu mensaje ha sido enviado correctamente. Te responderemos pronto."
              confirmText="Aceptar"
              cancelText="Cancelar"
              onConfirm={() => console.log('Confirmed')}
              onCancel={() => console.log('Cancelled')}
            />
          </div>
        </section>

        {/* Tooltips Section */}
        <section id="tooltips" className="mb-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-6">
            Tooltips
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Variantes de Tooltip
              </h3>
              <div className="flex flex-wrap gap-4">
                <Tooltip content="Tooltip por defecto" side="top">
                  <Button variant="secondary" color="blue">Default</Button>
                </Tooltip>
                <Tooltip content="Tooltip dark" variant="dark" side="right">
                  <Button variant="secondary" color="blue">Dark</Button>
                </Tooltip>
                <Tooltip content="Tooltip success" variant="success" side="bottom">
                  <Button variant="secondary" color="green">Success</Button>
                </Tooltip>
                <Tooltip content="Tooltip warning" variant="warning" side="left">
                  <Button variant="secondary" color="blue">Warning</Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </section>

        {/* Select Section */}
        <section id="select" className="mb-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-6">
            Select (Dropdown)
          </h2>

          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Selecciona una opción</label>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Elige una fruta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">Manzana</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="orange">Naranja</SelectItem>
                  <SelectItem value="grape">Uva</SelectItem>
                  <SelectItem value="strawberry">Fresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Tags Section */}
        <section id="tags" className="mb-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-6">
            Tags
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Tags Sólidos
              </h3>
              <div className="flex flex-wrap gap-3">
                <Tag variant="solid" color="primary">Primary</Tag>
                <Tag variant="solid" color="success">Success</Tag>
                <Tag variant="solid" color="danger">Danger</Tag>
                <Tag variant="solid" color="warning">Warning</Tag>
                <Tag variant="solid" color="info">Info</Tag>
              </div>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Tags con Iconos
              </h3>
              <div className="flex flex-wrap gap-3">
                <Tag variant="solid" color="danger" icon={<Heart className="w-4 h-4" />}>
                  Favorito
                </Tag>
                <Tag variant="outline" color="warning" icon={<Star className="w-4 h-4" />}>
                  Destacado
                </Tag>
              </div>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Tags Removibles
              </h3>
              <div className="flex flex-wrap gap-3">
                <Tag variant="subtle" color="primary" removable onRemove={() => console.log('Removed')}>
                  React
                </Tag>
                <Tag variant="subtle" color="success" removable onRemove={() => console.log('Removed')}>
                  TypeScript
                </Tag>
                <Tag variant="subtle" color="info" removable onRemove={() => console.log('Removed')}>
                  Next.js
                </Tag>
              </div>
            </div>
          </div>
        </section>

        {/* Menú Section */}
        <section id="menú" className="mb-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-6">
            Top Menu
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Menu Completo
              </h3>
              <TopMenu
                showLogo
                logoText="Kibi"
                showFreeBadge
                notificationCount={3}
                streakCount={7}
                isDarkMode={isDarkMode}
                onNotificationClick={() => console.log('Notification clicked')}
                onStreakClick={() => console.log('Streak clicked')}
                onThemeToggle={() => setIsDarkMode(!isDarkMode)}
                onMenuClick={() => console.log('Menu clicked')}
              />
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Menu Simple
              </h3>
              <TopMenu
                notificationCount={5}
                onNotificationClick={() => console.log('Notification clicked')}
              />
            </div>
          </div>
        </section>

        {/* Botones Circulares */}
        <section className="mb-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-6">
            Botones Circulares
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Circle Buttons
              </h3>
              <div className="flex flex-wrap gap-4">
                <CircleButton variant="primary" color="green" size="small" />
                <CircleButton variant="primary" color="green" size="medium" />
                <CircleButton variant="primary" color="green" size="large" />
                <CircleButton variant="secondary" color="blue" size="medium" icon={<Settings className="h-5 w-5" />} />
                <CircleButton variant="elevated" color="green" size="medium" icon={<User className="h-5 w-5" />} />
              </div>
            </div>
          </div>
        </section>

        {/* Colores Section */}
        <section id="colores" className="mb-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-6">
            Paleta de Colores
          </h2>

          <div className="space-y-6">
            {/* Brand Colors */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Colores de Marca
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-24 bg-primary-blue rounded-lg shadow-sm"></div>
                  <p className="text-sm text-dark-700 font-medium">Primary Blue</p>
                  <p className="text-xs text-dark-500">#20263D</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-24 bg-primary-green rounded-lg shadow-sm"></div>
                  <p className="text-sm text-dark-700 font-medium">Primary Green</p>
                  <p className="text-xs text-dark-500">#95C16B</p>
                </div>
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Colores Semánticos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="w-full h-24 bg-success-500 rounded-lg shadow-sm"></div>
                  <p className="text-sm text-dark-700 font-medium">Success</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-24 bg-error-500 rounded-lg shadow-sm"></div>
                  <p className="text-sm text-dark-700 font-medium">Error</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-24 bg-warning-500 rounded-lg shadow-sm"></div>
                  <p className="text-sm text-dark-700 font-medium">Warning</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tipografía Section */}
        <section id="tipografía" className="mb-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-6">
            Tipografía
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Quicksand (Títulos)
              </h3>
              <p className="text-[36px] font-bold font-[family-name:var(--font-quicksand)]">
                Título Grande
              </p>
              <p className="text-[28px] font-bold font-[family-name:var(--font-quicksand)]">
                Título Mediano
              </p>
              <p className="text-[20px] font-semibold font-[family-name:var(--font-quicksand)]">
                Título Pequeño
              </p>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Rubik (Cuerpo)
              </h3>
              <p className="text-[16px] font-[family-name:var(--font-rubik)]">
                Texto regular para contenido del cuerpo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="text-[16px] font-medium font-[family-name:var(--font-rubik)]">
                Texto medium para énfasis. Lorem ipsum dolor sit amet.
              </p>
              <p className="text-[14px] font-[family-name:var(--font-rubik)]">
                Texto pequeño para notas y detalles secundarios.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-grey-300 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-dark-600 font-[family-name:var(--font-rubik)]">
            Sistema de Diseño Kibi • Construido con Next.js 15 y Tailwind CSS v4
          </p>
        </div>
      </footer>
    </div>
  );
}
