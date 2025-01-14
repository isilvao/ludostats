'use client';

import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const userName = 'Nombre del Usuario';
  return (
    <nav className="header">
      <Link href="/home">
        <Image
          src="/assets/images/logo.svg"
          width={150}
          height={100}
          alt="Logo"
          className="cursor-pointer"
        />
      </Link>
      <Link href="/profile">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="/assets/images/person-1.png"
              width={40}
              height={40}
              alt="Foto de perfil"
              className="object-cover w-full h-full"
            />
          </div>
          <span className="ml-2 text-gray-400 hover:text-gray-600">
            {userName}
          </span>
        </div>
      </Link>
    </nav>
  );
};

export default Header;
