import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend('re_AyQTq895_HDdFFDVdEJtDPTBH5qRCpfZ8');

export async function POST(request: Request) {
  try {
    // Leer los valores del cuerpo de la solicitud
    const body = await request.json();
    const { firstName, otp, email } = body;

    // Validar que los datos necesarios están presentes
    if (!firstName || !otp || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, otp, or email.' },
        { status: 400 }
      );
    }

    // Enviar el correo con un estilo sofisticado y atractivo
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
              body {
                margin: 0;
                padding: 20px;
                background-color: #f4f4f4;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              }
              .container {
                background-color: #ffffff;
                max-width: 600px;
                margin: 0 auto;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 30px;
              }
              h1 {
                font-size: 24px;
                color: #333333;
                margin-bottom: 20px;
              }
              p {
                font-size: 16px;
                color: #555555;
                line-height: 1.5;
              }
              .otp {
                font-weight: bold;
                color: #e74c3c;
              }
              .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #999999;
                text-align: center;
              }
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
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
