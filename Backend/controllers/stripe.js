const { Resend } = require('resend');
const { Stripe } = require('stripe');
const { EXCHANGE_RATE_API_KEY } = require('../constants');

const sendEmail = async (req, res) => {
    const resend = new Resend("re_AyQTq895_HDdFFDVdEJtDPTBH5qRCpfZ8");

    try {
        const body = req.body;

        if (body.firstName && body.otp && body.email) {
            const { firstName, otp, email } = body;

            const { data, error } = await resend.emails.send({
                from: "general@ludostats.com",
                to: [email],
                subject: "Confirmación pago de suscripción a LudoStats",
                text: "",
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

            if (error) {
                return res.status(500).json({ error });
            }

            return res.json(data);
        }

        // ✅ API para Stripe
        if (body.priceId) {

            const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
            if (!stripeSecretKey) {
                throw new Error("❌ Stripe secret key is not defined");
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
                    success_url: `${req.headers.origin}/home?payment=success`,
                    cancel_url: `${req.headers.origin}/home?payment=cancel`,
                });

                return res.json({ url: session.url });
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

module.exports = {
    sendEmail,
    stripePrices,
    isPaymentSuccessful
};