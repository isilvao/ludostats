'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NavLinks } from '@/constants';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Verificar la posición de desplazamiento inicial
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`navbar ${isScrolled ? 'bg-[#f4f1e6] shadow-md' : 'bg-transparent'}`}
    >
      <div className="flex items-center gap-10">
        <Link href="/">
          <Image
            src="/assets/images/logo-ludostats.svg"
            width={150}
            height={100}
            alt="logo"
          />
        </Link>
      </div>

      <div className="hidden lg:flex gap-7 text-small justify-center flex-1">
        {NavLinks.map((link) => (
          <Link
            href={link.href}
            key={link.text}
            className="hover:text-gray-700"
          >
            {link.text}
          </Link>
        ))}
      </div>

      <div className="hidden lg:flex items-center gap-4">
        <Link href="/join-club" className="hover:text-gray-700 transition">
          Unirme a un club
        </Link>
        <Link
          href="/sign-in"
          className="border border-dark-200 px-4 py-2 rounded-md hover:bg-white transition"
        >
          Ingresar
        </Link>
        <Link
          href="/sign-up"
          className="bg-[#4CAF4F] text-white hover:bg-[#4CAF4F]/80 px-4 py-2 rounded-md transition"
        >
          Registrarse
        </Link>
      </div>

      <div className="lg:hidden flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Image
              src="/assets/icons/menu.svg"
              width={30}
              height={30}
              alt="menu"
              className="select-item"
            />
          </SheetTrigger>
          <SheetContent className="shad-sheet-content">
            <SheetHeader>
              <SheetTitle className="flex w-full items-center justify-between flex-row">
                <Image
                  src="/assets/images/logo-ludostats.svg"
                  width={150}
                  height={100}
                  alt="logo"
                />
                <SheetClose asChild>
                  <Image
                    src="/assets/icons/close-dark.svg"
                    width={30}
                    height={30}
                    alt="cerrar"
                    className="select-item"
                  />
                </SheetClose>
              </SheetTitle>
            </SheetHeader>

            <div className="grid gap-4 py-4 mt-5">
              <ul className="flex flex-col gap-4 text-black w-full">
                {NavLinks.map((link) => (
                  <Link
                    href={link.href}
                    key={link.text}
                    className="hover:text-gray-700"
                  >
                    {link.text}
                  </Link>
                ))}
              </ul>
              <div className="flex flex-col items-center gap-4 mt-8 text-center">
                <Link
                  href="/join-club"
                  className="hover:text-gray-700 w-full transition"
                >
                  Unirme a un club
                </Link>
                <Link
                  href="/sign-in"
                  className="border border-dark-200 px-4 py-2 rounded-md hover:bg-slate-50 transition w-full"
                >
                  Ingresar
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-[#4CAF4F] text-white hover:bg-[#4CAF4F]/80 px-4 py-2 rounded-md w-full transition"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
