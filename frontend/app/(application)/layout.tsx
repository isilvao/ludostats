'use client';
import React from 'react';
import Header from '@/components/Header';
import { redirect } from 'next/navigation';
import { useAuth } from '../../hooks';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <main className="bg-[#F4F5F5] min-h-screen">
      <Header />
      {children}
    </main>
  );
}
