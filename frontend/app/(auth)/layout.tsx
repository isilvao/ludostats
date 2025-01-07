import React from "react";
import Image from "next/image";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sección izquierda fija */}
      <section className="hidden lg:flex xl:w-2/5 w-1/2 fixed h-full bg-[#141e3a] p-10 justify-center">
        <div className="max-w-[430px] flex-col">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/assets/images/logo-white.svg"
                alt="logo"
                width={280}
                height={100}
                className="h-auto"
              />
            </Link>   
          </div>
          <div className="flex-grow mt-14 space-y-12 items-center justify-center flex flex-col">
            <div className="space-y-5 text-white">
              <h1 className="h1">Imagina lo que puedes lograr</h1>
              <p className="body-1">
                Accede a ofertas exclusivas y lleva tu club al siguiente nivel.
              </p>
            </div>
            <Image
              src="/assets/images/dashboard.svg"
              alt="Files"
              width={350}
              height={350}
              className="transition-all hover:rotate-2 hover:scale-105"
            />
          </div>
        </div>
        
      </section>

      {/* Sección derecha */}
      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0 lg:ml-[50%] xl:ml-[40%] my-10">
        <div className="mb-16 lg:hidden">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto w-[200px] lg:w-[250px]"
          />
        </div>

        {children}
      </section>
    </div>
  );
};

export default Layout;
