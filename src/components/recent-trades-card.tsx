"use client";

import { useTradeContext } from "@/contexts/trade-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

export function RecentTradesCard() {
  const { trades } = useTradeContext();
  const recent = trades.slice(0, 10);

  return (
    <Card className="mx-4 lg:mx-6">
      <div className="flex items-center justify-between">
        <CardHeader>
          <CardTitle>Letzte Trades</CardTitle>
        </CardHeader>
        <Button asChild variant="outline" size="sm" className="mr-6" disabled={recent.length === 0}>
          <Link href="/history">Gesamte Historie ansehen</Link>
        </Button>
      </div>
      <CardContent className="overflow-x-auto">
        {recent.length === 0 ? (
          <p className="text-center text-muted-foreground">Keine Recent Trades vorhanden.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Kaufdatum</TableHead>
                <TableHead>Kaufpreis (€)</TableHead>
                <TableHead>Menge</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((t, index) => (
                <TableRow key={t.id ?? `${t.symbol}-${index}`}>  
                  <TableCell>{t.symbol}</TableCell>
                  <TableCell>{format(new Date(t.buy_date), "d MMM yy")}</TableCell>
                  <TableCell>{t.buy_price.toFixed(2)} €</TableCell>
                  <TableCell>{t.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
