import Image from 'next/image';
import { characteristics } from '../constants';
import Link from 'next/link';

const Characteristics: React.FC = () => {
  return (
    <section className=" py-16 px-6 sm:px-10 lg:px-10 max-w-7xl mx-auto space-y-16">
      {characteristics.map((item, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row items-center md:items-stretch gap-24 px-16"
        >
          {/* Imagen */}
          <div className="flex-shrink-0 flex justify-center items-center w-full md:w-1/3 min-h-[300px]">
            <Image
              src={item.image}
              alt={item.title}
              width={300}
              height={300}
              className="object-contain"
            />
          </div>
          {/* Texto y botón */}
          <div className="flex flex-col justify-center text-center md:text-left w-full md:w-2/3 px-6">
            <h3 className="subtitle-1 text-[#4D4D4D]">{item.title}</h3>
            <p className="mt-4 body-2 text-[#717171]">{item.description}</p>
            <div className="mt-6 flex flex-row sm:flex-row gap-4">
              <Link
                href={item.href}
                className="bg-[#4CAF4F] text-white hover:bg-[#4CAF4F]/80 px-8 py-3 rounded-md transition flex items-center gap-2"
              >
                Leer Más
                <Image
                  src="/assets/icons/arrow-up.svg"
                  alt="arrow-right"
                  width={20}
                  height={20}
                  className="rotate-90"
                />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Characteristics;
