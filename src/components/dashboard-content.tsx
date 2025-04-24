"use client"

import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { RecentTradesCard } from "@/components/recent-trades-card"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// Dashboard main layout
export function DashboardContent() {

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards /> {/* Section with KPIs: Deposits, P&L, etc. */}
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive /> {/* Handelsaktivität pro Monat */}
              </div>
              <RecentTradesCard /> {/* Kürzlich hinzugefügte Trades */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}