export interface DashboardLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
}

export const DashboardLayout = ({ children, header }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-grey-50">
      {header}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};
