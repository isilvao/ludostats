// frontend/components/EquipoCard.tsx
'use client';
import React, { use, useState } from 'react';
import { getClubLogo } from '@/lib/utils';
import Link from 'next/link';
import { UsuariosEquipos } from '@/api/usuariosEquipos';
import { useAuth } from '@/hooks';

interface EquipoCardProps {
  equipo: {
    id: string;
    nombre: string;
    logo?: string;
    club: {
      nombre: string;
      deporte: string;
    };
  };
  onRemoveTeam: (teamId: string) => void;
}

const EquipoCard: React.FC<EquipoCardProps> = ({ equipo, onRemoveTeam }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const usuariosEquipos = new UsuariosEquipos();
  const { user } = useAuth();

  const handleLeaveTeam = () => {
    setShowConfirmation(false);
    console.log(user.id, equipo.id);
    try {
      usuariosEquipos.eliminarUsuarioEquipo(user.id, equipo.id);
      onRemoveTeam(equipo.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center align-middle h-full relative">
      {/* Menú de tres puntos */}
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
            Abandonar equipo
          </button>
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg max-w-sm">
            <h3 className="text-lg font-semibold mb-4">
              ¿Estás seguro de querer abandonar el equipo?
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
                onClick={handleLeaveTeam}
                className="px-4 py-2 bg-red text-white hover:bg-red/90 rounded"
              >
                Sí, abandonar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <Link href={`/${equipo.nombre.replace(/\s+/g, '')}`} className="w-full">
        <div className="flex items-center space-x-12">
          <img
            src={getClubLogo(equipo)}
            alt={`${equipo.nombre} logo`}
            className="w-20 h-20 object-cover rounded-full border-4 border-gray-100 shadow-md"
          />
          <div>
            <h3 className="text-lg font-semibold">{equipo.nombre}</h3>
            <p>Club: {equipo.club.nombre}</p>
            <p>Deporte: {equipo.club.deporte}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EquipoCard;
