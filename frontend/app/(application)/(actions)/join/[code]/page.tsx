'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const ClubInfoPage: React.FC = () => {
  const params = useParams();
  const code = params
    ? Array.isArray(params.code)
      ? params.code[0]
      : params.code
    : null;
  return (
    <div className="flex items-center justify-center p-4 w-full h-full">
      <div className="flex gap-4 w-full mt-6 text-center">
        <Link
          href={`/join/${code}/role`}
          className="flex-1 bg-brand hover:bg-brand/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Aceptar
        </Link>
        <Link
          href="/home"
          className="flex-1 bg-red hover:bg-red/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Cancelar
        </Link>
      </div>
    </div>
  );
};

export default ClubInfoPage;
