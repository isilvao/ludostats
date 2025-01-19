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

const TermsOfService: React.FC = () => {
  return (
    <div className="p-6 min-h-screen flex justify-center">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Términos y Condiciones - LudoStats
        </h1>

        <Section title="Introducción">
          <p>
            Bienvenido a <strong>LudoStats</strong>, una plataforma integral
            para la gestión de clubes deportivos. Estos términos y condiciones
            (en adelante, los "Términos") regulan el uso de nuestros servicios.
            Al acceder o utilizar nuestra plataforma, aceptas cumplir con estos
            Términos en su totalidad.
          </p>
          <p>
            Si no estás de acuerdo con alguna parte de estos Términos, te
            recomendamos no utilizar nuestros servicios.
          </p>
        </Section>

        <Section title="Definiciones">
          <ul className="list-disc list-inside">
            <li>
              <strong>Plataforma:</strong> Software y servicios ofrecidos por
              LudoStats para la gestión de clubes deportivos, incluyendo
              funcionalidades de pagos, membresías y estadísticas.
            </li>
            <li>
              <strong>Usuario:</strong> Persona física o jurídica que utiliza la
              plataforma.
            </li>
            <li>
              <strong>Administrador:</strong> Usuario responsable de la gestión
              de un club dentro de la plataforma.
            </li>
            <li>
              <strong>Miembro:</strong> Cualquier persona asociada a un club
              deportivo gestionado en la plataforma, como jugadores,
              entrenadores o staff.
            </li>
            <li>
              <strong>Datos:</strong> Información ingresada, almacenada o
              procesada a través de la plataforma, incluyendo datos personales y
              financieros.
            </li>
          </ul>
        </Section>

        <Section title="Registro y Cuenta">
          <ul className="list-decimal list-inside">
            <li>
              <strong>Registro:</strong> Para acceder a las funcionalidades de
              LudoStats, es necesario crear una cuenta, proporcionando
              información precisa y actualizada.
            </li>
            <li>
              <strong>Confidencialidad:</strong> Los usuarios son responsables
              de mantener la confidencialidad de sus credenciales de acceso.
            </li>
            <li>
              <strong>Autorización:</strong> Al registrarse, declaras que tienes
              la autoridad para actuar en nombre del club que representas.
            </li>
          </ul>
        </Section>

        <Section title="Uso Permitido">
          <ul className="list-disc list-inside">
            <li>
              Los servicios de LudoStats están destinados únicamente para la
              gestión de clubes deportivos. Cualquier uso fuera de este
              propósito está prohibido.
            </li>
            <li>
              No está permitido el uso de la plataforma para actividades
              fraudulentas, ilegales o que infrinjan los derechos de terceros.
            </li>
          </ul>
        </Section>

        <Section title="Pagos y Suscripciones">
          <ul className="list-decimal list-inside">
            <li>
              <strong>Plan de Suscripción:</strong> Algunas funcionalidades de
              LudoStats están disponibles mediante planes de suscripción. Los
              detalles del precio, duración y beneficios estarán especificados
              al momento de la contratación.
            </li>
            <li>
              <strong>Retrasos en Pagos:</strong> En caso de impago, LudoStats
              se reserva el derecho de suspender el acceso a las funcionalidades
              premium.
            </li>
            <li>
              <strong>Reembolsos:</strong> No se otorgarán reembolsos por
              servicios ya prestados.
            </li>
          </ul>
        </Section>

        <Section title="Responsabilidad del Usuario">
          <ul className="list-disc list-inside">
            <li>
              Garantizas que la información proporcionada en la plataforma es
              precisa y que tienes los derechos necesarios para utilizar los
              datos ingresados.
            </li>
            <li>
              Eres responsable de cualquier actividad realizada desde tu cuenta,
              incluyendo la gestión de pagos y datos de miembros.
            </li>
          </ul>
        </Section>

        <Section title="Protección de Datos">
          <p>
            LudoStats cumple con las normativas aplicables de protección de
            datos personales. Consulta nuestra{' '}
            <a href="/privacy-policy" className="text-blue-600 underline">
              Política de Privacidad
            </a>{' '}
            para más detalles.
          </p>
        </Section>

        <Section title="Modificaciones a los Servicios">
          <p>
            Nos reservamos el derecho de modificar, suspender o interrumpir
            cualquier funcionalidad de la plataforma, notificando a los usuarios
            con antelación razonable.
          </p>
        </Section>

        <Section title="Propiedad Intelectual">
          <p>
            Todo el contenido, software y materiales relacionados con LudoStats
            son propiedad exclusiva de LudoStats o de sus licenciantes. Queda
            prohibida su reproducción, distribución o uso sin autorización
            previa.
          </p>
        </Section>

        <Section title="Limitación de Responsabilidad">
          <p>
            LudoStats no será responsable de pérdidas indirectas, interrupciones
            del servicio o cualquier daño causado por el uso indebido de la
            plataforma.
          </p>
        </Section>

        <Section title="Resolución de Disputas">
          <p>
            Cualquier disputa relacionada con el uso de LudoStats se resolverá
            bajo las leyes del país donde opera la empresa. Las partes acuerdan
            someterse a la jurisdicción de los tribunales correspondientes.
          </p>
        </Section>

        <Section title="Contacto">
          <p>
            Si tienes preguntas sobre estos Términos, puedes contactarnos en:
          </p>
          <ul className="list-disc list-inside">
            <li>
              Email:{' '}
              <a
                href="mailto:contacto@ludostats.com"
                className="text-blue-600 underline"
              >
                contacto@ludostats.com
              </a>
            </li>
            <li>
              Teléfono:{' '}
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

export default TermsOfService;
