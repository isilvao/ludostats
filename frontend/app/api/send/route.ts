

import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend("re_AyQTq895_HDdFFDVdEJtDPTBH5qRCpfZ8");

export async function POST(request: Request) {
  try {
    console.log(111111)
    // Leer los valores del cuerpo de la solicitud
    const body = await request.json();
    const { firstName, otp, email } = body;
    console.log(1)
    console.log(firstName,otp,email)
    // Validar que los datos necesarios están presentes
    if (!firstName || !otp || !email) {
      return NextResponse.json(
        { error: "Missing required fields: firstName, otp, or email." },
        { status: 400 }
      );
    }

    // Enviar el correo con los datos proporcionados
    const { data, error } = await resend.emails.send({
      from: 'general@ludostats.com',
      to: [email],
      subject: 'Welcome to Acme!',
      text: ``,
      html: `<h1>Welcome, ${firstName}!</h1><p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p><p>Please use this code to complete your action.</p>`,
    });

    console.log(error);

    // Manejo de errores al enviar el correo
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
