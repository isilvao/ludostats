'use client';
import React, { useState } from 'react';

const SubscriptionPage: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState('Plan 2'); // Plan actual

  const plans = [
    {
      name: 'Plan 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Plan 2',
      description:
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      name: 'Plan 3',
      description:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Planes de Suscripción
      </h1>

      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-6 rounded-md shadow-lg ${currentPlan === plan.name
                ? 'border-2 border-green-500 bg-green-50'
                : 'bg-white'
              }`}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {plan.name}
            </h2>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            {currentPlan === plan.name ? (
              <span className="text-green-600 font-bold">
                Este es tu plan actual
              </span>
            ) : (
              <button
                className="bg-[#4CAF4F] text-white px-4 py-2 rounded-md font-bold hover:bg-[#4CAF4F]/80"
                onClick={() => setCurrentPlan(plan.name)}
              >
                Cambiar a este plan
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
