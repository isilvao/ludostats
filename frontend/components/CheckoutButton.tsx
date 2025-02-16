import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CheckoutButton = () => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const response = await fetch('/api/checkout', {
      method: 'POST',
    });

    const { id } = await response.json();

    await stripe?.redirectToCheckout({ sessionId: id });
  };

  return <button onClick={handleCheckout}>Pagar con Stripe</button>;
};

export default CheckoutButton;
