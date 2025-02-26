'use client';
import React, { useState, useEffect } from 'react';
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
import Link from 'next/link';
import { useEquipoClub } from '@/hooks/useEquipoClub';
import * as XLSX from 'xlsx';
import { BiExport } from 'react-icons/bi';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IoPersonAdd } from 'react-icons/io5';
import { useAuth } from '@/hooks/useAuth';
import { estadisticaAPI } from '@/api/estadistica';
import { useParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Toaster, toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { EquipoAPI } from '@/api/equipo';
import { ChartBar } from '@/components/ChartBar';
import { Chart } from 'chart.js';
import { FaQuestion, FaSadCry } from 'react-icons/fa';
import { IoIosAddCircle } from 'react-icons/io';

type statistic = {
  id: string;
  nombre: string;
  apellido: string;
  valor: string;
  fecha: string;
  equipo?: string;
};

type Member = {
  id: string;
  nombre: string;
  apellido: string;
};

const StatisticDetail: React.FC = () => {
  const [data, setData] = useState<statistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { accesToken } = useAuth();
  const selectionType = localStorage.getItem('selectionType');
  const { statisticID } = useParams();
  const { clubData, rolClub } = useEquipoClub();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatistic, setNewStatistic] = useState({
    memberId: '',
    valor: '',
    fecha: '',
  });
  const [editStatistic, setEditStatistic] = useState<statistic | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [tipoEstadisticaNombre, setTipoEstadisticaNombre] = useState('');
  const [tipoEstadisticaId, setTipoEstadisticaId] = useState('');

  useEffect(() => {
    const fetchTipoEstadisticaNombre = async () => {
      try {
        const api = new estadisticaAPI();
        const result = await api.getTipoEstadisticaById(statisticID);
        setTipoEstadisticaNombre(result.nombre);
        setTipoEstadisticaId(result.id);
      } catch (error) {
        console.error('Error fetching tipo de estadística:', error);
      }
    };

    const fetchEstadisticas = async () => {
      try {
        if (selectionType === 'equipo') {
          const api = new estadisticaAPI();
          const result = await api.getAllEstadisticasByTeam(
            clubData.id,
            statisticID
          );
          const statistics = result.map((item: any) => ({
            id: item.id,
            nombre: item.usuario.nombre,
            apellido: item.usuario.apellido,
            valor: item.valor,
            fecha: new Date(item.fecha).toLocaleDateString(),
          }));
          setData(statistics);
        } else if (selectionType === 'club') {
          const api = new estadisticaAPI();
          const result = await api.getAllEstadisticas(accesToken, statisticID);
          const statistics = result.map((item: any) => ({
            id: item.id,
            nombre: item.usuario.nombre,
            apellido: item.usuario.apellido,
            valor: item.valor,
            fecha: new Date(item.fecha).toLocaleDateString(),
            equipo: item.equipo.nombre,
          }));
          setData(statistics);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchMembers = async () => {
      try {
        const api = new EquipoAPI();
        const result = await api.getUsersByTeam(clubData.id);
        const members = result
          .filter(
            (item: any) => item.rol === 'deportista' || item.rol === 'miembro'
          )
          .map((item: any) => ({
            id: item.usuario.id,
            nombre: item.usuario.nombre,
            apellido: item.usuario.apellido,
          }));
        setMembers(members);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    if (statisticID) {
      fetchTipoEstadisticaNombre();
      fetchEstadisticas();
      fetchMembers();
    }
  }, [statisticID, accesToken, clubData.id]);

  const handleCreateStatistic = async () => {
    if (!newStatistic.memberId || !newStatistic.valor || !newStatistic.fecha) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    const valorNumerico = parseFloat(newStatistic.valor);
    if (isNaN(valorNumerico)) {
      toast.error('El valor debe ser un número');
      return;
    }

    try {
      const api = new estadisticaAPI();
      const result = await api.createEstadistica(
        statisticID,
        newStatistic.memberId,
        {
          valor: valorNumerico,
          fecha: newStatistic.fecha,
        },
        clubData.id
      );

      // Find the member details
      const member = members.find((m) => m.id === newStatistic.memberId);

      // Add the new statistic with member details
      setData((prevData) => [
        ...prevData,
        {
          id: result.id,
          nombre: member?.nombre || '',
          apellido: member?.apellido || '',
          valor: valorNumerico.toString(),
          fecha: new Date(newStatistic.fecha).toLocaleDateString(),
        },
      ]);

      setNewStatistic({ memberId: '', valor: '', fecha: '' });
      setIsDialogOpen(false);
      toast.success('Estadística creada con éxito', {
        style: {
          background: '#4CAF50', // Fondo verde
          color: '#FFFFFF', // Texto blanco
        },
      });
    } catch (error) {
      console.error('Error creating statistic:', error);
      toast.error('Error al crear la estadística');
    }
  };

  const handleEditStatistic = async () => {
    if (!editStatistic) return;

    const valorNumerico = parseFloat(editStatistic.valor);
    if (isNaN(valorNumerico)) {
      toast.error('El valor debe ser un número');
      return;
    }

    try {
      const api = new estadisticaAPI();
      const result = await api.updateEstadistica({
        id: editStatistic.id,
        valor: valorNumerico,
      });
      setData((prevData) =>
        prevData.map((stat) =>
          stat.id === editStatistic.id
            ? { ...stat, valor: valorNumerico.toString() }
            : stat
        )
      );
      setEditStatistic(null);
      setIsEditDialogOpen(false);
      toast.success('Estadística actualizada con éxito', {
        style: {
          background: '#4CAF50', // Fondo verde
          color: '#FFFFFF', // Texto blanco
        },
      });
    } catch (error) {
      console.error('Error updating statistic:', error);
      toast.error('Error al actualizar la estadística');
    }
  };

  const handleDeleteStatistic = async (id: string) => {
    try {
      const api = new estadisticaAPI();
      await api.deleteEstadistica(id);
      setData((prevData) => prevData.filter((stat) => stat.id !== id));
      toast.success('Estadística eliminada con éxito', {
        style: {
          background: '#4CAF50', // Fondo verde
          color: '#FFFFFF', // Texto blanco
        },
      });
    } catch (error) {
      console.error('Error deleting statistic:', error);
      toast.error('Error al eliminar la estadística');
    }
  };

  const columns: ColumnDef<statistic>[] = [
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
      accessorKey: 'nombre',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="ml-4">{row.getValue('nombre')}</div>,
    },
    {
      accessorKey: 'apellido',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Apellido
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="ml-4">{row.getValue('apellido')}</div>,
    },
    {
      accessorKey: 'valor',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Valor
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="ml-4">{row.getValue('valor')}</div>,
      sortingFn: (rowA, rowB) => {
        const valorA = parseFloat(rowA.getValue('valor'));
        const valorB = parseFloat(rowB.getValue('valor'));
        return valorA - valorB;
      },
    },
    {
      accessorKey: 'fecha',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="ml-4">{row.getValue('fecha')}</div>,
    },
    ...(selectionType !== 'equipo'
      ? [
          {
            accessorKey: 'equipo',
            header: 'Equipo',
            cell: ({ row }: { row: any }) => (
              <div className="ml-4">{row.getValue('equipo')}</div>
            ),
          },
        ]
      : []),
    ...(rolClub === 'admin' || rolClub === 'gerente' || rolClub === 'entrenador'
      ? [
          {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }: { row: any }) => {
              const statistic = row.original;
              const [statisticToDelete, setStatisticToDelete] =
                useState<statistic | null>(null);

              return (
                <>
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
                        <button
                          onClick={() => {
                            setEditStatistic(statistic);
                            setIsEditDialogOpen(true);
                          }}
                          className="w-full justify-center cursor-pointer"
                        >
                          Editar
                        </button>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatisticToDelete(statistic);
                        }}
                        className="w-full justify-center cursor-pointer"
                      >
                        Borrar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* AlertDialog separado */}
                  {statisticToDelete &&
                    statisticToDelete.id === statistic.id && (
                      <AlertDialog
                        open
                        onOpenChange={(open) => {
                          if (!open) setStatisticToDelete(null);
                        }}
                      >
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirmar eliminación
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que deseas eliminar esta
                              estadística? Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setStatisticToDelete(null)}
                            >
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                handleDeleteStatistic(statistic.id);
                                setStatisticToDelete(null);
                              }}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                </>
              );
            },
          },
        ]
      : []),
  ];

  const table = useReactTable({
    data,
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

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Estadísticas');
    XLSX.writeFile(workbook, 'estadisticas.xlsx');
  };

  return (
    <div className="w-full">
      <Toaster />
      <div className="flex items-center py-4 justify-between mb-6">
        <h1 className="text-3xl font-bold text-brand2">
          {tipoEstadisticaNombre}
        </h1>
        <div className="flex items-center space-x-5 h-10">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleDownloadExcel}
                  className="bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 rounded-lg transition-colors duration-w-[10rem] h-full px-2"
                >
                  <BiExport className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {selectionType === 'equipo' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="bg-brand hover:bg-brand/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-w-[10rem] flex flex-row space-x-3 items-center">
                  <IoIosAddCircle className="text-lg" />
                  <span>Agregar Nueva</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear nueva estadística</DialogTitle>
                  <DialogDescription>
                    Ingresa los detalles de la nueva estadística. Haz clic en
                    guardar cuando termines.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="member" className="text-right">
                      Miembro
                    </Label>
                    <select
                      id="member"
                      value={newStatistic.memberId}
                      onChange={(e) =>
                        setNewStatistic({
                          ...newStatistic,
                          memberId: e.target.value,
                        })
                      }
                      className="col-span-3 py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                    >
                      <option value="">Seleccionar miembro</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.nombre} {member.apellido}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="valor" className="text-right">
                      Valor
                    </Label>
                    <Input
                      id="valor"
                      value={newStatistic.valor}
                      onChange={(e) =>
                        setNewStatistic({
                          ...newStatistic,
                          valor: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fecha" className="text-right">
                      Fecha
                    </Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={newStatistic.fecha}
                      onChange={(e) =>
                        setNewStatistic({
                          ...newStatistic,
                          fecha: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={handleCreateStatistic}
                    className="bg-brand hover:bg-brand/90 text-white"
                  >
                    Guardar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      {data.length > 0 ? (
        <div className="max-w-[400px]">
          <ChartBar
            tipoEstadisticaNombre={tipoEstadisticaNombre}
            tipoEstadisticaId={tipoEstadisticaId}
          />
        </div>
      ) : null}
      <div className="bg-white border border-gray-300 rounded-lg p-6 max-w-full mt-4">
        <div className="flex items-center py-4 justify-between">
          <Input
            placeholder="Filtrar por nombre..."
            value={
              (table.getColumn('nombre')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('nombre')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-full">
                Columnas <ChevronDown />
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
                    <div className="flex flex-col items-center justify-center h-full text-center my-6">
                      <FaSadCry className="text-2xl text-gray-400 mb-2" />
                      <p className="text-xl text-gray-600">
                        Aún no hay ninguna estadística, agrega una nueva en el
                        equipo.
                      </p>
                    </div>
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
      {editStatistic && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar estadística</DialogTitle>
              <DialogDescription>
                Modifica el valor de la estadística. Haz clic en guardar cuando
                termines.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-valor" className="text-right">
                  Valor
                </Label>
                <Input
                  id="edit-valor"
                  value={editStatistic.valor}
                  onChange={(e) =>
                    setEditStatistic({
                      ...editStatistic,
                      valor: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleEditStatistic}
                className="bg-brand hover:bg-brand/90 text-white"
              >
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StatisticDetail;
