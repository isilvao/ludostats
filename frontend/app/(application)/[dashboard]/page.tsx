'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { ChartInit } from '@/components/ChartInit';
import { useEquipoClub } from '@/hooks/useEquipoClub';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'next/navigation';
import { TeamsAPI } from '@/api/teams';
import Link from 'next/link';
import { MdOutlineModeEdit } from 'react-icons/md';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { clubData, rolClub } = useEquipoClub();
  interface Evento {
    fecha_inicio: string;
    titulo: string;
  }

  interface Eventos {
    eventoPasado?: Evento;
    eventoFuturo?: Evento;
    cantidadMiembros: number;
  }

  const [eventos, setEventos] = useState<Eventos | null>(null);
  const selectionType = localStorage.getItem('selectionType');
  const isTeam = selectionType === 'equipo';
  const [isloading, setIsLoading] = useState(true);
  const params = useParams();
  const teamApi = new TeamsAPI();
  const nameTeam = params
    ? Array.isArray(params.dashboard)
      ? params.dashboard[0]
      : params.dashboard
    : null;

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        let eventosData;
        if (isTeam) {
          eventosData = await teamApi.obtenerEventosCercanosPorEquipo(
            clubData.id
          );
        } else {
          eventosData = await teamApi.obtenerEventosCercanosPorClub(
            clubData.id
          );
        }
        setEventos(eventosData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching eventos:', error);
      }
    };

    fetchEventos();
  }, [isTeam, nameTeam, teamApi]);

  if (!clubData || isloading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div
            className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-transparent border-brand rounded-full"
            role="status"
          ></div>
          <span className="mt-4 text-brand font-semibold">Cargando...</span>
        </div>
      </div>
    );
  }

  const year = new Date(clubData.createdAt).getFullYear();
  return (
    <>
      <div className=" bg-gray-100">
        {/* Título principal */}
        <div className="mb-5">
          <h1 className="text-3xl font-bold text-brand2">Dashboard</h1>
          <p className="text-gray-600">Consulta las noticias de tu equipo</p>
        </div>

        {/* Contenedor principal en grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Columna izquierda (principal) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tarjeta de información del equipo */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-brand2">
                  {clubData.nombre}
                </h2>
                {rolClub === ''}
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/${nameTeam}/settings`}
                        className="bg-white border border-gray-300 p-2 rounded hover:bg-gray-200 transition-colors duration-300"
                      >
                        <MdOutlineModeEdit className="text-xl text-gray-400" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      Editar {selectionType === 'equipo' ? 'equipo' : 'club'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p>
                    <span className="font-medium text-brand2">Deporte:</span>{' '}
                    {selectionType === 'equipo'
                      ? clubData.club.deporte
                      : clubData.deporte}
                  </p>
                  <p>
                    <span className="font-medium text-brand2">País:</span>{' '}
                    Colombia
                  </p>
                  <p>
                    <span className="font-medium text-brand2">
                      Año de integración:
                    </span>{' '}
                    {year}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium text-brand2">Jugadores:</span>{' '}
                    {eventos?.cantidadMiembros || 0}
                  </p>
                  <p>
                    <span className="font-medium text-brand2">Teléfono: </span>
                    {clubData.telefono ? clubData.telefono : 'Desconocido'}
                  </p>
                </div>
              </div>
            </div>

            {/* Sección de eventos (grid con dos columnas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Último evento */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-brand2 text-xl">
                  Último evento
                </h3>
                <p className="text-gray-500">
                  {eventos?.eventoPasado?.fecha_inicio
                    ? new Date(
                        eventos.eventoPasado.fecha_inicio
                      ).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })
                    : 'fecha'}
                </p>
                <p className="text-gray-600 mt-6 font-medium">
                  {eventos?.eventoPasado?.titulo ||
                    'No se han realizado eventos'}
                </p>
                <Separator className="mt-8" />
                <div className="flex justify-end mt-3">
                  <Link
                    href={`/${nameTeam}/calendar`}
                    className=" text-[#726868] hover:text-[#9d9090]/90"
                  >
                    Ver calendario
                  </Link>
                </div>
              </div>

              {/* Próximo evento */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-brand2 text-xl">
                  Próximo evento
                </h3>
                <p className="text-gray-500">
                  {eventos?.eventoFuturo?.fecha_inicio
                    ? new Date(
                        eventos.eventoFuturo.fecha_inicio
                      ).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })
                    : 'No hay fecha'}
                </p>
                <p className="text-gray-600 mt-6 font-medium">
                  {eventos?.eventoFuturo?.titulo || 'No hay eventos próximos'}
                </p>
                <Separator className="mt-8" />
                <div className="flex justify-end mt-3">
                  <Link
                    href={`/${nameTeam}/calendar`}
                    className=" text-[#726868] hover:text-[#9d9090]/90"
                  >
                    Ver calendario
                  </Link>
                </div>
              </div>
            </div>

            {/* Últimos mensajes */}
            {/* <div className="bg-white rounded shadow p-6">
              <h3 className="font-semibold mb-2">Últimos mensajes</h3>
              <p className="text-gray-500">No hay mensajes recientes</p>
            </div> */}
          </div>
          <ChartInit />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
