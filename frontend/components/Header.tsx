'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

const Header = () => {
  return (
    <nav className="grid grid-cols-3 items-center bg-[#f4f1e6] px-6 py-4 shadow-md h-[100px]">
      <Link href="/">
        <Image
          src="/assets/images/logo.svg"
          width={150}
          height={100}
          alt="Logo"
          className="cursor-pointer"
        />
      </Link>

      <div className="flex justify-center gap-7">
        <Link href="/Statistics" className="text-[#4D4D4D] text-lg font-bold">
          Estadísticas
        </Link>
        <Link href="/Calendar" className="text-[#4D4D4D] text-lg font-bold">
          Calendario
        </Link>
        <Link
          href="/Subscription"
          className="bg-[#4CAF4F] text-white px-4 py-2 rounded-md font-bold hover:bg-[#4CAF4F]/80"
        >
          Suscripción
        </Link>
      </div>

      <div className="flex justify-end items-center gap-4">
        <Image
          src="/assets/images/profile-placeholder.svg"
          width={40}
          height={40}
          alt="Foto de perfil"
          className="rounded-full"
        />
        <Sheet>
          <SheetTrigger asChild>
            <button className="bg-[#4CAF4F] text-white px-4 py-2 rounded-md font-bold hover:bg-[#4CAF4F]/80">
              Cuenta
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Cuenta</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-4">
              <Link href="/profile" className="text-[#4D4D4D] text-lg hover:underline">
                Datos personales
              </Link>
              <Link href="/privacy" className="text-[#4D4D4D] text-lg hover:underline">
                Privacidad
              </Link>
              <Link href="/" className="text-[#4D4D4D] text-lg hover:underline">
                Cerrar sesión
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>

  );
};

export default Header;



