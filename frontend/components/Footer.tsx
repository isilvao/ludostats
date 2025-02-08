import Image from 'next/image';
import Link from 'next/link';
import { footerLinks } from '@/constants';
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter, FaThreads } from 'react-icons/fa6';

type ColumnProps = {
  title: string;
  links: Array<{ name: string; href: string }>;
};

const FooterColumn = ({ title, links }: ColumnProps) => (
  <div className="flex flex-col space-y-1 min-w-[120px]">
    <h3 className="text-lg font-semibold pb-2">{title}</h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.name}>
          <Link href={link.href} className="hover:underline">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => (
  <footer className="bg-gray-900 text-gray-200 py-10">
    <div className="container mx-auto px-6 lg:px-20 py-8">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <div className="flex flex-col md:w-1/2 lg:w-1/3 items-center md:items-start gap-5 lg:justify-between">
          <Image
            src="/assets/images/logo-ludostats-white.svg"
            width={200}
            height={200}
            alt="LudoStats Logo"
          />
          <div className="flex flex-col space-y-1 text-center md:text-left">
            <p className="text-sm text-gray-400">
              Copyright © 2025 LudoStats.
            </p>
            <p className="text-sm text-gray-400">
              Todos los derechos reservados.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="https://www.instagram.com/ludostats/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white w-10 h-10  bg-gray-800 transition transform hover:scale-110 text-center flex items-center justify-center rounded-full"
            >
              <FaInstagram className="w-6 h-6" />
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white w-10 h-10  bg-gray-800 transition transform hover:scale-110 text-center flex items-center justify-center rounded-full"
            >
              <FaXTwitter className="w-6 h-6" />
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white w-10 h-10  bg-gray-800 transition transform hover:scale-110 text-center flex items-center justify-center rounded-full"
            >
              <FaThreads className="w-6 h-6" />
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white w-10 h-10  bg-gray-800 transition transform hover:scale-110 text-center flex items-center justify-center rounded-full"
            >
              <FaLinkedinIn className="w-6 h-6" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col w-full gap-5 sm:px-16 md:px-0 lg:flex-row md:justify-end">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:text-center md:text-start">
            {footerLinks.map((column, index) => (
              <FooterColumn
                key={index}
                title={column.title}
                links={column.links}
              />
            ))}
          </div>
          <div className="mt-5 lg:mt-0 lg:w-2/5 lg:ml-5 sm:px-12 md:px-0">
            <h3 className="text-lg font-semibold mb-2 pb-2">Mantente al día</h3>
            <div className="relative max-w-md">
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full px-4 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="absolute top-0 right-0 px-3 py-2 bg-green-500 text-white rounded-r-md hover:bg-green-600 transition"
              >
                <Image
                  src="/assets/icons/send.svg"
                  width={24}
                  height={24}
                  alt="Arrow Right"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
