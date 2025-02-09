'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UsuariosEquipos } from '@/api/usuariosEquipos';
import { InvitacionesAPI } from '@/api/invitacion';
import Link from 'next/link';
import { IoPeople } from 'react-icons/io5';
import { IoPerson } from 'react-icons/io5';
import { FaCheckCircle } from 'react-icons/fa';
import { AiOutlineLoading } from 'react-icons/ai';

const RolePage = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [isAccepted, setIsAccepted] = useState(false);
  const [invitacion, setInvitacion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const invitacionesAPI = new InvitacionesAPI();
  const usuariosEquiposAPI = new UsuariosEquipos();

  const code = params
    ? Array.isArray(params.code)
      ? params.code[0]
      : params.code
    : null;

  useEffect(() => {
    const fetchInvitacion = async () => {
      if (code) {
        const invitacion = await invitacionesAPI.verificarInvitacion(code);
        setInvitacion(invitacion);
      }
    };
    fetchInvitacion();
  }, [code]);

  const handleAccept = async () => {
    setIsLoading(true); // Mostrar ícono de carga
    try {
      if (user && invitacion) {
        await usuariosEquiposAPI.agregarUsuarioEquipo(
          user.id,
          invitacion.equipo_id,
          1
        );
        setIsAccepted(true);
        setTimeout(() => {
          router.push('/home');
        }, 1000); // Redirige después de 2 segundos
      }
    } catch (error) {
      console.error('Error al agregar usuario al equipo:', error);
    } finally {
      setIsLoading(false); // Ocultar ícono de carga
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-7">
        <AiOutlineLoading
          style={{ color: 'green', fontSize: '200px' }}
          className="animate-spin"
        />
      </div>
    );
  }

  return isAccepted ? (
    <div className="flex items-center justify-center mt-7">
      <FaCheckCircle style={{ color: 'green', fontSize: '200px' }} />
    </div>
  ) : (
    // <div>
    //   <Link href={`/join/${code}/parent`}>Continuar</Link>
    //   <button onClick={handleAccept}>Unirse</button>
    // </div>
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h2 className="text-xl font-semibold mt-8 text-[#4D4D4D]">
        Elige tu rol
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
        <div className="flex flex-col items-center p-4 border rounded-lg shadow-md">
          <IoPeople className="w-12 h-12 mb-2 text-[#333232]" />
          <p className="mb-2 text-lg font-semibold">Acudiente</p>
          <p className="text-gray-600 text-center pb-5">
            Eres el acudiente de algun jugador. Puedes ver sus estadísticas y
            mensajes.
          </p>
          <Link
            href={`/join/${code}/parent`}
            className="px-4 py-2 w-full text-white bg-brand rounded hover:bg-brand/90 text-center max-w-32 transition-colors duration-200"
          >
            Continuar
          </Link>
        </div>
        <div className="flex flex-col items-center p-4 border rounded-lg shadow-md">
          <IoPerson className="w-12 h-12 mb-2 text-[#333232]" />
          <p className="mb-2 text-lg font-semibold">Deportista</p>
          <p className="text-gray-600 text-center pb-5">
            Eres un jugador de este qequipo. Puedes ver tus estadísticas y
            mensajes.
          </p>
          <button
            className="px-4 py-2 w-full text-white bg-brand rounded hover:bg-brand/90 max-w-32 transition-colors duration-200"
            onClick={handleAccept}
          >
            Unirse
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolePage;
