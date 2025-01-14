import Image from 'next/image';
import { characteristics } from '../constants';
import Link from 'next/link';

const Characteristics: React.FC = () => {
  return (
    <section className=" py-16 px-6 max-w-7xl mx-auto space-y-16">
      {characteristics.map((item, index) => (
        <div
          key={index}
          className="flex flex-col lg:flex-row items-center md:items-stretch justify-around px-0 sm:px-5 gap-5"
        >
          {/* Imagen */}
          <div className="flex-shrink-0 flex justify-center items-center w-full lg:w-1/3 min-h-[300px] group">
            <Image
              src={item.image}
              alt={item.title}
              width={300}
              height={300}
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          {/* Texto y botón */}
          <div className="flex flex-col justify-center text-center md:text-left w-full px-0 sm:px-6 lg:max-w-[615px]">
            <h3 className="subtitle-2 md:subtitle-1 text-[#4D4D4D]">
              {item.title}
            </h3>
            <p className="mt-4 body-2 text-[#717171]">{item.description}</p>
            <div className="mt-6 flex justify-center md:justify-start flex-row gap-4">
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
