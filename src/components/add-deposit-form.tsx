"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/user-context";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useTradeContext } from "@/contexts/trade-context";

// Schema definition for deposit validation
const depositSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "Der Betrag muss größer als 0 sein." }), // Validation message in German
});

// Type based on the schema
type DepositFormData = z.infer<typeof depositSchema>;

// Component for adding a capital deposit
export function AddDepositForm({
  trigger,
  onSuccess,
}: {
  trigger: React.ReactNode;
  onSuccess?: (newDeposit: any) => void;
}) {
  const { user } = useUser();
  const { handleNewDeposit } = useTradeContext();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
  });

  // Form submission logic
  const onSubmit = async (data: DepositFormData) => {
    const { data: inserted, error } = await supabase
      .from("deposits")
      .insert({ user_id: user?.id, amount: data.amount })
      .select()
      .single();

    if (!error && inserted) {
      toast({
        title: "Erfolgreich",
        description: "Einzahlung wurde hinzugefügt.",
      });
      setOpen(false);
      reset();
      handleNewDeposit(inserted);
      if (onSuccess) onSuccess(inserted);
    } else {
      toast({
        title: "Fehler",
        description:
          "Beim Hinzufügen der Einzahlung ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-sm max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <DialogHeader>
            <DialogTitle>Kapital einzahlen</DialogTitle>{" "}
            {/* Add Capital Deposit */}
            <DialogDescription>
              Geben Sie den Betrag ein, den Sie in Ihr Portfolio eingezahlt
              haben.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="amount">Betrag (€)</Label> {/* Amount (€) */}
            <Input required type="number" step="0.01" {...register("amount")} />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Speichern..." : "Einzahlen"} {/* Add Deposit */}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
