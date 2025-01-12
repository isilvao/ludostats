import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="h-[85vh] mx-auto max-w-[1440px] flex flex-col-reverse lg:flex-row gap-8 lg:gap-16 py-10 px-6 md:px-12 lg:px-20">
      {/* Lado izquierdo: Texto y CTA */}
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-3xl sm:text-4xl lg:text-hero font-bold text-[#4D4D4D] leading-tight">
          Simplifica la gestión de tu{' '}
          <span className="text-[#4CAF4F]">club deportivo</span>
        </h1>
        <p className="text-sm md:text-base lg:text-lg mt-4 text-[#717171]">
          LudoStats: Administra tu equipo, organiza torneos, gestiona pagos y
          mucho más en un solo lugar.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Link
            href="/sign-up"
            className="bg-[#4CAF4F] text-white hover:bg-[#4CAF4F]/80 px-8 py-3 rounded-md transition"
          >
            Empezar Ahora
          </Link>
        </div>
      </div>

      {/* Lado derecho: Imagen */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-full">
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
