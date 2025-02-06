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
import { AiOutlineLoading } from 'react-icons/ai';
import { FaCheckCircle } from 'react-icons/fa';

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
        }, 1000); // Redirige después de 1 segundo
      }
    } catch (error) {
      console.error('Error al agregar usuario al equipo:', error);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-7">
        <AiOutlineLoading
          style={{ color: 'green', fontSize: '200px' }}
          className="animate-spin"
        />
      </div>
    );
  }

  return isAccepted ? (
    <div className="flex items-center justify-center mt-7">
      <FaCheckCircle style={{ color: 'green', fontSize: '200px' }} />
    </div>
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto mt-5 md:mt-0 md:px-10 md:py-8"
      >
        <div>
          <h2 className="text-xl font-semibold text-[#4D4D4D] mb-3 ml-2">
            Datos de tu hijo/a
          </h2>
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
                        placeholder={`Nombres`}
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
                        placeholder={`Apellidos`}
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
        </div>
        <div className="md:col-span-2 flex justify-center pt-6 mt-4">
          <button
            type="submit"
            className="w-full md:max-w-[180px] bg-brand hover:bg-brand/90 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : `Unirse`}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default ParentPage;
