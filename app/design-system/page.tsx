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
  ModalInfo,
  ModalHeader,
  Tooltip,
  TopMenu,
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  ToggleWithText,
  CircleButton,
  EditButton,
  SidebarButton,
  Tag,
  Alert,
  AlertTitle,
  AlertDescription,
  ListDropdown,
  PageIndicator,
  Calendar,
  Accordion,
  Card,
  FeedbackCard,
  CareerTag,
  KibiIcon
} from '@/shared/ui';
import {
  ChevronRight,
  Settings,
  User,
  Search,
  Heart,
  Star
} from 'lucide-react';
import IconsSection from './IconsSection';
import CalendarSection from './CalendarSection';
import ChartsSection from './ChartsSection';

export default function DesignSystemPage() {
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfoOpen, setModalInfoOpen] = useState(false);
  const [modalHeaderOpen, setModalHeaderOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [toggleWithTextValue, setToggleWithTextValue] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [listDropdownValue, setListDropdownValue] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className="min-h-screen bg-grey-50">
      {/* Header */}
      <header className="bg-white dark:bg-[#171B22] border-b border-grey-300 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[36px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-1">
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
        <nav className="mb-12 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-6">
          <h2 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-4">
            Navegación Rápida
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['Botones', 'Badges', 'Cards', 'Inputs', 'Checkboxes', 'Modales', 'Tooltips', 'Select', 'Tags', 'Alerts', 'Feedback Cards', 'Accordeones', 'Calendar', 'Charts', 'Menú', 'Sidebar', 'Colores', 'Tipografía', 'Kibi Icons'].map((section) => (
              <a
                key={section}
                href={`#${section.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 text-sm text-primary-blue hover:bg-blue-50 rounded-md transition-colors text-center font-[family-name:var(--font-rubik)]"
              >
                {section}
              </a>
            ))}
          </div>
        </nav>

        {/* Botones Section */}
        <section id="botones" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
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
        <section id="badges" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
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

        {/* Cards Section */}
        <section id="cards" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
            Cards
          </h2>

          <div className="space-y-8">
            {/* Basic Cards */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Variantes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <h3 className="text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-2">
                    Card Default
                  </h3>
                  <p className="text-dark-700 dark:text-grey-300 text-sm">
                    Card básica con borde simple y sin sombra.
                  </p>
                </Card>

                <Card variant="elevated">
                  <h3 className="text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-2">
                    Card Elevada
                  </h3>
                  <p className="text-dark-700 dark:text-grey-300 text-sm">
                    Card con sombra para dar profundidad.
                  </p>
                </Card>
              </div>
            </div>

            {/* Different Padding Options */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Opciones de Padding
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card padding="small">
                  <h3 className="text-[16px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                    Small Padding
                  </h3>
                </Card>

                <Card padding="medium">
                  <h3 className="text-[16px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                    Medium Padding
                  </h3>
                </Card>

                <Card padding="large">
                  <h3 className="text-[16px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)]">
                    Large Padding
                  </h3>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs Section */}
        <section id="inputs" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
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
        <section id="checkboxes" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
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
        <section id="modales" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
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
                <Button variant="primary" color="green" onClick={() => setModalInfoOpen(true)}>
                  Abrir Modal Info
                </Button>
                <Button variant="primary" color="blue" onClick={() => setModalHeaderOpen(true)}>
                  Abrir Modal Header
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

            <ModalInfo
              open={modalInfoOpen}
              onOpenChange={setModalInfoOpen}
              title="Ayuda"
              description={`Para encontrar el valor de xxx en una ecuación lineal como ax+b=cax + b = cax+b=c, sigue estos pasos:

Aísla el término con xxx → Resta o suma el número que está junto a xxx en el lado izquierdo de la ecuación, haciendo lo mismo en ambos lados.

Fórmula:
ax+b=c⇒ax=c−bax + b = c ⇒ ax = c - bax+b=c⇒ax=c−b

Despeja xxx → Divide ambos lados de la ecuación entre el número que multiplica a xxx (el coeficiente aaa).

Fórmula:
x=c−bax = \\frac{c - b}{a}x=ac−b

Con este método podrás resolver cualquier ecuación de primer grado con una incógnita.`}
              confirmText="Entendido"
              onConfirm={() => console.log('Modal Info confirmed')}
            />

            <ModalHeader
              open={modalHeaderOpen}
              onOpenChange={setModalHeaderOpen}
              title="Avatar"
              subtitle="Seleccionar avatar"
              size="default"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-6 justify-items-center">
                  <button className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-[#E8774A] flex items-center justify-center">
                      <img
                        src="/illustrations/avatar1.svg"
                        alt="Albert Einstein"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-dark-700 dark:text-white font-[family-name:var(--font-rubik)]">
                      Albert Einstein
                    </span>
                  </button>
                  <button className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-[#F4D58D] flex items-center justify-center">
                      <img
                        src="/illustrations/avatar2.svg"
                        alt="Platón"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-dark-700 dark:text-white font-[family-name:var(--font-rubik)]">
                      Platón
                    </span>
                  </button>
                  <button className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-[#8DA7BE] flex items-center justify-center">
                      <img
                        src="/illustrations/avatar1.svg"
                        alt="Nightingale Florence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-dark-700 dark:text-white font-[family-name:var(--font-rubik)]">
                      Nightingale Florence
                    </span>
                  </button>
                </div>
              </div>
            </ModalHeader>
          </div>
        </section>

        {/* Tooltips Section */}
        <section id="tooltips" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
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
        <section id="select" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
            Select (Dropdown)
          </h2>

          <div className="space-y-8">
            {/* Basic Select */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
                Select Básico
              </h3>
              <p className="text-[14px] text-dark-600 dark:text-grey-400 mb-4 font-[family-name:var(--font-rubik)]">
                Dropdown construido con Radix UI. Soporta dark mode automáticamente.
              </p>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 mb-2">
                  Selecciona una fruta
                </label>
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
                {selectValue && (
                  <p className="mt-2 text-sm text-dark-600 dark:text-grey-400">
                    Seleccionaste: <strong>{selectValue}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Select with Groups */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
                Select con Grupos
              </h3>
              <p className="text-[14px] text-dark-600 dark:text-grey-400 mb-4 font-[family-name:var(--font-rubik)]">
                Organiza opciones en grupos con SelectLabel.
              </p>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 mb-2">
                  Selecciona una asignatura
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Elige una asignatura" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Ciencias</SelectLabel>
                      <SelectItem value="physics">Física</SelectItem>
                      <SelectItem value="chemistry">Química</SelectItem>
                      <SelectItem value="biology">Biología</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Matemáticas</SelectLabel>
                      <SelectItem value="algebra">Álgebra</SelectItem>
                      <SelectItem value="geometry">Geometría</SelectItem>
                      <SelectItem value="calculus">Cálculo</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Idiomas</SelectLabel>
                      <SelectItem value="spanish">Español</SelectItem>
                      <SelectItem value="english">Inglés</SelectItem>
                      <SelectItem value="french">Francés</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Select Disabled State */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
                Estado Deshabilitado
              </h3>
              <p className="text-[14px] text-dark-600 dark:text-grey-400 mb-4 font-[family-name:var(--font-rubik)]">
                Select deshabilitado con estilo de borde punteado.
              </p>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-dark-700 dark:text-grey-300 mb-2">
                  Opción no disponible
                </label>
                <Select disabled>
                  <SelectTrigger disabled>
                    <SelectValue placeholder="Este select está deshabilitado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Opción 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Tags Section */}
        <section id="tags" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
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

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                CareerTag Component (Adaptativo Light/Dark)
              </h3>
              <p className="text-[14px] text-dark-600 dark:text-grey-400 mb-4 font-[family-name:var(--font-rubik)]">
                Tag reutilizable que se adapta automáticamente al modo claro/oscuro
              </p>
              <div className="flex flex-wrap gap-6 items-center">
                <CareerTag />
                <CareerTag career="Aspirante a medicina" />
              </div>
            </div>
          </div>
        </section>

        {/* Alerts Section */}
        <section id="alerts" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
            Alerts
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Variantes de Alerts
              </h3>
              <div className="space-y-4">
                <Alert variant="success">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    La operación se completó exitosamente.
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Hubo un error al procesar tu solicitud.
                  </AlertDescription>
                </Alert>

                <Alert variant="warning">
                  <AlertTitle>Advertencia</AlertTitle>
                  <AlertDescription>
                    Por favor revisa la información antes de continuar.
                  </AlertDescription>
                </Alert>

                <Alert variant="info">
                  <AlertTitle>Información</AlertTitle>
                  <AlertDescription>
                    Este es un mensaje informativo para ti.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Cards Section */}
        <section id="feedback-cards" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
            Feedback Cards
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
                Feedback Card con Kibi Icon (Predeterminado)
              </h3>
              <p className="text-[14px] text-dark-600 dark:text-grey-400 mb-6 font-[family-name:var(--font-rubik)]">
                Cards de feedback con iconos de éxito/error y mascota Kibi. Usadas en validación de preguntas y formularios.
                Tienen soporte completo para dark mode.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-dark-700 dark:text-grey-300 mb-4">Estado Correcto</p>
                  <FeedbackCard
                    isCorrect={true}
                    showKibiIcon={true}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-dark-700 dark:text-grey-300 mb-4">Estado Incorrecto</p>
                  <FeedbackCard
                    isCorrect={false}
                    showKibiIcon={true}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
                Feedback Card con Mensajes Personalizados
              </h3>
              <p className="text-[14px] text-dark-600 dark:text-grey-400 mb-6 font-[family-name:var(--font-rubik)]">
                Puedes personalizar el mensaje de feedback usando la prop <code className="bg-grey-100 dark:bg-[#272E3A] px-2 py-1 rounded text-sm">message</code>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-dark-700 dark:text-grey-300 mb-4">Mensaje Personalizado de Éxito</p>
                  <FeedbackCard
                    isCorrect={true}
                    message="¡Excelente trabajo! Has completado el ejercicio correctamente."
                    showKibiIcon={true}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-dark-700 dark:text-grey-300 mb-4">Mensaje Personalizado de Error</p>
                  <FeedbackCard
                    isCorrect={false}
                    message="Casi lo logras. Revisa el paso 3 de la explicación."
                    showKibiIcon={true}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
                Feedback Card sin Kibi Icon
              </h3>
              <p className="text-[14px] text-dark-600 dark:text-grey-400 mb-6 font-[family-name:var(--font-rubik)]">
                Para casos donde solo necesitas el feedback sin la mascota, usa <code className="bg-grey-100 dark:bg-[#272E3A] px-2 py-1 rounded text-sm">showKibiIcon=false</code>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-dark-700 dark:text-grey-300 mb-4">Sin Kibi - Correcto</p>
                  <FeedbackCard
                    isCorrect={true}
                    showKibiIcon={false}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-dark-700 dark:text-grey-300 mb-4">Sin Kibi - Incorrecto</p>
                  <FeedbackCard
                    isCorrect={false}
                    showKibiIcon={false}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
                Ejemplo de Uso en Código
              </h3>
              <div className="bg-grey-100 dark:bg-[#272E3A] p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm text-dark-900 dark:text-white font-mono">
{`// Uso básico con icono Kibi
<FeedbackCard
  isCorrect={false}
  showKibiIcon={true}
/>

// Con mensaje personalizado
<FeedbackCard
  isCorrect={true}
  message="¡Perfecto! Has dominado este tema."
  showKibiIcon={true}
/>

// Sin icono Kibi
<FeedbackCard
  isCorrect={false}
  message="Intenta de nuevo"
  showKibiIcon={false}
/>`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
                Feedback Card con Markdown y LaTeX
              </h3>
              <p className="text-[14px] text-dark-600 dark:text-grey-400 mb-6 font-[family-name:var(--font-rubik)]">
                El componente soporta Markdown y fórmulas LaTeX mediante la prop <code className="bg-grey-100 dark:bg-[#272E3A] px-2 py-1 rounded text-sm">enableMarkdown=true</code>.
                Ideal para mostrar feedback con ecuaciones matemáticas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-dark-700 dark:text-grey-300 mb-4">Con Fórmula LaTeX Simple</p>
                  <FeedbackCard
                    isCorrect={false}
                    message="La respuesta correcta es $x^2 + y^2 = r^2$"
                    enableMarkdown={true}
                    showKibiIcon={true}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-dark-700 dark:text-grey-300 mb-4">Con Ecuación Compleja</p>
                  <FeedbackCard
                    isCorrect={false}
                    message="La fórmula correcta de la parábola es $(x-h)^2 = 4p(y-k)$"
                    enableMarkdown={true}
                    showKibiIcon={true}
                  />
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm font-medium text-dark-700 dark:text-grey-300 mb-4">Markdown con Negrita y LaTeX</p>
                <div className="flex justify-center">
                  <FeedbackCard
                    isCorrect={false}
                    message="Recuerda que la **fórmula cuadrática** es $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$"
                    enableMarkdown={true}
                    showKibiIcon={true}
                  />
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm font-medium text-dark-700 dark:text-grey-300 mb-4">Con notación LaTeX \(...\) del backend</p>
                <div className="flex justify-center">
                  <FeedbackCard
                    isCorrect={false}
                    message="¿Calculaste la posición de Q2 usando la fórmula \\(P_k = \\frac{k(n+1)}{4}\\), donde k=2 y n=8?"
                    enableMarkdown={true}
                    showKibiIcon={true}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
                Ejemplo de Código con LaTeX
              </h3>
              <div className="bg-grey-100 dark:bg-[#272E3A] p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm text-dark-900 dark:text-white font-mono">
{`// Con fórmula LaTeX simple
<FeedbackCard
  isCorrect={false}
  message="La respuesta correcta es $x^2 + y^2 = r^2$"
  enableMarkdown={true}
  showKibiIcon={true}
/>

// Con ecuación compleja
<FeedbackCard
  isCorrect={false}
  message="La fórmula correcta es $(x-h)^2 = 4p(y-k)$"
  enableMarkdown={true}
  showKibiIcon={true}
/>

// Markdown con negrita y LaTeX
<FeedbackCard
  isCorrect={false}
  message="Recuerda que la **fórmula cuadrática** es $x = \\\\frac{-b \\\\pm \\\\sqrt{b^2-4ac}}{2a}$"
  enableMarkdown={true}
  showKibiIcon={true}
/>`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
                Características del Componente
              </h3>
              <ul className="list-disc list-inside space-y-2 text-[14px] text-dark-700 dark:text-grey-300 font-[family-name:var(--font-rubik)]">
                <li>✅ Soporte completo para dark mode</li>
                <li>✅ Icono de Kibi cambia automáticamente según el tema (normal/blanco)</li>
                <li>✅ Sombras adaptativas al modo oscuro</li>
                <li>✅ Mensajes predeterminados o personalizados</li>
                <li>✅ Soporte para Markdown y LaTeX (con enableMarkdown=true)</li>
                <li>✅ Diseño tooltip con triángulo apuntando hacia abajo</li>
                <li>✅ Usado en LessonQuestions para feedback de respuestas</li>
                <li>✅ Reutilizable en toda la aplicación</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Accordeones Section */}
        <section id="accordeones" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
            Accordeones
          </h2>

          <div className="space-y-8">
            {/* Basic Accordion */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Acordeón Básico (Cápsula de Ciencia)
              </h3>
              <Accordion
                items={[
                  {
                    title: 'Cápsula de ciencia',
                    subtitle: '¿Qué aprenderás hoy?',
                    content: `## Leyes de la conservación de la energía

La **energía cinética** es la energía asociada al movimiento de los objetos. Cuando un objeto se mueve, posee energía cinética que depende de su masa y velocidad.

La fórmula de la energía cinética es:

\`Ec = 1/2 × m × v²\`

Donde:
- **m** es la masa del objeto (en kilogramos)
- **v** es la velocidad del objeto (en metros por segundo)

### Principio de conservación

La energía no se crea ni se destruye, solo se transforma. Este es uno de los principios fundamentales de la física.

Por ejemplo, cuando un objeto cae, su [energía potencial](https://es.wikipedia.org/wiki/Energ%C3%ADa_potencial) se convierte en energía cinética.`,
                  },
                ]}
                defaultOpenIndex={0}
              />
            </div>

            {/* Multiple Items Accordion */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Múltiples Items (Solo uno abierto)
              </h3>
              <Accordion
                items={[
                  {
                    title: 'Introducción a la física',
                    subtitle: 'Conceptos básicos',
                    content: `La **física** es la ciencia natural que estudia las propiedades de la materia y la energía, así como las relaciones entre ambas.

Algunas ramas principales incluyen:

- Mecánica clásica
- Termodinámica
- Electromagnetismo
- Óptica
- Física cuántica

> "La física es el intento de hacer que las cosas complicadas sean simples." - E. Rutherford`,
                  },
                  {
                    title: 'Fuerzas y movimiento',
                    subtitle: 'Leyes de Newton',
                    content: `### Primera Ley de Newton (Inercia)

Un objeto en reposo permanecerá en reposo, y un objeto en movimiento continuará en movimiento a velocidad constante, a menos que actúe sobre él una fuerza externa.

### Segunda Ley de Newton

La aceleración de un objeto es directamente proporcional a la fuerza neta que actúa sobre él e inversamente proporcional a su masa.

**Fórmula:** \`F = m × a\`

### Tercera Ley de Newton

Para cada acción, hay una reacción igual y opuesta.`,
                  },
                  {
                    title: 'Trabajo y energía',
                    subtitle: 'Transformaciones energéticas',
                    content: `El **trabajo** se realiza cuando una fuerza mueve un objeto a cierta distancia.

**Fórmula del trabajo:** \`W = F × d × cos(θ)\`

La energía puede presentarse en diferentes formas:

1. Energía cinética (movimiento)
2. Energía potencial (posición)
3. Energía térmica (calor)
4. Energía química (enlaces)
5. Energía eléctrica

Todas estas formas pueden transformarse entre sí, pero la energía total se conserva.`,
                  },
                ]}
              />
            </div>

            {/* Multiple Open Accordion */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Múltiples Items (Varios abiertos simultáneamente)
              </h3>
              <Accordion
                allowMultiple
                items={[
                  {
                    title: 'Matemáticas básicas',
                    content: `Las **matemáticas** son el lenguaje de la ciencia. Algunos conceptos fundamentales:

- Aritmética: suma, resta, multiplicación, división
- Álgebra: ecuaciones y variables
- Geometría: formas y espacios
- Cálculo: derivadas e integrales

Las matemáticas nos ayudan a modelar y entender el mundo que nos rodea.`,
                  },
                  {
                    title: 'Química elemental',
                    content: `La **química** estudia la composición, estructura y propiedades de la materia.

**Elementos químicos:** Los bloques de construcción de toda la materia.

La tabla periódica organiza todos los elementos conocidos según sus propiedades químicas.

Algunos elementos comunes:
- Hidrógeno (H)
- Oxígeno (O)
- Carbono (C)
- Nitrógeno (N)`,
                  },
                  {
                    title: 'Biología general',
                    content: `La **biología** es el estudio de los seres vivos y sus procesos vitales.

Las características de los seres vivos:
1. Organización celular
2. Metabolismo
3. Crecimiento y desarrollo
4. Reproducción
5. Respuesta a estímulos
6. Adaptación y evolución

> "Nada en biología tiene sentido si no es a la luz de la evolución." - Theodosius Dobzhansky`,
                  },
                ]}
              />
            </div>

            {/* Minimal Variant */}
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Variante Minimal (Sin bordes)
              </h3>
              <Accordion
                variant="minimal"
                items={[
                  {
                    title: 'Pregunta frecuente 1',
                    content: 'Esta es la respuesta a la primera pregunta frecuente con **texto en negrita** y un enlace a [más información](https://example.com).',
                  },
                  {
                    title: 'Pregunta frecuente 2',
                    content: 'Esta es la respuesta a la segunda pregunta frecuente. Puedes incluir listas, enlaces y formato de texto.',
                  },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <CalendarSection />

        {/* List Dropdown Section */}
        <section className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
            List Dropdown
          </h2>

          <div className="space-y-6 max-w-md">
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Lista de Opciones
              </h3>
              <ListDropdown
                value={listDropdownValue}
                onValueChange={setListDropdownValue}
                items={[
                  { value: 'option1', label: 'Primera Opción' },
                  { value: 'option2', label: 'Segunda Opción' },
                  { value: 'option3', label: 'Tercera Opción' },
                  { value: 'option4', label: 'Opción Deshabilitada', disabled: true },
                  { value: 'option5', label: 'Última Opción' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Page Indicator Section */}
        <section className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
            Page Indicator
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Indicador de Páginas
              </h3>
              <div className="space-y-4">
                <PageIndicator
                  totalPages={5}
                  currentPage={currentPage}
                  onPageClick={setCurrentPage}
                />
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    color="blue"
                    size="small"
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="secondary"
                    color="blue"
                    size="small"
                    onClick={() => setCurrentPage(Math.min(4, currentPage + 1))}
                    disabled={currentPage === 4}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menú Section */}
        <section id="menú" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
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
        <section className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
            Botones Circulares
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Circle Buttons
              </h3>
              <div className="flex flex-wrap gap-4 items-center">
                <CircleButton variant="primary" color="green" size="small" />
                <CircleButton variant="primary" color="green" size="medium" />
                <CircleButton variant="primary" color="green" size="large" />
                <CircleButton variant="secondary" color="blue" size="medium" icon={<Settings className="h-5 w-5" />} />
                <CircleButton variant="elevated" color="green" size="medium" icon={<User className="h-5 w-5" />} />
              </div>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Botón de Editar (EditButton)
              </h3>
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex flex-col items-center gap-2">
                  <EditButton size="small" onClick={() => console.log('Edit clicked')} />
                  <span className="text-xs text-dark-600 dark:text-grey-400">Small</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <EditButton size="medium" onClick={() => console.log('Edit clicked')} />
                  <span className="text-xs text-dark-600 dark:text-grey-400">Medium (Default)</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <EditButton size="large" onClick={() => console.log('Edit clicked')} />
                  <span className="text-xs text-dark-600 dark:text-grey-400">Large</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <EditButton size="responsive" onClick={() => console.log('Edit clicked')} />
                  <span className="text-xs text-dark-600 dark:text-grey-400">Responsive (small → large)</span>
                </div>
              </div>
              <p className="text-sm text-dark-600 dark:text-grey-400 mt-4 font-[family-name:var(--font-rubik)]">
                Este botón se adapta automáticamente a light/dark mode. Usado en AccountSection para editar perfil y contraseña.
              </p>
            </div>
          </div>
        </section>

        {/* Sidebar Buttons Section */}
        <section id="sidebar" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
            Sidebar Buttons
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Estados Seleccionados
              </h3>
              <div className="space-y-3 max-w-sm">
                <SidebarButton type="inicio" selected={true} />
                <SidebarButton type="progreso" selected={true} />
                <SidebarButton type="clase-libre" selected={true} />
                <SidebarButton type="examen" selected={true} />
                <SidebarButton type="cuenta" selected={true} />
              </div>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Estados No Seleccionados
              </h3>
              <div className="space-y-3 max-w-sm">
                <SidebarButton type="inicio" selected={false} />
                <SidebarButton type="progreso" selected={false} />
                <SidebarButton type="clase-libre" selected={false} />
                <SidebarButton type="examen" selected={false} />
                <SidebarButton type="cuenta" selected={false} />
              </div>
            </div>

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Ejemplo Interactivo
              </h3>
              <div className="space-y-3 max-w-sm">
                <SidebarButton
                  type="inicio"
                  selected={true}
                  onClick={() => console.log('Inicio clicked')}
                />
                <SidebarButton
                  type="progreso"
                  selected={false}
                  onClick={() => console.log('Progreso clicked')}
                />
                <SidebarButton
                  type="clase-libre"
                  selected={false}
                  onClick={() => console.log('Clase Libre clicked')}
                />
                <SidebarButton
                  type="examen"
                  selected={false}
                  onClick={() => console.log('Examen clicked')}
                />
                <SidebarButton
                  type="cuenta"
                  selected={false}
                  onClick={() => console.log('Cuenta clicked')}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Colores Section */}
        <section id="colores" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
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
                  <p className="text-xs text-dark-500">#171B22</p>
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
        <section id="tipografía" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
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

            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                Colores de Texto Secundarios
              </h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex flex-col gap-2">
                    <p className="text-[16px] font-[family-name:var(--font-rubik)]" style={{ color: '#7B7B7B' }}>
                      Texto secundario en light mode (#7B7B7B)
                    </p>
                    <span className="text-xs text-dark-600 dark:text-grey-400">Light Mode</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-[16px] font-[family-name:var(--font-rubik)]" style={{ color: '#B9B9B9' }}>
                      Texto secundario en dark mode (#B9B9B9)
                    </p>
                    <span className="text-xs text-dark-600 dark:text-grey-400">Dark Mode</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kibi Icons Section */}
        <section id="kibi-icons" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
          <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
            Kibi Icons
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-[18px] font-semibold text-dark-800 mb-4 font-[family-name:var(--font-rubik)]">
                KibiIcon Component (Adaptativo Light/Dark)
              </h3>
              <p className="text-[14px] text-dark-600 dark:text-grey-400 mb-4 font-[family-name:var(--font-rubik)]">
                Componente reutilizable que muestra el ícono correcto según el modo actual
              </p>
              <div className="flex flex-wrap gap-8 items-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-grey-100 dark:bg-dark-800 rounded-lg">
                    <KibiIcon size={80} />
                  </div>
                  <span className="text-xs text-dark-600 dark:text-grey-400">Tamaño 80px (adaptativo)</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-grey-100 dark:bg-dark-800 rounded-lg">
                    <KibiIcon size={40} />
                  </div>
                  <span className="text-xs text-dark-600 dark:text-grey-400">Tamaño 40px (adaptativo)</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-grey-100 dark:bg-dark-800 rounded-lg">
                    <KibiIcon width={60} height={60} />
                  </div>
                  <span className="text-xs text-dark-600 dark:text-grey-400">Custom 60x60px</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Custom Icons Section */}
        <IconsSection />

        {/* Charts Section */}
        <ChartsSection />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#171B22] border-t border-grey-300 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-dark-600 font-[family-name:var(--font-rubik)]">
            Sistema de Diseño Kibi • Construido con Next.js 15 y Tailwind CSS v4
          </p>
        </div>
      </footer>
    </div>
  );
}
