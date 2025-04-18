'use client';
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
    rol: string;
  };
  userId: string;
}

const ClubCard: React.FC<ClubCardProps> = ({ club, userId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
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

  const handleLeaveClub = () => {
    setShowConfirmation(false);
    try {
      // Lógica para abandonar el club
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center align-middle h-full relative">
      {/* Menú de tres puntos */}
      {club.rol !== 'gerente' && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01"
            />
          </svg>
        </button>
      )}

      {/* Dropdown menu */}
      {isMenuOpen && (
        <div
          className="absolute top-1 right-10 bg-white border rounded-lg shadow-lg z-10"
          onClick={() => setIsMenuOpen(false)}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsMenuOpen(false);
              setShowConfirmation(true);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Abandonar club
          </button>
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg max-w-sm">
            <h3 className="text-lg font-semibold mb-4">
              ¿Estás seguro de querer abandonar el club?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowConfirmation(false);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleLeaveClub}
                className="px-4 py-2 bg-red text-white hover:bg-red/90 rounded"
              >
                Sí, abandonar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <button className="w-full" onClick={handleSelectClub}>
        <div className="flex items-center space-x-12">
          <img
            src={getClubLogo(club)}
            alt={`${club.nombre} logo`}
            className="w-20 h-20 object-cover rounded-full border-4 border-gray-100 shadow-md"
          />
          <div>
            <h3 className="text-lg font-semibold">{club.nombre}</h3>
            <p>Deporte: {club.deporte}</p>
            <p>Rol: {club.rol}</p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ClubCard;
