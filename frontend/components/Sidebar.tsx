'use client';

import Link from 'next/link';
import Image from 'next/image';
// import { navItems } from '@/constants';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEquipoClub } from '@/hooks/useEquipoClub'; // Importar el hook del contexto
import { getClubLogo } from '@/lib/utils';
import LoadingScreen from '@/components/LoadingScreen';
import { FaCalendarAlt, FaUsers, FaChartBar } from 'react-icons/fa';
import { GiLaurelsTrophy } from 'react-icons/gi';
import { IoMdSettings } from 'react-icons/io';
import { MdPayments } from 'react-icons/md';

const navItems = [
  {
    name: 'Calendario',
    icon: FaCalendarAlt,
    url: '/[dashboard]/calendar',
  },
  {
    name: 'Miembros',
    icon: FaUsers,
    url: '/[dashboard]/members',
  },
  {
    name: 'Estadísticas',
    icon: FaChartBar,
    url: '/[dashboard]/statistics',
  },
  {
    name: 'Torneos',
    icon: GiLaurelsTrophy,
    url: '/[dashboard]/inicio',
  },
  {
    name: 'Suscripción',
    icon: MdPayments,
    url: '/[dashboard]/subscription',
  },
  {
    name: 'Ajustes',
    icon: IoMdSettings,
    url: '/[dashboard]/settings',
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const { equipoData, clubData } = useEquipoClub(); // Usar el contexto
  const selectionType = localStorage.getItem('selectionType');
  const nameTeam = params
    ? Array.isArray(params.dashboard)
      ? params.dashboard[0]
      : params.dashboard
    : null;

  const logo =
    selectionType === 'equipo'
      ? getClubLogo(equipoData)
      : getClubLogo(clubData);
  const name =
    selectionType === 'equipo' ? equipoData?.nombre : clubData?.nombre;

  if (!logo || !name) {
    return <LoadingScreen />;
  }

  return (
    <aside className="sidebar bg-white">
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          <Link href={`/${nameTeam}`} className="lg:w-full">
            <li
              className={cn(
                'sidebar-nav-item hover:bg-gray-100',
                pathname === `/${nameTeam}` && 'shad-active'
              )}
            >
              <Image
                src={logo}
                alt={name}
                width={48} // Aumentar el tamaño del logo
                height={48} // Aumentar el tamaño del logo
                className={cn(
                  'w-12 h-12 rounded-full', // Ajustar el tamaño del logo
                  pathname === `/${nameTeam}`
                )}
              />
              <p className="hidden lg:block">{name}</p>
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
                  'sidebar-nav-item hover:bg-gray-100',
                  pathname.startsWith(
                    url.replace('[dashboard]', nameTeam ?? '')
                  ) && 'shad-active'
                )}
              >
                <span
                  className={cn(
                    'nav-icon',
                    pathname.startsWith(
                      url.replace('[dashboard]', nameTeam ?? '')
                    ) && 'nav-icon-active'
                  )}
                >
                  {icon({ size: 24 })}
                </span>
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
