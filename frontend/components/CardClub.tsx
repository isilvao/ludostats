// frontend/components/ClubCard.tsx
import React from 'react';
import { getClubLogo } from '@/lib/utils';
import Link from 'next/link';

interface ClubCardProps {
  club: {
    nombre: string;
    deporte: string;
    logo?: string;
  };
}

const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  return (
    <Link href={`/${club.nombre.replace(/\s+/g, '')}`}>
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center align-middle h-full">
        <div className="flex items-center space-x-12">
          <img
            src={getClubLogo(club)}
            alt={`${club.nombre} logo`}
            className="w-20 h-20 object-cover rounded-full border-4 border-gray-100 shadow-md"
          />
          <div>
            <h3 className="text-lg font-semibold">{club.nombre}</h3>
            <p>Deporte: {club.deporte}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClubCard;
