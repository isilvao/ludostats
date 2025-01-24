'use client';
import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center py-4 focus:outline-none"
      >
        <span className="text-lg font-medium text-gray-800">{question}</span>
        <svg
          className={`w-6 h-6 transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <p className="text-gray-600 mt-2">{answer}</p>}
    </div>
  );
};

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: '¿Qué es LudoStats y para qué sirve?',
      answer:
        'LudoStats es una plataforma diseñada para ayudar a los clubes deportivos a gestionar miembros, controlar pagos, analizar estadísticas y optimizar sus operaciones.',
    },
    {
      question: '¿Puedo usar LudoStats para varios clubes?',
      answer:
        'Sí, LudoStats permite gestionar múltiples clubes desde una sola cuenta, lo que facilita la administración centralizada.',
    },
    {
      question: '¿Cómo puedo realizar un pago?',
      answer:
        'Los pagos se pueden realizar directamente a través de nuestra plataforma con métodos seguros como tarjetas de crédito, débito o transferencias electrónicas.',
    },
    {
      question: '¿LudoStats es seguro para almacenar datos?',
      answer:
        'Sí, utilizamos estándares de seguridad de nivel empresarial, como encriptación de datos y copias de seguridad regulares, para garantizar que tu información esté protegida.',
    },
    {
      question: '¿Ofrecen soporte técnico en caso de problemas?',
      answer:
        'Sí, ofrecemos soporte técnico para todos los planes. Los usuarios de planes Premium y Pro tienen acceso a soporte prioritario.',
    },
    {
      question: '¿Puedo cancelar mi suscripción en cualquier momento?',
      answer:
        'Sí, puedes cancelar tu suscripción en cualquier momento desde tu cuenta. El acceso a las funcionalidades se mantendrá hasta el final del período pagado.',
    },
    {
      question: '¿Se pueden personalizar las funcionalidades?',
      answer:
        'Ofrecemos la posibilidad de personalizar ciertas características bajo el plan Pro. Contáctanos para más detalles.',
    },
  ];

  return (
    <div className="pt-10 pb-32">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-5">
          Preguntas Frecuentes
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Resolvemos las dudas más comunes para que aproveches al máximo
          LudoStats.
        </p>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} {...faq} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
