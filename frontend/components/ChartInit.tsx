"use client"

import React, { useEffect, useState } from 'react';
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { estadisticaAPI } from "@/api/estadistica"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(120, 100%, 50%)",
  },
} satisfies ChartConfig

interface ChartDatas {
  mes: string
  totalUsuarios: number
}

export function ChartInit() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [estadisticas, setEstadisticas] = useState<ChartDatas[]>([]);
  const [firstMonth, setFirstMonth] = useState<string>("");
  const [lastMonth, setLastMonth] = useState<string>("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiEstadisticas = new estadisticaAPI()

        const id_team = "837ebb9f-64ce-46e9-9c6d-31307331afa7"

        const data = await apiEstadisticas.diagramaUsuariosEquipo(id_team)

        //TODO: Cambiar los datos de mes a espanol

        setFirstMonth(data[0].mes)
        setLastMonth(data[data.length - 1].mes)

        setEstadisticas(data)
      } catch (error: any) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevos Usuarios</CardTitle>
        <CardDescription>
          Se muestra el recuento de los nuevos usuarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={estadisticas}
            margin={{
              left: 12,
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
  )
}
