'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    specialVisibility: {
      equipo: ['gerente', 'entrenador', 'deportista', 'admin', 'miembro'], // Visible para todos en equipo
      club: ['gerente', 'entrenador', 'deportista', 'admin', 'miembro'], // Visible solo para gerente y admin en club
    },
  },
  {
    name: 'Miembros',
    icon: FaUsers,
    url: '/[dashboard]/members',
    specialVisibility: {
      equipo: ['gerente', 'entrenador', 'deportista', 'admin', 'miembro'], // Visible para todos en equipo
      club: ['gerente', 'admin'], // Visible solo para gerente y admin en club
    },
  },
  {
    name: 'Estadísticas',
    icon: FaChartBar,
    url: '/[dashboard]/statistics',
    specialVisibility: {
      equipo: ['gerente', 'entrenador', 'deportista', 'admin', 'miembro'], // Visible para todos en equipo
      club: ['gerente', 'admin'], // Visible solo para gerente y admin en club
    },
  },
  {
    name: 'Torneos',
    icon: GiLaurelsTrophy,
    url: '/[dashboard]/inicio',
    specialVisibility: {
      equipo: ['gerente', 'entrenador', 'deportista', 'admin', 'miembro'], // Visible para todos en equipo
      club: ['gerente', 'admin'], // Visible solo para gerente y admin en club
    },
  },
  {
    name: 'Pagos',
    icon: MdPayments,
    url: '/[dashboard]/subscription',
    specialVisibility: {
      equipo: ['gerente', 'entrenador', 'deportista', 'admin', 'miembro'], // Visible para todos en equipo
      club: ['gerente', 'entrenador', 'deportista', 'admin', 'miembro'], // Visible solo para gerente y admin en club
    },
  },
  {
    name: 'Ajustes',
    icon: IoMdSettings,
    url: '/[dashboard]/settings',
    specialVisibility: {
      equipo: ['gerente'], // Visible para todos en equipo
      club: ['gerente'], // Visible solo para gerente y admin en club
    },
  },
  {
    name: 'Equipos',
    icon: FaUsers,
    url: '/[dashboard]/teams',
    specialVisibility: {
      equipo: [], // Visible para todos en equipo
      club: ['gerente', 'admin'], // Visible solo para gerente y admin en club
    },
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const { clubData, rolClub } = useEquipoClub(); // Usar el contexto
  const selectionType = localStorage.getItem('selectionType');
  const nameTeam = params
    ? Array.isArray(params.dashboard)
      ? params.dashboard[0]
      : params.dashboard
    : null;

  const logo = getClubLogo(clubData);
  const name = clubData?.nombre;
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
                  'w-12 h-12 object-cover rounded-full border-2 border-gray-100', // Ajustar el tamaño del logo
                  pathname === `/${nameTeam}`
                )}
              />
              <p className="hidden lg:block">{name}</p>
            </li>
          </Link>
          {navItems
            .filter(({ specialVisibility }) => {
              if (specialVisibility && selectionType) {
                return specialVisibility[
                  selectionType as 'equipo' | 'club'
                ]?.includes(rolClub);
              }
              return false;
            })
            .map(({ url, name, icon }) => {
              const finalUrl =
                (rolClub === 'deportista' || rolClub === 'miembro') &&
                url === '/[dashboard]/statistics'
                  ? '/[dashboard]/mystatistics'
                  : url;
              return (
                <Link
                  key={name}
                  href={finalUrl.replace('[dashboard]', nameTeam ?? '')}
                  className="lg:w-full"
                >
                  <li
                    className={cn(
                      'sidebar-nav-item hover:bg-gray-100',
                      pathname.startsWith(
                        finalUrl.replace('[dashboard]', nameTeam ?? '')
                      ) && 'shad-active'
                    )}
                  >
                    <span
                      className={cn(
                        'nav-icon',
                        pathname.startsWith(
                          finalUrl.replace('[dashboard]', nameTeam ?? '')
                        ) && 'nav-icon-active'
                      )}
                    >
                      {icon({ size: 24 })}
                    </span>
                    <p className="hidden lg:block">{name}</p>
                  </li>
                </Link>
              );
            })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
