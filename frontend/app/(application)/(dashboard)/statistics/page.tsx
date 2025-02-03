'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Statistics: React.FC = () => {
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

  return (
    <div className="bg-gray-100 min-h-screen p-6">
 

      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Tipos de Estadísticas</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tipoEstadisticaData.map((tipo) => (
            <div
              key={tipo.tipoEstadistica_id}
              className="p-4 border rounded shadow-lg hover:shadow-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all flex flex-col items-center justify-between w-full h-48"
            >
              <h2 className="text-xl font-semibold mb-2 text-center">{tipo.nombre}</h2>
              <p className="text-gray-600 text-center mb-4">{tipo.descripcion}</p>
              <div className="flex justify-center">
                <Link href={`/statisticsDetails/${tipo.tipoEstadistica_id}?nombre=${encodeURIComponent(tipo.nombre)}&descripcion=${encodeURIComponent(tipo.descripcion)}`}>
                  <button className="bg-[rgb(76,175,79)] text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                    Ver Detalles
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

     
    </div>
  );
};

export default Statistics;
