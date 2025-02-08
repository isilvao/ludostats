import React from 'react';
// import { testimonials } from '../constants';
// import Image from 'next/image';
import Link from 'next/link';

const Testimonials = () => {
  return (
    <>
      {/* <section className="py-12 6 max-w-7xl mx-auto">
        <div className="container mx-auto">
          <div className="text-center mb-10 px-0 sm:px-6 lg:px-10 max-w-xl mx-auto">
            <h2 className="subtitle-2 sm:subtitle-1 text-[#4D4D4D]">
              Lo que nuestros usuarios dicen sobre LudoStats
            </h2>
            <p className="mt-2 body-1 text-[#717171]">
              Cientos de clubes deportivos han transformado su gestión con
              CoachHub App. Descubre cómo esta herramienta ha hecho más
              eficientes sus operaciones y llevado sus equipos al siguiente
              nivel.
            </p>
          </div>
          <div className="flex justify-center px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 md:gap-5">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`relative max-w-[350px] ${
                    testimonials.length === 3 && index === 2
                      ? 'md:col-span-2 md:mx-auto lg:col-span-1 lg:mx-0'
                      : ''
                  }`}
                >
                  <div className="relative group overflow-hidden rounded-xl shadow-lg">
                    <Image
                      src={testimonial.avatar}
                      alt="Testimonio"
                      className="w-full h-64 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                      width={300}
                      height={300}
                    />
                  </div>

                  <div className="relative -mt-20 z-10 bg-white w-10/12 mx-auto p-4 rounded-xl shadow-lg flex flex-col justify-between sm:min-h-[335px]">
                    <p className="text-[#717171] h4 sm:h3 text-center mb-2">
                      {testimonial.quote}
                    </p>
                    <Link
                      href="#"
                      className="mt-8 mb-2 h4 sm:h3 text-center text-[#4CAF4F] block hover:underline"
                    >
                      Leer Más →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}
      <section className="py-12 bg-[#F7F7F7]">
        <div className="text-center mb-10 max-w-2xl mx-auto mt-10">
          <h2 className="h1 md:text-hero text-[#4D4D4D]">
            ¿Quieres saber cómo funciona?
          </h2>
          <Link
            href="/sign-up"
            className="bg-[#4CAF4F] text-white hover:bg-[#4CAF4F]/80 px-8 py-3 rounded-md transition mt-8 inline-block"
          >
            Empezar Ahora
          </Link>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
