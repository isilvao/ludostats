'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TeamsAPI } from '@/api/teams';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { EquipoAPI } from '@/api/equipo';
import { useEquipoClub } from '@/hooks';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useParams } from 'next/navigation';
import { FaDumbbell, FaFutbol, FaHandshake, FaTrophy } from 'react-icons/fa6';

const CreateEventForm = () => {
  const teamsAPI = new TeamsAPI();
  const { user } = useAuth();
  const router = useRouter();
  const { clubData } = useEquipoClub();
  const params = useParams();
  const nameTeam = params
    ? Array.isArray(params.dashboard)
      ? params.dashboard[0]
      : params.dashboard
    : null;
  const selectionType = localStorage.getItem('selectionType');
  const isTeam = selectionType === 'equipo';
  const [equipos, setEquipos] = useState<{ id: string; nombre: string }[]>([]);
  const createEventSchema = z.object({
    titulo: z.string().min(2, 'Título obligatorio').max(50),
    descripcion: z.string().min(1, 'Selecciona un tipo de evento'),
    fecha_inicio: z.string().min(1, 'Fecha de inicio obligatoria'),
    fecha_fin: z.string().min(1, 'Fecha de fin obligatoria'),
    equipos: isTeam
      ? z.array(z.string()).optional()
      : z.array(z.string()).min(1, 'Selecciona al menos un equipo'),
  });

  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      equipos: [],
    },
  });

  useEffect(() => {
    if (!isTeam) {
      const fetchEquipos = async () => {
        try {
          const equipoAPI = new EquipoAPI();
          const equipos = await equipoAPI.obtenerEquiposClub(clubData.id);
          setEquipos(equipos);
        } catch (error) {
          console.error('Error al obtener los equipos:', error);
        }
      };

      fetchEquipos();
    }
  }, [user.id, isTeam]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof createEventSchema>) => {
    setIsLoading(true);
    try {
      const fecha_inicio = values.fecha_inicio;
      const fecha_fin = values.fecha_fin;
      const club_id = isTeam ? clubData.club.id : clubData.id;
      const equipo_ids = isTeam ? [clubData.id] : values.equipos;
      // console.log({
      //   titulo: values.titulo,
      //   descripcion: values.descripcion,
      //   fecha_inicio,
      //   fecha_fin,
      //   club_id,
      //   equipo_ids,
      // });

      await teamsAPI.crearEvento({
        titulo: values.titulo,
        descripcion: values.descripcion,
        fecha_inicio,
        fecha_fin,
        club_id,
        equipo_ids,
      });

      toast.success('Evento creado correctamente');
      setTimeout(() => {
        router.push(`/${nameTeam}/calendar`);
      }, 1000);
    } catch (error) {
      console.error('Error al crear el evento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[90vh] px-6 items-center max-w-7xl mx-auto pb-10">
      <Toaster />
      <div className="flex flex-col items-start py-4">
        <h1 className="text-3xl font-bold mb-2 text-brand2">Crear Evento</h1>
        <p className="text-gray-600 mb-2 text-center">
          Completa la información del evento y selecciona los equipos a los que
          se asignará.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-4xl mx-auto p-6 space-y-6"
        >
          {/* Selección de equipos */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-brand text-white rounded-full w-8 h-8 flex items-center justify-center">
                  1
                </div>
                <p className="text-xl font-bold text-brand2">Equipo</p>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6 px-4 md:px-12">
              {isTeam ? (
                <p className="text-lg">{clubData.nombre}</p>
              ) : (
                <FormField
                  control={form.control}
                  name="equipos"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        {equipos.map((equipo) => (
                          <Label
                            key={equipo.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              checked={
                                field.value?.includes(equipo.id) ?? false
                              }
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([
                                    ...(field.value || []),
                                    equipo.id,
                                  ]);
                                } else {
                                  field.onChange(
                                    (field.value || []).filter(
                                      (id) => id !== equipo.id
                                    )
                                  );
                                }
                              }}
                            />
                            {equipo.nombre}
                          </Label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Tipo de evento */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-brand text-white rounded-full w-8 h-8 flex items-center justify-center">
                  2
                </div>
                <p className="text-xl font-bold text-brand2">Tipo de evento</p>
              </div>
            </CardHeader>
            <CardContent className="px-4 md:px-12">
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-2 gap-4"
                    >
                      <Label className="flex items-center gap-2 border p-4 rounded-lg">
                        <RadioGroupItem value="amistoso" /> Partido Amistoso{' '}
                        <FaHandshake className="ml-auto h-6 w-6" />
                      </Label>
                      <Label className="flex items-center gap-2 border p-4 rounded-lg">
                        <RadioGroupItem value="torneo" /> Torneo{' '}
                        <FaTrophy className="ml-auto h-6 w-6" />
                      </Label>
                      <Label className="flex items-center gap-2 border p-4 rounded-lg">
                        <RadioGroupItem value="entrenamiento" /> Entrenamiento{' '}
                        <FaDumbbell className="ml-auto h-6 w-6" />
                      </Label>
                      <Label className="flex items-center gap-2 border p-4 rounded-lg">
                        <RadioGroupItem value="liga" /> Liga{' '}
                        <FaFutbol className="ml-auto h-6 w-6" />
                      </Label>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardContent className="px-4 md:px-12">
              <div className="my-6">
                <p className="text-lg font-bold text-brand2">
                  Añadir detalles del evento
                </p>
              </div>
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem className="w-full md:max-w-lg">
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Título" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Fecha del evento */}
          {/* Fecha y Hora de Inicio */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-brand text-white rounded-full w-8 h-8 flex items-center justify-center">
                  3
                </div>
                <p className="text-xl font-bold text-brand2">
                  Fecha del evento
                </p>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6 px-4 md:px-12">
              <FormField
                control={form.control}
                name="fecha_inicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha y hora de inicio</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fecha_fin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha y hora de fin</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Botón de enviar */}
          <div className="flex justify-center pt-5">
            <Button
              type="submit"
              className="w-full md:w-auto bg-brand hover:bg-brand/90 text-white font-bold py-4 px-8 rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Crear Evento'}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreateEventForm;
