"use client"

import { useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useTradeContext } from "@/contexts/trade-context"

// Trade object structure
export interface Trade {
  symbol: string
  buy_date: string
  sell_date: string | null
  quantity: number
  buy_price: number
  sell_price: number | null
}

// Chart component now pulls trades + loading from TradeContext directly
export function ChartAreaInteractive() {
  const { trades, loading } = useTradeContext()

  const chartData = useMemo(() => {
    const monthlyStats = new Map<string, { open: number; closed: number }>()

    trades.forEach((t) => {
      const buyDate = new Date(t.buy_date)
      const monthLabel = buyDate.toLocaleDateString("de-DE", {
        month: "short",
        year: "numeric",
      })

      if (!monthlyStats.has(monthLabel)) {
        monthlyStats.set(monthLabel, { open: 0, closed: 0 })
      }

      const stat = monthlyStats.get(monthLabel)!
      if (t.sell_price == null) stat.open += 1
      else stat.closed += 1
    })

    // Ensure chart data is sorted chronologically
    return Array.from(monthlyStats.entries())
      .map(([month, values]) => ({ month, ...values }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
  }, [trades])

  const chartConfig = {
    open: {
      label: "Offene Trades",
      color: "hsl(var(--chart-2))",
    },
    closed: {
      label: "Geschlossene Trades",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  if (loading) {
    return <Skeleton className="h-64 w-full rounded-xl" />
  }

  if (chartData.length === 0) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Handelsaktivität</CardTitle>
          <CardDescription>Keine Daten verfügbar</CardDescription> {/* No data available */}
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <p className="text-center">Keine Daten zum Anzeigen</p> {/* No data to display */}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Handelsaktivität</CardTitle>
        <CardDescription>Die Anzahl der Trades pro Monat</CardDescription> {/* Number of trades per month */}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillOpen" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-open)"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-open)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillClosed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-closed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-closed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="open"
              type="monotone"
              fill="url(#fillOpen)"
              stroke="var(--color-open)"
            />
            <Area
              dataKey="closed"
              type="monotone"
              fill="url(#fillClosed)"
              stroke="var(--color-closed)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}