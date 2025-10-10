import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bienvenido a Kibi',
  description: 'Prepárate para tu examen de admisión a la UAEMEX con Kibi',
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
