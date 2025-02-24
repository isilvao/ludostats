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
import { useAuth } from '@/hooks';
import LoadingScreen from '@/components/LoadingScreen';
import { getClubLogo } from '@/lib/utils';
import { useRouter } from 'next/navigation';
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
import Resizer from 'react-image-file-resizer';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { CiCamera } from 'react-icons/ci';

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
  const {
    equipoData,
    clubData,
    setEquipoSeleccionado,
    setClubSeleccionado,
    updateClubLogo,
    updateClubName,
    updateDescripcionClub,
    updateTelefonoClub,
    updateDeporteClub,
  } = useEquipoClub();
  const [selectedOption, setSelectedOption] = useState('edit');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const selectionType = localStorage.getItem('selectionType');
  const isTeam = selectionType === 'equipo';
  const api = isTeam ? new EquipoAPI() : new ClubAPI();
  const data = clubData;
  const router = useRouter();
  const [logo, setLogo] = useState(getClubLogo(clubData));
  const [name, setName] = useState(clubData?.nombre);

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
      setLogo(getClubLogo(data));
      setName(data.nombre); // Actualizar el nombre en el estado local
    }
    console.log(data)

  }, [data, form]);

  if (!data) {
    return <LoadingScreen />;
  }

  const handleSave = async (values: z.infer<typeof editSchema>) => {
    try {
      if (isTeam) {
        await (api as EquipoAPI).modificarEquipo({
          id: data.id,
          ...values,
        });
      } else {
        console.log('values en edicion de Club', values);

        await (api as ClubAPI).editarClub({
          id: data.id,
          ...values,
        });
      }
      updateClubName(values.nombre); // Actualizar el nombre en el contexto
      updateDescripcionClub(values.descripcion); // Actualizar la descripción en el contexto
      updateTelefonoClub(values.telefono); // Actualizar el teléfono en el contexto
      updateDeporteClub(values.deporte); // Actualizar el deporte en el contexto
      updateClubLogo(logo); // Actualizar el logo en el contexto
      setName(values.nombre); // Actualizar el nombre en el estado local

      form.reset(values); // Actualizar el formulario con los nuevos valores
      toast.success('Datos actualizados con éxito', {
        style: {
          background: '#4CAF50', // Fondo verde
          color: '#FFFFFF', // Texto blanco
        },
      });
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      toast.error('Error al actualizar los datos');
    }
  };

  const handleDelete = async () => {
    try {
      if (isTeam) {
        await (api as EquipoAPI).eliminarEquipo(data.id);
      } else {
        await (api as ClubAPI).eliminarClub(data.id);
      }
      toast.success('Eliminado con éxito');
      router.push('/home');
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar');
    }
  };

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoadingImage(true);
      try {
        const resizedImage = await new Promise<File>((resolve) => {
          Resizer.imageFileResizer(
            file,
            150, // ancho máximo
            150, // alto máximo
            'JPEG', // formato
            100, // calidad
            0, // rotación
            (uri) => {
              resolve(uri as File);
            },
            'file'
          );
        });

        let result;
        if (isTeam) {
          result = await (api as EquipoAPI).actualizarLogoEquipo(
            data.id,
            resizedImage
          );
        } else {
          result = await (api as ClubAPI).actualizarLogoClub(
            data.id,
            resizedImage
          );
        }
        setLogo(result.logo); // Actualiza el logo en el estado local
        updateClubLogo(result.logo); // Actualiza el logo en el contexto
        toast.success('Logo actualizado con éxito', {
          style: {
            background: '#4CAF50', // Fondo verde
            color: '#FFFFFF', // Texto blanco
          },
        });
      } catch (error) {
        console.error('Error al actualizar el logo:', error);
        toast.error('Error al actualizar el logo');
      } finally {
        setIsLoadingImage(false);
      }
    }
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
                      <select
                        {...field}
                        value={field.value as string}
                        className="text-black pl-2 py-2 mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-black focus:ring-1 focus:ring-black/50"
                      >
                        <option value="" disabled>
                          Selecciona un nivel
                        </option>
                        <option value="Competitivo">Competitivo</option>
                        <option value="Recreativo">Recreativo</option>
                      </select>
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
    <section className="py-5 mx-0">
      <Toaster />
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {isTeam ? 'Editar Equipo' : 'Editar Club'}
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row lg:space-x-4">
        <div className="bg-white px-0 py-10 border border-gray-300 rounded-md lg:w-1/4 mb-4 lg:mb-0 h-full">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Image
                src={logo} // Asegúrate de que src no sea una cadena vacía
                alt="Logo"
                className="rounded-full w-24 h-24 object-cover border-4 border-gray-100 shadow-md"
                width={100}
                height={100}
              />
              {isLoadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <FaSpinner className="animate-spin text-white h-8 w-8" />
                </div>
              )}
              <label
                htmlFor="logoInput"
                className="absolute bottom-0 right-0 bg-gray-200 p-1 rounded-full hover:bg-gray-300 h-10 w-10 flex items-center justify-center border border-spacing-1 border-white cursor-pointer"
              >
                <CiCamera className="h-6 w-6" />
              </label>
              <input
                id="logoInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
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
        <div className="bg-white p-6 border border-gray-300 rounded-md lg:w-[75%] w-full">
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
