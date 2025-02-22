import { basePath, apiVersion } from './config';
import Stripe from 'stripe';


export default async function handler(req, res) {

  const baseApiUrl = `${basePath}/${apiVersion}`;

  const url = `${baseApiUrl}/getSecretKeyStripe`;

  const response = await fetch(url);
  const result = await response.json();

  if (response.status !== 200) throw result;

  console.log("WTFFF SECRET KEYYY", result)

  const stripe = new Stripe(SECRETKEY);
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === '/api/check-secret-key' && req.query.route === 'check-secret-key') {
    console.log("🔐 Clave secreta de Stripe (Backend):", SECRETKEY);
    return res.status(200).json({ message: 'Clave secreta de Stripe registrada en el servidor' });
  }

  if (pathname === '/api/check-secret-key' && req.query.route === 'checkout') {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: 'Producto de prueba' },
              unit_amount: 5000, // Precio en centavos (50 USD)
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      return res.status(200).json({ id: session.id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(404).json({ error: 'Ruta no encontrada' });
}