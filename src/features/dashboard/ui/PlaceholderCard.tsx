export interface PlaceholderCardProps {
  title: string;
  message?: string;
}

export const PlaceholderCard = ({
  title,
  message = 'Próximamente disponible'
}: PlaceholderCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-dark-800 mb-4 font-[family-name:var(--font-quicksand)]">
        {title}
      </h2>
      <p className="text-sm text-dark-600 font-[family-name:var(--font-rubik)]">
        {message}
      </p>
    </div>
  );
};
