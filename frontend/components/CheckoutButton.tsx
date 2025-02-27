"use client";

import { StripeAPI } from '../api/stripe'

interface CheckoutButtonProps {
  priceId: string;
}

const CheckoutButton = ({ priceId }: CheckoutButtonProps) => {

  const handleCheckout = async () => {

    const stripeapi = new StripeAPI();

    const data = await stripeapi.createCheckoutSession(priceId);

    console.log("EL ID DEL CHECKOUT ES: ", data.id);

    window.location.href = data.url;
  };

  if (!priceId) {
    return <p className="text-red-500 text-sm">Error: No se encontró ID para el pago</p>;
  }

  return (
    <div className="flex justify-center items-center py-10">
      <button
        className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90 transition-colors"
        onClick={handleCheckout} // ✅ Llamar la función de prueba al hacer clic
      >
        Renovar suscripción
      </button>
    </div>
  );
};

export default CheckoutButton;