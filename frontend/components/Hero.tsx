import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="h-[85vh] mx-auto max-w-[1440px] flex flex-col items-center md:flex-row gap-8 md:gap-10 lg:gap-16 py-10 px-6 justify-center">
      {/* Lado izquierdo: Texto y CTA */}
      <div className="flex-1 flex flex-col justify-center max-w-xl text-left">
        <h1 className="h1 lg:text-hero font-bold text-[#4D4D4D] leading-tight">
          Simplifica la gestión de tu{' '}
          <span className="text-[#4CAF4F]">club deportivo</span>
        </h1>
        <p className="text-base lg:text-lg mt-4 text-[#717171]">
          LudoStats: Administra tu equipo, organiza torneos, gestiona pagos y
          mucho más en un solo lugar.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 text-center">
          <Link
            href="/sign-up"
            className="bg-[#4CAF4F] text-white hover:bg-[#4CAF4F]/80 px-8 py-3 rounded-md transition"
          >
            Empezar Ahora
          </Link>
        </div>
      </div>

      {/* Lado derecho: Imagen */}
      <div className="flex-1 flex items-center justify-center max-w-xl">
        <div className="relative min-w-[300px] w-full h-64 sm:h-80 md:h-96 lg:h-[500px]">
          <Image
            src="/assets/images/hero-Img.svg"
            alt="phone"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
