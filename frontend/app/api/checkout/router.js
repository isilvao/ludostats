import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST(req) {
  console.log("✅ API /api/checkout recibió una solicitud");

  let body;
  try {
    body = await req.json();
    console.log("✅ Cuerpo recibido en API checkout:", body);
  } catch (error) {
    console.error("❌ Error al leer el cuerpo de la solicitud:", error);
    return NextResponse.json({ error: "Error al leer los datos" }, { status: 400 });
  }

  const { priceId } = body;

  if (!priceId) {
    console.error("❌ Error: priceId no recibido en la API.");
    return NextResponse.json({ error: "ID de precio no proporcionado" }, { status: 400 });
  }

  console.log("✅ ID de precio recibido:", priceId);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    console.log("✅ URL de checkout creada:", session.url);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("❌ Error creando sesión de Stripe:", error);
    return NextResponse.json({ error: "Error creando sesión de checkout" }, { status: 500 });
  }
}
