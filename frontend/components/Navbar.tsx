"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "@/constants";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`flex justify-between items-center py-5 px-5 md:px-20 border-b gap-4 sticky top-0 z-50 transition-colors ${
        isScrolled ? "bg-gray-200 shadow-md" : ""
      }`}
    >
      <div className="flex items-center gap-10">
        <Link href="/">
          <Image
            src="/assets/images/logo.svg"
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
        <Link
          href="/join"
          className="text-blue-600 hover:text-blue-800 hover:underline transition"
        >
          Unirme
        </Link>
        <Link
          href="/sign-in"
          className="border border-green-500 text-green-500 px-4 py-2 rounded-md hover:bg-green-500 hover:text-white transition"
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
            <Button variant="outline">
              <span className="material-icons">menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menú</SheetTitle>
              <SheetDescription>Explora las opciones del sitio.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
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
              <div className="flex flex-col items-center gap-4 mt-4">
                <Link
                  href="/join"
                  className="text-blue-600 hover:text-blue-800 hover:underline transition"
                >
                  Unirme
                </Link>
                <Link
                  href="/sign-in"
                  className="border border-green-500 text-green-500 px-4 py-2 rounded-md w-full hover:bg-green-500 hover:text-white transition"
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
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="ghost">Cerrar</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
