'use client';
import { CiCamera } from 'react-icons/ci';
import { FaSpinner } from 'react-icons/fa'; // Importa el spinner de react-icons
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useAuth } from '../../../hooks';
import { User, Auth } from '../../../api';
import { getProfileImage } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import LoadingScreen from '@/components/LoadingScreen';
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
import { useRouter } from 'next/navigation';
import Resizer from 'react-image-file-resizer';

const profileSchema = z.object({
  nombre: z.string().min(1, 'Nombre obligatorio'),
  apellido: z.string().min(1, 'Apellido obligatorio'),
  documento: z.string().optional(),
  // correo: z.string().email('Correo inválido'),
  telefono: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: 'El teléfono debe tener 10 dígitos y solo contener números',
    }),
  fecha_nacimiento: z.string().optional(),
  direccion: z.string().optional(),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Antigua contraseña obligatoria'),
    newPassword: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /[a-z]/,
        'La contraseña debe contener al menos una letra minúscula'
      )
      .regex(
        /[A-Z]/,
        'La contraseña debe contener al menos una letra mayúscula'
      )
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
      .regex(
        /[^a-zA-Z0-9]/,
        'La contraseña debe contener al menos un carácter especial'
      ),
    confirmPassword: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /[a-z]/,
        'La contraseña debe contener al menos una letra minúscula'
      )
      .regex(
        /[A-Z]/,
        'La contraseña debe contener al menos una letra mayúscula'
      )
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
      .regex(
        /[^a-zA-Z0-9]/,
        'La contraseña debe contener al menos un carácter especial'
      ),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

const Profile = () => {
  const userController = new User();
  const { user, accessToken, updateProfileImage, setUser } = useAuth();
  const [selectedOption, setSelectedOption] = useState('profile');
  const [profileImage, setProfileImage] = useState(getProfileImage(user));
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      documento: user?.documento || '',
      // correo: user?.correo || '',
      telefono: user?.telefono || '',
      fecha_nacimiento: user?.fecha_nacimiento || '',
      direccion: user?.direccion || '',
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        documento: user.documento || '',
        telefono: user.telefono || '',
        fecha_nacimiento: user.fecha_nacimiento
          ? new Date(user.fecha_nacimiento).toISOString().split('T')[0]
          : '',
        direccion: user.direccion || '',
      });
    }
  }, [user, form]);

  if (!user) {
    return <LoadingScreen />;
  }

  const handleSave = async (values: z.infer<typeof profileSchema>) => {
    const data = {
      id: user.id,
      ...values,
      fecha_nacimiento: values.fecha_nacimiento
        ? new Date(values.fecha_nacimiento).toISOString().split('T')[0]
        : null,
    };
    try {
      await userController.updateUser(data);
      setUser((prevUser: any) => ({
        ...prevUser,
        ...values,
        fecha_nacimiento: values.fecha_nacimiento
          ? new Date(values.fecha_nacimiento).toISOString().split('T')[0]
          : null,
      }));
      toast.success('Perfil actualizado con éxito', {
        style: {
          background: '#4CAF50', // Fondo verde
          color: '#FFFFFF', // Texto blanco
        },
      });
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      if (error instanceof TypeError) {
        alert('Error de red. Por favor, verifica tu conexión.');
      } else {
        alert('Error al actualizar el perfil');
      }
    }
  };

  const handleChangePassword = async (
    values: z.infer<typeof passwordSchema>
  ) => {
    try {
      await userController.updatePasswordFromProfile(
        user.id,
        values.oldPassword,
        values.newPassword
      );
      toast.success('Contraseña actualizada con éxito', {
        style: {
          background: '#4CAF50', // Fondo verde
          color: '#FFFFFF', // Texto blanco
        },
      });
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      if (
        error instanceof Error &&
        error.message === 'Contraseña antigua incorrecta'
      ) {
        alert(
          'La contraseña antigua no coincide. Por favor, inténtalo de nuevo.'
        );
      } else {
        alert('Error al actualizar la contraseña');
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userController.deteleMe(accessToken, user.id);
      alert('Cuenta eliminada con éxito');
      router.push('/');
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      alert('Error al eliminar la cuenta');
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

        const result = await userController.actualizarFotoPerfil(
          user.id,
          resizedImage
        );
        setProfileImage(result); // Assuming the API returns the new image URL
        updateProfileImage(result); // Actualiza la imagen de perfil en el contexto
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

  const renderContent = () => {
    switch (selectedOption) {
      case 'profile':
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
                        <Input
                          {...field}
                          type="number"
                          placeholder="Documento"
                        />
                      </FormControl>
                      <FormMessage className="shad-form-message" />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="correo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Correo Electrónico"
                        />
                      </FormControl>
                      <FormMessage className="shad-form-message" />
                    </FormItem>
                  )} */}
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="Teléfono" />
                      </FormControl>
                      <FormMessage className="shad-form-message" />
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
                      <FormMessage className="shad-form-message" />
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
                      <FormMessage className="shad-form-message" />
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
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handleChangePassword)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Antigua Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="*************"
                      />
                    </FormControl>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="*************"
                      />
                    </FormControl>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="*************"
                      />
                    </FormControl>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-brand text-white px-4 py-2 rounded-md hover:bg-brand/90"
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
    <section className="py-10 mx-8">
      <Toaster />
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Mi Perfil</h1>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="bg-white px-0 py-10 border border-gray-300 rounded-md md:w-1/4 mb-4 md:mb-0 h-full">
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
                  <FaSpinner className="animate-spin text-white h-8 w-8" />{' '}
                  {/* Usa el spinner de react-icons */}
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
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              {user.nombre} {user.apellido}
            </h2>
            <p className="text-gray-600">{user.correo}</p>
          </div>
          <ul className="mt-6">
            <li
              className={`pl-6 cursor-pointer p-3 border-l-4 ${selectedOption === 'profile' ? 'bg-gray-200 border-l-green' : 'hover:bg-gray-100 border-l-transparent'}`}
              onClick={() => setSelectedOption('profile')}
            >
              Perfil
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
                  Borrar mi cuenta
                </li>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción
                    no se puede deshacer.
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
        <div className="bg-white p-6 border border-gray-300 rounded-md md:w-[75%] w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {selectedOption === 'profile'
              ? 'Editar mi información'
              : 'Preferencias'}
          </h1>
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default Profile;
