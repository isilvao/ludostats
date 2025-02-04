'use client';

// Import for backend functions
import { Auth } from '../api/auth';
import { useAuth } from '../hooks';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface GoogleJwtPayload extends JwtPayload {
  given_name?: string;
  family_name?: string;
  email: string;
  picture: string;
}

type FormType = 'sign-in' | 'sign-up';

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    firstName:
      formType === 'sign-up'
        ? z
            .string()
            .min(2, 'El nombre debe tener al menos 2 caracteres')
            .max(50, 'El nombre debe tener menos de 50 caracteres')
        : z.string().optional(),
    lastName:
      formType === 'sign-up'
        ? z
            .string()
            .min(2, 'El apellido debe tener al menos 2 caracteres')
            .max(50, 'El apellido debe tener menos de 50 caracteres')
        : z.string().optional(),
    rememberMe:
      formType === 'sign-in' ? z.boolean().optional() : z.boolean().optional(),
    picture:
      z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const { login, user, logout } = useAuth();
  const authController = new Auth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const formSchema = authFormSchema(type);

  const [next, setNext] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNext(params.get('next'));
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      let result;
      if (type === 'sign-up') {
        await authController.register({
          nombre: values.firstName || '',
          apellido: values.lastName || '',
          correo: values.email,
          contrasena: values.password,
        });
        result = await authController.login({
          correo: values.email,
          contrasena: values.password,
          rememberMe: values.rememberMe,
        });
      } else {
        result = await authController.login({
          correo: values.email,
          contrasena: values.password,
          rememberMe: values.rememberMe,
        });
      }

      authController.setAccessToken(result.accessToken, result.rememberMe);
      authController.setRefreshToken(result.refreshToken, result.rememberMe);

      const { accessToken, refreshToken } = result;
      if (accessToken && refreshToken) {
        login(accessToken);
        window.location.href = next || '/home';
      }
    } catch {
      setErrorMessage('Fallo al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitGoogle = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage('');
    console.log(values)

    try {
      const result = await authController.register({
        nombre: values.firstName || '',
        apellido: values.lastName || '',
        correo: values.email,
        contrasena: values.password,
        foto: values.picture || undefined // 📌 Si no hay foto, enviamos `undefined`
      });
    } catch {}

    try {
      const result = await authController.login({
        correo: values.email,
        contrasena: values.password,
        rememberMe: values.rememberMe,
      });

      authController.setAccessToken(result.accessToken, result.rememberMe);
      authController.setRefreshToken(result.refreshToken, result.rememberMe);

      const { accessToken, refreshToken } = result;
      if (accessToken && refreshToken) {
        login(accessToken);
        window.location.href = next || '/home';
      }
      alert(values)
    } catch {
      setErrorMessage('Fallo al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === 'sign-in' ? 'Inicia sesión en tu cuenta' : 'Registrarse'}
          </h1>

          {type === 'sign-up' && (
            <>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">Nombres</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingresa tus nombres"
                          className="shad-input"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">
                        Apellidos
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingresa tus apellidos"
                          className="shad-input"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Correo Electrónico
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa tu correo electrónico"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          {type === 'sign-in' && (
            <div className="flex items-center justify-between mt-2 mb-4">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  {...form.register('rememberMe')}
                  className="mr-2"
                />
                Recordarme
              </label>
              <Link
                href="/reset-password"
                className="text-sm text-[#141e3a] hover:underline"
              >
                Olvidaste la contraseña?
              </Link>
            </div>
          )}
          {type === 'sign-up' && (
            <p className="text-sm text-center mt-4 text-neutral-500">
              Al registrarte, aceptas nuestras{' '}
              <Link
                href="/terms-of-service"
                className="text-[#141e3a] hover:underline"
              >
                Condiciones
              </Link>{' '}
              y nuestra{' '}
              <Link
                href="/privacy-policy"
                className="text-[#141e3a] hover:underline"
              >
                Política de datos
              </Link>
              .
            </p>
          )}
          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {type === 'sign-in' ? 'Ingresar' : 'Registrarse'}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>

          {errorMessage && <p className="error-message">*{errorMessage}</p>}

          <div className="flex items-center w-full">
            <div className="flex-grow border-t border-neutral-300"></div>
            <span className="mx-4 text-neutral-900 body-2">O</span>
            <div className="flex-grow border-t border-neutral-300"></div>
          </div>

          <div className="flex justify-center space-x-12">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const decoded = jwtDecode(
                  credentialResponse.credential!
                ) as GoogleJwtPayload;
                //alert(decoded.picture)

                const googleValues = {
                  email: decoded.email,
                  password: 'googleauth1',
                  firstName: decoded.given_name || '',
                  lastName: decoded.family_name || '',
                  rememberMe: true,
                  picture: decoded.picture,
                };

                onSubmitGoogle(googleValues);
              }}
            />
          </div>

          <div className="body-2 flex justify-center mt-4">
            <p className="text-light-100">
              {type === 'sign-in'
                ? 'Aun no tienes una cuenta?'
                : 'Ya tienes una cuenta?'}
            </p>
            <Link
              href={
                type === 'sign-in'
                  ? `/sign-up${next ? `?next=${next}` : ''}`
                  : `/sign-in${next ? `?next=${next}` : ''}`
              }
              className="ml-1 font-medium text-[#141e3a] hover:underline"
            >
              {type === 'sign-in' ? 'Registrarse' : 'Iniciar sesión'}
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AuthForm;
