"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/user-context";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useTradeContext } from "@/contexts/trade-context";

// Schema definition using Zod for form validation
const tradeSchema = z.object({
  symbol: z.string().min(1).max(6).regex(/^[A-Z]+$/),
  stock_name: z.string().max(50).optional(),
  buy_date: z.string().min(1),
  quantity: z.coerce.number().positive(),
  buy_price: z.coerce.number().positive(),
  sell_date: z.string().nullable().optional(),
  sell_price: z.union([z.coerce.number().positive(), z.literal("")]).optional(),
  notes: z.string().max(300).optional(),
});

export type TradeFormData = z.infer<typeof tradeSchema>;

export function NewTradeForm({
  trigger,
  onSuccess,
  initialValues,
  mode = "create",
  open: controlledOpen,
  setOpen: setControlledOpen,
}: {
  trigger: React.ReactNode;
  onSuccess?: (trade: any) => void;
  initialValues?: TradeFormData & { id?: string };
  mode?: "create" | "edit";
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) {
  const { user } = useUser();
  const { trades, handleNewTrade, handleUpdateTrade } = useTradeContext();
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const form = useForm<TradeFormData>({
    resolver: zodResolver(tradeSchema),
    defaultValues: initialValues || {
      buy_date: new Date().toISOString().split("T")[0],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  // Handles both trade creation and updating
  const onSubmit = async (data: TradeFormData) => {
    const formattedSymbol = data.symbol.toUpperCase();

    if (mode === "edit" && initialValues?.id) {
      const { data: existing } = await supabase
        .from("trades")
        .select("id")
        .eq("user_id", user?.id)
        .eq("symbol", formattedSymbol)
        .eq("buy_date", data.buy_date)
        .maybeSingle();

      if (existing && existing.id !== initialValues.id) {
        toast({
          title: "Doppelter Trade",
          description: "Es existiert bereits ein Trade mit diesem Symbol und Kaufdatum.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("trades")
        .update({
          symbol: formattedSymbol,
          stock_name: data.stock_name,
          buy_date: data.buy_date,
          quantity: data.quantity,
          buy_price: data.buy_price,
          sell_date: data.sell_date || null,
          sell_price: data.sell_price === "" ? null : data.sell_price,
          notes: data.notes,
        })
        .eq("id", initialValues.id);

      if (!error) {
        const updatedTrade = {
          ...data,
          id: initialValues.id,
          sell_price: data.sell_price === "" ? null : data.sell_price,
        };
        toast({ title: "Erfolg", description: "Trade aktualisiert." });
        setOpen(false);
        handleUpdateTrade(updatedTrade);
        if (onSuccess) onSuccess(updatedTrade);
      } else {
        toast({ title: "Fehler", description: "Aktualisierung fehlgeschlagen.", variant: "destructive" });
      }
      return;
    }

    const { data: existing } = await supabase
      .from("trades")
      .select("id")
      .eq("user_id", user?.id)
      .eq("symbol", formattedSymbol)
      .eq("buy_date", data.buy_date)
      .maybeSingle();

    if (existing) {
      toast({
        title: "Doppelter Trade",
        description: "Es existiert bereits ein Trade mit diesem Symbol und Kaufdatum.",
        variant: "destructive",
      });
      return;
    }

    const { data: inserted, error } = await supabase
      .from("trades")
      .insert({
        user_id: user?.id,
        symbol: formattedSymbol,
        stock_name: data.stock_name,
        buy_date: data.buy_date,
        quantity: data.quantity,
        buy_price: data.buy_price,
        sell_date: data.sell_date || null,
        sell_price: data.sell_price === "" ? null : data.sell_price,
        notes: data.notes,
      })
      .select()
      .single();

    if (!error && inserted) {
      toast({ title: "Erfolg", description: "Trade erfolgreich hinzugefügt." });
      setOpen(false);
      reset();
      handleNewTrade(inserted);
      if (onSuccess) onSuccess(inserted);
    } else {
      toast({ title: "Fehler", description: "Speichern des Trades fehlgeschlagen.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <DialogHeader>
            <DialogTitle>
              {mode === "edit" ? "Trade bearbeiten" : "Neuen Trade hinzufügen"}
            </DialogTitle>
            <DialogDescription>
              Füllen Sie die Trade-Details aus. Felder mit <span className="text-red-500">*</span> sind erforderlich.
            </DialogDescription>
          </DialogHeader>

          {/* Required: Symbol */}
          <div className="grid gap-2">
            <Label htmlFor="symbol">Symbol <span className="text-red-500">*</span></Label>
            <Input {...register("symbol")}/>
            {errors.symbol && <p className="text-xs text-red-500">{errors.symbol.message}</p>}
          </div>

          {/* Optional: Stock Name */}
          <div className="grid gap-2">
            <Label htmlFor="stock_name">Aktienname</Label>
            <Input {...register("stock_name")}/>
          </div>

          {/* Required: Buy Date */}
          <div className="grid gap-2">
            <Label htmlFor="buy_date">Kaufdatum <span className="text-red-500">*</span></Label>
            <Input type="date" {...register("buy_date")}/>
            {errors.buy_date && <p className="text-xs text-red-500">{errors.buy_date.message}</p>}
          </div>

          {/* Required: Quantity */}
          <div className="grid gap-2">
            <Label htmlFor="quantity">Menge <span className="text-red-500">*</span></Label>
            <Input type="number" {...register("quantity")}/>
            {errors.quantity && <p className="text-xs text-red-500">{errors.quantity.message}</p>}
          </div>

          {/* Required: Buy Price */}
          <div className="grid gap-2">
            <Label htmlFor="buy_price">Kaufpreis (€) <span className="text-red-500">*</span></Label>
            <Input type="number" {...register("buy_price")}/>
            {errors.buy_price && <p className="text-xs text-red-500">{errors.buy_price.message}</p>}
          </div>

          {/* Optional: Sell Date */}
          <div className="grid gap-2">
            <Label htmlFor="sell_date">Verkaufsdatum (optional)</Label>
            <Input type="date" {...register("sell_date")}/>
          </div>

          {/* Optional: Sell Price */}
          <div className="grid gap-2">
            <Label htmlFor="sell_price">Verkaufspreis (€)</Label>
            <Input type="number" {...register("sell_price")}/>
          </div>

          {/* Optional: Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Notizen</Label>
            <Textarea {...register("notes")}/>
          </div>

          {/* Submit Button */}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Speichern..." : mode === "edit" ? "Aktualisieren" : "Speichern"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}