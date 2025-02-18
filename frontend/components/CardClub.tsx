'use client';
// frontend/components/ClubCard.tsx
import React, { useState } from 'react';
import { getClubLogo } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEquipoClub } from '@/hooks/useEquipoClub';

interface ClubCardProps {
  club: {
    id: string;
    nombre: string;
    deporte: string;
    logo?: string;
  };
  userId: string;
}

const ClubCard: React.FC<ClubCardProps> = ({ club, userId }) => {
  const router = useRouter();
  const { resetDatos } = useEquipoClub();

  const handleSelectClub = async () => {
    try {
      resetDatos();
      localStorage.setItem('selectedTeamId', club.id);
      localStorage.setItem('selectedTeamName', club.nombre.replace(/\s+/g, ''));
      localStorage.setItem('userId', userId);
      localStorage.setItem('selectionType', 'club');
      router.push(`/${club.nombre.replace(/\s+/g, '')}`);
    } catch (error) {
      console.error('❌ Error al seleccionar el club:', error);
    }
  };

  return (
    <button onClick={handleSelectClub}>
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
    </button>
  );
};

export default ClubCard;
