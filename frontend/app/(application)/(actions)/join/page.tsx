'use client';

import React, { useState } from 'react';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const JoinClubPage: React.FC = () => {
  const [clubCode, setClubCode] = useState('');
  const router = useRouter();

  const handleJoinClub = () => {
    router.push(`/join/${clubCode}`);
  };

  return (
    <div className="py-6 px-6 items-center max-w-7xl mx-auto flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Unirse a un club
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hay 2 maneras de unirse a tu club en LudoStats, ya sea utilizando el
          código secreto o utilizando el enlace de invitación.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 max-w-3xl w-full">
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-center">
            <FaLock className="mr-2 text-green-500" /> Por código secreto
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            El responsable del club te ha enviado un código secreto para unirte
            al club.
          </p>
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-brand max-w-xs mx-auto">
            <input
              type="text"
              value={clubCode}
              onChange={(e) => setClubCode(e.target.value)}
              placeholder="Introduce el código secreto"
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          <button
            onClick={handleJoinClub}
            className="mt-4 w-full max-w-40 mx-auto bg-brand text-white py-2 rounded-lg hover:bg-brand/90 transition duration-300"
          >
            Validar
          </button>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-center">
            <FaEnvelope className="mr-2 text-blue-500" /> Enlace de invitación
          </h2>
          <p className="text-gray-600 text-sm">
            El responsable del club te ha enviado un enlace de invitación. Por
            favor, haz clic en el enlace para unirse al club
          </p>
        </div>
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
  );
};

export default JoinClubPage;
