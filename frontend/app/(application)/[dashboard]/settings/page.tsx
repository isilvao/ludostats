'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useEquipoClub } from '@/hooks/useEquipoClub';
import { EquipoAPI } from '@/api/equipo';
import { ClubAPI } from '@/api/club';
import LoadingScreen from '@/components/LoadingScreen';
import { getClubLogo } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
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

const editSchema = z.object({
  nombre: z.string().min(1, 'Nombre obligatorio'),
  descripcion: z.string().optional(),
  telefono: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: 'El teléfono debe tener 10 dígitos y solo contener números',
    }),
  deporte: z.string().optional(),
  nivelPractica: z.string().optional(),
});

const EditPage = () => {
  const { equipoData, clubData, setEquipoSeleccionado, setClubSeleccionado } =
    useEquipoClub();
  const [selectedOption, setSelectedOption] = useState('edit');
  const selectionType = localStorage.getItem('selectionType');
  const isTeam = selectionType === 'equipo';
  const api = isTeam ? new EquipoAPI() : new ClubAPI();
  const data = equipoData;
  const logo = getClubLogo(equipoData);
  const name = equipoData?.nombre;

  const form = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      nombre: data?.nombre || '',
      descripcion: data?.descripcion || '',
      telefono: data?.telefono || '',
      deporte: data?.deporte || '',
      nivelPractica: data?.nivelPractica || '',
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        telefono: data.telefono || '',
        deporte: data.deporte || '',
        nivelPractica: data.nivelPractica || '',
      });
    }
  }, [data, form]);

  if (!data) {
    return <LoadingScreen />;
  }

  const handleSave = async (values: z.infer<typeof editSchema>) => {
    // try {
    //   if (isTeam) {
    //     await api.modificarEquipo(data.id, values);
    //   } else {
    //     await api.editarClub(data.id, values);
    //   }
    //   alert('Datos actualizados con éxito');
    // } catch (error) {
    //   console.error('Error al actualizar los datos:', error);
    //   alert('Error al actualizar los datos');
    // }
  };

  const handleDelete = async () => {
    // try {
    //   if (isTeam) {
    //     await api.deleteEquipo(data.id);
    //   } else {
    //     await api.deleteClub(data.id);
    //   }
    //   alert('Eliminado con éxito');
    // } catch (error) {
    //   console.error('Error al eliminar:', error);
    //   alert('Error al eliminar');
    // }
  };

  const renderContent = () => {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nombre" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Descripción" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Teléfono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isTeam ? (
              <FormField
                control={form.control}
                name="nivelPractica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel de Práctica</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nivel de Práctica" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="deporte"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deporte</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Deporte" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <Button
            type="submit"
            className="bg-brand text-white px-4 py-2 rounded-md hover:bg-brand/90"
          >
            Guardar
          </Button>
        </form>
      </Form>
    );
  };

  return (
    <section className="py-10 mx-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {isTeam ? 'Editar Equipo' : 'Editar Club'}
        </h1>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="bg-white px-0 py-10 border border-gray-300 rounded-md md:w-1/4 mb-4 md:mb-0 h-full">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Image
                src={logo}
                alt="Logo"
                className="rounded-full w-24 h-24"
                width={100}
                height={100}
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-800">{name}</h2>
          </div>
          <ul className="mt-6">
            <li
              className={`pl-6 cursor-pointer p-3 border-l-4 ${selectedOption === 'edit' ? 'bg-gray-200 border-l-green' : 'hover:bg-gray-100 border-l-transparent'}`}
              onClick={() => setSelectedOption('edit')}
            >
              Editar {isTeam ? 'Equipo' : 'Club'}
            </li>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <li className="pl-6 text-[#FF0000] cursor-pointer p-3 hover:bg-red/20">
                  Borrar {isTeam ? 'Equipo' : 'Club'}
                </li>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro de que deseas eliminar{' '}
                    {isTeam ? 'este equipo' : 'este club'}? Esta acción no se
                    puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </ul>
        </div>
        <div className="bg-white p-6 border border-gray-300 rounded-md md:w-[75%] w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {selectedOption === 'edit' ? 'Editar Información' : ''}
          </h1>
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default EditPage;
