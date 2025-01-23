'use client';

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";

const StatisticDetails: React.FC<{ params: { tipoEstadisticaId: string } }> = ({ params }) => {
  const { usuario } = useAuth();
  const router = useRouter();
  const { tipoEstadisticaId } = params;
  const [tipoEstadistica, setTipoEstadistica] = useState(null);
  const [estadisticas, setEstadisticas] = useState([]);
  const [formData, setFormData] = useState({ deportista: "", valor: "", fecha: "" });

  useEffect(() => {
    // Simular API para obtener tipo de estadística y estadísticas relacionadas
    const fetchTipoEstadistica = async () => {
      const mockTipoEstadistica = {
        id: tipoEstadisticaId,
        nombre: "Salto alto",
        descripcion: "Se mide el salto alto en centímetros",
        unidades: "cm",
      };
      setTipoEstadistica(mockTipoEstadistica);
    };

    const fetchEstadisticas = async () => {
      const mockEstadisticas = [
        { id: 1, deportista: "Juan Pérez", equipo: "Mayores", valor: 220, unidades: "cm", fecha: "2025-01-19" },
      ];
      setEstadisticas(mockEstadisticas);
    };

    fetchTipoEstadistica();
    fetchEstadisticas();
  }, [tipoEstadisticaId]);

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.deportista || !formData.valor || !formData.fecha) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    const newEstadistica = {
      id: Date.now(),
      deportista: formData.deportista,
      equipo: "Mayores", // Simulado
      valor: parseInt(formData.valor),
      unidades: tipoEstadistica?.unidades || "",
      fecha: formData.fecha,
    };

    setEstadisticas((prev) => [...prev, newEstadistica]);
    setFormData({ deportista: "", valor: "", fecha: "" });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta estadística?")) {
      setEstadisticas((prev) => prev.filter((estadistica) => estadistica.id !== id));
    }
  };

  if (!tipoEstadistica) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Header />

      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{tipoEstadistica.nombre}</h1>

        <table className="w-full text-left border-collapse mb-6">
          <thead>
            <tr>
              <th className="border-b p-2">Deportista</th>
              <th className="border-b p-2">Equipo</th>
              <th className="border-b p-2">Valor</th>
              <th className="border-b p-2">Unidades</th>
              <th className="border-b p-2">Fecha</th>
              <th className="border-b p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estadisticas.map((estadistica) => (
              <tr key={estadistica.id}>
                <td className="border-b p-2">{estadistica.deportista}</td>
                <td className="border-b p-2">{estadistica.equipo}</td>
                <td className="border-b p-2">{estadistica.valor}</td>
                <td className="border-b p-2">{estadistica.unidades}</td>
                <td className="border-b p-2">{estadistica.fecha}</td>
                <td className="border-b p-2">
                  <button
                    onClick={() => handleDelete(estadistica.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <form onSubmit={handleAddOrUpdate} className="bg-gray-50 p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Agregar Nueva Estadística</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Deportista"
              value={formData.deportista}
              onChange={(e) => setFormData({ ...formData, deportista: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Valor"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Guardar
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default StatisticDetails;
