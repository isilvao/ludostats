import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface User {
  foto?: string;
}

export const getProfileImage = (user: User) => {
  const defaultImage = '/assets/images/default-profile.png';

  return user.foto || defaultImage;
};
