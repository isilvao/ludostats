"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import { StripeAPI } from '../../../../api/stripe';

interface PlanProps {
    name: string | null;
    price: string;
    features: { name: string; included: boolean }[];
    buttonText: string;
    recommended?: boolean;
    clubType: string;
    id?: string | null;
}

const PlanCard: React.FC<PlanProps> = ({
    name,
    price,
    features,
    buttonText,
    recommended,
    clubType,
    id,
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
                    {feature.included ? (
                        <span className="text-brand font-bold mr-2">✔</span>
                    ) : (
                        <span className="text-red font-bold mr-2">✘</span>
                    )}
                    {feature.name}
                </li>
            ))}
        </ul>
        {id ? (
            <CheckoutButton priceId={id} />
        ) : (
            <p className="text-red-500 text-sm">Error: No se encontró ID para este plan</p>
        )}
    </div>
);

async function getConversionRate(EXCHANGE_RATE_API_KEY: string) {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`);
        if (!response.ok) {
            throw new Error(`Error fetching conversion rate: ${response.statusText}`);
        }
        const data = await response.json();
        return (data as { conversion_rates: { COP: number } }).conversion_rates.COP;
    } catch (error) {
        console.error('Error fetching conversion rate:', error);
        return 1; // Default conversion rate in case of error
    }
}

function formatPrice(price: number): string {
    const roundedPrice = Math.ceil(price / 1000) * 1000;
    return `$${roundedPrice.toLocaleString('es-CO')}`;
}

async function getPricingData() {
    try {
        const stripeapi = new StripeAPI();
        const res = await stripeapi.getPrices();

        const conversionRate = await getConversionRate(res.EXCHANGE_RATE_API_KEY);

        const plans = [
            {
                name: 'Básico',
                price: 38000,
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
                price: 79900,
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
                price: 119900,
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

        const combinedPlans = plans.map((plan) => {
            const matchingPrice = res.prices.data.find((price: any) => price.nickname === plan.name);
            if (matchingPrice) {
                return {
                    ...plan,
                    name: matchingPrice.nickname,
                    price: matchingPrice.unit_amount ? formatPrice((matchingPrice.unit_amount / 100) * conversionRate) : '$0',
                    id: matchingPrice.id,
                };
            }
            return { ...plan, id: null };
        });

        return combinedPlans;
    } catch (error) {
        console.error('Error fetching pricing data:', error);
        return [];
    }
}

const PricingPage: React.FC = () => {
    const [plans, setPlans] = useState<PlanProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPricingData();
            setPlans(data.map(plan => ({ ...plan, price: plan.price.toString() })) as PlanProps[]);
        };
        fetchData();
    }, []);

    return (
        <div className="pt-10 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-center text-[#4D4D4D] mb-5">
                    Planes y precios
                </h2>
                <p className="text-center text-gray-600 mb-12">
                    Escoge el plan que mejor se ajuste a las necesidades de tu club deportivo.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <div key={idx}>
                            <PlanCard {...plan} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingPage;