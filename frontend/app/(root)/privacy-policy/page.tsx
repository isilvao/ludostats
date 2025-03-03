import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="text-gray-700 space-y-4">{children}</div>
  </section>
);

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-[#fffbef] p-6 min-h-screen flex justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Política de Privacidad - LudoStats
        </h1>

        <Section title="Introducción">
          <p>
            Nuestras políticas están diseñadas para cumplir con la legislación
            colombiana, específicamente la <strong>Ley 1581 de 2012</strong> y
            el <strong>Decreto 1377 de 2013</strong>, además de considerar
            regulaciones internacionales como el{' '}
            <strong>Reglamento General de Protección de Datos (GDPR)</strong>{' '}
            para usuarios de otros países.
          </p>
          <p>
            Reconocemos la importancia de la protección especial que merecen los
            datos de menores de edad y establecemos mecanismos adicionales para
            garantizar su privacidad y seguridad.
          </p>
        </Section>

        <Section title="Definiciones">
          <ul className="list-disc list-inside">
            <li>
              <strong>Titular de los datos:</strong> Persona cuyos datos
              personales son objeto de tratamiento.
            </li>
            <li>
              <strong>Responsable del tratamiento:</strong> La empresa
              desarrolladora y administradora de LudoStats.
            </li>
            <li>
              <strong>Encargado del tratamiento:</strong> Terceros contratados
              para procesar datos en nombre del responsable.
            </li>
            <li>
              <strong>Datos sensibles:</strong> Información que puede afectar la
              intimidad del titular o cuyo uso indebido puede generar
              discriminación (ej.: salud, identidad, etc.).
            </li>
            <li>
              <strong>Acudiente:</strong> Persona legalmente responsable de un
              menor de edad.
            </li>
          </ul>
        </Section>

        <Section title="Finalidad del Tratamiento de Datos">
          <p>
            La recopilación y uso de los datos personales se realizará
            únicamente para:
          </p>
          <ul className="list-decimal list-inside">
            <li>
              Gestionar la creación y administración de perfiles de usuarios.
            </li>
            <li>
              Facilitar pagos de suscripciones, torneos y otros servicios del
              club.
            </li>
            <li>Registrar estadísticas deportivas de los usuarios.</li>
            <li>
              Gestionar la trazabilidad de compras, inventarios y proveedores
              del club.
            </li>
            <li>Comunicar eventos, torneos y actividades relacionadas.</li>
            <li>
              Garantizar la seguridad y trazabilidad de los usuarios,
              especialmente menores de edad.
            </li>
            <li>
              Ofrecer servicios personalizados basados en el rendimiento y
              preferencias deportivas.
            </li>
          </ul>
        </Section>

        <Section title="Recolección de Datos Personales">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            A. Información Solicitada
          </h3>
          <p>
            <strong>Para adultos:</strong>
          </p>
          <ul className="list-disc list-inside">
            <li>Nombre completo.</li>
            <li>Documento de identidad (Cédula, Pasaporte, etc.).</li>
            <li>Fecha de nacimiento.</li>
            <li>Dirección de residencia.</li>
            <li>Información de contacto (correo electrónico y teléfono).</li>
            <li>Datos financieros para pagos.</li>
          </ul>
          <p>
            <strong>Para menores de edad:</strong>
          </p>
          <ul className="list-disc list-inside">
            <li>Nombre completo del menor.</li>
            <li>
              Documento de identidad del menor (Tarjeta de identidad o
              equivalente).
            </li>
            <li>Fecha de nacimiento del menor.</li>
            <li>
              Información del acudiente:
              <ul className="list-disc list-inside ml-6">
                <li>Nombre completo.</li>
                <li>Documento de identidad.</li>
                <li>Información de contacto.</li>
              </ul>
            </li>
          </ul>
        </Section>

        <Section title="Consentimiento">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Para menores de edad:
          </h3>
          <ul className="list-disc list-inside">
            <li>
              La creación de un perfil de usuario para un menor de edad está
              condicionada a la autorización explícita y documentada de su
              acudiente legal.
            </li>
            <li>
              El consentimiento deberá incluir:
              <ul className="list-disc list-inside ml-6">
                <li>Aceptación del tratamiento de datos.</li>
                <li>
                  Autorización para que el menor acceda a los servicios del
                  club.
                </li>
                <li>Reconocimiento de las políticas de privacidad.</li>
              </ul>
            </li>
            <li>
              La página web no permitirá que un menor de edad realice pagos o
              participe en actividades sin la aprobación de su acudiente.
            </li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Para usuarios en general:
          </h3>
          <ul className="list-disc list-inside">
            <li>
              Se solicitará consentimiento explícito para la recolección y uso
              de datos durante el registro en la plataforma.
            </li>
          </ul>
        </Section>

        <Section title="Contacto">
          <p>Si tienes preguntas sobre esta política, contáctanos:</p>
          <ul className="list-disc list-inside">
            <li>
              <a
                href="mailto:privacidad@ludostats.com"
                className="text-blue-600 underline"
              >
                privacidad@ludostats.com
              </a>
            </li>
            <li>
              <a href="tel:+571234567890" className="text-blue-600 underline">
                +57 123 456 7890
              </a>
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
