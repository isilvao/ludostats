'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { InvitacionesAPI } from '../../../../../api/invitacion';
import { ClubAPI } from '../../../../../api/club';
import LoadingScreen from '@/components/LoadingScreen';
import { getClubLogo } from '@/lib/utils';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const params = useParams();
  const code = params
    ? Array.isArray(params.code)
      ? params.code[0]
      : params.code
    : null;
  const [isLoading, setIsLoading] = useState(true);
  const [clubInfo, setClubInfo] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const invitacionesAPI = new InvitacionesAPI();
  const clubAPI = new ClubAPI();

  useEffect(() => {
    const verificarInvitacion = async (clave: string) => {
      try {
        const invitacion = await invitacionesAPI.verificarInvitacion(clave);
        const club = await clubAPI.obtenerClubPorEquipoId(invitacion.equipo_id);
        setClubInfo({ ...club, rol: invitacion.rol_invitado });
        setIsLoading(false);
      } catch (error) {
        setError(error as string);
        setIsLoading(false);
      }
    };

    if (code) {
      verificarInvitacion(code);
    }
  }, [code]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <main className="py-6 px-6 items-center max-w-7xl mx-auto flex flex-col justify-center sm:px-6 lg:px-8">
      {error ? (
        <p className="text-red text-lg font-medium">Información incorrecta</p>
      ) : (
        <div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Unirse a un equipo
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Estás a punto de unirte a un equipo en LudoStats.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <img
                src={getClubLogo(clubInfo)}
                alt={`${clubInfo.nombre} logo`}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-md"
              />

              <h1 className="text-2xl font-bold text-gray-800 mt-4">
                {clubInfo.nombre}
              </h1>

              <div className="bg-blue text-black px-4 py-2 rounded-full text-sm font-semibold">
                {clubInfo.deporte}
              </div>
            </div>
            <div>{children}</div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            ¿Necesitas ayuda?{' '}
            <a
              href="#"
              className="text-blue underline hover:text-blue/80 transition"
            >
              Contáctanos.
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
