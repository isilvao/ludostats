"use client";

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface CheckoutButtonProps {
  priceId: string;
}

const CheckoutButton = ({ priceId }: CheckoutButtonProps) => {
  console.log("🛒 ID recibido en CheckoutButton:", priceId); // ✅ Verificar que el ID llega correctamente al renderizar

  const handleCheckout = async () => {
    console.log("✅ Botón presionado. ID de pago:", priceId); // ✅ Verificar que el ID llega al hacer clic

    try {
      const res = await fetch('/api/send', { 
        method: 'POST',
        body: JSON.stringify({ priceId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Respuesta de la API de checkout:', errorText);
        throw new Error('Error en la solicitud de checkout');
      }

      const data = await res.json();
      console.log("✅ URL de checkout recibida:", data.url);
      window.location.href = data.url;
    } catch (error) {
      console.error('❌ Error en el proceso de checkout:', error);
      alert('Hubo un error al procesar el pago. Por favor, inténtalo de nuevo.');
    }
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