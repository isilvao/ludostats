'use client';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import CanvasLoader from './CanvasLoader';
import { Model3D } from './Model3D';

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <section className="h-[85vh] mx-auto max-w-[1440px] flex flex-col items-center lg:flex-row gap-8 md:gap-10 lg:gap-16 py-10 px-6 justify-center">
      {/* Lado izquierdo: Texto y CTA */}
      <div className="flex-1 flex flex-col justify-center max-w-xl text-left">
        <h1 className="h1 lg:text-hero font-bold text-[#4D4D4D] leading-tight">
          Simplifica la gestión de tu{' '}
          <span className="text-[#4CAF4F]">club deportivo</span>
        </h1>
        <p className="text-base lg:text-lg mt-4 text-[#717171]">
          LudoStats: Administra tu equipo, organiza torneos, gestiona pagos y
          mucho más en un solo lugar.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 text-center">
          <Link
            href="/sign-up"
            className="bg-[#4CAF4F] text-white hover:bg-[#4CAF4F]/80 px-8 py-3 rounded-md transition"
          >
            Empezar Ahora
          </Link>
        </div>
      </div>

      {/* Lado derecho: Escena 3D */}
      <div className="flex-1 flex items-center justify-center max-w-xl">
        <div className="max-w-[300px] md:max-w-[500px] md:w-full h-64 sm:h-80 lg:h-[500px]">
          {isMounted && (
            <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
              <Suspense fallback={<CanvasLoader />}>
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={4} />
                <Model3D />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 2}
                  maxPolarAngle={Math.PI / 2}
                  target={[0, 0, 0]}
                />
              </Suspense>
            </Canvas>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
