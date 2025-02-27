'use client';
import React, { useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useAuth } from '../../hooks';
import LoadingScreen from '@/components/LoadingScreen';
import { User as UserAPI } from '@/api/user';
import { EquipoClubProvider } from '@/contexts/equipoClubContext';

const userAPI = new UserAPI();

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading, setUser } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const otp = searchParams.get('otp');
  const id = searchParams.get('id');

  useEffect(() => {
    const activateUser = async () => {
      if (id && otp) {
        try {
          await userAPI.activateUser(id, otp);
          const updatedUser = { ...user, correo_validado: true };
          setUser(updatedUser);
          router.replace(pathname); // Remove otp and id from URL
        } catch (error) {
          console.error('Error activating user:', error);
        }
      } else if (!user.correo_validado) {
        try {
          await userAPI.sendEmailValidate(user.correo, user.nombre, user.id);
        } catch (error) {
          console.error('Error sending validation email:', error);
        }
      }
    };

    if (user && !user.correo_validado) {
      activateUser();
    }
  }, [id, otp, user, pathname, router, setUser]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return redirect(`/sign-up?next=${encodeURIComponent(pathname)}`);
  }

  if (!user.correo_validado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Correo de validación enviado
          </h2>
          <p className="text-gray-600 mb-4">
            Hemos enviado un correo de validación a{' '}
            <strong>{user.correo}</strong>. Por favor, revisa tu bandeja de
            entrada y sigue las instrucciones para validar tu correo.
          </p>
          <div className="text-4xl text-blue-500 mb-4">
            <i className="fas fa-envelope"></i>
          </div>
          <p className="text-gray-500">
            Si no has recibido el correo, revisa tu carpeta de spam o intenta
            reenviar el correo de validación.
          </p>
        </div>
      </div>
    );
  }

  return (
    <EquipoClubProvider>
      <main className="bg-[#F4F5F5] min-h-screen">
        <Header />
        {children}
      </main>
    </EquipoClubProvider>
  );
}

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}
