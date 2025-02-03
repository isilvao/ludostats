'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UsuariosEquipos } from '@/api/usuariosEquipos';
import { InvitacionesAPI } from '@/api/invitacion';
import Link from 'next/link';

const RolePage = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [isAccepted, setIsAccepted] = useState(false);
  const [invitacion, setInvitacion] = useState<any>(null);
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

  const handleAccept = () => {
    if (user && invitacion) {
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

  return isAccepted ? (
    <div>
      <p>Has aceptado la invitación</p>
    </div>
  ) : (
    <div>
      <Link href={`/join/${code}/parent`}>Continuar</Link>
      <button onClick={handleAccept}>Unirse</button>
    </div>
  );
};

export default RolePage;
