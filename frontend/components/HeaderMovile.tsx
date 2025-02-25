import Image from 'next/image';
import Link from 'next/link';
import { useEquipoClub } from '@/hooks/useEquipoClub'; // Importar el hook del contexto
import { getClubLogo } from '@/lib/utils';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { useParams } from 'next/navigation';
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
      equipo: ['gerente', 'entrenador', 'deportista', 'admin', 'miembro'],
      club: ['gerente', 'entrenador', 'deportista', 'admin', 'miembro'],
    },
  },
  {
    name: 'Miembros',
    icon: FaUsers,
    url: '/[dashboard]/members',
    specialVisibility: {
      equipo: ['gerente', 'entrenador', 'deportista', 'admin', 'miembro'],
      club: ['gerente', 'admin'],
    },
  },
  {
    name: 'Estadísticas',
    icon: FaChartBar,
    url: '/[dashboard]/statistics',
    specialVisibility: {
      equipo: ['gerente', 'entrenador', 'deportista', 'admin', 'miembro'],
      club: ['gerente', 'admin'],
    },
  },
  // {
  //   name: 'Torneos',
  //   icon: GiLaurelsTrophy,
  //   url: '/[dashboard]/inicio',
  //   specialVisibility: {
  //     equipo: ['gerente', 'entrenador', 'deportista', 'admin', 'miembro'],
  //     club: ['gerente', 'admin'],
  //   },
  // },
  {
    name: 'Pagos',
    icon: MdPayments,
    url: '/[dashboard]/subscription',
    specialVisibility: {
      equipo: ['gerente', 'entrenador', 'deportista', 'admin', 'miembro'],
      club: ['gerente', 'entrenador', 'deportista', 'admin', 'miembro'],
    },
  },
  {
    name: 'Ajustes',
    icon: IoMdSettings,
    url: '/[dashboard]/settings',
    specialVisibility: {
      equipo: ['gerente'],
      club: ['gerente'],
    },
  },
  {
    name: 'Equipos',
    icon: FaUsers,
    url: '/[dashboard]/teams',
    specialVisibility: {
      equipo: [],
      club: ['gerente', 'admin'],
    },
  },
];

const HeaderMovile = () => {
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

  return (
    <nav className={`header-movile bg-[#f2efef] shadow-sm`}>
      <div className="lg:hidden flex items-center">
        <Link href={`/${nameTeam}`} className="flex items-center gap-2">
          <Image
            src={logo}
            alt={name}
            width={30}
            height={30}
            className="rounded-full w-10 h-10 object-cover border-4 border-gray-100 shadow-md"
          />
          <span className="font-semibold text-gray-800">{name}</span>
        </Link>
        <div className="border-l border-gray-400 h-6 mx-2"></div>
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/menu.svg"
                width={30}
                height={30}
                alt="menu"
                className="select-item"
              />
            </div>
          </SheetTrigger>
          <SheetContent side="top">
            <SheetHeader>
              <SheetTitle className="flex w-full items-center justify-between flex-row">
                <Image
                  src="/assets/images/logo-ludostats.svg"
                  width={150}
                  height={100}
                  alt="logo"
                />
                <SheetClose asChild>
                  <Image
                    src="/assets/icons/close-dark.svg"
                    width={30}
                    height={30}
                    alt="cerrar"
                    className="select-item"
                  />
                </SheetClose>
              </SheetTitle>
            </SheetHeader>

            <div className="grid gap-4 py-4 mt-5">
              <ul className="flex flex-col gap-4 text-black w-full">
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
                      <SheetClose asChild key={name}>
                        <Link
                          href={finalUrl.replace('[dashboard]', nameTeam ?? '')}
                          className="hover:text-gray-700 flex items-center gap-2"
                        >
                          {icon({ size: 24 })}
                          {name}
                        </Link>
                      </SheetClose>
                    );
                  })}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default HeaderMovile;
