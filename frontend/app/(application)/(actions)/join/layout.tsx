import React from 'react';
import LoadingScreen from '@/components/LoadingScreen';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main>{children}</main>;
}
