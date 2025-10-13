import { Button, Logo } from '@/shared/ui';

export interface DashboardHeaderProps {
  userName?: string;
  onLogout: () => void;
}

export const DashboardHeader = ({ userName, onLogout }: DashboardHeaderProps) => {
  return (
    <header className="bg-white border-b border-grey-300 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo size="small" />
        <div className="flex items-center gap-4">
          {userName && (
            <span className="text-sm text-dark-700 font-[family-name:var(--font-rubik)]">
              {userName}
            </span>
          )}
          <Button variant="secondary" color="blue" size="medium" onClick={onLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
};
