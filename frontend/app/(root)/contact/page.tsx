import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import {
  FaThreads,
  FaXTwitter,
  FaPhoneFlip,
  FaLocationDot,
} from 'react-icons/fa6';
import { IoIosMail } from 'react-icons/io';

const ContactUs = () => {
  return (
    <section className="py-12 max-w-7xl mx-auto">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-10 px-0 sm:px-6 lg:px-10 max-w-xl mx-auto">
          <h2 className="subtitle-2 sm:subtitle-1 text-[#4D4D4D]">
            ¿Tienes alguna pregunta? ¡Contáctanos!
          </h2>
          <p className="mt-2 body-1 text-[#717171]">
            Estamos aquí para ayudarte. Completa el formulario o utiliza la
            información de contacto para comunicarte con nosotros.
          </p>
        </div>

        {/* Formulario de Contacto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Ingresa tu nombre"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#4CAF4F] text-white py-2 rounded-md hover:bg-[#4CAF4F]/80 transition"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="subtitle-2 text-[#4D4D4D]">
                Información de Contacto
              </h3>
              <p className="mt-2 body-1 text-[#717171]">
                Comunícate con nosotros directamente a través de nuestros
                canales de contacto.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <IoIosMail className="w-6 h-6 text-[#4D4D4D]" />
                <p className="ml-3 text-[#4D4D4D]">
                  <a
                    href="mailto:soporte@ludostats.com"
                    className="hover:underline"
                  >
                    soporte@ludostats.com
                  </a>
                </p>
              </div>
              <div className="flex items-center">
                <FaPhoneFlip className="w-6 h-6 text-[#4D4D4D]" />
                <p className="ml-3 text-[#4D4D4D]">
                  <a href="tel:+1234567890" className="hover:underline">
                    +123 456 7890
                  </a>
                </p>
              </div>
              <div className="flex items-center">
                <FaLocationDot className="w-6 h-6 text-[#4D4D4D]" />
                <p className="ml-3 text-[#4D4D4D]">
                  Avenida Principal 123, Ciudad Deportiva
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="text-center mt-12">
          <h3 className="subtitle-2 text-[#4D4D4D]">
            Síguenos en Redes Sociales
          </h3>
          <div className="flex justify-center mt-4 space-x-6">
            <Link
              href="https://www.instagram.com/ludostats/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white w-10 h-10  bg-zinc-800 transition transform hover:scale-110 text-center flex items-center justify-center rounded-full"
            >
              <FaInstagram className="w-6 h-6" />
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white w-10 h-10  bg-gray-800 transition transform hover:scale-110 text-center flex items-center justify-center rounded-full"
            >
              <FaXTwitter className="w-6 h-6" />
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white w-10 h-10  bg-gray-800 transition transform hover:scale-110 text-center flex items-center justify-center rounded-full"
            >
              <FaThreads className="w-6 h-6" />
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white w-10 h-10  bg-gray-800 transition transform hover:scale-110 text-center flex items-center justify-center rounded-full"
            >
              <FaLinkedinIn className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Ayuda Rápida */}
        <div className="text-center mt-16">
          <p className="text-[#717171]">
            ¿Tienes dudas frecuentes? Visita nuestra{' '}
            <a href="/faq" className="text-[#4CAF4F] hover:underline">
              sección de preguntas frecuentes
            </a>{' '}
            para obtener ayuda inmediata.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
