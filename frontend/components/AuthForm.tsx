'use client';

// Import for backend functions
import { Auth } from '../api/auth';
import { User } from '../api/user';
import { useAuth } from "../hooks"
//

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
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode , JwtPayload } from "jwt-decode"

interface GoogleJwtPayload extends JwtPayload {
  given_name?: string;
  family_name?: string;
  email: string;
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
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  // Hook para traer la informacion del usuario (Ivan)
  const { login, user, logout } = useAuth();
  console.log("User de auth", user)
  const authController = new Auth();
  const userController = new User();

  // Fin del hook

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formSchema = authFormSchema(type);
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
      console.log(1, values)
      const result =
        type === 'sign-up'
          ? await authController.register({
              nombre: values.firstName || '',
              apellido: values.lastName || '',
              correo: values.email,
              contrasena: values.password,
            })
          : await authController.login({
              correo: values.email,
              contrasena: values.password,
              rememberMe: values.rememberMe,
            });

      authController.setAccessToken(result.accessToken, result.rememberMe);
      authController.setRefreshToken(result.refreshToken, result.rememberMe);

      const { accessToken, refreshToken } = result;
      if (accessToken && refreshToken) {
        login(accessToken);
        window.location.href = '/home';
      }

      if (result.success) {
        window.location.href = '/sign-in';
      }
    } catch {
      setErrorMessage('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const onSubmitGoogle = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      console.log(1, values)
      const result =
          await authController.register({
            nombre: values.firstName || '',
            apellido: values.lastName || '',
            correo: values.email,
            contrasena: values.password,
          })

      

    } catch {
  
    } 

    try {
      console.log(1, values)
      const result =
          await authController.login({
            correo: values.email,
            contrasena: values.password,
            rememberMe: values.rememberMe,
          });
          console.log(2)

      authController.setAccessToken(result.accessToken, result.rememberMe);
      authController.setRefreshToken(result.refreshToken, result.rememberMe);

      const { accessToken, refreshToken } = result;
      if (accessToken && refreshToken) {
        login(accessToken);
        window.location.href = '/home';
      }

      if (result.success) {
        window.location.href = '/sign-in';
      }

    } catch {
      setErrorMessage('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }

    
  };

  const HandleLookUserByEmail = async (email : string) => {
    try {
      const user = await userController.getUserByEmail(email);
      if (user) {
          console.log("El correo ya está registrado:", user);
      } else {
          console.log("Correo no se Encuentra en la base de datos.");
      }
  } catch (error) {
      const err = error as { msg?: string; message?: string };
      console.error("Error al verificar el correo:", err.msg || err.message);
  }


  };

  const HandleResetPasswordOTP = async () => {
    


  };

  const HandleResetPasswordsendEmail = async (email : string) => {
    try {
      // Validar los datos
    var firstName = "Pepe"
      if (!email || !firstName) {
        alert("Por favor ingresa tu nombre y correo electrónico.");
        return;
      }

      // Crear el cuerpo de la solicitud
      const requestBody = {
        firstName,
        otp: "123456", // Valor estático por ahora; puedes integrarlo con un generador OTP
        email,
      };

      // Realizar la solicitud al servidor
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      // Manejar respuesta del servidor
      if (!response.ok) {
        alert(`Error: ${data.error || "Ocurrió un error inesperado."}`);
        return;
      }

      alert("Correo enviado con éxito.");
      console.log("Respuesta del servidor:", data);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      alert("No se pudo enviar el correo. Inténtalo de nuevo.");
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
                onClick={(event) => {
                  event.preventDefault(); // Previene la acción predeterminada del enlace
                  HandleLookUserByEmail("luisgmmh18v1@gmail.com");
                  HandleResetPasswordsendEmail("lmarinmu@unal.edu.co");
                }}
                
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
            <Button
              className="bg-white hover:bg-neutral-100 p-2 rounded-full w-12 h-12"
              onClick={() => alert('Login with Facebook')}
            >
              <Image
                src="/assets/icons/facebook-icon.svg"
                alt="Facebook"
                width={32}
                height={32}
              />
            </Button>
            <>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
              console.log(jwtDecode(credentialResponse.credential!));

              const decoded = (jwtDecode(credentialResponse.credential!)) as GoogleJwtPayload;

              console.log(decoded.email)
              
              // Adaptar los valores de Google al formato esperado por `onSubmit`
              const googleValues = {
                email: decoded.email, // Correo electrónico desde Google
                password: 'googleauth1', // Contraseña no necesaria, 
                firstName: decoded.given_name || '', // Nombre desde Google
                lastName: decoded.family_name || '', // Apellido desde Google
                rememberMe: true, // O lo que sea necesario para tu lógica
              };

              // Llamar a `onSubmit` con los valores adaptados
              onSubmitGoogle(googleValues);
              
            }}
            onError={() => console.log("Login failed")}/>
            </>
            <Button
              className="bg-white hover:bg-neutral-100 text-neutral-900 p-2 rounded-full w-12 h-12"
              onClick={() => alert('Login with Google')}
            >
              <Image
                src="/assets/icons/google-icon.svg"
                alt="Google"
                width={28}
                height={28}
              />
            </Button>
          </div>

          <div className="body-2 flex justify-center mt-4">
            <p className="text-light-100">
              {type === 'sign-in'
                ? 'Aun no tienes una cuenta?'
                : 'Ya tienes una cuenta?'}
            </p>
            <Link
              href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
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
