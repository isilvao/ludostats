'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../hooks';
import { getProfileImage } from '../lib/utils';

const Header = () => {
  const { user } = useAuth();
  return (
    <nav className="header">
      <Link href="/home">
        <Image
          src="/assets/images/logo-ludostats.svg"
          width={150}
          height={100}
          alt="Logo"
        />
      </Link>
      <Link href="/profile">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={getProfileImage(user)}
              width={40}
              height={40}
              alt="Foto de perfil"
              className="object-cover w-full h-full"
            />
          </div>
          <span className="ml-2 text-gray-400 hover:text-gray-600">
            {user.nombre}
          </span>
        </div>
      </Link>
    </nav>
  );
};

export default Header;
