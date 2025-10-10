'use client';

import { useState } from 'react';
import { Input } from '@/components/ui';
import { Search, Mail, Lock, User, Eye, EyeOff, Info } from 'lucide-react';

export default function TestInput() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Input - Kibi Design System</h1>

      {/* Basic States */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Estados Básicos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Default */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Default</h3>
            <Input label="Label" placeholder="Placeholder" helperText="Helper Text" />
          </div>

          {/* With Value */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">With Value</h3>
            <Input
              label="Label"
              placeholder="Placeholder"
              defaultValue="Input text"
              helperText="Helper Text"
            />
          </div>

          {/* Error */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Error State</h3>
            <Input
              label="Label"
              placeholder="Placeholder"
              error="This field is required"
            />
          </div>

          {/* Success */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Success State</h3>
            <Input
              label="Label"
              placeholder="Placeholder"
              success="Looks good!"
            />
          </div>

          {/* Disabled */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Disabled</h3>
            <Input
              label="Label"
              placeholder="Placeholder"
              helperText="Helper Text"
              disabled
            />
          </div>

          {/* Without Label */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Without Label</h3>
            <Input placeholder="Placeholder" helperText="Helper Text" />
          </div>
        </div>
      </section>

      {/* With Icons */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Con Iconos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Leading Icon */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Leading Icon</h3>
            <Input
              label="Search"
              placeholder="Search..."
              leadingIcon={<Search className="h-4 w-4" />}
              helperText="Enter keywords"
            />
          </div>

          {/* Trailing Icon */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Trailing Icon</h3>
            <Input
              label="Information"
              placeholder="Enter details"
              trailingIcon={<Info className="h-4 w-4" />}
              helperText="Additional info"
            />
          </div>

          {/* Both Icons */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Leading + Trailing</h3>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leadingIcon={<Mail className="h-4 w-4" />}
              trailingIcon={<Info className="h-4 w-4" />}
              helperText="We'll never share your email"
            />
          </div>

          {/* Error with Icon */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Error with Icon</h3>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leadingIcon={<Mail className="h-4 w-4" />}
              error="Invalid email address"
            />
          </div>

          {/* Success with Icon */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">Success with Icon</h3>
            <Input
              label="Username"
              placeholder="Enter username"
              leadingIcon={<User className="h-4 w-4" />}
              success="Username is available"
            />
          </div>

          {/* Clear Button */}
          <div>
            <h3 className="text-sm font-medium mb-4 text-grey-600">With Clear Button</h3>
            <Input
              label="Search"
              placeholder="Search..."
              leadingIcon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              showClearButton
              onClear={() => setSearchQuery('')}
              helperText="Click X to clear"
            />
          </div>
        </div>
      </section>

      {/* Form Examples */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Casos de Uso - Formularios</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-6">Formulario de Login</h3>
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                leadingIcon={<Mail className="h-4 w-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={email && !email.includes('@') ? 'Invalid email' : undefined}
              />

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  leadingIcon={<Lock className="h-4 w-4" />}
                  trailingIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-grey-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                Sign In
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-6">Formulario de Registro</h3>
            <div className="space-y-4">
              <Input
                label="Nombre completo"
                placeholder="Juan Pérez"
                leadingIcon={<User className="h-4 w-4" />}
                helperText="Como aparece en tu identificación"
              />

              <Input
                label="Email"
                type="email"
                placeholder="juan@example.com"
                leadingIcon={<Mail className="h-4 w-4" />}
                success="Email disponible"
              />

              <Input
                label="Username"
                placeholder="juanperez"
                leadingIcon={<User className="h-4 w-4" />}
                error="Este username ya está en uso"
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres"
                leadingIcon={<Lock className="h-4 w-4" />}
                helperText="Debe contener mayúsculas, minúsculas y números"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Examples */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Casos de Uso - Búsqueda</h2>

        <div className="space-y-6">
          {/* Simple Search */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-grey-600">Búsqueda Simple</h3>
            <Input
              placeholder="Buscar cursos, temas o profesores..."
              leadingIcon={<Search className="h-4 w-4" />}
              showClearButton
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>

          {/* Search with Results Count */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-grey-600">Búsqueda con Resultados</h3>
            <Input
              placeholder="Buscar..."
              leadingIcon={<Search className="h-4 w-4" />}
              helperText="42 resultados encontrados"
              defaultValue="Matemáticas"
            />
          </div>
        </div>
      </section>

      {/* Different Sizes */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Tamaños Personalizados</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3 text-grey-600">Small (h-9)</h3>
            <Input
              placeholder="Small input"
              className="h-9 text-sm"
              leadingIcon={<Search className="h-3.5 w-3.5" />}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3 text-grey-600">Default (h-10)</h3>
            <Input
              placeholder="Default input"
              leadingIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3 text-grey-600">Large (h-12)</h3>
            <Input
              placeholder="Large input"
              className="h-12 text-base"
              leadingIcon={<Search className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* All States Grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Matriz Completa de Estados</h2>

        <div className="overflow-x-auto">
          <div className="inline-grid grid-cols-4 gap-4 min-w-max">
            {/* Headers */}
            <div className="font-medium text-sm text-grey-600">Default</div>
            <div className="font-medium text-sm text-grey-600">With Icon</div>
            <div className="font-medium text-sm text-grey-600">Error</div>
            <div className="font-medium text-sm text-grey-600">Success</div>

            {/* Row 1: Basic */}
            <Input placeholder="Placeholder" helperText="Helper Text" />
            <Input
              placeholder="Placeholder"
              leadingIcon={<Mail className="h-4 w-4" />}
              helperText="Helper Text"
            />
            <Input placeholder="Placeholder" error="Error message" />
            <Input placeholder="Placeholder" success="Success message" />

            {/* Row 2: With Label */}
            <Input label="Label" placeholder="Placeholder" helperText="Helper Text" />
            <Input
              label="Label"
              placeholder="Placeholder"
              leadingIcon={<User className="h-4 w-4" />}
              helperText="Helper Text"
            />
            <Input label="Label" placeholder="Placeholder" error="Error message" />
            <Input label="Label" placeholder="Placeholder" success="Success message" />

            {/* Row 3: Disabled */}
            <Input placeholder="Placeholder" helperText="Helper Text" disabled />
            <Input
              placeholder="Placeholder"
              leadingIcon={<Lock className="h-4 w-4" />}
              helperText="Helper Text"
              disabled
            />
            <Input label="Label" placeholder="Placeholder" disabled />
            <Input label="Label" placeholder="Placeholder" disabled />
          </div>
        </div>
      </section>
    </div>
  );
}
