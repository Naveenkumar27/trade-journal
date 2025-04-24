"use client";

import { PlusIcon, WalletIcon, type LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AddDepositForm } from "@/components/add-deposit-form";
import { NewTradeForm } from "@/components/new-trade-form";
import { Button } from "./ui/button";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  return (
    <>
      {/* Main Navigation */}
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    {item.icon && <item.icon className="mr-2" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Quick Actions */}
      <SidebarGroup className="mt-4">
        <SidebarGroupLabel>Schnellaktionen</SidebarGroupLabel> {/* Quick Actions */}
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Trade hinzufügen"
                className="w-full justify-start gap-2"
              >
                <NewTradeForm
                  trigger={
                    <Button variant="outline" className="w-4/5 mt-2">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Trade hinzufügen {/* Add Trade */}
                    </Button>
                  }
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Einzahlung hinzufügen"
                className="w-full justify-start gap-2"
              >
                <AddDepositForm
                  trigger={
                    <Button variant="outline" className="w-4/5 mt-2">
                      <WalletIcon className="h-4 w-4" />
                      <span>Einzahlung hinzufügen</span> {/* Add Deposit */}
                    </Button>
                  }
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
