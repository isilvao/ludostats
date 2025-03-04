'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { User as UserAPI } from '@/api/user';
import { ClubAPI } from '@/api/club';
import { EquipoAPI } from '@/api/equipo';
import { toast } from 'sonner';
import Image from 'next/image';
import Resizer from 'react-image-file-resizer';
import { Toaster } from '@/components/ui/sonner';
import { getProfileImage } from '@/lib/utils';
import { useEquipoClub } from '@/hooks';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { FaSpinner } from 'react-icons/fa6';
import { CiCamera } from 'react-icons/ci';
import { UsuariosEquipos } from '@/api/usuariosEquipos';

interface User {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  documento?: string;
  rol?: string; // Add rol to the User interface
}

const memberSchema = z.object({
  nombre: z.string().min(1, 'Nombre obligatorio'),
  apellido: z.string().min(1, 'Apellido obligatorio'),
  telefono: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: 'El teléfono debe tener 10 dígitos y solo contener números',
    }),
  fecha_nacimiento: z.string().optional(),
  direccion: z.string().optional(),
  documento: z.string().optional(),
});

const roleSchema = z.object({
  role: z.enum(['gerente', 'entrenador', 'deportista', 'admin', 'miembro']),
});

const EditMember = () => {
  const { memberID } = useParams();
  const { clubData, rolClub } = useEquipoClub();
  const router = useRouter();
  const [member, setMember] = useState<User>();
  const [profileImage, setProfileImage] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [selectedOption, setSelectedOption] = useState('edit');
  const selectionType = localStorage.getItem('selectionType');
  const isTeam = selectionType === 'equipo';

  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      fecha_nacimiento: '',
      direccion: '',
      documento: '',
    },
  });

  const roleForm = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role: 'miembro',
    },
  });

  useEffect(() => {
    const fetchMember = async () => {
      try {
        if (isTeam) {
          const teamAPI = new EquipoAPI();
          const result = await teamAPI.getUserByIdInTeam(clubData.id, memberID);
          setMember(result.usuario);
          setProfileImage(getProfileImage(result.usuario));
          form.reset({
            nombre: result.usuario.nombre || '',
            apellido: result.usuario.apellido || '',
            correo: result.usuario.correo || '', // Corrección aquí
            telefono: result.usuario.telefono || '',
            fecha_nacimiento: result.usuario.fecha_nacimiento
              ? new Date(result.usuario.fecha_nacimiento)
                .toISOString()
                .split('T')[0]
              : '',
            direccion: result.usuario.direccion || '',
            documento: result.usuario.documento || '',
          });
          roleForm.reset({
            role: result.rol || 'miembro', // Se asegura que haya un valor válido
          });
        } else {
          const clubAPI = new ClubAPI();
          const result = await clubAPI.getUserByIdInClub(clubData.id, memberID);
          setMember(result.usuario);
          setProfileImage(getProfileImage(result.usuario));
          form.reset({
            nombre: result.usuario.nombre || '',
            apellido: result.usuario.apellido || '',
            correo: result.usuario.correo || '', // Corrección aquí
            telefono: result.usuario.telefono || '',
            fecha_nacimiento: result.usuario.fecha_nacimiento
              ? new Date(result.usuario.fecha_nacimiento)
                .toISOString()
                .split('T')[0]
              : '',
            direccion: result.usuario.direccion || '',
            documento: result.usuario.documento || '',
          });
          roleForm.reset({
            role: result.rol || 'miembro', // Se asegura que haya un valor válido
          });
        }
      } catch (error) {
        console.error('Error fetching member:', error);
      }
    };

    if (memberID) {
      fetchMember();
    }
  }, [memberID, form, roleForm]);

  const handleSave = async (values: z.infer<typeof memberSchema>) => {
    try {
      const memberAPI = new UserAPI();
      await memberAPI.updateUser({ id: memberID, ...values });
      setMember((prevMember) => ({
        ...prevMember!,
        ...values,
        id: prevMember!.id, // Ensure id is always defined
      }));
      toast.success('Perfil actualizado con éxito', {
        style: {
          background: '#4CAF50', // Fondo verde
          color: '#FFFFFF', // Texto blanco
        },
      });
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error al actualizar el perfil', {
        style: {
          background: '#FF0000', // Fondo rojo
          color: '#FFFFFF', // Texto blanco
        },
      });
    }
  };

  const handleRoleChange = async (values: { role: string }) => {
    try {
      const usuariosEquiposAPI = new UsuariosEquipos();
      if (isTeam) {
        await usuariosEquiposAPI.modificarRolUsuarioEquipo(
          memberID,
          clubData.id,
          values.role
        );
      } else {
        await usuariosEquiposAPI.modificarRolUsuarioClub(
          memberID,
          clubData.id,
          values.role
        );
      }
      toast.success('Rol actualizado con éxito', {
        style: {
          background: '#4CAF50', // Fondo verde
          color: '#FFFFFF', // Texto blanco
        },
      });
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      toast.error('Error al actualizar el rol', {
        style: {
          background: '#FF0000', // Fondo rojo
          color: '#FFFFFF', // Texto blanco
        },
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (isTeam) {
        const teamAPI = new UsuariosEquipos();
        if (typeof memberID === 'string') {
          await teamAPI.eliminarUsuarioEquipo(memberID, clubData.id);
          toast.success('Cuenta eliminada con éxito', {
            style: {
              background: '#4CAF50', // Fondo verde
              color: '#FFFFFF', // Texto blanco
            },
          });
        } else {
          throw new Error('Invalid memberID');
        }
      } else {
        const clubAPI = new ClubAPI();
        if (typeof memberID === 'string') {
          await clubAPI.eliminarUsuarioDeClub(memberID, clubData.id);
          toast.success('Cuenta eliminada con éxito', {
            style: {
              background: '#4CAF50', // Fondo verde
              color: '#FFFFFF', // Texto blanco
            },
          });
        } else {
          throw new Error('Invalid memberID');
        }
      }
      router.push('/dashboard/members');
    } catch (error) {
      console.error('Error al eliminar al miembro:', error);
      toast.error('Error al eliminar al miembro', {
        style: {
          background: '#FF0000', // Fondo rojo
          color: '#FFFFFF', // Texto blanco
        },
      });
    }
  };

  const handleProfileImageChange = async (
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

        const memberAPI = new UserAPI();
        const result = await memberAPI.actualizarFotoPerfil(
          memberID,
          resizedImage
        );
        setProfileImage(result); // Assuming the API returns the new image URL
        toast.success('Foto de perfil actualizada con éxito', {
          style: {
            background: '#4CAF50', // Fondo verde
            color: '#FFFFFF', // Texto blanco
          },
        });
      } catch (error) {
        console.error('Error al actualizar la foto de perfil:', error);
      } finally {
        setIsLoadingImage(false);
      }
    }
  };

  if (!member) {
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

  const renderContent = () => {
    switch (selectedOption) {
      case 'edit':
        return (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombres *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nombres" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apellido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Apellidos" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="documento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Documento" />
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
                        <Input {...field} type="tel" placeholder="Teléfono" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fecha_nacimiento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          placeholder="Fecha de Nacimiento"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Dirección" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
      case 'preferences':
        return (
          <Form {...roleForm}>
            <form
              onSubmit={roleForm.handleSubmit(handleRoleChange)}
              className="space-y-4"
            >
              <FormField
                control={roleForm.control}
                name="role"
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>Rol *</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="text-black pl-2 py-2 mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:border-black focus:ring-1 focus:ring-black/50"
                          disabled={field.value === 'gerente'}
                        >
                          {field.value !== 'gerente' && (
                            <>
                              <option value="entrenador">Entrenador</option>
                              <option value="deportista">Deportista</option>
                              {/* <option value="admin">Admin</option> */}
                              <option value="miembro">Miembro</option>
                            </>
                          )}
                          {field.value === 'gerente' && (
                            <option value="gerente">Gerente</option>
                          )}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />

              <Button
                type="submit"
                className="bg-brand text-white px-4 py-2 rounded-md hover:bg-brand/90"
                disabled={roleForm.getValues('role') === 'gerente'}
              >
                Guardar
              </Button>
            </form>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-10">
      <Toaster />
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Editar Miembro
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row lg:space-x-4">
        <div className="bg-white px-0 py-10 border border-gray-300 rounded-md lg:w-1/4 mb-4 lg:mb-0 h-full">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Image
                src={profileImage}
                alt="Foto de perfil"
                className="rounded-full w-28 h-28 object-cover"
                width={100}
                height={100}
              />
              {isLoadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <FaSpinner className="animate-spin text-white h-8 w-8" />
                </div>
              )}
              <label
                htmlFor="profileImageInput"
                className="absolute bottom-0 right-0 bg-gray-200 p-1 rounded-full hover:bg-gray-300 h-10 w-10 flex items-center justify-center border border-spacing-1 border-white cursor-pointer"
              >
                <CiCamera className="h-6 w-6" />
              </label>
              <input
                id="profileImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-800 text-center">
              {member.nombre} {member.apellido}
            </h2>
            <p className="text-gray-600">{member.correo}</p>
          </div>
          <ul className="mt-6">
            <li
              className={`pl-6 cursor-pointer p-3 border-l-4 ${selectedOption === 'edit' ? 'bg-gray-200 border-l-green' : 'hover:bg-gray-100 border-l-transparent'}`}
              onClick={() => setSelectedOption('edit')}
            >
              Editar Miembro
            </li>
            <li
              className={`pl-6 cursor-pointer p-3 border-l-4 ${selectedOption === 'preferences' ? 'bg-gray-200 border-l-green' : 'hover:bg-gray-100 border-l-transparent'}`}
              onClick={() => setSelectedOption('preferences')}
            >
              Preferencias
            </li>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <li className="pl-6 text-[#FF0000] cursor-pointer p-3 hover:bg-red/20">
                  Eliminar miembro
                </li>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro de que deseas eliminar a este miembro? Esta
                    acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </ul>
        </div>
        <div className="bg-white p-6 border border-gray-300 rounded-md lg:w-[75%] w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {selectedOption === 'edit'
              ? 'Editar información del miembro'
              : 'Preferencias'}
          </h1>
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default EditMember;
