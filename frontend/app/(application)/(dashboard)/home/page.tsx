'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
const Home: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        {' '}
        <div className="flex items-center justify-center bg-blue text-white text-xl font-bold h-[300px] w-[70%] mx-auto mt-6 cursor-pointer rounded-md shadow-lg">
          Ver estadísticas
        </div>
        <div className="bg-white mt-10 py-8 px-6 w-[70%] mx-auto rounded-md shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Resumen de suscripción
          </h2>
          <p className="text-gray-600">
            Aquí puedes ver un resumen de tu suscripción activa, incluyendo la
            fecha de renovación, beneficios actuales y más.
          </p>
        </div>
        <div className="bg-white mt-10 py-8 px-6 w-[70%] mx-auto rounded-md shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Información de tu equipo
          </h2>
          <ul className="text-gray-600 space-y-2">
            <li>• Miembro 1: Estadísticas...</li>
            <li>• Miembro 2: Estadísticas...</li>
            <li>• Miembro 3: Estadísticas...</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
