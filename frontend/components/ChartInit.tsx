'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { estadisticaAPI } from '@/api/estadistica';
import { useEquipoClub } from '@/hooks/useEquipoClub';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(120, 100%, 50%)',
  },
} satisfies ChartConfig;

interface ChartDatas {
  mes: string;
  totalUsuarios: number;
}

export function ChartInit() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [estadisticas, setEstadisticas] = useState<ChartDatas[]>([]);
  const [firstMonth, setFirstMonth] = useState<string>('');
  const [lastMonth, setLastMonth] = useState<string>('');

  const { clubData } = useEquipoClub();

  const selectionType = localStorage.getItem('selectionType');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiEstadisticas = new estadisticaAPI();

        const id_team = clubData.id;
        let data;

        if (selectionType === 'club') {
          data = await apiEstadisticas.diagramaUsuariosPorClub(id_team);
        } else {
          data = await apiEstadisticas.diagramaUsuariosEquipo(id_team);
        }

        data.forEach((element: any) => {
          switch (element.mes) {
            case 'January':
              element.mes = 'Enero';
              break;
            case 'February':
              element.mes = 'Febrero';
              break;
            case 'March':
              element.mes = 'Marzo';
              break;
            case 'April':
              element.mes = 'Abril';
              break;
            case 'May':
              element.mes = 'Mayo';
              break;
            case 'June':
              element.mes = 'Junio';
              break;
            case 'July':
              element.mes = 'Julio';
              break;
            case 'August':
              element.mes = 'Agosto';
              break;
            case 'September':
              element.mes = 'Septiembre';
              break;
            case 'October':
              element.mes = 'Octubre';
              break;
            case 'November':
              element.mes = 'Noviembre';
              break;
            case 'December':
              element.mes = 'Diciembre';
              break;
          }
        });

        setFirstMonth(data[0].mes);
        setLastMonth(data[data.length - 1].mes);

        setEstadisticas(data);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevos Usuarios</CardTitle>
        <CardDescription>
          Se muestra la cantidad de usuarios registrados por cada mes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={estadisticas}
            margin={{
              left: -15,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              name="Mes"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="totalUsuarios"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              name="Total de Usuarios: "
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Los datos se muestran desde {firstMonth} hasta {lastMonth}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
