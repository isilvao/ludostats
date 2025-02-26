'use client';
import { User } from '../api/user';
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
import OtpModal from '@/components/OTPModal';
import Link from 'next/link';

const resetPasswordSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [accountId, setAccountId] = useState('');

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const userController = new User();
      console.log(1)
      const user = await userController.getUserByEmail(values.email);
      if (!user) {
        setErrorMessage('El correo no existe en la plataforma.');
        return;
      }
      console.log(2)
      setAccountId(user.id);
      await userController.sendEmail(values.email, user.nombre);
      setOtpSent(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message || 'No se pudo enviar el OTP. Inténtalo de nuevo.'
        );
      } else {
        setErrorMessage('No se pudo enviar el OTP. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">Restablecer Contraseña</h1>
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
          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            Restablecer Contraseña
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
        </form>
        <div className="body-2 flex justify-center mt-4">
          <Link
            href="/sign-in"
            className="ml-1 font-medium text-[#141e3a] hover:underline"
          >
            Volver a Iniciar sesión
          </Link>
        </div>
      </Form>

      {otpSent && (
        <OtpModal email={form.getValues('email')} accountId={accountId} />
      )}
    </>
  );
};

export default ResetPasswordForm;
