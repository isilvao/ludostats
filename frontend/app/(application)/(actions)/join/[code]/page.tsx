'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { InvitacionesAPI } from '../../../../../api/invitacion';
import { ClubAPI } from '../../../../../api/club';
import { UsuariosEquipos } from '../../../../../api//usuariosEquipos';
import { useAuth } from '../../../../../hooks/useAuth';
import LoadingScreen from '@/components/LoadingScreen';
import { FaCheckCircle } from 'react-icons/fa';
import { getClubLogo } from '@/lib/utils';

const ClubInfoPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const code = params
    ? Array.isArray(params.code)
      ? params.code[0]
      : params.code
    : null;
  const [isLoading, setIsLoading] = useState(true);
  const [clubInfo, setClubInfo] = useState<any>(null);
  const [invitacion, setInvitacion] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isAccepted, setIsAccepted] = useState(false);
  const invitacionesAPI = new InvitacionesAPI();
  const clubAPI = new ClubAPI();
  const usuariosEquiposAPI = new UsuariosEquipos();
  const { user } = useAuth();

  useEffect(() => {
    const verificarInvitacion = async (clave: string) => {
      try {
        const invitacion = await invitacionesAPI.verificarInvitacion(clave);
        setInvitacion(invitacion);
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

  const handleAccept = () => {
    if (user && clubInfo && invitacion) {
      usuariosEquiposAPI.agregarUsuarioEquipo(
        user.id,
        invitacion.equipo_id,
        invitacion.rol_invitado
      );
      setIsAccepted(true);
      setTimeout(() => {
        router.push('/home');
      }, 2000); // Redirige después de 2 segundos
    }
  };

  const handleCancel = () => {
    // Lógica para cancelar la invitación
    router.push('/home');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-[80vh] bg-gray-100 flex items-center justify-center p-4">
      {error ? (
        <p className="text-red text-lg font-medium">Información incorrecta</p>
      ) : isAccepted ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full mx-4 transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col items-center space-y-4 py-12">
            <FaCheckCircle className="text-brand text-8xl mb-4" />
            <p className="text-green-500 text-lg font-medium">
              Invitación aceptada exitosamente
            </p>
          </div>
        </div>
      ) : (
        clubInfo && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full mx-4 transition-all duration-300 hover:shadow-xl">
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

              <div className="flex gap-4 w-full mt-6">
                <button
                  onClick={handleAccept}
                  className="flex-1 bg-brand hover:bg-brand/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Aceptar
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-red hover:bg-red/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ClubInfoPage;
