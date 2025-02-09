import React from 'react';
import {
  FaUsers,
  FaMoneyBillWave,
  FaChartBar,
  FaBell,
  FaCalendarAlt,
  FaFileAlt,
} from 'react-icons/fa';
import Link from 'next/link';

const Functionalities: React.FC = () => {
  const features = [
    {
      title: 'Gestión de Miembros',
      description:
        'Administra fácilmente todos los miembros del club, con perfiles detallados y herramientas para segmentar por roles y categorías.',
      icon: <FaUsers size={48} className="text-blue-500 mb-4" />,
    },
    {
      title: 'Control de Pagos',
      description:
        'Simplifica los pagos con recordatorios automáticos, informes financieros y múltiples métodos de pago integrados.',
      icon: <FaMoneyBillWave size={48} className="text-green-500 mb-4" />,
    },
    {
      title: 'Estadísticas Avanzadas',
      description:
        'Obtén análisis detallados sobre el rendimiento de los equipos y miembros para tomar decisiones informadas.',
      icon: <FaChartBar size={48} className="text-purple-500 mb-4" />,
    },
    {
      title: 'Notificaciones en Tiempo Real',
      description:
        'Mantente al tanto con notificaciones automáticas para eventos, pagos y actualizaciones importantes.',
      icon: <FaBell size={48} className="text-yellow-500 mb-4" />,
    },
    {
      title: 'Calendario de Actividades',
      description:
        'Organiza entrenamientos, partidos y eventos con un calendario intuitivo y sincronización en tiempo real.',
      icon: <FaCalendarAlt size={48} className="text-red-500 mb-4" />,
    },
    {
      title: 'Gestión Documental',
      description:
        'Sube, comparte y gestiona documentos importantes como contratos, reglamentos o reportes desde una única plataforma.',
      icon: <FaFileAlt size={48} className="text-teal-500 mb-4" />,
    },
  ];

  return (
    <div className="pt-12 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Título */}
        <h2 className="text-4xl font-bold text-center text-[#4D4D4D] mb-5">
          Funcionalidades
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Descubre cómo LudoStats puede transformar la gestión de tu club
          deportivo con herramientas diseñadas para facilitar cada tarea.
        </p>

        {/* Funcionalidades */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/sign-up"
            className="bg-brand text-white px-12 py-4 rounded-lg shadow-lg hover:bg-brand/90 transition duration-300"
          >
            Comienza Ahora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Functionalities;
