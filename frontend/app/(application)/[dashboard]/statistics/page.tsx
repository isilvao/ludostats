'use client';

import React, { useState, useEffect } from "react";
import { ClubAPI } from "@/api/club";
import { estadisticaAPI } from "@/api/estadistica";
import { useAuth } from "@/hooks";

interface TipoEstadistica {
  tipoEstadistica_id: number;
  nombre: string;
  descripcion: string;
}

const Statistics: React.FC = () => {
  const { accessToken } = useAuth();
  const [idClub, setIdClub] = useState<string | null>(null);
  const [tipoEstadisticaData, setTipoEstadisticaData] = useState<TipoEstadistica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState<TipoEstadistica>({ tipoEstadistica_id: 0, nombre: "", descripcion: "" });

  // 🔹 Obtener `id_club` al montar el componente
  useEffect(() => {
    const fetchClub = async () => {
      if (!accessToken) return;

      try {
        const api = new ClubAPI();
        const clubes = await api.buscarMisClubes(accessToken);

        if (clubes.length > 0) {
          setIdClub(clubes[0].id);
        } else {
          console.warn("El usuario no tiene clubes asociados.");
        }
      } catch (error) {
        console.error("Error obteniendo el club:", error);
      }
    };

    fetchClub();
  }, [accessToken]);

  // 🔹 Obtener estadísticas cuando `idClub` esté disponible
  useEffect(() => {
    const fetchTipoEstadisticas = async () => {
      if (!idClub || !accessToken) return;

      try {
        const api = new estadisticaAPI();
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

  // 🔹 Mostrar formulario para agregar tarjeta
  const handleCreate = () => {
    setCreating(true);
    setFormData({ tipoEstadistica_id: 0, nombre: "", descripcion: "" });
  };

  // 🔹 Guardar nueva tarjeta
  const handleSaveCreate = async () => {
    if (!formData || !accessToken || !idClub) return;

    try {
      const api = new estadisticaAPI();
      const newEntry = await api.createTipoEstadistica(formData, accessToken, idClub);
      setTipoEstadisticaData([...tipoEstadisticaData, newEntry]); // 🔹 Agregar a la lista
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
    if (!formData || !accessToken || !idClub) return;

    try {
      const api = new estadisticaAPI();
      await api.updateTipoEstadistica(formData, accessToken, idClub);
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
    if (!confirmDelete || !accessToken || !idClub) return;

    try {
      const api = new estadisticaAPI();
      await api.deleteTipoEstadistica({ id }, accessToken, idClub);
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
        {/* Botón de "Agregar Tarjeta" con estilos corregidos */}
        <button   className="px-4 py-2 rounded mt-4 block mx-auto"  style={{    color: "rgb(255 255 255)",    backgroundColor: "rgb(76 175 79)",  }}  onClick={handleCreate}>  Agregar Tarjeta</button>
      </section>
      {/* 🔹 Formulario Modal para Agregar o Editar Tarjeta */}
      {(creating || editing !== null) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editing !== null ? "Editar Estadística" : "Agregar Nueva Estadística"}</h2>

            <label className="block text-sm font-medium">Nombre</label>
            <input type="text" className="border w-full p-2 mb-3" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />

            <label className="block text-sm font-medium">Descripción</label>
            <input type="text" className="border w-full p-2 mb-3" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />

            <div className="flex justify-end space-x-2">
              {/* Botón de "Guardar" dentro del modal */}
              <button className="px-4 py-2 rounded" style={{color: "rgb(255 255 255)",  backgroundColor: "rgb(76 175 79)",}}  onClick={handleSaveCreate}>  Guardar</button>
              {/* Botón de "Cancelar" dentro del modal */} 
              <button className="px-4 py-2 rounded ml-2"style={{color: "rgb(255 255 255)",backgroundColor: "rgb(255, 99, 71)", }}  onClick={() => setCreating(false)}>  Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
