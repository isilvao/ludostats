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

const createEventSchema = z.object({
  titulo: z.string().min(2, 'Título obligatorio').max(50),
  descripcion: z.string().min(5, 'Descripción obligatoria').max(200),
  fecha_inicio: z.string().min(1, 'Fecha de inicio obligatoria'),
  fecha_fin: z.string().min(1, 'Fecha de fin obligatoria'),
  equipos: z.array(z.string()).optional(),
});

const CreateEventForm = () => {
  const teamsAPI = new TeamsAPI();
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const { clubData } = useEquipoClub();
  const [eventType, setEventType] = useState('entrenamiento');
  const [team, setTeam] = useState('equipo prueba');
  const [equipos, setEquipos] = useState<{ id: string; nombre: string }[]>([]);
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
  }, [user.id]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof createEventSchema>) => {
    setIsLoading(true);
    try {
      await teamsAPI.crearEvento({
        titulo: values.titulo,
        descripcion: values.descripcion,
        fecha_inicio: values.fecha_inicio,
        fecha_fin: values.fecha_fin,
        club_id: clubData.id,
        equipo_ids: values.equipos,
      });
      router.push('/calendar');
    } catch (error) {
      console.error('Error al crear el evento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[90vh] px-6 items-center max-w-7xl mx-auto pb-10">
      <div className="flex flex-col items-start">
        <h1 className="text-2xl font-bold mb-2 text-brand2">Crear Evento</h1>
        <p className="text-gray-600 mb-2 text-center">
          Completa la información del evento y selecciona los equipos a los que
          se asignará.
        </p>
      </div>
      {/* <div>
        <h1 className="text-2xl font-bold mb-2 text-center">Crear Evento</h1>
        <p className="text-gray-600 mb-2 text-center">
          Completa la información del evento y selecciona los equipos a los que
          se asignará.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white rounded-md shadow-md max-w-2xl mx-auto p-4 border-t-[20px] border-brand"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">
                        Título *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Título del evento"
                          className="shad-input"
                          {...field}
                          value={field.value as string}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">
                        Descripción *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Descripción del evento"
                          className="shad-input"
                          {...field}
                          value={field.value as string}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fecha_inicio"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">
                        Fecha de Inicio *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          className="shad-input"
                          {...field}
                          value={field.value as string}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fecha_fin"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">
                        Fecha de Fin *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          className="shad-input"
                          {...field}
                          value={field.value as string}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="equipos"
                render={({ field }) => (
                  <FormItem>
                    <div className="">
                      <FormLabel className="">Equipos *</FormLabel>
                      <FormControl>
                        <div className="max-h-64 overflow-y-auto border p-2 rounded">
                          {equipos.map((equipo) => (
                            <div
                              key={equipo.id}
                              className="flex items-center space-x-2"
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
                              <label>{equipo.nombre}</label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-center border-t border-gray-200 pt-6">
            <Button
              type="submit"
              className="w-full md:w-auto bg-brand hover:bg-brand/90 text-white font-bold py-4 px-8 rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Crear Evento'}
            </Button>
          </div>
        </form>
      </Form> */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>Equipo</CardHeader>
          <CardContent>
            <RadioGroup
              value={team}
              onChange={(e) => setTeam((e.target as HTMLInputElement).value)}
              className="flex gap-4"
            >
              <Label className="flex items-center gap-2">
                <RadioGroupItem value="equipo prueba" /> equipo prueba
              </Label>
              <Label className="flex items-center gap-2">
                <RadioGroupItem value="CHAM" /> CHAM
              </Label>
              <Label className="flex items-center gap-2">
                <RadioGroupItem value="Chum" /> Chum
              </Label>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Tipo de evento</CardHeader>
          <CardContent>
            <RadioGroup
              value={eventType}
              onChange={(e) =>
                setEventType((e.target as HTMLInputElement).value)
              }
              className="grid grid-cols-2 gap-4"
            >
              <Label className="flex items-center gap-2">
                <RadioGroupItem value="partido entre nosotros" /> Partido entre
                nosotros
              </Label>
              <Label className="flex items-center gap-2">
                <RadioGroupItem value="partido amistoso" /> Partido amistoso
              </Label>
              <Label className="flex items-center gap-2">
                <RadioGroupItem value="torneo" /> Torneo
              </Label>
              <Label className="flex items-center gap-2">
                <RadioGroupItem value="entrenamiento" /> Entrenamiento
              </Label>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Fecha del evento</CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <span>Evento recurrente</span>
              <Switch />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha de inicio</Label>
                <Input type="date" defaultValue="2025-02-25" />
              </div>
              <div>
                <Label>Fecha de fin</Label>
                <Input type="date" defaultValue="2025-02-25" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Hora de encuentro</Label>
                <Input type="time" defaultValue="19:00" />
              </div>
              <div>
                <Label>Hora de inicio</Label>
                <Input type="time" defaultValue="20:00" />
              </div>
              <div>
                <Label>Hora de fin</Label>
                <Input type="time" defaultValue="21:00" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancelar</Button>
          <Button className="bg-blue-600 text-white">Guardar</Button>
        </div>
      </div>
    </section>
  );
};

export default CreateEventForm;
