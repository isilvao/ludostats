import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface User {
  foto?: string;
}

interface Club {
  logo?: string;
}

const defaultProfileImage = '/assets/images/default-profile.png';
const defaultClubLogo = '/assets/images/default-club-logo.png';

const getDefaultImage = (obj: any, key: string, defaultImage: string) => {
  return obj[key] || defaultImage;
};

export const getProfileImage = (user: User) => {
  return getDefaultImage(user, 'foto', defaultProfileImage);
};

export const getClubLogo = (club: Club) => {
  return getDefaultImage(club, 'logo', defaultClubLogo);
};

export const sportsOptions = [
  'Fútbol',
  'Baloncesto',
  'Voleibol',
  'Tenis',
  'Natación',
  'Béisbol',
  'Rugby',
  'Hockey',
  'Atletismo',
  'Ciclismo',
  'Gimnasia',
  'Esgrima',
  'Boxeo',
  'Judo',
  'Karate',
  'Taekwondo',
  'Lucha',
  'Levantamiento de pesas',
  'Remo',
  'Piragüismo',
  'Vela',
  'Surf',
  'Esquí',
  'Snowboard',
  'Patinaje',
  'Escalada',
  'Senderismo',
  'Golf',
  'Críquet',
  'Badminton',
  'Squash',
  'Pádel',
  'Tenis de mesa',
  'Bádminton',
  'Handball',
  'Waterpolo',
  'Triatlón',
  'Pentatlón moderno',
  'Biatlón',
  'Curling',
  'Lacrosse',
  'Softball',
  'Ultimate frisbee',
  'Cheerleading',
  'Danza deportiva',
  'Esports',
  'Otro',
];
