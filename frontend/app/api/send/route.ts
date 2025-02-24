import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { Stripe } from 'stripe';

const resend = new Resend('re_AyQTq895_HDdFFDVdEJtDPTBH5qRCpfZ8');

// ✅ API para enviar correos
export async function POST(request: Request) {
  try {
    // Leer los valores del cuerpo de la solicitud
    const body = await request.json();

    // Si el body tiene `firstName`, `otp`, `email`, es una solicitud de correo
    if (body.firstName && body.otp && body.email) {
      const { firstName, otp, email } = body;

      // Enviar correo
      const { data, error } = await resend.emails.send({
        from: 'general@ludostats.com',
        to: [email],
        subject: 'Solicitud cambio de contraseña',
        text: '',
        html: `
          <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { margin: 0; padding: 20px; background-color: #f4f4f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
                .container { background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 30px; }
                h1 { font-size: 24px; color: #333333; margin-bottom: 20px; }
                p { font-size: 16px; color: #555555; line-height: 1.5; }
                .otp { font-weight: bold; color: #e74c3c; }
                .footer { margin-top: 20px; font-size: 12px; color: #999999; text-align: center; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Bienvenido, ${firstName}!</h1>
                <p>Tu código de un solo uso es: <span class="otp">${otp}</span></p>
                <p>Por favor, usa este código para restablecer tu contraseña.</p>
                <p class="footer">Si no solicitaste un cambio de contraseña, por favor ignora este correo.</p>
              </div>
            </body>
          </html>
        `,
      });

      // Manejo de errores al enviar el correo
      if (error) {
        return NextResponse.json({ error }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    // ✅ Si el body tiene `priceId`, es una solicitud de pago con Stripe
    if (body.priceId) {
      console.log("✅ Creando sesión de Stripe con priceId:", body.priceId);

      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeSecretKey) {
        throw new Error('❌ Stripe secret key is not defined');
      }
      const stripe = new Stripe(stripeSecretKey, { apiVersion: "2025-01-27.acacia" });

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price: body.priceId,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${request.headers.get('origin')}/cancel`,
        });

        console.log("✅ URL de checkout creada:", session.url);
        return NextResponse.json({ url: session.url });
      } catch (error) {
        console.error("❌ Error creando sesión de Stripe:", error);
        return NextResponse.json({ error: "Error creando sesión de checkout" }, { status: 500 });
      }
    }

    // ❌ Si no hay datos válidos
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// ✅ API para obtener precios de Stripe
export async function GET() {
  console.log("✅ Obteniendo precios de Stripe...");
  
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error('❌ Stripe secret key is not defined');
  }
  const stripe = new Stripe(stripeSecretKey);
  const prices = await stripe.prices.list();
  
  console.log("✅ Precios obtenidos:", prices);
  return NextResponse.json(prices);
}
