interface UserInfoCardProps {
  user: {
    email?: string;
    phoneNumber?: string;
    profileComplete?: boolean;
  } | null;
}

export const UserInfoCard = ({ user }: UserInfoCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-dark-800 mb-4 font-[family-name:var(--font-quicksand)]">
        Información del Usuario
      </h2>
      <div className="space-y-2 text-sm font-[family-name:var(--font-rubik)]">
        <p>
          <span className="font-semibold">Email:</span> {user?.email}
        </p>
        {user?.phoneNumber && (
          <p>
            <span className="font-semibold">Teléfono:</span> {user.phoneNumber}
          </p>
        )}
        <p>
          <span className="font-semibold">Perfil:</span>{' '}
          {user?.profileComplete ? 'Completo' : 'Incompleto'}
        </p>
      </div>
    </div>
  );
};
