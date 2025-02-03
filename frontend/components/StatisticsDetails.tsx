'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const StatisticsDetails: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  const tipoEstadisticaId = query?.tipoEstadisticaId;

  const [estadisticaInfo, setEstadisticaInfo] = useState<any>(null);

  // Simulación de datos falsos para cada tipo de estadística
  const estadisticasFalsas = [
    {
      tipoEstadistica_id: "1",
      nombre: "Salto alto",
      descripcion: "Se mide el salto alto en centímetros",
      unidades: "cm",
      datos: [
        { id: 1, deportista: "Juan Pérez", valor: 85, fecha: "2025-01-01" },
        { id: 2, deportista: "María López", valor: 90, fecha: "2025-01-02" },
      ],
    },
    {
      tipoEstadistica_id: "2",
      nombre: "Velocidad",
      descripcion: "Se mide la velocidad en metros por segundo",
      unidades: "m/s",
      datos: [
        { id: 1, deportista: "Carlos Gómez", valor: 12.5, fecha: "2025-01-01" },
        { id: 2, deportista: "Ana Torres", valor: 11.8, fecha: "2025-01-02" },
      ],
    },
    {
      tipoEstadistica_id: "3",
      nombre: "Resistencia",
      descripcion: "Se mide la resistencia en minutos",
      unidades: "min",
      datos: [
        { id: 1, deportista: "Pedro Ruiz", valor: 45, fecha: "2025-01-01" },
        { id: 2, deportista: "Luisa Méndez", valor: 50, fecha: "2025-01-02" },
      ],
    },
  ];

  useEffect(() => {
    if (tipoEstadisticaId) {
      const estadisticaSeleccionada = estadisticasFalsas.find(
        (e) => e.tipoEstadistica_id === tipoEstadisticaId
      );
      setEstadisticaInfo(estadisticaSeleccionada);
    }
  }, [tipoEstadisticaId]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Header />

      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        {estadisticaInfo ? (
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
          <p className="text-gray-600">Cargando información...</p>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default StatisticsDetails;
