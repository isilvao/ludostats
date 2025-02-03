// frontend/components/EquipoCard.tsx
import React from 'react';
import { getClubLogo } from '@/lib/utils';
import Link from 'next/link';

interface EquipoCardProps {
  equipo: {
    nombre: string;
    logo?: string;
    club: {
      nombre: string;
      deporte: string;
    };
  };
}

const EquipoCard: React.FC<EquipoCardProps> = ({ equipo }) => {
  return (
    <Link href="/inicio">
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center align-middle h-full">
        <div className="flex items-center space-x-12">
          <img
            src={getClubLogo(equipo)}
            alt={`${equipo.nombre} logo`}
            className="w-20 h-20 object-contain rounded-full border-4 border-gray-100 shadow-md"
          />
          <div>
            <h3 className="text-lg font-semibold">{equipo.nombre}</h3>
            <p>Club: {equipo.club.nombre}</p>
            <p>Deporte: {equipo.club.deporte}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EquipoCard;
