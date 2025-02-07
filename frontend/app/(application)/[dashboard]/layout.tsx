import React from 'react';
import Sidebar from '@/components/Sidebar';
// import { useEquipoClub } from '@/hooks/useEquipoClub'; // Importar el hook del contexto
// import LoadingScreen from '@/components/LoadingScreen';
// import { redirect } from 'next/navigation';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // const { equipoData, clubData, loading } = useEquipoClub(); // Usar el contexto

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  // if (!equipoData && !clubData) {
  //   return redirect(`/home`);
  // }

  return (
    <main className="flex h-[91vh] bg-white">
      <Sidebar />
      <section className="flex h-full flex-1 flex-col">
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}
