'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { estadisticaAPI } from "@/api/estadistica";
import { useAuth } from "@/hooks";

// Definir la estructura del objeto de estadística
interface Estadistica {
  estadistica_id: number;
  nombre: string;
  descripcion: string;
  tipoEstadistica_id: number;
}

const Statistics: React.FC = () => {
  const { usuario } = useAuth();
  const [estadisticaData, setEstadisticaData] = useState<Estadistica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        if (!usuario?.accessToken || !usuario?.id_club) {
          console.error("Faltan datos de usuario para la petición");
          setError("No se pudieron obtener las estadísticas");
          setIsLoading(false);
          return;
        }
        const api = new estadisticaAPI();
        const data: Estadistica[] = await api.getAllEstadisticas(usuario.accessToken, usuario.id_club);
        console.log("Datos obtenidos:", data);
        setEstadisticaData(data);
      } catch (error) {
        console.error("Error al obtener las estadísticas:", error);
        setError("Error al obtener los datos de estadísticas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstadisticas();
  }, [usuario]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      

      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Estadísticas Generales</h1>

        {isLoading ? (
          <p className="text-center text-gray-600">Cargando estadísticas...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {estadisticaData.length > 0 ? (
              estadisticaData.map((estadistica) => (
                <div
                  key={estadistica.estadistica_id}
                  className="p-4 border rounded shadow-lg hover:shadow-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all flex flex-col items-center justify-between w-full h-48"
                >
                  <h2 className="text-xl font-semibold mb-2 text-center">{estadistica.nombre || 'Sin nombre'}</h2>
                  <p className="text-gray-600 text-center mb-4">{estadistica.descripcion || 'Sin descripción'}</p>
                  <div className="flex justify-center">
                    <Link href={`/statisticsDetails/${estadistica.tipoEstadistica_id}`}>
                      <button className="bg-[rgb(76,175,79)] text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                        Ver Detalles
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No hay estadísticas disponibles.</p>
            )}
          </div>
        )}
      </section>

     
    </div>
  );
};

export default Statistics;
