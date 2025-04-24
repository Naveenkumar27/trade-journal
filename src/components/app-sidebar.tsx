"use client";

import * as React from "react";
import {
  BarChartIcon,
  ClipboardListIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  BriefcaseIcon,
  ArchiveIcon,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Sidebar navigation data, now translated to German
const data = {
  navMain: [
    {
      title: "Übersicht", // Dashboard
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Offene Positionen", // Open Positions
      url: "/open-positions",
      icon: BriefcaseIcon,
    },
    {
      title: "Geschlossene Positionen", // Closed Positions
      url: "/closed-positions",
      icon: ArchiveIcon,
    },
    {
      title: "Handelshistorie", // Trade History
      url: "/history",
      icon: ClipboardListIcon,
    },
    {
      title: "Analysen", // Analytics
      url: "/analytics",
      icon: BarChartIcon,
    },
  ],
  navSecondary: [
    {
      title: "Einstellungen", // Settings
      url: "/settings",
      icon: SettingsIcon,
    },
    {
      title: "Hilfe", // Help
      url: "/help",
      icon: HelpCircleIcon,
    },
  ],
};

// Main sidebar component with translated labels
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <LayoutDashboardIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Trade Journal</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}