'use client';

import Link from 'next/link';
import Image from 'next/image';
import { navItems } from '@/constants';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEquipoClub } from '@/hooks/useEquipoClub'; // Importar el hook del contexto
import { getClubLogo } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const { equipoData } = useEquipoClub(); // Usar el contexto
  console.log(equipoData);
  const nameTeam = params
    ? Array.isArray(params.dashboard)
      ? params.dashboard[0]
      : params.dashboard
    : null;

  return (
    <aside className="sidebar bg-white">
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          <Link href={`/${nameTeam}/inicio`} className="lg:w-full">
            <li
              className={cn(
                'sidebar-nav-item',
                pathname === `/${nameTeam}/inicio` && 'shad-active'
              )}
            >
              <Image
                src={getClubLogo(equipoData?.equipo || {})}
                alt={equipoData?.equipo?.nombre}
                width={24}
                height={24}
                className={cn(
                  'nav-icon',
                  pathname === `/${nameTeam}/inicio` && 'nav-icon-active'
                )}
              />
              <p className="hidden lg:block">{equipoData?.equipo?.nombre}</p>
            </li>
          </Link>
          {navItems.map(({ url, name, icon }) => (
            <Link
              key={name}
              href={url.replace('[dashboard]', nameTeam ?? '')}
              className="lg:w-full"
            >
              <li
                className={cn(
                  'sidebar-nav-item',
                  pathname === url.replace('[dashboard]', nameTeam ?? '') &&
                    'shad-active'
                )}
              >
                <Image
                  src={icon}
                  alt={name}
                  width={24}
                  height={24}
                  className={cn(
                    'nav-icon',
                    pathname === url.replace('[dashboard]', nameTeam ?? '') &&
                      'nav-icon-active'
                  )}
                />
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
export default Sidebar;
