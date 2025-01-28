'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
import { useState } from 'react';

// Validation schemas
const clubSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre es obligatorio')
    .max(50, 'Máximo 50 caracteres'),
  sport: z.string().min(1, 'Selecciona un deporte'),
  phone: z.string().optional(),
  logo: z.string().optional(),
});

const teamSchema = clubSchema.extend({
  gender: z.string().min(1, 'Selecciona un género'),
  age: z.string().min(1, 'Selecciona un rango de edad'),
  level: z.string().min(1, 'Selecciona un nivel'),
});

// Component props
type FormType = 'club' | 'team';
interface FormProps {
  type: FormType;
}

const FormComponent = ({ type }: FormProps) => {
  const schema = type === 'club' ? clubSchema : teamSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      sport: '',
      phone: '',
      logo: '',
      ...(type === 'team' && { gender: '', age: '', level: '' }),
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      console.log('Form submitted:', values);
      // Simulate API call
      setTimeout(() => alert('Formulario enviado con éxito!'), 1000);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto"
      >
        <h1 className="text-xl font-bold">
          {type === 'club' ? 'Crear un Club' : 'Crear un Equipo'}
        </h1>

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del club o equipo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sport */}
        <FormField
          control={form.control}
          name="sport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deporte</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un deporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="futbol">Fútbol</SelectItem>
                    <SelectItem value="baloncesto">Baloncesto</SelectItem>
                    <SelectItem value="voleibol">Voleibol</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone (optional) */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Número de contacto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Logo (optional) */}
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo (URL opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Enlace al logo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === 'team' && (
          <>
            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Género</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="mixto">Mixto</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edad</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rango de edad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="infantil">Infantil</SelectItem>
                        <SelectItem value="juvenil">Juvenil</SelectItem>
                        <SelectItem value="adulto">Adulto</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Level */}
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nivel</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="principiante">
                          Principiante
                        </SelectItem>
                        <SelectItem value="intermedio">Intermedio</SelectItem>
                        <SelectItem value="avanzado">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Guardar'}
        </Button>
      </form>
    </Form>
  );
};

export default FormComponent;
