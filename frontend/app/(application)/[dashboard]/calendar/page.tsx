'use client';

import React, { useEffect } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEquipoClub } from '@/hooks';
import { TeamsAPI } from '@/api/teams';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { IoPersonAdd } from 'react-icons/io5';
import { Toaster, toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { BiExport } from 'react-icons/bi';
import { set } from 'zod';
import { FaCalendarPlus } from 'react-icons/fa';
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react';
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';

interface Event {
  id: string;
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  categoria: string;
}

const CalendarEvents = () => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const { clubData } = useEquipoClub();
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [newEvent, setNewEvent] = React.useState({
    eventId: '',
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
  });

  const calendarApp = useNextCalendarApp({
    views: [
      createViewWeek(),
      createViewDay(),
      createViewMonthAgenda(),
      createViewMonthGrid(),
    ],
    theme: 'shadcn',
    calendars: {
      johndoe: {
        label: 'John Doe',
        colorName: 'johndoe',
        lightColors: {
          main: 'hsl(210 40% 93.1%)',
          container: '#000',
          onContainer: 'hsl(210 40% 93.1%)',
        },
      },
    },
    selectedDate: '2023-12-01',
    events: [
      {
        id: 1,
        title: 'Coffee with John',
        start: '2023-12-01',
        end: '2023-12-01',
        calendarId: 'johndoe',
      },
      {
        id: 2,
        title: 'Breakfast with Sam',
        description: 'Discuss the new project',
        location: 'Starbucks',
        start: '2023-11-29 05:00',
        end: '2023-11-29 06:00',
        calendarId: 'johndoe',
      },
      {
        id: 3,
        title: 'Gym',
        start: '2023-11-27 06:00',
        end: '2023-11-27 07:00',
        calendarId: 'johndoe',
      },
      {
        id: 4,
        title: 'Media fasting',
        start: '2023-12-01',
        end: '2023-12-03',
        calendarId: 'johndoe',
      },
      {
        id: 5,
        title: 'Some appointment',
        people: ['John'],
        start: '2023-12-03 03:00',
        end: '2023-12-03 04:30',
        calendarId: 'johndoe',
      },
    ],
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const teamsAPI = new TeamsAPI();
        const fetchedEvents = await teamsAPI.obtenerEventosPorClub(clubData.id);
        const events = fetchedEvents.map((event: any) => ({
          id: event.evento.id,
          titulo: event.evento.titulo,
          descripcion: event.evento.descripcion,
          fecha_inicio: event.evento.fecha_inicio,
          fecha_fin: event.evento.fecha_fin,
        }));
        setEvents(events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    if (clubData.id) {
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, [clubData.id]);

  async function handleDelete(id: string): Promise<void> {
    try {
      const teamsAPI = new TeamsAPI();
      await teamsAPI.deleteEvento(id);
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }

  async function handleCreate() {
    if (
      !newEvent.titulo ||
      !newEvent.fecha_inicio ||
      !newEvent.fecha_fin ||
      !newEvent.descripcion
    ) {
      toast.error('Todos los campos son obligatorios');
      return;
    }
    try {
      const teamsAPI = new TeamsAPI();
      await teamsAPI.createEvento(newEvent, clubData.id);
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: newEvent.eventId,
          titulo: newEvent.titulo,
          descripcion: newEvent.descripcion,
          fecha_inicio: newEvent.fecha_inicio,
          fecha_fin: newEvent.fecha_fin,
          categoria: '', // Add appropriate value for categoria
        },
      ]);
      setNewEvent({
        eventId: '',
        titulo: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  }

  async function handleEdit(id: string) {
    try {
      const teamsAPI = new TeamsAPI();
      await teamsAPI.updateEvento(id);
      window.location.reload();
    } catch (error) {
      console.error('Error editing event:', error);
    }
  }

  const columns: ColumnDef<Event>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'titulo',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Título
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="ml-4">{row.getValue('titulo')}</div>,
    },
    {
      accessorKey: 'descripcion',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Descripción
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-4">{row.getValue('descripcion')}</div>
      ),
    },
    {
      accessorKey: 'fecha_inicio',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha de Inicio
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-4">
          {new Date(row.getValue('fecha_inicio')).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'fecha_fin',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha de Fin
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-4">
          {new Date(row.getValue('fecha_fin')).toLocaleString()}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Acciones',
      cell: ({ row }) => {
        const event = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opciones</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link
                  href={`/home`}
                  className="w-full justify-center cursor-pointer"
                >
                  Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="w-full">
                      Borrar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Estás seguro de que deseas eliminar este evento? Esta
                        acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(event.id)}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: events,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div
            className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-transparent border-brand rounded-full"
            role="status"
          ></div>
          <span className="mt-4 text-brand font-semibold">Cargando...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <h1 className="text-3xl font-bold text-brand2">Calendario</h1>
        <div className="flex items-center space-x-5 h-10">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 rounded-lg transition-colors duration-w-[10rem] h-full px-2">
                  <BiExport className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Link
            href={`calendar/createEvent`}
            className="bg-brand hover:bg-brand/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-w-[10rem] flex flex-row space-x-3 items-center"
          >
            <FaCalendarPlus />
            {/* <IoPersonAdd className="w-5 h-5" /> */}
            <p>Añadir evento</p>
          </Link>
        </div>
      </div>
      <div className="bg-white border border-gray-300 rounded-lg p-6 max-w-full mt-4">
        <div className="flex items-center pb-5 justify-between">
          <Input
            placeholder="Filtrar por titulo..."
            value={
              (table.getColumn('titulo')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('titulo')?.setFilterValue(event.target.value)
            }
            className="max-w-sm mr-3"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No hay eventos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{' '}
            {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarEvents;
