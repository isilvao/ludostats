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
import { useParams } from 'next/navigation';
import { useEquipoClub } from '@/hooks/useEquipoClub';
import { EquipoAPI } from '@/api/equipo';
import { ClubAPI } from '@/api/club';
import { UsuariosEquipos } from '@/api/usuariosEquipos';
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
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

type Member = {
  id: string;
  nombre: string;
  apellido: string;
  activo: boolean;
  correo: string;
  rol: string;
};

const DataTableDemo: React.FC = () => {
  const params = useParams();
  const nameTeam = params
    ? Array.isArray(params.dashboard)
      ? params.dashboard[0]
      : params.dashboard
    : null;

  const { clubData, rolClub } = useEquipoClub();
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { accesToken } = useAuth();
  const selectionType = localStorage.getItem('selectionType');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectionType === 'equipo') {
          const equipoAPI = new EquipoAPI();
          const result = await equipoAPI.getUsersByTeam(clubData.id);
          const members = result.map((item: any) => ({
            id: item.usuario.id,
            nombre: item.usuario.nombre,
            apellido: item.usuario.apellido,
            activo: item.usuario.activo,
            correo: item.usuario.correo,
            rol: item.rol,
          }));
          setData(members);
        } else if (selectionType === 'club') {
          const clubAPI = new ClubAPI();
          const result = await clubAPI.getUsersByClub(clubData.id);
          const members = result.map((item: any) => ({
            id: item.id,
            nombre: item.nombre,
            apellido: item.apellido,
            activo: item.activo,
            correo: item.correo,
            rol: item.rol,
          }));
          setData(members);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (clubData.id) {
      fetchData();
    }
  }, [clubData.id]);

  const handleDelete = async (id: string) => {
    try {
      const equipoAPI = new UsuariosEquipos();
      await equipoAPI.eliminarUsuarioEquipo(id, clubData.id);
      setData((prevData) => prevData.filter((member) => member.id !== id));
      toast.success('Usuario eliminado con éxito', {
        style: {
          background: '#4CAF50', // Fondo verde
          color: '#FFFFFF', // Texto blanco
        },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar el usuario', {
        style: {
          background: '#FF0000', // Fondo rojo
          color: '#FFFFFF', // Texto blanco
        },
      });
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');
    XLSX.writeFile(workbook, 'members.xlsx');
  };

  const columns: ColumnDef<Member>[] = [
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nombre
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="ml-4">{row.getValue('nombre')}</div>,
    },
    {
      accessorKey: 'apellido',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Apellido
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="ml-4">{row.getValue('apellido')}</div>,
    },
    {
      accessorKey: 'correo',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Correo
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="ml-4">{row.getValue('correo')}</div>,
    },
    {
      accessorKey: 'rol',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Rol
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="ml-4">{row.getValue('rol')}</div>,
    },
    {
      accessorKey: 'activo',
      header: 'Activo',
      cell: ({ row }) => <div>{row.getValue('activo') ? 'Sí' : 'No'}</div>,
    },
    ...(rolClub === 'admin' || rolClub === 'gerente' || rolClub === 'entrenador'
      ? [
          {
            id: 'actions',
            enableHiding: false,
            header: 'Acciones',
            cell: ({ row }: { row: any }) => {
              const member = row.original;

              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${nameTeam}/members/${member.id}`}
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
                            <AlertDialogTitle>
                              Confirmar eliminación
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que deseas eliminar este miembro?
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(member.id)}
                            >
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

  return (
    <div className="w-full">
      <Toaster />
      <div className="flex items-center py-4 justify-between">
        <h1 className="h2">Miembros</h1>
        <div className="flex items-center space-x-5 h-10">
          {(rolClub === 'admin' || rolClub === 'gerente') && (
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
          )}
          {selectionType === 'equipo' &&
            (rolClub === 'admin' ||
              rolClub === 'gerente' ||
              rolClub === 'entrenador') && (
              <Link
                href={`/${nameTeam}/members/add`}
                className="bg-brand hover:bg-brand/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-w-[10rem] flex flex-row space-x-3 items-center"
              >
                <IoPersonAdd className="w-5 h-5" />
                <p>Añadir miembro</p>
              </Link>
            )}
        </div>
      </div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filtrar por nombre..."
          value={(table.getColumn('nombre')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nombre')?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-3"
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
          <TableHeader>
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
                  No results.
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
  );
};

export default DataTableDemo;
