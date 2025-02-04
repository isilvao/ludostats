'use client';

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tipoEstadisticasAPI } from "@/api/tipoEstadisticas";
import { useAuth } from "@/hooks";

const StatisticsDetails: React.FC = () => {
  const { usuario } = useAuth();
  const { tipoEstadisticaId } = useParams();
  const [estadisticaInfo, setEstadisticaInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTipoEstadistica = async () => {
      try {
        if (!usuario?.accessToken || !tipoEstadisticaId) {
          console.error("Faltan datos para la petición");
          setError("No se pudieron obtener las estadísticas");
          setIsLoading(false);
          return;
        }
        const api = new tipoEstadisticasAPI();
        const data = await api.getTipoEstadistica("ID_CLUB", usuario.accessToken);
        const estadisticaSeleccionada = data.find(
          (e: any) => e.tipoEstadistica_id === tipoEstadisticaId
        );
        setEstadisticaInfo(estadisticaSeleccionada);
      } catch (error) {
        console.error("Error al obtener el tipo de estadística:", error);
        setError("Error al obtener los datos de estadísticas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTipoEstadistica();
  }, [usuario, tipoEstadisticaId]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Header />

      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        {isLoading ? (
          <p className="text-center text-gray-600">Cargando información...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : estadisticaInfo ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {estadisticaInfo.nombre}
            </h1>
            <p className="text-gray-600 mb-4">{estadisticaInfo.descripcion}</p>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2">Deportista</th>
                  <th className="border-b p-2">Valor ({estadisticaInfo.unidades})</th>
                  <th className="border-b p-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {estadisticaInfo.datos.map((dato: any) => (
                  <tr key={dato.id}>
                    <td className="border-b p-2">{dato.deportista}</td>
                    <td className="border-b p-2">{dato.valor}</td>
                    <td className="border-b p-2">{dato.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="text-gray-600">No se encontró información.</p>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default StatisticsDetails;