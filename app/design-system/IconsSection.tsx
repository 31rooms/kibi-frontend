export default function IconsSection() {
  return (
    <section id="iconos" className="mb-16 bg-white dark:bg-[#171B22] rounded-lg shadow-sm p-8">
      <h2 className="text-[28px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-6">
        Iconos Custom SVG
      </h2>

      <div className="space-y-8">
        {/* Status and Feedback Icons */}
        <div>
          <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
            Estados y Feedback
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/succes-icon.svg" alt="Success Icon" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">succes-icon.svg</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/error-icon.svg" alt="Error Icon" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">error-icon.svg</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/status-up.svg" alt="Status Up" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">status-up.svg</span>
            </div>
          </div>
        </div>

        {/* Progress and Trending Icons */}
        <div>
          <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
            Progreso y Tendencias
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/trend-up.svg" alt="Trend Up" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">trend-up.svg</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/trend-up-progreso.svg" alt="Trend Up Progreso" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">trend-up-progreso.svg</span>
            </div>
          </div>
        </div>

        {/* Achievement Icons */}
        <div>
          <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
            Logros y Estrellas
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/star.svg" alt="Star" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">star.svg</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/star-flash.svg" alt="Star Flash" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">star-flash.svg</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/start-50.svg" alt="Start 50" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">start-50.svg</span>
            </div>
          </div>
        </div>

        {/* UI and Actions Icons */}
        <div>
          <h3 className="text-[18px] font-semibold text-dark-800 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
            UI y Acciones
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/calendar.svg" alt="Calendar" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">calendar.svg</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/cience.svg" alt="Science" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">cience.svg</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/timer.svg" alt="Timer" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">timer.svg</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/task-square.svg" alt="Task Square" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">task-square.svg</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/share.svg" alt="Share" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">share.svg</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/close-square.svg" alt="Close Square" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">close-square.svg</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src="/icons/foco-button.svg" alt="Foco Button" className="w-12 h-12" />
              <span className="text-xs text-dark-600 dark:text-grey-400 text-center">foco-button.svg</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
