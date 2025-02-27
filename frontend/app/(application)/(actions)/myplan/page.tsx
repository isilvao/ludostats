'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import { StripeAPI } from '../../../../api/stripe';
import LoadingScreen from '@/components/LoadingScreen';
import { useAuth } from '@/hooks';

interface PlanProps {
    name: string | null;
    price: string;
    features: { name: string; included: boolean }[];
    buttonText: string;
    recommended?: boolean;
    clubType: string;
    id?: string | null;
    isActive?: boolean;
}

const PlanCard: React.FC<PlanProps> = ({
    name,
    price,
    features,
    buttonText,
    recommended,
    clubType,
    id,
    isActive,
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
        {isActive ? (
            <div className="flex justify-center items-center py-10">
                <button
                    className="bg-[#378535] text-white px-4 py-2 rounded-lg hover:bg-[#378535]/90 transition-colors">
                    Plan activo
                </button>
            </div>
        ) : (
            id && name !== 'Gratuito' ? (
                <CheckoutButton priceId={id} />
            ) : (
                name !== 'Gratuito' && (
                    <p className="text-red-500 text-sm">
                        Error: No se encontró ID para este plan
                    </p>
                )
            )
        )}
    </div>
);

async function getConversionRate(EXCHANGE_RATE_API_KEY: string) {
    try {
        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`
        );
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
                name: 'Gratuito',
                price: 0,
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
                price: 71000,
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
                price: 141000,
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
                price: 211000,
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

        const combinedPlans = plans.map((plan) => {
            const matchingPrice = res.prices.data.find(
                (price: any) => price.nickname === plan.name
            );
            if (matchingPrice) {
                return {
                    ...plan,
                    name: matchingPrice.nickname,
                    price: matchingPrice.unit_amount
                        ? formatPrice((matchingPrice.unit_amount / 100) * conversionRate)
                        : '$0',
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
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPricingData();
            setPlans(data.map(plan => ({
                ...plan,
                price: plan.price.toString(),
                isActive: user?.tipo_suscripcion === plan.name?.toLowerCase()
            })) as PlanProps[]);

            setIsLoading(false);
        };
        fetchData();
    }, [user]);

    if (isLoading) {
        return <LoadingScreen />;
    }

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