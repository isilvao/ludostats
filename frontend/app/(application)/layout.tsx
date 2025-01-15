import React from 'react';
import Header from '@/components/Header';
import { AuthProvider } from "../../contexts"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <main className="bg-[#F4F5F5] min-h-screen">
        <Header />
        {children}
      </main>
    </AuthProvider>
  );
}
