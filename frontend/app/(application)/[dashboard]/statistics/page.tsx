'use client';
import React, { useEffect, useState } from 'react';
import { estadisticaAPI } from '@/api/estadistica';
import { useAuth } from '@/hooks';
import { useEquipoClub } from '@/hooks';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Toaster, toast } from 'sonner';
import { useParams } from 'next/navigation';
import { IoIosAddCircle, IoIosStats } from 'react-icons/io';
import { FaQuestion } from 'react-icons/fa';

interface TipoEstadistica {
  id: string;
  nombre: string;
  descripcion: string;
}

const EstadisticaCard = ({
  tipoEstadistica,
  onEdit,
  onDelete,
  nameTeam,
  isTeam,
}: {
  tipoEstadistica: TipoEstadistica;
  onEdit: (tipoEstadistica: TipoEstadistica) => void;
  onDelete: (id: string) => void;
  nameTeam: string | null;
  isTeam: boolean;
}) => (
  <div className="estadistica-card bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center gap-4 h-full cursor-pointer">
    <Link
      href={`/${nameTeam}/statistics/${tipoEstadistica.id}`}
      passHref
      className="w-full h-full"
    >
      <div className="w-full h-full flex flex-col items-center text-center gap-4">
        <h3 className="text-xl font-semibold text-brand2">
          {tipoEstadistica.nombre}
        </h3>
        <p className="text-gray-600">{tipoEstadistica.descripcion}</p>
      </div>
    </Link>
    {!isTeam && (
      <div className="flex space-x-4 mt-auto">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(tipoEstadistica);
          }}
        >
          Editar
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="bg-red text-white hover:bg-red/90"
              onClick={(e) => e.stopPropagation()}
            >
              Eliminar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que deseas eliminar esta estadística? Esta
                acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(tipoEstadistica.id)}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )}
  </div>
);

const EstadisticasPage = () => {
  const [estadisticas, setEstadisticas] = useState<TipoEstadistica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { accessToken } = useAuth();
  const { clubData } = useEquipoClub();
  const [newEstadistica, setNewEstadistica] = useState({
    nombre: '',
    descripcion: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editEstadistica, setEditEstadistica] =
    useState<TipoEstadistica | null>(null);
  const selectionType = localStorage.getItem('selectionType');
  const isTeam = selectionType === 'equipo';
  const params = useParams();
  const nameTeam: string | null =
    params && params.dashboard
      ? Array.isArray(params.dashboard)
        ? params.dashboard[0]
        : params.dashboard
      : null;

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const api = new estadisticaAPI();
        let result;
        if (isTeam) {
          result = await api.getTipoEstadisticaByTeam(clubData.id, accessToken);
        } else {
          result = await api.getTipoEstadistica(clubData.id, accessToken);
        }
        setEstadisticas(result);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, [accessToken, clubData.id, isTeam]);

  const handleCreateEstadistica = async () => {
    try {
      const api = new estadisticaAPI();
      const result = await api.createTipoEstadistica(
        newEstadistica,
        clubData.id
      );
      const nuevaEstadistica = {
        id: result.id,
        nombre: newEstadistica.nombre,
        descripcion: newEstadistica.descripcion,
      };

      setEstadisticas((prevEstadisticas) => [
        ...prevEstadisticas,
        nuevaEstadistica,
      ]);
      setNewEstadistica({ nombre: '', descripcion: '' });
      setIsDialogOpen(false);
      toast.success('Estadística creada con éxito', {
        style: {
          background: '#4CAF50', // Fondo verde
          color: '#FFFFFF', // Texto blanco
        },
      });
    } catch (error: any) {
      setError(error);
      toast.error('Error al crear la estadística');
    }
  };

  const handleEditEstadistica = async () => {
    if (!editEstadistica) return;
    try {
      const api = new estadisticaAPI();
      const result = await api.updateTipoEstadistica(editEstadistica);
      setEstadisticas((prevEstadisticas) =>
        prevEstadisticas.map((estadistica) =>
          estadistica.id === editEstadistica.id ? editEstadistica : estadistica
        )
      );
      setEditEstadistica(null);
      setIsEditDialogOpen(false);
      toast.success('Estadística actualizada con éxito', {
        style: {
          background: '#4CAF50', // Fondo verde
          color: '#FFFFFF', // Texto blanco
        },
      });
    } catch (error: any) {
      setError(error);
      toast.error('Error al actualizar la estadística');
    }
  };

  const handleDeleteEstadistica = async (id: string) => {
    try {
      const api = new estadisticaAPI();
      await api.deleteTipoEstadistica(id);
      setEstadisticas((prevEstadisticas) =>
        prevEstadisticas.filter((estadistica) => estadistica.id !== id)
      );
      toast.success('Estadística eliminada con éxito', {
        style: {
          background: '#4CAF50', // Fondo verde
          color: '#FFFFFF', // Texto blanco
        },
      });
    } catch (error: any) {
      setError(error);
      toast.error('Error al eliminar la estadística');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div
            className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-transparent border-brand rounded-full"
            role="status"
          ></div>
          <span className="mt-4 text-brand font-semibold">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 items-center max-w-7xl mx-auto">
      <Toaster />
      <div className="flex items-center py-4 justify-between mb-6">
        <h1 className="text-3xl font-bold text-brand2">Tipos de Estadística</h1>
        {!isTeam && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="bg-brand hover:bg-brand/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-w-[10rem] flex flex-row space-x-3 items-center">
                <IoIosAddCircle className="text-lg" />
                <span>Agregar Nueva</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Crear nueva estadística</DialogTitle>
                <DialogDescription>
                  Ingresa los detalles de la nueva estadística. Haz clic en
                  guardar cuando termines.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre" className="text-right">
                    Nombre *
                  </Label>
                  <Input
                    id="nombre"
                    value={newEstadistica.nombre}
                    onChange={(e) =>
                      setNewEstadistica({
                        ...newEstadistica,
                        nombre: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="descripcion" className="text-right">
                    Descripción
                  </Label>
                  <Input
                    id="descripcion"
                    value={newEstadistica.descripcion}
                    onChange={(e) =>
                      setNewEstadistica({
                        ...newEstadistica,
                        descripcion: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => {
                    if (!newEstadistica.nombre || !newEstadistica.descripcion) {
                      toast.error('Todos los campos son obligatorios', {});
                      return;
                    }
                    handleCreateEstadistica();
                  }}
                  className="bg-brand hover:bg-brand/90"
                >
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {estadisticas.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center mt-20">
          <FaQuestion className="text-9xl text-gray-400 mb-6" />
          <p className="text-xl text-gray-600">
            Aún no hay ningún tipo de estadística
          </p>
        </div>
      ) : (
        <div className="estadisticas-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {estadisticas.map((tipoEstadistica) => (
            <EstadisticaCard
              key={tipoEstadistica.id}
              tipoEstadistica={tipoEstadistica}
              onEdit={(estadistica) => {
                setEditEstadistica(estadistica);
                setIsEditDialogOpen(true);
              }}
              onDelete={handleDeleteEstadistica}
              nameTeam={nameTeam}
              isTeam={isTeam}
            />
          ))}
        </div>
      )}
      {editEstadistica && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar estadística</DialogTitle>
              <DialogDescription>
                Modifica los detalles de la estadística. Haz clic en guardar
                cuando termines.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={editEstadistica.nombre}
                  onChange={(e) =>
                    setEditEstadistica({
                      ...editEstadistica,
                      nombre: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-descripcion" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="edit-descripcion"
                  value={editEstadistica.descripcion}
                  onChange={(e) =>
                    setEditEstadistica({
                      ...editEstadistica,
                      descripcion: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleEditEstadistica}
                className="bg-brand hover:bg-brand/90"
              >
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EstadisticasPage;
