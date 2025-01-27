import Link from 'next/link';
import React from 'react';
import { FaTshirt, FaShieldAlt, FaHandshake } from 'react-icons/fa';

const Page: React.FC = () => {
  const userHasTeamsOrClubs = false; // Simulación para verificar si tiene clubes o equipos
  const userHasChildren = false; // Simulación para mostrar sección de hijos (puedes expandir con datos más adelante)

  return (
    <section className="py-6 px-6 items-center max-w-7xl mx-auto">
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 px-4 sm:px-6 lg:px-10 max-w-xl mx-auto">
          <h1 className="subtitle-2 sm:subtitle-1 text-[#4D4D4D]">
            Mis equipos y clubes
          </h1>
        </div>
        <div>
          {!userHasTeamsOrClubs ? (
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
                      Unirse a un club
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Tus equipos y clubes
              </h2>
              {/* Aquí puedes iterar sobre los equipos o clubes */}
              <p className="text-gray-600">
                Aquí se mostrarán tus equipos y clubes.
              </p>
            </div>
          )}

          {userHasChildren && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Mis hijos
              </h2>
              <p className="text-gray-600">
                La información relacionada con los hijos aparecerá aquí.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;
