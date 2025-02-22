import React from 'react';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';


interface PlanProps {
  name: string;
  price: string;
  features: { name: string; included: boolean }[];
  buttonText: string;
  recommended?: boolean;
  clubType: string;
}

const PlanCard: React.FC<PlanProps> = ({
  name,
  price,
  features,
  buttonText,
  recommended,
  clubType,
}) => (
  <div
    className={`relative bg-white shadow-md rounded-lg border ${
      recommended ? 'border-brand' : 'border-gray-300'
    } p-6 flex flex-col items-center transition-transform transform hover:scale-105`}
  >
    {recommended && (
      <div className="absolute -top-4 bg-brand text-white px-4 py-1 rounded-full text-sm font-semibold">
        Recomendado
      </div>
    )}
    <h3 className="text-2xl font-semibold text-gray-800">{name}</h3>
    <p className="text-gray-600 text-sm mb-4">Ideal para {clubType}.</p>
    <div className="flex items-end mb-6">
      <span className="text-4xl font-bold text-gray-900">{price}</span>
      <span className="text-sm text-gray-600 ml-1">/mes</span>
    </div>
    <ul className="space-y-2 mb-6">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-center text-gray-700">
          {feature.included ? (
            <span className="text-brand font-bold mr-2">✔</span>
          ) : (
            <span className="text-red font-bold mr-2">✘</span>
          )}
          {feature.name}
        </li>
      ))}
    </ul>
    <Link
      href="/sign-up"
      className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90 transition-colors"
    >
      {buttonText}
    </Link>
  </div>
);

const Pricing: React.FC = () => {
  const plans = [
    {
      name: 'Básico',
      price: '$38,000',
      features: [
        { name: 'Gestión de miembros', included: true },
        { name: 'Control de pagos', included: true },
        { name: 'Estadísticas básicas', included: true },
        { name: 'Soporte por email', included: true },
        { name: 'Gestión avanzada', included: false },
        { name: 'Soporte prioritario', included: false },
        { name: 'Integraciones con terceros', included: false },
      ],
      buttonText: 'Registrar mi club',
      clubType: 'clubes pequeños',
    },
    {
      name: 'Premium',
      price: '$79,900',
      features: [
        { name: 'Gestión de miembros', included: true },
        { name: 'Control de pagos', included: true },
        { name: 'Estadísticas avanzadas', included: true },
        { name: 'Soporte por email', included: true },
        { name: 'Gestión avanzada', included: true },
        { name: 'Soporte prioritario', included: true },
        { name: 'Integraciones con terceros', included: false },
      ],
      buttonText: 'Registrar mi club',
      recommended: true,
      clubType: 'clubes medianos',
    },
    {
      name: 'Pro',
      price: '$119,900',
      features: [
        { name: 'Gestión de miembros', included: true },
        { name: 'Control de pagos', included: true },
        { name: 'Estadísticas avanzadas', included: true },
        { name: 'Soporte por email', included: true },
        { name: 'Gestión avanzada', included: true },
        { name: 'Soporte prioritario', included: true },
        { name: 'Integraciones con terceros', included: true },
      ],
      buttonText: 'Registrar mi club',
      clubType: 'clubes grandes',
    },
  ];

  return (
    <div className="pt-10 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-[#4D4D4D] mb-5">
          Planes y precios
        </h2>
        


        <div>
          <h1>Compra un producto</h1>
          <CheckoutButton />
        </div>
    
 


        <p className="text-center text-gray-600 mb-12">
          Escoge el plan que mejor se ajuste a las necesidades de tu club
          deportivo.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <PlanCard key={idx} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
