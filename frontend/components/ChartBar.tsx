"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
import { useEffect, useState } from "react"
import { estadisticaAPI } from "@/api/estadistica"
import { useEquipoClub } from "@/hooks/useEquipoClub"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ChartBarProps {
  tipoEstadisticaNombre: string
  tipoEstadisticaId: string
}

interface ChartData {
  mes: string
  [key: string]: number | string
}

export function ChartBar({ tipoEstadisticaNombre, tipoEstadisticaId }: ChartBarProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [estadisticas, setEstadisticas] = useState<ChartData[]>([])
  const [firstMonth, setFirstMonth] = useState<string>("")
  const [lastMonth, setLastMonth] = useState<string>("")
  const [trend, setTrend] = useState<number | null>(null)
  const { clubData } = useEquipoClub()

  const selectionType = localStorage.getItem("selectionType")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiEstadisticas = new estadisticaAPI()
        const id_team = clubData.id
        let data

        if (selectionType === "club") {
          data = await apiEstadisticas.diagramaBarrasPorClub(tipoEstadisticaId)
          const formattedData = formatClubData(data)
          setEstadisticas(formattedData)
        } else {
          data = await apiEstadisticas.diagramaBarras(tipoEstadisticaId, id_team)
          setEstadisticas(formatEquipoData(data))
        }

        const months = estadisticas.map((item) => item.mes)
        setFirstMonth(months[0])
        setLastMonth(months[months.length - 1])

        if (estadisticas.length >= 2) {
          const lastMonthData = estadisticas[estadisticas.length - 1]
          const secondLastMonthData = estadisticas[estadisticas.length - 2]
          const lastTotal =
            Object.values(lastMonthData).reduce((sum: number, value) => sum + (typeof value === "number" ? value : 0), 0) - 1 // Subtract 1 to account for the 'mes' property
          const secondLastTotal =
            Object.values(secondLastMonthData).reduce(
              (sum: number, value) => sum + (typeof value === "number" ? value : 0),
              0,
            ) - 1
          const trendValue = ((lastTotal - secondLastTotal) / secondLastTotal) * 100
          setTrend(trendValue)
        }
      } catch (error: any) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [tipoEstadisticaId, clubData.id, estadisticas.length, estadisticas[estadisticas.length - 1], selectionType])

  const formatClubData = (data: any): ChartData[] => {
    const allMonths = new Set<string>()
    Object.values(data).forEach((teamData: any) => {
      Object.keys(teamData).forEach((month) => {
        allMonths.add(month)
      })
    })

    const sortedMonths = Array.from(allMonths).sort(
      (a, b) => new Date(`01 ${a} 2025`).getTime() - new Date(`01 ${b} 2025`).getTime(),
    )

    return sortedMonths.map((month) => {
      const monthData: ChartData = { mes: translateMonth(month) }
      Object.entries(data).forEach(([team, teamData]: [string, any]) => {
        monthData[team] = teamData[month] || 0
      })
      return monthData
    })
  }

  const formatEquipoData = (data: any): ChartData[] => {
    return data.map((item: any) => ({
      mes: translateMonth(item.mes),
      total: item.total,
    }))
  }

  const translateMonth = (month: string): string => {
    const translations: { [key: string]: string } = {
      January: "Enero",
      February: "Febrero",
      March: "Marzo",
      April: "Abril",
      May: "Mayo",
      June: "Junio",
      July: "Julio",
      August: "Agosto",
      September: "Septiembre",
      October: "Octubre",
      November: "Noviembre",
      December: "Diciembre",
    }
    return translations[month] || month
  }

  const chartConfig: ChartConfig = {}
  const colors = [
    "hsl(120, 53.30%, 58.80%)",
    "hsl(200, 53.30%, 58.80%)",
    "hsl(280, 53.30%, 58.80%)",
    "hsl(40, 53.30%, 58.80%)",
    "hsl(320, 53.30%, 58.80%)",
  ]

  if (selectionType === "club") {
    Object.keys(estadisticas[0] || {}).forEach((key, index) => {
      if (key !== "mes") {
        chartConfig[key] = {
          label: key,
          color: colors[index % colors.length],
        }
      }
    })
  } else {
    chartConfig.total = {
      label: tipoEstadisticaNombre,
      color: colors[0],
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tipoEstadisticaNombre}</CardTitle>
        <CardDescription>
          {firstMonth} - {lastMonth} 2025
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={estadisticas}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mes"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}`} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            {selectionType === "club" ? (
              Object.keys(chartConfig).map((key, index) => (
                <Bar key={key} dataKey={key} fill={colors[index % colors.length]} radius={4} name={key} />
              ))
            ) : (
              <Bar dataKey="total" fill={colors[0]} radius={4} name={tipoEstadisticaNombre} />
            )}
            <Legend />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trend !== null ? (
            <>
              Tendencia {trend > 0 ? "subiendo" : "bajando"} por {trend.toFixed(2)}% este mes
              {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </>
          ) : (
            "No hay datos suficientes para mostrar la tendencia"
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          {firstMonth && lastMonth ? (
            <>Los datos se muestran desde {firstMonth} hasta {lastMonth}</>
          ) : (
            "No hay datos de meses"
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

