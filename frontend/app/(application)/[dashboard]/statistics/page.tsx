'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { tipoEstadisticasAPI } from "@/api/tipoEstadisticas";
import { useAuth } from "@/hooks";

interface TipoEstadistica {
  tipoEstadistica_id: number;
  nombre: string;
  descripcion: string;
}

const Statistics: React.FC = () => {
  const { user } = useAuth();
  console.log("Usuario desde useAuth:", user);
  console.log("Aqui llega");


  const [tipoEstadisticaData, setTipoEstadisticaData] = useState<TipoEstadistica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [editedData, setEditedData] = useState<TipoEstadistica | null>(null);

 


  useEffect(() => {
    if (!user || !user.accessToken || !user.id_club) {
      console.warn("user no disponible, esperando datos...");
      return;
    }
    console.log("AccessToken:", user?.accessToken);
    console.log("ID Club:", user?.id_club);
    const fetchTipoEstadisticas = async () => {
      try {
        if (!user?.accessToken || !user?.id_club) {
          console.error("Faltan datos de user para la petición");
          setError("No se pudieron obtener los tipos de estadísticas");
          setIsLoading(false);
          return;
        }
        const api = new tipoEstadisticasAPI();
        const data: TipoEstadistica[] = await api.getTipoEstadistica(user.id_club, user.accessToken);
        setTipoEstadisticaData(data);
      } catch (error) {
        console.error("Error al obtener los tipos de estadísticas:", error);
        setError("Error al obtener los datos de tipos de estadísticas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTipoEstadisticas();
  }, [user]);

  const handleEdit = (tipoEstadistica: TipoEstadistica) => {
    setEditing(tipoEstadistica.tipoEstadistica_id);
    setEditedData({ ...tipoEstadistica });
  };

  const handleSaveEdit = async () => {
    if (!editedData) return;
    try {
      const api = new tipoEstadisticasAPI();
      await api.updateTipoEstadistica(editedData, user.accessToken, user.id_club);
      setTipoEstadisticaData(prevData => prevData.map(item => 
        item.tipoEstadistica_id === editedData.tipoEstadistica_id ? editedData : item));
      setEditing(null);
      setEditedData(null);
    } catch (error) {
      console.error("Error al actualizar la estadística:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta estadística?");
    if (!confirmDelete) return;
    try {
      const api = new tipoEstadisticasAPI();
      await api.deleteTipoEstadistica({ id }, user.accessToken, user.id_club);
      setTipoEstadisticaData(prevData => prevData.filter(item => item.tipoEstadistica_id !== id));
    } catch (error) {
      console.error("Error al eliminar la estadística:", error);
    }
  };

  const handleCreate = () => {
    setCreating(true);
    setEditedData({ tipoEstadistica_id: 0, nombre: "", descripcion: "" });
  };

  const handleSaveCreate = async () => {
    if (!editedData) return;
    try {
      const api = new tipoEstadisticasAPI();
      const newEntry = await api.createTipoEstadistica(editedData, user.accessToken, user.id_club);
      setTipoEstadisticaData([...tipoEstadisticaData, newEntry]);
      setCreating(false);
      setEditedData(null);
    } catch (error) {
      console.error("Error al crear la estadística:", error);
    }
  };

  return (
    
    <div className="bg-gray-100 min-h-screen p-6">
       <div>
    <p>Componente Statistics montado correctamente</p>
  </div>
      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Tipos de Estadísticas</h1>
        <p className="text-sm text-gray-500">AccessToken: {user?.accessToken}</p>
        <p className="text-sm text-gray-500">ID Club: {user?.id_club}</p>

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
