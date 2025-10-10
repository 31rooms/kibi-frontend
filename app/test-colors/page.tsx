export default function TestColors() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Prueba de Colores - Sistema de Diseño Kibi</h1>

      {/* Test paletas básicas */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Paletas Básicas</h2>
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-grey-500 p-4 rounded-lg text-white">grey-500</div>
          <div className="bg-blue-500 p-4 rounded-lg text-white">blue-500</div>
          <div className="bg-orange-500 p-4 rounded-lg text-white">orange-500</div>
          <div className="bg-violet-500 p-4 rounded-lg text-white">violet-500</div>
          <div className="bg-purple-500 p-4 rounded-lg text-white">purple-500</div>
        </div>
      </section>

      {/* Test colores semánticos */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Colores Semánticos</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-error-500 p-4 rounded-lg text-white">error-500</div>
          <div className="bg-success-500 p-4 rounded-lg text-white">success-500</div>
          <div className="bg-warning-500 p-4 rounded-lg text-white">warning-500</div>
        </div>
      </section>

      {/* Test colores de marca */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Colores de Marca</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary-blue p-4 rounded-lg text-white">primary-blue</div>
          <div className="bg-primary-green p-4 rounded-lg text-white">primary-green</div>
        </div>
      </section>

      {/* Test sombras */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sombras</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-8 bg-white shadow-bubble rounded-lg">shadow-bubble</div>
          <div className="p-8 bg-white shadow-strong rounded-lg">shadow-strong</div>
        </div>
      </section>

      {/* Test border radius */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Border Radius</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-grey-200 p-4 rounded-sm">rounded-sm</div>
          <div className="bg-grey-200 p-4 rounded-md">rounded-md</div>
          <div className="bg-grey-200 p-4 rounded-lg">rounded-lg</div>
          <div className="bg-grey-200 p-4 rounded-xl">rounded-xl</div>
        </div>
      </section>

      {/* Test CSS Variables */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">CSS Variables (Fallback)</h2>
        <div className="grid grid-cols-3 gap-4">
          <div style={{backgroundColor: 'var(--color-chatbot-blue)'}} className="p-4 rounded-lg text-white">
            chatbot-blue (var)
          </div>
          <div style={{backgroundColor: 'var(--color-button-green-default)'}} className="p-4 rounded-lg text-white">
            button-green (var)
          </div>
          <div style={{backgroundColor: 'var(--color-background-helper)'}} className="p-4 rounded-lg">
            background-helper (var)
          </div>
        </div>
      </section>
    </div>
  );
}
