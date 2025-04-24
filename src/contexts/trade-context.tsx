"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useUser } from "@/contexts/user-context"
import { supabase } from "@/lib/supabase"

// Interfaces for trade, deposit, and position tracking
interface Trade {
  id: string
  symbol: string
  buy_date: string
  sell_date?: string | null
  quantity: number
  buy_price: number
  sell_price?: number | null
  stock_name?: string
  notes?: string
}

interface Deposit {
  id: string
  amount: number
  deposited_at: string
}

interface OpenPosition {
  symbol: string
  stock_name: string
  quantity: number
  avg_price: number
  invested: number
}

interface TradeContextType {
  trades: Trade[]
  deposits: number
  loading: boolean
  handleNewTrade: (trade: Trade) => void
  handleUpdateTrade: (trade: Trade) => void
  handleNewDeposit: (deposit: Deposit) => void
  handleDeleteTrade: (id: string) => void
  getOpenPositions: () => OpenPosition[]
}

const TradeContext = createContext<TradeContextType | null>(null)

// Provider component for trade and deposit state management
export function TradeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [trades, setTrades] = useState<Trade[]>([])
  const [deposits, setDeposits] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return

      const [{ data: tradeData }, { data: depositData }] = await Promise.all([
        supabase.from("trades").select("*").eq("user_id", user.id),
        supabase.from("deposits").select("amount").eq("user_id", user.id),
      ])

      setTrades(tradeData ?? [])
      const total = depositData?.reduce((acc, d) => acc + Number(d.amount), 0) || 0
      setDeposits(total)
      setLoading(false)
    }

    fetchData()
  }, [user])

  // Adds a new trade to the state
  const handleNewTrade = (trade: Trade) => {
    setTrades((prev) => [trade, ...prev])
  }

  // Updates an existing trade
  const handleUpdateTrade = (updated: Trade) => {
    setTrades((prev) => prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)))
  }

  // Adds a new deposit and updates total
  const handleNewDeposit = (deposit: Deposit) => {
    setDeposits((prev) => prev + Number(deposit.amount))
  }

  // Removes a trade by ID
  const handleDeleteTrade = (id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id))
  }

  // Calculates current open positions
  const getOpenPositions = (): OpenPosition[] => {
    const openTrades = trades.filter((t) => !t.sell_date || !t.sell_price)
    const grouped = new Map<string, { name?: string; totalQty: number; totalCost: number }>()

    for (const trade of openTrades) {
      const key = trade.symbol
      const entry = grouped.get(key) || { name: trade.stock_name, totalQty: 0, totalCost: 0 }
      entry.totalQty += trade.quantity
      entry.totalCost += trade.quantity * trade.buy_price
      grouped.set(key, entry)
    }

    return Array.from(grouped.entries()).map(([symbol, { name, totalQty, totalCost }]) => ({
      symbol,
      stock_name: name || "—",
      quantity: totalQty,
      avg_price: totalCost / totalQty,
      invested: totalCost,
    }))
  }

  return (
    <TradeContext.Provider
      value={{
        trades,
        deposits,
        loading,
        handleNewTrade,
        handleUpdateTrade,
        handleNewDeposit,
        handleDeleteTrade,
        getOpenPositions,
      }}
    >
      {children}
    </TradeContext.Provider>
  )
}

// Custom hook to use the TradeContext safely
export function useTradeContext() {
  const context = useContext(TradeContext)
  if (!context) throw new Error("useTradeContext must be used within TradeProvider")
  return context
}