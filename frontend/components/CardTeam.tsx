// frontend/components/EquipoCard.tsx
'use client';
import React, { use, useState } from 'react';
import { getClubLogo } from '@/lib/utils';
import { UsuariosEquipos } from '@/api/usuariosEquipos';
import { useRouter } from 'next/navigation';
import { useEquipoClub } from '@/hooks/useEquipoClub';

interface EquipoCardProps {
  equipo: {
    id: string;
    nombre: string;
    logo?: string;
    rol: string;
    club: {
      nombre: string;
      deporte: string;
    };
  };
  onRemoveTeam: (teamId: string) => void;
  userId: string;
}

const EquipoCard: React.FC<EquipoCardProps> = ({
  equipo,
  onRemoveTeam,
  userId,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const usuariosEquipos = new UsuariosEquipos();
  const router = useRouter();
  const { resetDatos } = useEquipoClub();

  const handleLeaveTeam = () => {
    setShowConfirmation(false);
    try {
      usuariosEquipos.eliminarUsuarioEquipo(userId, equipo.id);
      onRemoveTeam(equipo.id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectTeam = async () => {
    try {
      resetDatos();
      localStorage.setItem('selectedTeamId', equipo.id); // Almacena el ID del equipo en localStorage
      localStorage.setItem(
        'selectedTeamName',
        equipo.nombre.replace(/\s+/g, '')
      ); // Almacena el nombre del equipo en localStorage
      localStorage.setItem('userId', userId); // Almacena el ID del usuario en localStorage
      localStorage.setItem('selectionType', 'equipo'); // Almacena el tipo de selección en localStorage
      router.push(`/${equipo.nombre.replace(/\s+/g, '')}`);
    } catch (error) {
      console.error('❌ Error al seleccionar el equipo:', error);
    } finally {
    }
  };

  // const handleSelectTeam = () => {
  //   setEquipoSeleccionado(equipo, null, equipo.club); // Actualizar el contexto con la información del equipo
  // };

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
      <button className="w-full" onClick={handleSelectTeam}>
        <div className="flex items-center space-x-12">
          <img
            src={getClubLogo(equipo)}
            alt={`${equipo.nombre} logo`}
            className="w-20 h-20 object-cover rounded-full border-4 border-gray-100 shadow-md"
          />
          <div>
            <h3 className="text-lg font-semibold">{equipo.nombre}</h3>
            <p>Club: {equipo.club.nombre}</p>
            {/* <p>Deporte: {equipo.club.deporte}</p> */}
            <p>Rol: {equipo.rol}</p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default EquipoCard;
