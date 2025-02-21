'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ChevronDown } from 'lucide-react';

const eventsData = [
  {
    id: 1,
    fecha: '18/02/2025 a 22:00',
    tipo: 'Entrenamiento',
    asistencia: 'Ausente',
    categoria: 'Entrenamiento',
  },
  {
    id: 2,
    fecha: '25/02/2025 a 22:00',
    tipo: 'Entrenamiento',
    asistencia: 'En espera',
    categoria: 'Entrenamiento',
  },
  {
    id: 3,
    fecha: '10/03/2025 a 20:00',
    tipo: 'Super Liga',
    asistencia: 'Presente',
    categoria: 'Super Liga',
  },
];

const categories = ['Todos los tipos', 'Entrenamiento', 'Super Liga'];

const CalendarEvents = () => {
  const [events, setEvents] = useState(eventsData);
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos los tipos');

  const filteredEvents = events.filter(
    (event) =>
      (selectedCategory === 'Todos los tipos' ||
        event.categoria === selectedCategory) &&
      event.tipo.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-row w-full p-4">
      <div className="w-1/4 p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">Filtrar</h2>
        {categories.map((category) => (
          <div key={category} className="mb-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => setSelectedCategory(category)}
                className="mr-2"
              />
              {category}
            </label>
          </div>
        ))}
      </div>

      <div className="w-3/4 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Eventos</h1>
          <Button className="bg-blue-900 text-white px-4 py-2 rounded-lg">
            Crear evento
          </Button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Input
            className="w-1/3"
            placeholder="Buscar por nombre"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Vista temporada <ChevronDown className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Opción 1</DropdownMenuItem>
              <DropdownMenuItem>Opción 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Asistencias</TableHead>
                <TableHead>Eventos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length ? (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.fecha}</TableCell>
                    <TableCell>{event.tipo}</TableCell>
                    <TableCell
                      className={
                        event.asistencia === 'Ausente'
                          ? 'text-red-500'
                          : 'text-gray-500'
                      }
                    >
                      {event.asistencia}
                    </TableCell>
                    <TableCell>{event.tipo}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No hay eventos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CalendarEvents;
