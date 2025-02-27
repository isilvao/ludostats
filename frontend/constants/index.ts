import { FaCalendarAlt, FaUsers, FaChartBar } from 'react-icons/fa';

export const NavLinks = [
  { href: '/about-us', key: 'Nosotros', text: 'Nosotros' },
  { href: '/features', key: 'Funcionalidades', text: 'Funcionalidades' },
  { href: '/plans', key: 'Planes', text: 'Planes' },
  // { href: '/', key: 'Testimonios', text: 'Testimonios' },
  { href: '/faq', key: 'FAQ', text: 'FAQ' },
];

export const features = [
  {
    title: 'Conecta a todos',
    description: 'Una plataforma para dueños, entrenadores y deportistas.',
    icon: '/assets/icons/people.svg',
  },
  {
    title: 'Gestión integral',
    description: 'Administra calendarios, pagos y resultados.',
    icon: '/assets/icons/building.svg',
  },
  {
    title: 'Automatización de procesos',
    description: 'Olvídate de los errores manuales.',
    icon: '/assets/icons/hands.svg',
  },
];

export const characteristics = [
  {
    title:
      'Todo lo que necesitas para gestionar tu club deportivo, al alcance de tu mano',
    description:
      'Olvídate de manejar pagos manualmente o perder tiempo en hojas de cálculo. Con nuestra pasarela de pagos integrada, los estudiantes, deportistas y acudientes pueden realizar sus pagos de forma segura y automática. Además, podrás consultar un historial detallado para un control total de las finanzas.',
    image: '/assets/images/creditCard.svg',
    href: '/features',
  },
  {
    title: 'Organización de Torneos y Eventos',
    description:
      'Planea cada evento de tu club sin estrés. Crea calendarios de entrenamientos, partidos y reuniones con notificaciones automáticas para todos los interesados. Organiza torneos con fases de grupos, llaves de eliminación directa y tablas de posiciones que se actualizan en tiempo real.',
    image: '/assets/images/calendar.svg',
    href: '/features',
  },
  {
    title: 'Estadísticas de Rendimiento Deportivo',
    description:
      'Lleva un control detallado del rendimiento de cada jugador y del equipo completo. Desde métricas individuales como velocidad, resistencia y altura de salto, hasta estadísticas en tiempo real por partido, como puntos, bloqueos y saques. Identifica áreas de mejora y celebra el progreso de tus deportistas.',
    image: '/assets/images/stats.svg',
    href: '/features',
  },
];

export const testimonials = [
  {
    name: 'person-1',
    avatar: '/assets/images/person-1.png',
    title: 'CEO, Example Inc.',
    quote:
      '“Organizar los torneos de nuestro club solía ser un caos. Ahora, todo está en un solo lugar: calendarios, tablas de posiciones y resultados. Mis jugadores y yo estamos más enfocados que nunca.”',
  },
  {
    name: 'person-2',
    avatar: '/assets/images/person-2.png',
    title: 'CEO, Example Inc.',
    quote:
      '“Antes de LudoStats, siempre olvidaba las fechas de pago o los pedidos de uniformes. Ahora todo es mucho más fácil, y puedo concentrarme en apoyar a mi hijo en sus juegos.”',
  },
  {
    name: 'person-3',
    avatar: '/assets/images/person-3.png',
    title: 'CEO, Example Inc.',
    quote:
      '“El control financiero y las estadísticas de rendimiento han revolucionado nuestra gestión. Hemos reducido errores y mejorado nuestra planificación. LudoStats ha sido una inversión invaluable.”',
  },
];

export const footerLinks = [
  {
    title: 'Compañía',
    links: [
      { name: 'Nosotros', href: '/about-us' },
      { name: 'Funcionalidades', href: '/features' },
      { name: 'Contáctanos', href: '/contact' },
      { name: 'Planes', href: '/plans' },
      // { name: 'Testimonios', href: '/' },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { name: 'Términos de servicio', href: '/terms-of-service' },
      { name: 'Política de privacidad', href: '/privacy-policy' },
      { name: 'Preguntas frecuentes', href: '/faq' },
      // { name: 'Legal', href: '/' },
    ],
  },
];

export const navItems = [
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
  // {
  //   name: 'Suscripción',
  //   icon: <FaVideo />,
  //   url: '/[dashboard]/subscription',
  // },
  // {
  //   name: 'Others',
  //   icon: <FaEllipsisH />,
  //   url: '#',
  // },
];
