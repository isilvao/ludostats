import Image from 'next/image';
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      {/* Definición de la animación personalizada usando una etiqueta de estilo */}
      <style jsx>{`
        @keyframes pulseScale {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
      `}</style>

      <div className="relative">
        {/* Spinner animado detrás del logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 border-4 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
        </div>
        {/* Logo con animación de pulso */}
        <Image
          src="/assets/images/logo-ludostats.svg"
          alt="Logo"
          className="relative w-52 h-52 animate-[pulseScale_2s_ease-in-out_infinite]"
          width={128}
          height={128}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
