import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex h-[91vh] bg-white">
      <Sidebar />
      <section className="flex h-full flex-1 flex-col">
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}
