'use client';

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistics: React.FC = () => {
  const [goalsTarget, setGoalsTarget] = useState(20);
  const [goalsAchieved, setGoalsAchieved] = useState(12);

  // Datos para el gráfico de rendimiento
  const performanceData = {
    labels: ['Partido 1', 'Partido 2', 'Partido 3', 'Partido 4', 'Partido 5'],
    datasets: [
      {
        label: 'Goles',
        data: [2, 1, 3, 0, 4],
        backgroundColor: 'rgba(76, 175, 79, 0.6)',
        borderColor: 'rgba(76, 175, 79, 1)',
        borderWidth: 1,
      },
    ],
  };

  const performanceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Rendimiento por Partido',
      },
    },
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
<<<<<<<< HEAD:frontend/pages/Statistics.tsx
      <Header />
========
>>>>>>>> Diego:frontend/app/(application)/(dashboard)/statistics/page.tsx
      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Estadísticas Personales
        </h1>
        <div className="flex justify-between">
          <div>
            Partidos jugados: <strong>15</strong>
          </div>
          <div>
            Tiempo jugado: <strong>12 horas</strong>
          </div>
          <div>
            Victorias: <strong>8</strong>
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Rendimiento Individual
        </h2>
        <Bar data={performanceData} options={performanceOptions} />
      </section>

      <section className="bg-white p-6 rounded-md shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Metas Personales
        </h2>
        <p>
          Meta de goles: {goalsAchieved}/{goalsTarget}
        </p>
        <button
          onClick={() => setGoalsAchieved(goalsAchieved + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Sumar Gol
        </button>
      </section>
<<<<<<<< HEAD:frontend/pages/Statistics.tsx
      <Footer />
========
>>>>>>>> Diego:frontend/app/(application)/(dashboard)/statistics/page.tsx
    </div>
  );
};

export default Statistics;
