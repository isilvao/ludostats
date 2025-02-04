'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ClubAPI } from '@/api/club';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

type FormType = 'club' | 'team';

// Validation schemas
const createFormSchema = (formType: FormType) => {
  return z.object({
    name: z.string().min(2, 'Nombre obligatorio').max(50),
    sport: z.string().min(1, 'Deporte obligatorio'),
    phone: z
      .string()
      .refine((val) => val === '' || val.length >= 10, {
        message: 'Teléfono inválido',
      })
      .optional(),
    logo: z.instanceof(Blob).optional(),
    ...(formType === 'team' && {
      gender: z.string().min(1, 'Género obligatorio'),
      age: z.string().min(1, 'Edad obligatoria'),
      level: z.string().min(1, 'Nivel obligatorio'),
      teamType: z.string().min(1, 'Tipo de equipo obligatorio'),
    }),
  });
};

const CreateForm = ({ type }: { type: FormType }) => {
  const schema = createFormSchema(type);
  const clubcreate = new ClubAPI();

  const { accessToken } = useAuth();

  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      sport: '',
      phone: '',
      logo: undefined,
      ...(type === 'team' && {
        gender: '',
        age: '',
        level: '',
        teamType: '',
      }),
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      if (type === 'club') {
        await clubcreate.crearClub(
          {
            nombre: values.name,
            deporte: values.sport,
            telefono: values.phone || '',
            logo: values.logo || '',
          },
          accessToken
        );
        // Redirigir al usuario a /home después de un envío exitoso
        router.push('/home');
      }
      console.log('Form submitted:', values);
    } catch (error) {
      console.error('Error al crear el club:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[90vh] *:py-6 px-6 items-center max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-center">
          {type === 'club' ? 'Crea tu club' : 'Crea tu equipo'}
        </h1>
        <p className="text-gray-600 mb-2 text-center">
          {type === 'club'
            ? 'Completa la información de tu club y ponle tu propio logo'
            : 'Completa la información de tu equipo, personaliza el logotipo y el color'}
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white rounded-md shadow-md max-w-2xl mx-auto p-4 border-t-[20px] border-brand"
        >
          <div className="grid md:grid-cols-[200px_1fr] gap-6">
            {/* Columna izquierda - Logo */}
            <div className="border-r border-gray-200 pr-4">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form-label">Logo</FormLabel>
                    <FormControl>
                      <div className="mt-1">
                        <label
                          htmlFor="logo-upload"
                          className="flex items-center justify-center w-full h-48 border-2 border-dashed rounded-md cursor-pointer hover:border-brand transition-colors"
                        >
                          <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) field.onChange(file);
                            }}
                          />
                          {field.value ? (
                            <img
                              src={
                                field.value instanceof Blob
                                  ? URL.createObjectURL(field.value)
                                  : ''
                              }
                              alt="Logo preview"
                              className="object-cover w-full h-full rounded-md"
                            />
                          ) : (
                            <span className="text-gray-500">
                              Sube tu logo aquí
                            </span>
                          )}
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">
                        Nombre del {type === 'club' ? 'Club *' : 'Equipo *'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`ex: AS Fresnes`}
                          className="shad-input"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />

              {/* Sport */}
              <FormField
                control={form.control}
                name="sport"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">
                        Deporte *
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          value={field.value as string}
                          className="text-gray-400 py-2 mt-1"
                        >
                          <option value="" disabled>
                            Selecciona un deporte
                          </option>
                          <option value="football">Football</option>
                          <option value="basketball">Basketball</option>
                          <option value="volleyball">Volleyball</option>
                        </select>
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />

              {/* Team-specific fields */}
              {type === 'team' && (
                <>
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <div className="shad-form-item">
                          <FormLabel className="shad-form-label">
                            Género *
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              value={field.value as string}
                              className="text-gray-400 py-2 mt-1"
                            >
                              <option value="" disabled>
                                Selecciona un género
                              </option>
                              <option value="masculino">Masculino</option>
                              <option value="femenino">Femenino</option>
                              <option value="mixto">Mixto</option>
                            </select>
                          </FormControl>
                        </div>
                        <FormMessage className="shad-form-message" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <div className="shad-form-item">
                          <FormLabel className="shad-form-label">
                            Edad *
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              value={field.value as string}
                              className="text-gray-400 py-2 mt-1"
                            >
                              <option value="" disabled>
                                Selecciona un grupo de edad
                              </option>
                              <option value="infantil">Infantil</option>
                              <option value="juvenil">Juvenil</option>
                              <option value="adulto">Adulto</option>
                            </select>
                          </FormControl>
                        </div>
                        <FormMessage className="shad-form-message" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <div className="shad-form-item">
                          <FormLabel className="shad-form-label">
                            Nivel de práctica *
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              value={field.value as string}
                              className="text-gray-400 py-2 mt-1"
                            >
                              <option value="" disabled>
                                Selecciona un nivel
                              </option>
                              <option value="principiante">Principiante</option>
                              <option value="intermedio">Intermedio</option>
                              <option value="avanzado">Avanzado</option>
                            </select>
                          </FormControl>
                        </div>
                        <FormMessage className="shad-form-message" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teamType"
                    render={({ field }) => (
                      <FormItem>
                        <div className="shad-form-item">
                          <FormLabel className="shad-form-label">
                            Tipo de equipo *
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              value={field.value as string}
                              className="text-gray-400 py-2 mt-1"
                            >
                              <option value="" disabled>
                                Selecciona un tipo
                              </option>
                              <option value="competitivo">Competitivo</option>
                              <option value="recreativo">Recreativo</option>
                            </select>
                          </FormControl>
                        </div>
                        <FormMessage className="shad-form-message" />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">
                        Teléfono
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ex: +57 123 456 7890"
                          className="shad-input"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-2 flex justify-center border-t border-gray-200 pt-6">
              <Button
                type="submit"
                className="w-full md:w-auto bg-brand hover:bg-brand/90 text-white font-bold py-4 px-8 rounded"
                disabled={isLoading}
              >
                {isLoading
                  ? 'Enviando...'
                  : `Crear mi ${type === 'club' ? 'club' : 'equipo'}`}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreateForm;
