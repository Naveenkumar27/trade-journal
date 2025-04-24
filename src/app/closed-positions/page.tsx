"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, differenceInDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { useTradeContext } from "@/contexts/trade-context";

export default function ClosedPositionsPage() {
  const { trades, loading: tradeLoading } = useTradeContext();
  const [loading, setLoading] = useState(true);

  // Filter for closed trades that have a valid sell price and sell date
  const closedTrades = trades.filter(
    (t) => t.sell_price !== null && t.sell_price !== undefined && t.sell_date
  );

  // Total invested capital in closed trades
  const totalClosedInvested = closedTrades.reduce(
    (acc, t) => acc + t.quantity * t.buy_price,
    0
  );

  // Total value realized from selling closed trades
  const totalRealizedValue = closedTrades.reduce(
    (acc, t) => acc + t.quantity * t.sell_price!,
    0
  );

  // Total profit/loss for closed trades
  const totalClosedPnL = totalRealizedValue - totalClosedInvested;

  useEffect(() => {
    // When trades are loaded, stop the loading spinner
    if (!tradeLoading) {
      setLoading(false);
    }
  }, [tradeLoading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 lg:p-6 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card showing total capital invested */}
            <Card>
              <CardHeader>
                <CardTitle>Investiertes Kapital</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  €{totalClosedInvested.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            {/* Card showing realized value from closed positions */}
            <Card>
              <CardHeader>
                <CardTitle>Realisierter Erlös</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  €{totalRealizedValue.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            {/* Card showing total P&L from closed positions */}
            <Card>
              <CardHeader>
                <CardTitle>Realisierter G/V</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-2xl font-semibold ${
                    totalClosedPnL >= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  €{totalClosedPnL.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Table displaying details of all closed positions */}
          <Card>
            <CardHeader>
              <CardTitle>Geschlossene Positionen</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {closedTrades.length === 0 ? (
                <p className="text-muted-foreground">
                  Keine geschlossenen Trades vorhanden.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Kaufsdatum</TableHead>
                      <TableHead>Verkaufsdatum</TableHead>
                      <TableHead>Menge</TableHead>
                      <TableHead>Kaufpreis</TableHead>
                      <TableHead>Verkaufspreis</TableHead>
                      <TableHead>G/V</TableHead>
                      <TableHead>Gehalten (Tage)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {closedTrades.map((t, idx) => {
                      const pnl = (t.sell_price! - t.buy_price) * t.quantity;
                      const daysHeld = differenceInDays(
                        new Date(t.sell_date!),
                        new Date(t.buy_date)
                      );
                      return (
                        <TableRow key={t.id ?? `${t.symbol}-${idx}`}>
                          <TableCell>{t.symbol}</TableCell>
                          <TableCell>{format(new Date(t.buy_date), "d MMM yyyy")}</TableCell>
                          <TableCell>{format(new Date(t.sell_date!), "d MMM yyyy")}</TableCell>
                          <TableCell>{t.quantity}</TableCell>
                          <TableCell>{t.buy_price.toFixed(2)} €</TableCell>
                          <TableCell>{t.sell_price!.toFixed(2)} €</TableCell>
                          <TableCell
                            className={pnl >= 0 ? "text-green-600" : "text-red-500"}
                          >
                            {pnl.toFixed(2)} €
                          </TableCell>
                          <TableCell>{daysHeld}d</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
