"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useTradeContext } from "@/contexts/trade-context";

// Trade object structure
export interface Trade {
  symbol: string;
  buy_date: string;
  sell_date: string | null;
  quantity: number;
  buy_price: number;
  sell_price: number | null;
}

// Chart component showing open vs closed trades by month
export function ChartAreaInteractive() {
  const { trades, loading } = useTradeContext();

  const chartData = useMemo(() => {
    // Use a map with monthKey (YYYY-MM) to accumulate stats
    const statsMap = new Map<
      string,
      { date: Date; open: number; closed: number }
    >();

    trades.forEach((trade) => {
      const buyDate = new Date(trade.buy_date);
      // Normalize to first day of month
      const monthDate = new Date(buyDate.getFullYear(), buyDate.getMonth(), 1);
      const monthKey = monthDate.toISOString().slice(0, 7); // 'YYYY-MM'

      if (!statsMap.has(monthKey)) {
        statsMap.set(monthKey, { date: monthDate, open: 0, closed: 0 });
      }

      const stats = statsMap.get(monthKey)!;
      if (trade.sell_price == null) stats.open += 1;
      else stats.closed += 1;
    });

    // Convert to array, sort by date, and map to label
    return Array.from(statsMap.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ date, open, closed }) => ({
        month: date.toLocaleDateString("de-DE", {
          month: "short",
          year: "numeric",
        }),
        open,
        closed,
      }));
  }, [trades]);

  // Chart configuration (German labels)
  const chartConfig = {
    open: { label: "Offene Trades", color: "hsl(var(--chart-2))" },
    closed: { label: "Geschlossene Trades", color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig;

  // Show skeleton while loading
  if (loading) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  // No data state
  if (chartData.length === 0) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Handelsaktivität</CardTitle>
          <CardDescription>Keine Daten verfügbar</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex justify-center">
          <p className="text-muted-foreground">Keine Daten zum Anzeigen.</p>
        </CardContent>
      </Card>
    );
  }

  // Render chart with sorted data
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Handelsaktivität</CardTitle>
        <CardDescription>Anzahl der Trades pro Monat</CardDescription>
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
  );
}