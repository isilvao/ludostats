import Image from 'next/image';
import { features } from '../constants';

const Features = () => {
  return (
    <section className="py-6 px-6 items-center max-w-7xl mx-auto">
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 px-4 sm:px-6 lg:px-10 max-w-xl mx-auto">
          <h2 className="subtitle-2 sm:subtitle-1 text-[#4D4D4D]">
            Gestiona tu club deportivo desde un solo lugar
          </h2>
          <p className="mt-2 body-1 text-[#717171]">
            ¿Qué te ofrece LudoStats?
          </p>
        </div>
        <div className="max-w-7xl mx-auto flex justify-around">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-24">
            {features.map((item, index) => (
              <div
                key={index}
                className={`bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center space-y-4 max-w-xs transition-transform transform hover:scale-105 ${
                  features.length === 3 && index === 2
                    ? 'md:col-span-2 md:mx-auto lg:col-span-1 lg:mx-0'
                    : ''
                }`}
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="w-20 h-20 object-contain"
                />
                <h3 className="subtitle-2 text-[#4D4D4D]">{item.title}</h3>
                <p className="body-2 text-[#717171]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
