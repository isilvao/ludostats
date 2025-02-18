'use client';
import React, { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useEquipoClub } from '@/hooks/useEquipoClub';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { TeamsAPI } from '@/api/teams';
import HeaderMovile from '@/components/HeaderMovile';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    equipoData,
    clubData,
    setEquipoSeleccionado,
    resetDatos,
    setClubSeleccionado,
  } = useEquipoClub();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const teamApi = new TeamsAPI();

  useEffect(() => {
    const fetchEquipoData = async () => {
      try {
        const selectionType = localStorage.getItem('selectionType');
        const TeamId = localStorage.getItem('selectedTeamId');
        const storedTeamName = localStorage.getItem('selectedTeamName');
        const currentTeamName = pathname.split('/')[1];
        const userId = localStorage.getItem('userId');
        if (selectionType === 'equipo') {
          if (TeamId && storedTeamName === currentTeamName) {
            const result = await teamApi.obtenerEquipoConRol(TeamId, userId);
            setClubSeleccionado(result.equipo, result.rol);
          } else {
            throw new Error('Nombre del equipo no coincide con el almacenado');
          }
        } else if (selectionType === 'club') {
          if (TeamId && storedTeamName === currentTeamName) {
            const result = await teamApi.obtenerClubConRol(TeamId, userId);
            setClubSeleccionado(result.club, result.rol);
          } else {
            throw new Error('Nombre del club no coincide con el almacenado');
          }
        } else {
          throw new Error('Tipo de selección no válido');
        }
      } catch (error) {
        router.push('/home'); // Redirige al usuario a la página de inicio si hay un error
      }
    };

    fetchEquipoData();
  }, [pathname, searchParams]);

  if (!clubData) {
    return <LoadingScreen />;
  }

  return (
    <main className="flex-col md:flex-row md:flex h-[80vh] md:h-[91vh] bg-white">
      <Sidebar />
      <HeaderMovile />
      <section className="flex max-w-full h-full flex-1 flex-col">
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}
