'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks'; // Importar el hook de autenticación

const Statistics: React.FC = () => {
  const { usuario } = useAuth();
  const [tipoEstadisticaData, setTipoEstadisticaData] = useState<
    { tipoEstadistica_id: number; nombre: string; descripcion: string }[]
  >([]);
  const [estadisticaData, setEstadisticaData] = useState<
    {
      estadistica_id: number;
      usuario_id: number;
      tipoEstadistica_id: number;
      fecha: string;
      valor: number;
    }[]
  >([]);

  // Estado para formularios
  const [tipoEstadisticaId, setTipoEstadisticaId] = useState('');
  const [valor, setValor] = useState('');
  const [fecha, setFecha] = useState('');
  const [editingEstadistica, setEditingEstadistica] = useState<number | null>(
    null
  );

  // Simulación de una API para datos iniciales (reemplazar con fetch hacia el backend)
  const fetchTipoEstadistica = async () => {
    const data = [
      {
        tipoEstadistica_id: 1,
        nombre: 'Puntos',
        descripcion: 'Estadísticas de puntos',
      },
      {
        tipoEstadistica_id: 2,
        nombre: 'Rebotes',
        descripcion: 'Estadísticas de rebotes',
      },
    ];
    setTipoEstadisticaData(data);
  };

  const fetchEstadistica = async () => {
    const data = [
      {
        estadistica_id: 1,
        usuario_id: 1,
        tipoEstadistica_id: 1,
        fecha: '2025-01-01',
        valor: 20,
      },
      {
        estadistica_id: 2,
        usuario_id: 2,
        tipoEstadistica_id: 2,
        fecha: '2025-01-02',
        valor: 15,
      },
    ];
    setEstadisticaData(data);
  };

  useEffect(() => {
    fetchTipoEstadistica();
    fetchEstadistica();
  }, []);

  // CRUD para Estadística
  const handleEstadisticaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEstadistica) {
      // Actualizar estadística existente
      setEstadisticaData((prev) =>
        prev.map((estadistica) =>
          estadistica.estadistica_id === editingEstadistica
            ? {
                ...estadistica,
                tipoEstadistica_id: parseInt(tipoEstadisticaId),
                valor: parseInt(valor),
                fecha,
              }
            : estadistica
        )
      );
      setEditingEstadistica(null);
    } else {
      // Agregar nueva estadística
      const newEstadistica = {
        estadistica_id: Date.now(),
        tipoEstadistica_id: parseInt(tipoEstadisticaId),
        usuario_id: 1, // Simular usuario actual (esto debería venir del contexto o auth)
        fecha,
        valor: parseInt(valor),
      };
      setEstadisticaData((prev) => [...prev, newEstadistica]);
    }

    // Limpiar formulario
    setTipoEstadisticaId('');
    setValor('');
    setFecha('');
  };

  const handleDeleteEstadistica = async (id: number) => {
    setEstadisticaData((prev) =>
      prev.filter((estadistica) => estadistica.estadistica_id !== id)
    );
  };

  interface Estadistica {
    estadistica_id: number;
    usuario_id: number;
    tipoEstadistica_id: number;
    fecha: string;
    valor: number;
  }

  interface TipoEstadistica {
    tipoEstadistica_id: number;
    nombre: string;
    descripcion: string;
  }

  const handleEditEstadistica = (estadistica: Estadistica) => {
    setEditingEstadistica(estadistica.estadistica_id);
    setTipoEstadisticaId(estadistica.tipoEstadistica_id.toString());
    setValor(estadistica.valor.toString());
    setFecha(estadistica.fecha);
  };

  // if (usuario?.rol !== 'admin') {
  //   return <div>No tienes permiso para acceder a esta página</div>;
  // }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Gestión de Estadísticas
        </h1>

        {/* Formulario para Estadística */}
        <form onSubmit={handleEstadisticaSubmit} className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Formulario Estadística
          </h2>
          <div className="flex gap-4 mb-2">
            <select
              value={tipoEstadisticaId}
              onChange={(e) => setTipoEstadisticaId(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">Seleccionar Tipo de Estadística</option>
              {tipoEstadisticaData.map((tipo) => (
                <option
                  key={tipo.tipoEstadistica_id}
                  value={tipo.tipoEstadistica_id}
                >
                  {tipo.nombre}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-green text-white px-4 py-2 rounded"
          >
            {editingEstadistica ? 'Actualizar' : 'Agregar'}
          </button>
        </form>

        {/* Tabla Estadística */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">ID</th>
              <th className="border-b p-2">Tipo</th>
              <th className="border-b p-2">Fecha</th>
              <th className="border-b p-2">Valor</th>
              <th className="border-b p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estadisticaData.map((estadistica) => (
              <tr key={estadistica.estadistica_id}>
                <td className="border-b p-2">{estadistica.estadistica_id}</td>
                <td className="border-b p-2">
                  {tipoEstadisticaData.find(
                    (tipo) =>
                      tipo.tipoEstadistica_id === estadistica.tipoEstadistica_id
                  )?.nombre || 'Desconocido'}
                </td>
                <td className="border-b p-2">{estadistica.fecha}</td>
                <td className="border-b p-2">{estadistica.valor}</td>
                <td className="border-b p-2">
                  <button
                    onClick={() => handleEditEstadistica(estadistica)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteEstadistica(estadistica.estadistica_id)
                    }
                    className="bg-red text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Statistics;
