import type { Metadata } from 'next';
import './globals.css';
import { Poppins } from 'next/font/google';
import { AuthProvider } from "../contexts"
//
import { GoogleOAuthProvider } from '@react-oauth/google'; // Importa el proveedor de Google OAuth
import { EquipoClubProvider } from "../contexts/equipoClubContext"; // 📌 Importar el nuevo contexto

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LudoStats',
  description: 'Simplify the management of your sports club',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <EquipoClubProvider>
      <html lang="en">
        <body className={`${poppins.variable} antialiased`}>
          {/* Envuelve toda la aplicación con el proveedor de Google */}
        <GoogleOAuthProvider clientId="291636032306-kubh2id137huk5ouhfpobpl8d252lv21.apps.googleusercontent.com">
          {children}
          </GoogleOAuthProvider>
          </body>
          
      </html>
      </EquipoClubProvider>
    </AuthProvider>
  );
}
