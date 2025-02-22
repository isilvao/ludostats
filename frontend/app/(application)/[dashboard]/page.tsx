'use client';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { ChartInit } from '@/components/ChartInit';
import { useEquipoClub } from '@/hooks/useEquipoClub';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { clubData } = useEquipoClub();
  console.log(clubData);
  const selectionType = localStorage.getItem('selectionType');
  const isTeam = selectionType === 'equipo';

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <h2 className="text-2xl font-semibold mt-4 text-foreground">
          Loading...
        </h2>
        <p className="text-muted-foreground mt-2">
          Please wait while we fetch your data.
        </p>
      </div>
    );
  }

  const year = new Date(clubData.createdAt).getFullYear();
  return (
    <>
      <div className=" bg-gray-100">
        {/* Título principal */}
        <div className="mb-3">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Consulta las noticias de tu equipo</p>
        </div>

        {/* Contenedor principal en grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda (principal) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tarjeta de información del equipo */}
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-semibold mb-4">{clubData.nombre}</h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-medium">Deporte:</span>{' '}
                  {selectionType === 'equipo'
                    ? clubData.club.deporte
                    : clubData.deporte}
                </p>
                <p>
                  <span className="font-medium">País:</span> Colombia
                </p>
                <p>
                  <span className="font-medium">Año de integración:</span>{' '}
                  {year}
                </p>
                <p>
                  <span className="font-medium">Jugadores:</span> 3
                </p>
              </div>
            </div>

            {/* Sección de eventos (grid con dos columnas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Último evento */}
              <div className="bg-white rounded shadow p-6">
                <h3 className="font-semibold mb-2">Último evento</h3>
                <p className="text-gray-500">Ningún evento pasado</p>
                <button className="mt-2 text-blue-600 hover:underline">
                  Ver calendario
                </button>
              </div>

              {/* Próximo evento */}
              <div className="bg-white rounded shadow p-6">
                <h3 className="font-semibold mb-2">Próximo evento</h3>
                <p className="text-gray-500">Ningún evento próximo</p>
                <button className="mt-2 text-blue-600 hover:underline">
                  Ver calendario
                </button>
              </div>
            </div>

            {/* Últimos mensajes */}
            <div className="bg-white rounded shadow p-6">
              <h3 className="font-semibold mb-2">Últimos mensajes</h3>
              <p className="text-gray-500">No hay mensajes recientes</p>
            </div>
          </div>

          <ChartInit />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
