"use client";

import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CheckoutButton = () => {
  useEffect(() => {
    fetch('/api/check-secret-key?route=check-secret-key')
      .then(response => response.json())
      .then(data => console.log(data.message))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const response = await fetch('/api/check-secret-key?route=checkout', {
      method: 'POST',
    });

    const { id } = await response.json();

    await stripe?.redirectToCheckout({ sessionId: id });
  };

  return <button onClick={handleCheckout}>Pagar con Stripe</button>;
};

console.log("🔑 Clave pública de Stripe (Frontend):", process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default CheckoutButton;