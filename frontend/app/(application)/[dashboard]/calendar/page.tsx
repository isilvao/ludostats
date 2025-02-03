import React from 'react';
import 'react-calendar/dist/Calendar.css';
import { Calendar as ReactCalendar } from 'react-calendar';

const CalendarPage: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Mi Calendario
      </h1>
      <div className="flex justify-center">
        <ReactCalendar />
      </div>
    </div>
  );
};

export default CalendarPage;
