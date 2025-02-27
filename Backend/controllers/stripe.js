const { Resend } = require('resend');
const { Stripe } = require('stripe');
const { EXCHANGE_RATE_API_KEY, STRIPE_WEBHOOK_SECRET } = require('../constants');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-01-27.acacia" });
const User = require('../models/Usuario');

const sendEmail = async (req, res) => {
    try {
        const body = req.body;

        // ✅ API para Stripe
        if (body.priceId) {

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
                    success_url: `${req.headers.origin}/home?payment=success`,
                    cancel_url: `${req.headers.origin}/home?payment=cancel`,
                });

                return res.json({ url: session.url, id: session.id });
            } catch (error) {
                console.error("❌ Error creando sesión de Stripe:", error);
                return res.status(500).json({ error: "Error creando sesión de checkout" });
            }
        }

        return res.status(400).json({ error: "Solicitud inválida" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// DATOS PARA EL BACKEND
/**
 * Usuario ID
 * Destinatario: null
 * tipo: suscripcion
 * concepto: (poner el plan)
 */


const stripePrices = async (req, res) => {

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
        return res.status(500).json({ error: "❌ Stripe secret key is not defined" });
    }

    try {
        const stripe = new Stripe(stripeSecretKey);
        const prices = await stripe.prices.list();
        return res.json({ prices, EXCHANGE_RATE_API_KEY });
    } catch (error) {
        console.error("❌ Error obteniendo precios de Stripe:", error);
        return res.status(500).json({ error: "Error obteniendo precios" });
    }
};

const isPaymentSuccessful = async (req, res) => {
    const { payment } = req.query;

    if (payment === "success") {
        return res.json({ payment: true });
    } else if (payment === "cancel") {
        return res.json({ payment: false });
    } else {
        return res.json({ payment: null });
    }
}

const webhook = async (request, response) => {
    const endpointSecret = "whsec_172ebf303d7b3fd03afb648acb50c5c749e6a7f71a9bb62c2a9cb9b711b05241";
    const signature = request.headers['stripe-signature'];

    let event;

    try {
        // ✅ Verificamos la firma del webhook usando el cuerpo en formato RAW
        event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
    } catch (err) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const subscriptionId = session.subscription || null;
        const customerId = session.customer;

        console.log('✅ Checkout completado. ID del cliente:', customerId);

        if (subscriptionId) {
            try {
                // ✅ Obtener los datos completos de la suscripción
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const usuarioStripeId = subscription.customer;
                const customer = await stripe.customers.retrieve(usuarioStripeId);


                const correoUsuario = customer.email;
                const tipoPlan = subscription.plan.nickname.toLowerCase().replace("á", "a");
                const usuario = await User.findOne({ where: { correo: correoUsuario } })

                if (usuario) {
                    await usuario.update({ id_stripe: usuarioStripeId, tipo_suscripcion: tipoPlan });
                } else {
                    console.warn(`⚠️ Usuario no encontrado con el correo: ${correoUsuario}`);
                }

                // ENVIO DE CORREO Y NOTIFICACION, ACTUALIZACION USUARIO
                // CORREO -> Nombre, email, tipo de plan, Date.now()
                // NOTIFICACION -> Usuario id, tipo de plan, Date.now()

            } catch (error) {
                console.error("❌ Error al obtener suscripción:", error.message);
            }
        } else {
            console.warn("⚠️ No hay suscripción en este checkout.");
        }
    } else {
        console.log(`ℹ️ Evento no manejado: ${event.type}`);
    }

    response.status(200).json({ received: true });
};

const userHasSubscription = async (req, res) => {
    console.log("🔍 Verificando suscripción del usuario...");
}

module.exports = {
    sendEmail,
    stripePrices,
    isPaymentSuccessful,
    webhook
};