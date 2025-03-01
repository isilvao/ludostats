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
        className={`relative bg-white shadow-md rounded-lg border ${recommended ? 'border-brand' : 'border-gray-300'
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
                    {feature.included === undefined ? (
                        <span className="text-gray-500 font-bold mr-2">-</span>
                    ) : feature.included ? (
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
            name: 'Gratuito',
            price: '$0',
            features: [
                { name: 'Cantidad de clubes: 1', included: true },
                { name: 'Cantidad de equipos: 2', included: true },
                { name: 'Cantidad de tipos de estadística: 2', included: true },
                { name: 'Limite de usuarios por plan: 10', included: true },
            ],
            buttonText: 'Registrar mi club',
            clubType: 'clubes pequeños',
        },
        {
            name: 'Básico',
            price: '$71,000',
            features: [
                { name: 'Cantidad de clubes: 1', included: true },
                { name: 'Cantidad de equipos: 5', included: true },
                { name: 'Cantidad de tipos de estadística: 10', included: true },
                { name: 'Limite de usuarios por plan: 50', included: true },
            ],
            buttonText: 'Registrar mi club',
            clubType: 'clubes pequeños',
        },
        {
            name: 'Premium',
            price: '$141,000',
            features: [
                { name: 'Cantidad de clubes: 3', included: true },
                { name: 'Cantidad de equipos: 15', included: true },
                { name: 'Cantidad de tipos de estadística: 30', included: true },
                { name: 'Limite de usuarios por plan: 150', included: true },
            ],
            buttonText: 'Registrar mi club',
            recommended: true,
            clubType: 'clubes medianos',
        },
        {
            name: 'Pro',
            price: '$211,000',
            features: [
                { name: 'Cantidad de clubes: 5', included: true },
                { name: 'Cantidad de equipos: 30', included: true },
                { name: 'Cantidad de tipos de estadística: 50', included: true },
                { name: 'Limite de usuarios por plan: 300', included: true },
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

                <p className="text-center text-gray-600 mb-12">
                    Escoge el plan que mejor se ajuste a las necesidades de tu club
                    deportivo.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plans.map((plan, idx) => (
                        <PlanCard key={idx} {...plan} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pricing;