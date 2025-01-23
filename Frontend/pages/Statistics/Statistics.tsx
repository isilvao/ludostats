'use client';

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks"; // Importar el hook de autenticación

const Statistics: React.FC = () => {
  const { usuario } = useAuth();
  const router = useRouter();
  const [tipoEstadisticaData, setTipoEstadisticaData] = useState([]);

  // Simulación de una API para datos iniciales (reemplazar con fetch hacia el backend)
  const fetchTipoEstadistica = async () => {
    const data = [
      { tipoEstadistica_id: 1, nombre: "Salto alto", descripcion: "Se mide el salto alto en centímetros", unidades: "cm" },
      { tipoEstadistica_id: 2, nombre: "Velocidad", descripcion: "Se mide la velocidad en metros por segundo", unidades: "m/s" },
      { tipoEstadistica_id: 3, nombre: "Resistencia", descripcion: "Se mide la resistencia en minutos", unidades: "min" },
    ];
    setTipoEstadisticaData(data);
  };

  useEffect(() => {
    fetchTipoEstadistica();
  }, []);

  const handleCardClick = (tipoEstadisticaId: number) => {
    router.push(`/estadisticas/${tipoEstadisticaId}`);
  };

  if (usuario?.rol !== "admin") {
    return <div>No tienes permiso para acceder a esta página</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Header />

      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Tipos de Estadísticas</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tipoEstadisticaData.map((tipo) => (
            <div
              key={tipo.tipoEstadistica_id}
              className="p-4 border rounded shadow hover:shadow-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
            >
              <h2 className="text-xl font-semibold mb-2 text-center">{tipo.nombre}</h2>
              <p className="text-gray-600 text-center mb-4">{tipo.descripcion}</p>
              <div className="flex justify-center">
                <button
                  onClick={() => handleCardClick(tipo.tipoEstadistica_id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Entrar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Statistics;
