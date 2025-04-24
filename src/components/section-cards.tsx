"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTradeContext } from "@/contexts/trade-context";

// Trade card summary component to display high-level metrics
export function SectionCards() {
  const { trades, deposits, loading } = useTradeContext();

  // Filter only trades that are closed and have a valid sell date
  const closedTrades = trades.filter(
    (t) => t.sell_price !== null && t.sell_date !== null
  );

  // Calculate net profit/loss
  const pnl = closedTrades.reduce(
    (acc, t) => acc + (t.sell_price! - t.buy_price) * t.quantity,
    0
  );

  // Calculate average holding period in days for closed trades
  const avgHold =
    closedTrades.reduce((acc, t) => {
      const buy = new Date(t.buy_date);
      const sell = new Date(t.sell_date!);
      const days = (sell.getTime() - buy.getTime()) / (1000 * 60 * 60 * 24);
      return acc + days;
    }, 0) / (closedTrades.length || 1);

  // Calculate hit rate (profitable trades / total closed trades)
  const hitRate =
    (closedTrades.filter((t) => t.sell_price! - t.buy_price > 0).length /
      (closedTrades.length || 1)) *
    100;

  // Calculate profit factor (sum of gains / sum of losses)
  const profitFactor = (() => {
    const gains = closedTrades
      .filter((t) => t.sell_price! > t.buy_price)
      .reduce((acc, t) => acc + (t.sell_price! - t.buy_price) * t.quantity, 0);
    const losses = closedTrades
      .filter((t) => t.sell_price! < t.buy_price)
      .reduce((acc, t) => acc + (t.buy_price - t.sell_price!) * t.quantity, 0);
    return losses === 0 ? "∞" : (gains / losses).toFixed(2);
  })();

  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 xl:grid-cols-4 lg:px-6">
      {/* Total Capital Deposited */}
      <Card>
        <CardHeader className="relative">
          <CardDescription>Gesamteinzahlungen</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            €{deposits.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Gesamtbetrag, der in das Portfolio eingezahlt wurde
        </CardFooter>
      </Card>
      {/* Total Profit or Loss */}
      <Card>
        <CardHeader className="relative">
          <CardDescription>Gesamt G/V</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            €{pnl.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Nettogewinn oder -verlust aus allen geschlossenen Trades
        </CardFooter>
      </Card>
      {/* Hit Rate */}
      <Card>
        <CardHeader className="relative">
          <CardDescription>Trefferquote</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {hitRate.toFixed(0)}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Prozentsatz der profitablen Trades
        </CardFooter>
      </Card>
      {/* Average Holding Time */}
      <Card>
        <CardHeader className="relative">
          <CardDescription>Ø Haltedauer</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {avgHold.toFixed(1)} Tage
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Basierend auf geschlossenen Trades mit gültigen Daten
        </CardFooter>
      </Card>
    </div>
  );
}
