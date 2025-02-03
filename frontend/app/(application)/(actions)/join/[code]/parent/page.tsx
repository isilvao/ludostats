'use client';
import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UsuariosEquipos } from '@/api/usuariosEquipos';
import { InvitacionesAPI } from '@/api/invitacion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const parentPageSchema = () => {
  return z.object({
    firstname: z.string().min(2, 'Nombre obligatorio').max(50),
    lastname: z.string().min(2, 'Apellido obligatorio').max(50),
  });
};

const ParentPage = () => {
  const schema = parentPageSchema();
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [isAccepted, setIsAccepted] = useState(false);
  const [invitacion, setInvitacion] = useState<any>(null);
  const invitacionesAPI = new InvitacionesAPI();
  const usuariosEquiposAPI = new UsuariosEquipos();

  const code = params
    ? Array.isArray(params.code)
      ? params.code[0]
      : params.code
    : null;

  useEffect(() => {
    const fetchInvitacion = async () => {
      if (code) {
        const invitacion = await invitacionesAPI.verificarInvitacion(code);
        setInvitacion(invitacion);
      }
    };
    fetchInvitacion();
  }, [code]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstname: '',
      lastname: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  //   const onSubmit = () => {
  //     if (user && invitacion) {
  //       usuariosEquiposAPI.agregarUsuarioEquipo(
  //         user.id,
  //         invitacion.equipo_id,
  //         invitacion.rol_invitado
  //       );
  //       setIsAccepted(true);
  //       setTimeout(() => {
  //         router.push('/home');
  //       }, 2000); // Redirige después de 2 segundos
  //     }
  //   };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      console.log('Form submitted:', values);
      if (user && invitacion) {
        const hijoDatos = {
          nombre: values.firstname,
          apellido: values.lastname,
        };
        await usuariosEquiposAPI.agregarUsuarioEquipo(
          user.id,
          invitacion.equipo_id,
          2,
          hijoDatos
        );
        setIsAccepted(true);
        setTimeout(() => {
          router.push('/home');
        }, 2000); // Redirige después de 2 segundos
      }
    } catch (error) {
      console.error('Error al agregar usuario al equipo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return isAccepted ? (
    <div>
      <p>Has aceptado la invitación</p>
    </div>
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto mt-8"
      >
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Nombre de tu hijo/a *
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
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Apellido de tu hijo/a *
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
        </div>
        <div className="md:col-span-2 flex justify-center border-t border-gray-200 pt-6">
          <Button
            type="submit"
            className="w-full md:w-auto bg-brand hover:bg-brand/90 text-white font-bold py-4 px-8 rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : `Unirse`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ParentPage;
