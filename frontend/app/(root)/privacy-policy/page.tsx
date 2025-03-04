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
            LudoStats respeta tu privacidad y cumple con la legislación
            colombiana, específicamente la <strong>Ley 1581 de 2012</strong> y
            el <strong>Decreto 1377 de 2013</strong>, además de considerar
            regulaciones internacionales como el{' '}
            <strong>Reglamento General de Protección de Datos (GDPR)</strong>{' '}
            para usuarios de otros países.
          </p>
          <p>
            Si utilizas nuestra plataforma, aceptas el tratamiento de tus datos
            según lo establecido en esta política.
          </p>
        </Section>

        <Section title="Definiciones">
          <ul className="list-disc list-inside">
            <li>
              <strong>Titular de los datos:</strong> Persona cuyos datos
              personales son tratados.
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

        <Section title="Reglas sobre la Creación de Cuentas">
          <ul className="list-disc list-inside">
            <li>Solo los mayores de edad pueden crear cuentas en LudoStats.</li>
            <li>
              Un adulto puede registrar a un menor como parte de su cuenta (por
              ejemplo, un padre agregando a su hijo).
            </li>
            <li>
              No permitimos que los menores de edad creen cuentas
              independientes.
            </li>
          </ul>
        </Section>

        <Section title="Finalidad del Tratamiento de Datos">
          <p>Los datos recopilados se utilizarán únicamente para:</p>
          <ul className="list-decimal list-inside">
            <li>Gestionar cuentas y perfiles de usuario.</li>
            <li>
              Facilitar pagos de suscripciones, torneos y otros servicios.
            </li>
            <li>
              Registrar estadísticas deportivas y rendimiento de los usuarios.
            </li>
            <li>Comunicar eventos, torneos y actividades.</li>
            <li>Garantizar la seguridad y trazabilidad de los usuarios.</li>
            <li>Mejorar nuestros servicios con análisis de datos agregados.</li>
          </ul>
        </Section>

        <Section title="Recolección de Datos Personales">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            5.1 Datos de Adultos
          </h3>
          <ul className="list-disc list-inside">
            <li>Nombre completo.</li>
            <li>Documento de identidad (Cédula, Pasaporte, etc.).</li>
            <li>Fecha de nacimiento.</li>
            <li>Dirección de residencia.</li>
            <li>Información de contacto (correo electrónico y teléfono).</li>
            <li>Datos financieros para pagos.</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            5.2 Datos de Menores de Edad
          </h3>
          <p>
            Si un usuario adulto agrega a un menor a su cuenta, solo
            recopilamos:
          </p>
          <ul className="list-disc list-inside">
            <li>Nombre completo del menor.</li>
            <li>
              Adicionalmente, recopilamos información del acudiente:
              <ul className="list-disc list-inside ml-6">
                <li>Nombre completo.</li>
                <li>Documento de identidad.</li>
                <li>Información de contacto.</li>
              </ul>
            </li>
          </ul>
          <p>
            No recopilamos información adicional de los menores sin
            consentimiento explícito del acudiente.
          </p>
        </Section>

        <Section title="Consentimiento y Protección de Datos de Menores">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            6.1 Para menores de edad:
          </h3>
          <ul className="list-disc list-inside">
            <li>
              El registro de un menor en la plataforma solo es posible si un
              adulto lo agrega a su cuenta.
            </li>
            <li>
              Se requiere autorización del acudiente para el tratamiento de los
              datos del menor.
            </li>
            <li>
              No permitimos que los menores de edad realicen pagos o participen
              en actividades sin aprobación del acudiente.
            </li>
            <li>
              Los acudientes pueden eliminar la información de su hijo en
              cualquier momento.
            </li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            6.2 Para todos los usuarios:
          </h3>
          <ul className="list-disc list-inside">
            <li>
              Al registrarse en LudoStats, el usuario otorga consentimiento
              explícito para la recolección y uso de sus datos personales.
            </li>
            <li>
              En cualquier momento, los usuarios pueden revocar su
              consentimiento o solicitar la eliminación de sus datos.
            </li>
          </ul>
        </Section>

        <Section title="Derechos de los Usuarios sobre sus Datos">
          <p>Los usuarios tienen derecho a:</p>
          <ul className="list-disc list-inside">
            <li>
              Acceder a sus datos personales almacenados en nuestra plataforma.
            </li>
            <li>
              Rectificar cualquier información incorrecta o desactualizada.
            </li>
            <li>Eliminar su cuenta y los datos asociados.</li>
            <li>Solicitar información sobre cómo tratamos sus datos.</li>
          </ul>
          <p>
            Para ejercer estos derechos, contáctanos a{' '}
            <a
              href="mailto:privacidad@ludostats.com"
              className="text-blue-600 underline"
            >
              privacidad@ludostats.com
            </a>
            .
          </p>
        </Section>

        <Section title="Seguridad y Almacenamiento de Datos">
          <ul className="list-disc list-inside">
            <li>
              Usamos protocolos de seguridad y cifrado para proteger la
              información de nuestros usuarios.
            </li>
            <li>Los datos solo son accesibles por personal autorizado.</li>
            <li>
              No vendemos ni compartimos datos personales con terceros sin
              consentimiento.
            </li>
            <li>
              Los datos se almacenan por el tiempo necesario para cumplir con
              nuestras finalidades y obligaciones legales.
            </li>
          </ul>
        </Section>

        <Section title="Contacto">
          <p>
            Si tienes preguntas sobre esta política de privacidad, puedes
            contactarnos:
          </p>
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
