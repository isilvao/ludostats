import Footer from '@/components/Footer';
import Header from '@/components/Header';
import React from 'react';
import 'react-calendar/dist/Calendar.css';

const Calendar: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Header/>
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Mi Calendario
      </h1>
      <div className="flex justify-center">
        <Calendar />
      </div>
      <Footer/>
    </div>
  );
};

export default Calendar;
