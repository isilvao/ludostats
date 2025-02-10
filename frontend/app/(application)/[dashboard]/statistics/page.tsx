'use client';

import React, { useState, useEffect } from "react";
import { ClubAPI } from "@/api/club";
import { estadisticaAPI } from "@/api/estadistica";
import { useEquipoClub } from "@/hooks/useEquipoClub";
import { useAuth } from "@/hooks";

interface TipoEstadistica {
  tipoEstadistica_id: number;
  nombre: string;
  descripcion: string;
}

const Statistics: React.FC = () => {
  const { accessToken, user } = useAuth();
  const { clubData, equipoData } = useEquipoClub();
  const [tipoEstadisticaData, setTipoEstadisticaData] = useState<TipoEstadistica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState<TipoEstadistica>({ tipoEstadistica_id: 0, nombre: "", descripcion: "" });
  console.log("Equipo ID", equipoData.id);
  console.log("Club ID", clubData.id);

  // 🔹 Obtener estadísticas según contexto (club o equipo)
  useEffect(() => {
    const fetchTipoEstadisticas = async () => {
      if (!accessToken) return;

      try {
        let data;
        if (clubData?.id) {
          const api = new estadisticaAPI();
          data = await api.getTipoEstadistica(clubData.id, accessToken);
        } else if (equipoData?.id) {
          const api = new estadisticaAPI();
          data = await api.getTipoEstadisticaByTeam(equipoData.id, accessToken);
        }

        setTipoEstadisticaData(data || []);
      } catch (error) {
        console.error("Error al obtener los tipos de estadísticas:", error);
        setError("Error al obtener los datos de tipos de estadísticas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTipoEstadisticas();
  }, [accessToken, clubData, equipoData]);

  // 🔹 Mostrar formulario para agregar tarjeta
  const handleCreate = () => {
    setCreating(true);
    setFormData({ tipoEstadistica_id: 0, nombre: "", descripcion: "" });
  };

  // 🔹 Guardar nueva tarjeta
  const handleSaveCreate = async () => {
    if (!formData.nombre.trim() || !formData.descripcion.trim() || !accessToken) return;

    try {
      if (clubData?.id) {
        const api = new estadisticaAPI();
        const newEntry = await api.createTipoEstadistica(formData, accessToken, clubData.id);
        setTipoEstadisticaData([...tipoEstadisticaData, newEntry]);
      } else if (equipoData?.id) {
        const api = new estadisticaAPI();
        const newEntry = await api.createTipoEstadistica(formData, accessToken, equipoData.id);
        setTipoEstadisticaData([...tipoEstadisticaData, newEntry]);
      }
      setCreating(false);
      setFormData({ tipoEstadistica_id: 0, nombre: "", descripcion: "" });
    } catch (error) {
      console.error("Error al crear la estadística:", error);
    }
  };

  // 🔹 Editar tarjeta existente
  const handleEdit = (tipoEstadistica: TipoEstadistica) => {
    setEditing(tipoEstadistica.tipoEstadistica_id);
    setFormData({ ...tipoEstadistica });
  };

  // 🔹 Guardar cambios en una tarjeta editada
  const handleSaveEdit = async () => {
    if (!formData.nombre.trim() || !formData.descripcion.trim() || !accessToken) return;

    try {
      if (clubData?.id) {
        const api = new estadisticaAPI();
        await api.updateTipoEstadistica(formData, accessToken, clubData.id);
      } else if (equipoData?.id) {
        const api = new estadisticaAPI();
        await api.updateTipoEstadistica(formData, accessToken, equipoData.id);
      }

      setTipoEstadisticaData(prevData =>
        prevData.map(item => (item.tipoEstadistica_id === formData.tipoEstadistica_id ? formData : item))
      );
      setEditing(null);
      setFormData({ tipoEstadistica_id: 0, nombre: "", descripcion: "" });
    } catch (error) {
      console.error("Error al actualizar la estadística:", error);
    }
  };

  // 🔹 Eliminar tarjeta
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta estadística?");
    if (!confirmDelete || !accessToken) return;

    try {
      if (clubData?.id) {
        const api = new estadisticaAPI();
        await api.deleteTipoEstadistica({ id }, accessToken, clubData.id);
      } else if (equipoData?.id) {
        const api = new estadisticaAPI();
        await api.deleteTipoEstadistica({ id }, accessToken, equipoData.id);
      }

      setTipoEstadisticaData(prevData => prevData.filter(item => item.tipoEstadistica_id !== id));
    } catch (error) {
      console.error("Error al eliminar la estadística:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <p className="text-center">Componente Statistics montado correctamente</p>

      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Tipos de Estadísticas</h1>
        <p className="text-sm text-gray-500">
          Contexto: {clubData ? "Club" : equipoData ? "Equipo" : "Ninguno"}
        </p>

        {isLoading ? (
          <p className="text-center text-gray-600">Cargando tipos de estadísticas...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {tipoEstadisticaData.length > 0 ? (
              tipoEstadisticaData.map((tipoEstadistica) => (
                <div key={tipoEstadistica.tipoEstadistica_id} className="p-4 border rounded shadow-lg bg-gray-50">
                  <h2 className="text-xl font-semibold mb-2">{tipoEstadistica.nombre}</h2>
                  <p className="text-gray-600 mb-4">{tipoEstadistica.descripcion}</p>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEdit(tipoEstadistica)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(tipoEstadistica.tipoEstadistica_id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No hay tipos de estadísticas disponibles.</p>
            )}
          </div>
        )}
        <button
          className="px-4 py-2 rounded mt-4 block mx-auto bg-green-600 text-white"
          onClick={handleCreate}
        >
          Agregar Tarjeta
        </button>
      </section>

      {/* 🔹 Formulario Modal para Agregar o Editar Tarjeta */}
      {(creating || editing !== null) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editing !== null ? "Editar Estadística" : "Agregar Nueva Estadística"}
            </h2>

            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              className="border w-full p-2 mb-3"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />

            <label className="block text-sm font-medium">Descripción</label>
            <input
              type="text"
              className="border w-full p-2 mb-3"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            />

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded bg-green-600 text-white"
                onClick={editing !== null ? handleSaveEdit : handleSaveCreate}
              >
                Guardar
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white"
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
