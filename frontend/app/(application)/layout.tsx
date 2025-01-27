'use client';
import React from 'react';
import Header from '@/components/Header';
import { redirect, usePathname } from 'next/navigation';
import { useAuth } from '../../hooks';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return null;
  }

  if (!user) {
    return redirect(`/sign-up?next=${encodeURIComponent(pathname)}`);
  }

  return (
    <main className="bg-[#F4F5F5] min-h-screen">
      <Header />
      {children}
    </main>
  );
}
