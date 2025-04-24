"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Trash2Icon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTradeContext } from "@/contexts/trade-context";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { NewTradeForm } from "@/components/new-trade-form";
import type { TradeFormData } from "@/components/new-trade-form";

// DataTable lists trades grouped by symbol
export interface Trade {
  id?: string;
  symbol: string;
  stock_name?: string;
  buy_date: string;
  sell_date?: string | null;
  quantity: number;
  buy_price: number;
  sell_price?: number | null;
  notes?: string;
}

function groupTradesBySymbol(trades: Trade[]) {
  const map = new Map<string, Trade[]>();
  for (const trade of trades) {
    const list = map.get(trade.symbol) || [];
    list.push(trade);
    map.set(trade.symbol, list);
  }
  return Array.from(map.entries()).map(([symbol, trades]) => {
    const totalQty = trades.reduce((sum, t) => sum + t.quantity, 0);
    const totalCost = trades.reduce(
      (sum, t) => sum + t.quantity * t.buy_price,
      0
    );
    return {
      symbol,
      trades,
      totalQuantity: totalQty,
      totalInvested: totalCost,
      avgPrice: totalCost / totalQty,
    };
  });
}

export function DataTable() {
  const { trades, loading, handleDeleteTrade } = useTradeContext();
  const [filter, setFilter] = React.useState("");
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [editTrade, setEditTrade] = React.useState<
    (TradeFormData & { id?: string }) | null
  >(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [expandedGroups, setExpandedGroups] = React.useState(new Set<string>());

  const filtered = trades.filter((t) => {
    return (
      t.symbol.toLowerCase().includes(filter.toLowerCase()) ||
      t.stock_name?.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const groupedTrades = groupTradesBySymbol(filtered);

  const deleteTrade = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("trades").delete().eq("id", id);
    setDeletingId(null);
    if (error) {
      toast.error("Fehler beim Löschen des Trades.");
    } else {
      handleDeleteTrade(id);
      toast.success("Trade wurde gelöscht.");
    }
  };

  const toggleGroup = (symbol: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(symbol) ? next.delete(symbol) : next.add(symbol);
      return next;
    });
  };

  if (loading) {
    return (
      <Card className="mx-4 lg:mx-6">
        <CardContent>
          <Skeleton className="h-64 w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mx-4 lg:mx-6">
        <Input
          placeholder="Filtern nach Symbol oder Name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-60 ml-6 my-4"
        />
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Aktienname</TableHead>
                <TableHead>Kaufsdatum</TableHead>
                <TableHead>Verkaufsdatum</TableHead>
                <TableHead>Menge</TableHead>
                <TableHead>Kaufpreis</TableHead>
                <TableHead>Verkaufspreis</TableHead>
                <TableHead>Gewinn/Verlust</TableHead>
                <TableHead>Notizen</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedTrades.length ? (
                groupedTrades.map((group) => (
                  <React.Fragment key={group.symbol}>
                    <TableRow
                      className="bg-muted/50 hover:bg-muted font-semibold cursor-pointer transition"
                      onClick={() => toggleGroup(group.symbol)}
                    >
                      <TableCell colSpan={10} className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          {expandedGroups.has(group.symbol) ? (
                            <ChevronDownIcon className="w-4 h-4" />
                          ) : (
                            <ChevronRightIcon className="w-4 h-4" />
                          )}
                          {group.symbol} — {group.trades.length} Trade
                          {group.trades.length > 1 ? "s" : ""},{" "}
                          {group.totalQuantity} Aktien, Ø: €
                          {group.avgPrice.toFixed(2)}
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedGroups.has(group.symbol) &&
                      group.trades.map((trade, idx) => {
                        const pnl =
                          trade.sell_price && trade.sell_price > 0
                            ? (trade.sell_price - trade.buy_price) *
                              trade.quantity
                            : null;
                        return (
                          <TableRow
                            key={trade.id ?? `${trade.symbol}-${idx}`}
                            className="hover:bg-accent cursor-pointer"
                            onClick={() => {
                              setEditTrade({
                                ...trade,
                                sell_price: trade.sell_price ?? "",
                                sell_date: trade.sell_date ?? "",
                                stock_name: trade.stock_name ?? "",
                              });
                              setEditDialogOpen(true);
                            }}
                          >
                            <TableCell className="pl-6 font-medium">
                              {trade.symbol}
                            </TableCell>
                            <TableCell>{trade.stock_name || "—"}</TableCell>
                            <TableCell>
                              {format(new Date(trade.buy_date), "d MMM yy")}
                            </TableCell>
                            <TableCell>
                              {trade.sell_date
                                ? format(new Date(trade.sell_date), "d MMM yy")
                                : "—"}
                            </TableCell>
                            <TableCell>{trade.quantity}</TableCell>
                            <TableCell>
                              {trade.buy_price.toFixed(2)} €
                            </TableCell>
                            <TableCell>
                              {trade.sell_price
                                ? `${trade.sell_price.toFixed(2)} €`
                                : "—"}
                            </TableCell>
                            <TableCell>
                              {pnl !== null ? (
                                <Badge
                                  variant={pnl >= 0 ? "default" : "destructive"}
                                  className="flex items-center gap-1"
                                >
                                  {pnl >= 0 ? (
                                    <ArrowUpIcon className="h-3 w-3" />
                                  ) : (
                                    <ArrowDownIcon className="h-3 w-3" />
                                  )}{" "}
                                  {pnl.toFixed(2)} €
                                </Badge>
                              ) : (
                                "—"
                              )}
                            </TableCell>
                            <TableCell>{trade.notes || "—"}</TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    disabled={deletingId === trade.id}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2Icon className="h-4 w-4 text-red-500" />
                                    <span className="sr-only">Löschen</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Trade löschen
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Möchten Sie diesen Trade wirklich löschen?
                                      Diese Aktion kann nicht rückgängig gemacht
                                      werden.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Abbrechen
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteTrade(trade.id!);
                                      }}
                                    >
                                      Löschen
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center text-muted-foreground"
                  >
                    Keine Trades gefunden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editTrade && (
        <NewTradeForm
          mode="edit"
          initialValues={editTrade}
          onSuccess={() => {
            setEditDialogOpen(false);
            setEditTrade(null);
          }}
          trigger={<span />} // invisible trigger
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
        />
      )}
    </>
  );
}
