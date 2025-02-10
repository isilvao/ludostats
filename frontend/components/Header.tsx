'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../hooks';
import { getProfileImage } from '../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user, logout } = useAuth();
  const handleSignOut = async () => {
    try {
      await logout(); // Espera a que logout termine
      window.location.href = '/';
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

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
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
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
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-40">
          <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/profile">Mi Perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-[#e32424] cursor-pointer"
          >
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default Header;
