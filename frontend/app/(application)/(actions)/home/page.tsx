'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaShieldAlt, FaHandshake } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { EquipoAPI } from '@/api/equipo';
import { ClubAPI } from '@/api/club';
import { StripeAPI } from '@/api/stripe';
import LoadingScreen from '@/components/LoadingScreen';
import { User } from '@/api/user';
import CardClub from '@/components/CardClub';
import CardTeam from '@/components/CardTeam';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

// Interfaces para cada tipo (puedes modificarlas según tu API)
interface Equipo {
  id: string;
  //Equipo: {
  nombre: string;
  logo?: string;
  rol: string;
  club: {
    nombre: string;
    deporte: string;
  };
  //};
}

interface Club {
  id: string;
  nombre: string;
  deporte: string;
  logo?: string;
  rol: string;
}

interface Hijo {
  id: string;
  nombre: string;
}

interface HijoConEquiposYClubes {
  hijo: Hijo;
  equipos: Equipo[];
  clubes: Club[];
}

type Tab = 'equipos' | 'clubes' | 'hijos';

const Page: React.FC = () => {
  const { user, accessToken } = useAuth();

  // Estados para cada categoría
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [clubes, setClubes] = useState<Club[]>([]);
  const [equiposhijo, setEquiposhijo] = useState<HijoConEquiposYClubes[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('equipos');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipoAPI = new EquipoAPI();
        const clubAPI = new ClubAPI();
        const stripeAPI = new StripeAPI();
        const userhijo = new User();
        const equiposData = await equipoAPI.obtenerMisEquipos(user.id);
        setEquipos(equiposData);
        const clubesData = await clubAPI.buscarMisClubes(user.id);
        setClubes(clubesData);

        const paymentSuccessful = await stripeAPI.isPaymentSuccessful();

        console.log('Payment successful:', paymentSuccessful);

        if (paymentSuccessful) {
          toast.success('Pago realizado con éxito', {
            style: {
              background: '#4CAF50', // Fondo verde
              color: '#FFFFFF', // Texto blanco
            },
          });
        }

        if (!paymentSuccessful) {
          toast.error('Pago fallido', {
            style: {
              background: '#F44336', // Fondo rojo
              color: '#FFFFFF', // Texto blanco
            },
          });
        }

        const hijos = await userhijo.obtenerMisHijos(accessToken);
        const equiposhijoData = await Promise.all(
          hijos.map(async (hijo: Hijo) => {
            const equipos = await equipoAPI.obtenerMisEquipos(hijo.id);
            return { hijo, equipos };
          })
        );
        const clubeshijoData = await Promise.all(
          hijos.map(async (hijo: Hijo) => {
            const clubes = await clubAPI.buscarMisClubes(hijo.id);
            return { hijo, clubes };
          })
        );
        const combinedData = hijos.map((hijo: Hijo, index: number) => ({
          hijo,
          equipos: equiposhijoData[index].equipos,
          clubes: clubeshijoData[index].clubes,
        }));
        setEquiposhijo(combinedData);
      } catch (error) {
        console.error('Error al obtener la información:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, accessToken]);

  const handleRemoveTeam = (equipoId: string) => {
    setEquipos((prevEquipos) =>
      prevEquipos.filter((equipo) => equipo.id !== equipoId)
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // Si el usuario no tiene ningún equipo, club ni hijo, mostramos las tarjetas de "Crear" y "Unirse"
  const noTieneNinguno =
    equipos.length === 0 && clubes.length === 0 && equiposhijo.length === 0;

  if (noTieneNinguno) {
    return (
      <section className="py-6 px-6 items-center max-w-7xl mx-auto">
        <Toaster />
        <div className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 px-4 sm:px-6 lg:px-10 max-w-xl mx-auto">
            <h1 className="subtitle-2 sm:subtitle-1 text-[#4D4D4D]">
              Mis equipos y clubes
            </h1>
          </div>
          <div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                No tienes un equipo todavía.
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Para usar LudoStats, necesitas ser parte de un equipo o club.
              </p>
              <div className="max-w-7xl mx-auto flex justify-around">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 xl:gap-24">
                  <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center space-y-4 max-w-xs">
                    <div className="flex justify-center mb-2">
                      <div className="bg-gray-200 rounded-full p-4">
                        <FaShieldAlt className="text-black text-2xl" />
                      </div>
                    </div>
                    <h3 className="subtitle-2 text-[#4D4D4D]">Club</h3>
                    <p className="body-2 text-[#717171] flex-grow">
                      Administra varios grupos, o toda tu asociación, como
                      gerente.
                    </p>
                    <Link
                      href={'/create-club'}
                      className="w-full bg-brand text-white py-2 rounded-lg hover:bg-brand/80 transition mt-auto"
                    >
                      Crear un club
                    </Link>
                  </div>
                  <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center space-y-4 max-w-xs">
                    <div className="flex justify-center mb-2">
                      <div className="bg-gray-200 rounded-full p-4">
                        <FaHandshake className="text-black text-2xl" />
                      </div>
                    </div>
                    <h3 className="subtitle-2 text-[#4D4D4D]">
                      Miembro (o Padre)
                    </h3>
                    <p className="body-2 text-[#717171] flex-grow">
                      Administra tu vida deportiva, o la de tu hijo.
                    </p>
                    <Link
                      href={'/join'}
                      className="w-full bg-brand text-white py-2 rounded-lg hover:bg-brand/80 transition mt-auto"
                    >
                      Unirse a un equipo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Función para renderizar el contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'equipos':
        return (
          <div>
            {equipos.length === 0 ? (
              <p className="text-center text-gray-600">
                No tienes ningún equipo asignado.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {equipos.map((equipo) => (
                  <CardTeam
                    key={equipo.id}
                    equipo={equipo}
                    onRemoveTeam={handleRemoveTeam}
                    userId={user.id}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case 'clubes':
        return (
          <div>
            {clubes.length === 0 ? (
              <p className="text-center text-gray-600">
                No tienes ningún club asignado.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {clubes.map((club) => (
                  <CardClub key={club.id} club={club} userId={user.id} />
                ))}
              </div>
            )}
          </div>
        );
      case 'hijos':
        return (
          <div>
            {equiposhijo.length === 0 ? (
              <p className="text-center text-gray-600">
                No tienes ningún hijo registrado.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {equiposhijo.map(({ hijo, equipos, clubes }) => (
                  <React.Fragment key={hijo.id}>
                    <h2 className="text-xl font-semibold text-gray-700 mb-3 col-span-full">
                      {hijo.nombre}
                    </h2>
                    {equipos.map((equipo) => (
                      <CardTeam
                        key={equipo.id}
                        equipo={equipo}
                        onRemoveTeam={handleRemoveTeam}
                        userId={hijo.id}
                      />
                    ))}
                    {clubes.map((club) => (
                      <CardClub key={club.id} club={club} userId={hijo.id} />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-6 px-6 items-center max-w-7xl mx-auto">
      <Toaster />
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 px-4 sm:px-6 lg:px-10 max-w-xl mx-auto">
          <h1 className="subtitle-2 sm:subtitle-1 text-[#4D4D4D]">
            Mis equipos y clubes
          </h1>
        </div>

        {/* Pestañas */}
        <div className="mb-8">
          <nav className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('equipos')}
                className={`px-4 py-2 font-medium rounded-lg transition ${
                  activeTab === 'equipos'
                    ? 'bg-brand text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Equipos
              </button>
              <button
                onClick={() => setActiveTab('clubes')}
                className={`px-4 py-2 font-medium rounded-lg transition ${
                  activeTab === 'clubes'
                    ? 'bg-brand text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Clubes
              </button>
              <button
                onClick={() => setActiveTab('hijos')}
                className={`px-4 py-2 font-medium rounded-lg transition ${
                  activeTab === 'hijos'
                    ? 'bg-brand text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Hijos
              </button>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/join"
                className="px-4 py-2 font-medium rounded-lg transition bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Unirse a un equipo
              </Link>
              {activeTab === 'clubes' && (
                <Link
                  href="/create-club"
                  className="px-4 py-2 font-medium rounded-lg transition bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Crear un club
                </Link>
              )}
              {activeTab === 'equipos' && (
                <Link
                  href="/create-team"
                  className="px-4 py-2 font-medium rounded-lg transition bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Crear un equipo
                </Link>
              )}
            </div>
          </nav>
        </div>

        {/* Contenido de la pestaña activa */}
        {renderTabContent()}
      </div>
    </section>
  );
};

export default Page;
