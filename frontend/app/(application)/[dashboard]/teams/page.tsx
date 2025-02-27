'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { EquipoAPI } from '@/api/equipo';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useEquipoClub } from '@/hooks';
import { useRouter } from 'next/navigation';
import { getClubLogo } from '@/lib/utils';

interface Equipo {
  id: string;
  nombre: string;
  descripcion: string;
  telefono?: string;
  nivelPractica: string;
  logo?: string;
  club_id: string;
  createdAt: string;
  updatedAt: string;
}

const CardTeam: React.FC<{ equipo: Equipo; userId: string }> = ({
  equipo,
  userId,
}) => {
  const router = useRouter();

  const handleSelectTeam = () => {
    localStorage.setItem('selectedTeamId', equipo.id);
    localStorage.setItem('selectedTeamName', equipo.nombre.replace(/\s+/g, ''));
    localStorage.setItem('userId', userId);
    localStorage.setItem('selectionType', 'equipo');
    router.push(`/${equipo.nombre.replace(/\s+/g, '')}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center align-middle h-full relative">
      <div className="w-full">
        <div className="flex items-center space-x-8">
          <img
            src={getClubLogo(equipo)}
            alt={`${equipo.nombre} logo`}
            className="w-20 h-20 object-cover rounded-full border-4 border-gray-100 shadow-md"
          />
          <div>
            <h3 className="text-lg font-semibold">{equipo.nombre}</h3>
            <p>Nivel de práctica: {equipo.nivelPractica}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamsPage: React.FC = () => {
  const { user } = useAuth();
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const { clubData, rolClub } = useEquipoClub();

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const clubAPI = new EquipoAPI();
        const equiposData = await clubAPI.obtenerEquiposClub(clubData.id);
        setEquipos(equiposData);
      } catch (error) {
        console.error('Error al obtener los equipos del club:', error);
        toast.error('Error al obtener los equipos del club');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEquipos();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div
            className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-transparent border-brand rounded-full"
            role="status"
          ></div>
          <span className="mt-4 text-brand font-semibold">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="py-6 px-6 items-center max-w-7xl mx-auto">
      <Toaster />
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 px-4 sm:px-6 lg:px-10 max-w-xl mx-auto">
          <h1 className="subtitle-2 sm:subtitle-1 text-[#4D4D4D]">
            Equipos del Club
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {equipos.length === 0 ? (
            <p className="text-center text-gray-600">
              No hay equipos en este club.
            </p>
          ) : (
            equipos.map((equipo) => (
              <CardTeam key={equipo.id} equipo={equipo} userId={user.id} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamsPage;
