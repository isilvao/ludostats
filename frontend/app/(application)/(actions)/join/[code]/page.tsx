'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const ClubInfoPage: React.FC = () => {
  const router = useRouter();
  const { code } = useParams();
  const [clubInfo, setClubInfo] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // if (code) {
    //   // Fetch club info based on the code
    //   fetch(`/api/clubs/${code}`)
    //     .then((response) => {
    //       if (!response.ok) {
    //         throw new Error('Club not found');
    //       }
    //       return response.json();
    //     })
    //     .then((data) => {
    //       setClubInfo(data);
    //       setError(false);
    //     })
    //     .catch((error) => {
    //       console.error('Error fetching club info:', error);
    //       setError(true);
    //     });
    // } else {
    // Set a default club info for testing
    setClubInfo({
      name: 'Club de Prueba',
      description: 'Este es un club de prueba para ver el diseño.',
      role: 'Miembro',
      members: 10,
      logo: 'https://via.placeholder.com/150',
    });
    // }
  }, [code]);

  if (error) {
    return (
      <div className="error-card">
        <h2>El código no pertenece a ningún club</h2>
        <button onClick={() => router.push('/join')}>Reintentar</button>
      </div>
    );
  }

  if (!clubInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="club-card">
      <img src={clubInfo.logo} alt="Club logo" />
      <h1>{clubInfo.name}</h1>
      <p>{clubInfo.description}</p>
      <p>Rol: {clubInfo.role}</p>
      <p>Members: {clubInfo.members}</p>
      <button
        onClick={() => {
          alert('Aceptar clicked');
        }}
      >
        Aceptar
      </button>
      <button
        onClick={() => {
          alert('Cancelar clicked');
        }}
      >
        Cancelar
      </button>
    </div>
  );
};

export default ClubInfoPage;
