import Image from 'next/image'
import { Button } from './ui/button'


const Hero = () => {
  return (
    <section className="mx-auto max-w-[1440px] flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row">
      <div className="hero-map" />

      <div className="relative z-20 flex flex-1 flex-col xl:w-1/2">
        <h1 className="text-hero text-[#4D4D4D]">Simplifica la gestión de tu club deportivo</h1>
        <p className="h5 mt-6 text-[#717171] xl:max-w-[520px]">
          LudoStats: Administra tu equipo, organiza torneos, gestiona pagos y mucho más en un solo lugar.
        </p>
        <div className="flex flex-col w-full gap-3 sm:flex-row">
          <Button>
            Empezar Ahora
          </Button>
        </div>
      </div>

      <div className="relative flex flex-1 items-start">
        <div className="relative z-20 flex w-[268px] flex-col gap-8 rounded-3xl bg-green-90 px-7 py-8">
          <Image 
            src="/assets/images/hero-Img.svg"
            alt="phone" 
            width={268}
            height={500}
          />
        </div>
      </div>
    </section>
  )
}

export default Hero