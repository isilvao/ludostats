import React from 'react';
import Image from 'next/image';

const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      name: 'Diego Rodríguez',
      role: 'CEO :v',
      image: '/assets/images/person-1.png',
    },
    {
      name: 'Ivan Silva',
      role: 'CTO y Desarrollador Principal',
      image: '/assets/images/person-2.png',
    },
    {
      name: 'Luis Marín',
      role: 'Gerente de Marketing',
      image: '/assets/images/person-3.png',
    },
    {
      name: 'David Castañeda',
      role: 'Especialista en Atención al Cliente',
      image: '/assets/images/person-3.png',
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
        <div className="grid md:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center"
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
