import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';

const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      name: 'Diego Rodríguez',
      role: 'Frontend Developer',
      image: '/assets/images/person-1.png',
      hrefIn: 'https://www.linkedin.com/in/diego-rodriguez-1a2b3c4d5e6f',
      hrefGh: 'https://github.com/diego-rodriguez-1a2b3c4d5e6f',
    },
    {
      name: 'Ivan Silva',
      role: 'Backend Developer',
      image: '/assets/images/person-2.png',
      hrefIn: 'https://www.linkedin.com/in/diego-rodriguez-1a2b3c4d5e6f',
      hrefGh: 'https://github.com/diego-rodriguez-1a2b3c4d5e6f',
    },
    {
      name: 'Luis Marín',
      role: 'Backend Developer',
      image: '/assets/images/person-3.png',
      hrefIn: 'https://www.linkedin.com/in/diego-rodriguez-1a2b3c4d5e6f',
      hrefGh: 'https://github.com/diego-rodriguez-1a2b3c4d5e6f',
    },
    {
      name: 'David Castañeda',
      role: 'Frontend Developer',
      image: '/assets/images/person-3.png',
      hrefIn: 'https://www.linkedin.com/in/diego-rodriguez-1a2b3c4d5e6f',
      hrefGh: 'https://github.com/diego-rodriguez-1a2b3c4d5e6f',
    },
  ];

  return (
    <div className="pt-10 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Título */}
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Sobre Nosotros
        </h2>
        <p className="text-center text-gray-600 mb-12">
          En LudoStats, nos apasiona el deporte y la tecnología. Nos dedicamos a
          facilitar la gestión de clubes deportivos, permitiendo que cada equipo
          alcance su máximo potencial.
        </p>

        {/* Sección de Misión, Visión y Valores */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Nuestra Misión
            </h3>
            <p className="text-gray-600">
              Revolucionar la gestión administrativa y deportiva de clubes
              mediante una plataforma intuitiva y eficiente, que simplifique
              procesos, mejore el rendimiento y fomente la organización,
              eliminando el caos de los métodos tradicionales.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Nuestra Visión
            </h3>
            <p className="text-gray-600">
              Para 2034, seremos la plataforma líder en gestión deportiva con
              presencia internacional, digitalizando y centralizando la
              administración y evaluación del rendimiento en los clubes.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Nuestros Valores
            </h3>
            <p className="text-gray-600">
              Innovación, transparencia, trabajo en equipo y compromiso con
              nuestros usuarios.
            </p>
          </div>
        </div>

        {/* Equipo */}
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Nuestro Equipo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105"
            >
              <Image
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mb-4 object-cover"
                width={150}
                height={150}
              />
              <h4 className="text-lg font-semibold text-gray-800">
                {member.name}
              </h4>
              <p className="text-sm text-gray-600">{member.role}</p>
              <div className="flex gap-4 mt-4">
                <Link
                  href={member.hrefGh}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white w-10 h-10  bg-gray-800 transition transform hover:scale-110 text-center flex items-center justify-center rounded-full"
                >
                  <FaGithub className="w-6 h-6" />
                </Link>
                <Link
                  href={member.hrefIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white w-10 h-10  bg-gray-800 transition transform hover:scale-110 text-center flex items-center justify-center rounded-full"
                >
                  <FaLinkedinIn className="w-6 h-6" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
