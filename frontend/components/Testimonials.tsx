import React from 'react';
import { testimonials } from '../constants';
import Image from 'next/image';
import Link from 'next/link';

const Testimonials = () => {
  return (
    <section className="py-12 px-6 sm:px-10 lg:px-10 max-w-7xl mx-auto">
      <div className="container mx-auto">
        <div className="text-center mb-10 px-4 sm:px-6 lg:px-10 max-w-xl mx-auto">
          <h2 className="subtitle-1 text-[#4D4D4D]">
            Lo que nuestros usuarios dicen sobre LudoStats
          </h2>
          <p className="mt-2 body-1 text-[#717171]">
            Cientos de clubes deportivos han transformado su gestión con
            CoachHub App. Descubre cómo esta herramienta ha hecho más eficientes
            sus operaciones y llevado sus equipos al siguiente nivel.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-5">
          {testimonials.map((testimonial, index) => (
            <div key={index}>
              {/* Imagen de fondo */}
              <div className="relative">
                <Image
                  src={testimonial.avatar}
                  alt="Testimonio"
                  className="w-full h-60 object-cover rounded-xl"
                  width={300}
                  height={300}
                />
              </div>
              {/* Comentario */}
              <div className="relative -mt-10 z-10 bg-white w-10/12 mx-auto p-4 rounded-xl shadow-lg">
                <p className="text-[#717171] h3 text-center mb-2">
                  {testimonial.quote}
                </p>
                <Link
                  href="#"
                  className="mt-8 mb-2 h3 text-center text-[#4CAF4F] block hover:underline"
                >
                  Leer Más →
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mb-10 px-4 sm:px-6 lg:px-10 max-w-xl mx-auto mt-10">
          <h2 className="subtitle-1 text-[#4D4D4D]">
            ¿Quieres saber cómo funciona?
          </h2>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
