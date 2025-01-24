// DIEGO QUE ME QUIERE MATAR AYUDA
import * as React from 'react';



interface EmailTemplateProps {
  firstName: string;
  otp: string; // Nueva propiedad para el OTP
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  otp, // Desestructuramos el OTP
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>Your One-Time Password (OTP) is: <strong>{otp}</strong></p>
    <p>Please use this code to complete your action.</p>
  </div>
);