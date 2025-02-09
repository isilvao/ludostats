'use client';

import React, { useState, useEffect } from "react";
import { ClubAPI } from "@/api/club";
import { tipoEstadisticasAPI } from "@/api/tipoEstadisticas";
import { useAuth } from "@/hooks";

interface TipoEstadistica {
  tipoEstadistica_id: number;
  nombre: string;
  descripcion: string;
}

const Statistics: React.FC = () => {
  const { accessToken } = useAuth(); // ✅ Obtiene el token directamente
  const [idClub, setIdClub] = useState<string | null>(null);
  const [tipoEstadisticaData, setTipoEstadisticaData] = useState<TipoEstadistica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [editedData, setEditedData] = useState<TipoEstadistica | null>(null);

  // 🔹 1. Obtener `id_club` al montar el componente
  useEffect(() => {
    const fetchClub = async () => {
      if (!accessToken) return;

      try {
        const api = new ClubAPI();
        const clubes = await api.buscarMisClubes(accessToken);

        if (clubes.length > 0) {
          setIdClub(clubes[0].id); // 🔹 Tomamos el primer club del usuario
        } else {
          console.warn("El usuario no tiene clubes asociados.");
        }
      } catch (error) {
        console.error("Error obteniendo el club:", error);
      }
    };

    fetchClub();
  }, [accessToken]);

  // 🔹 2. Obtener estadísticas cuando `idClub` esté disponible
  useEffect(() => {
    const fetchTipoEstadisticas = async () => {
      if (!idClub || !accessToken) return;

      try {
        const api = new tipoEstadisticasAPI();
        const data = await api.getTipoEstadistica(idClub, accessToken);
        setTipoEstadisticaData(data);
      } catch (error) {
        console.error("Error al obtener los tipos de estadísticas:", error);
        setError("Error al obtener los datos de tipos de estadísticas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTipoEstadisticas();
  }, [idClub, accessToken]);

  // 🔹 3. Función para editar
  const handleEdit = (tipoEstadistica: TipoEstadistica) => {
    setEditing(tipoEstadistica.tipoEstadistica_id);
    setEditedData({ ...tipoEstadistica });
  };

  const handleSaveEdit = async () => {
    if (!editedData || !accessToken || !idClub) return;
    try {
      const api = new tipoEstadisticasAPI();
      await api.updateTipoEstadistica(editedData, accessToken, idClub);
      setTipoEstadisticaData(prevData =>
        prevData.map(item =>
          item.tipoEstadistica_id === editedData.tipoEstadistica_id ? editedData : item
        )
      );
      setEditing(null);
      setEditedData(null);
    } catch (error) {
      console.error("Error al actualizar la estadística:", error);
    }
  };

  // 🔹 4. Función para eliminar
  const handleDelete = async (id: number) => {
    if (!accessToken || !idClub) return;
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta estadística?");
    if (!confirmDelete) return;
    try {
      const api = new tipoEstadisticasAPI();
      await api.deleteTipoEstadistica({ id }, accessToken, idClub);
      setTipoEstadisticaData(prevData => prevData.filter(item => item.tipoEstadistica_id !== id));
    } catch (error) {
      console.error("Error al eliminar la estadística:", error);
    }
  };

  // 🔹 5. Función para crear
  const handleCreate = () => {
    setCreating(true);
    setEditedData({ tipoEstadistica_id: 0, nombre: "", descripcion: "" });
  };

  const handleSaveCreate = async () => {
    if (!editedData || !accessToken || !idClub) return;
    try {
      const api = new tipoEstadisticasAPI();
      const newEntry = await api.createTipoEstadistica(editedData, accessToken, idClub);
      setTipoEstadisticaData([...tipoEstadisticaData, newEntry]);
      setCreating(false);
      setEditedData(null);
    } catch (error) {
      console.error("Error al crear la estadística:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <p className="text-center">Componente Statistics montado correctamente</p>

      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Tipos de Estadísticas</h1>
        <p className="text-sm text-gray-500">ID del Club: {idClub || "Cargando..."}</p>

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
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(tipoEstadistica)}>Editar</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(tipoEstadistica.tipoEstadistica_id)}>Eliminar</button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No hay tipos de estadísticas disponibles.</p>
            )}
          </div>
        )}

        <button className="bg-[rgb(76,175,79)] text-white px-4 py-2 rounded mt-4" onClick={handleCreate}>Agregar Tarjeta</button>
      </section>
    </div>
  );
};

export default Statistics;
