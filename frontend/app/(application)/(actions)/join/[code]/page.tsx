'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { InvitacionesAPI } from '../../../../../api/invitacion';

const ClubInfoPage: React.FC = () => {
  const router = useRouter();
  const { code } = useParams();
  const [clubInfo, setClubInfo] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const invitacionesAPI = new InvitacionesAPI();

  const verificarInvitacion = async (clave: string) => {
    try {
      const result = await invitacionesAPI.verificarInvitacion(clave);
      setError(false);
      console.log('Es correcto');
    } catch (error) {
      console.error('Error fetching club info:', error);
      setError(true);
      console.log('No es correcto');
    }
  };

  useEffect(() => {
    if (code) {
      const codeString = Array.isArray(code) ? code[0] : code;
      verificarInvitacion(codeString);
    }
  }, [code]);

  return <div>{error ? <p>No es correcto</p> : <p>Es correcto</p>}</div>;
};

export default ClubInfoPage;
