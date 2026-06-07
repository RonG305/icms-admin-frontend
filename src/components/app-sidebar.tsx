"use client"

import * as React from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Cooperative",
    email: "store@example.com",
    avatar: "",
  },
  navGroups: [
    {
      label: "",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: "solar:widget-2-linear",
        },
      ],
    },
    {
      label: "Organization",
      items: [
        {
          title: "Members",
          url: "/organization/members",
          icon: "solar:users-group-rounded-linear",
        },
        {
          title: "Exit Requests",
          url: "/organization/exit-requests",
          icon: "solar:exit-linear",
        },
        {
          title: "Shares",
          url: "/organization/shares",
          icon: "solar:chart-square-linear",
        },
        {
          title: "Dividends",
          url: "/organization/dividends",
          icon: "solar:money-bag-linear",
        },
      ],
    },
    {
      label: "Operations",
      items: [
        {
          title: "Milk Collection",
          url: "/operations/milk-collection",
          icon: "solar:cup-linear",
        },
        {
          title: "Milk ATM",
          url: "/operations/milk-atm",
          icon: "solar:shop-minimalistic-linear",
        },
        {
          title: "Rate Config",
          url: "/operations/rate-config",
          icon: "solar:settings-minimalistic-linear",
        },
        {
          title: "Payments",
          url: "/operations/payments",
          icon: "solar:wallet-money-linear",
        },
        {
          title: "Tasks",
          url: "/operations/tasks",
          icon: "solar:calendar-mark-linear",
        },
      ],
    },
    {
      label: "Finance",
      items: [
        {
          title: "Revenue",
          url: "/finance/revenue",
          icon: "solar:graph-new-up-linear",
        },
        {
          title: "Expenses",
          url: "/finance/expenses",
          icon: "solar:bill-list-linear",
        },
        {
          title: "Pasteurization",
          url: "/finance/pasteurization",
          icon: "solar:fire-minimalistic-linear",
        },
        {
          title: "Budget",
          url: "/finance/budget",
          icon: "solar:pie-chart-2-linear",
        },
        {
          title: "Reports",
          url: "/finance/reports",
          icon: "solar:document-text-linear",
        },
      ],
    },
    {
      label: "Inventory",
      items: [
        {
          title: "Stock",
          url: "/inventory/stock",
          icon: "solar:box-linear",
        },
        {
          title: "Suppliers",
          url: "/inventory/suppliers",
          icon: "solar:delivery-linear",
        },
      ],
    },
    {
      label: "Logistics",
      items: [
        {
          title: "Vehicles",
          url: "/logistics/vehicles",
          icon: "solar:bus-linear",
        },
        {
          title: "Trips",
          url: "/logistics/trips",
          icon: "solar:route-linear",
        },
      ],
    },
    {
      label: "Settings",
      items: [
        {
          title: "System Config",
          url: "/settings/system-config",
          target: "_blank",
          icon: "solar:server-minimalistic-linear",
        },
        {
          title: "Auth Pages",
          url: "#",
          icon: "solar:shield-user-linear",
          items: [
            { title: "Sign In 1", url: "/sign-in" },
            { title: "Sign In 2", url: "/sign-in-2" },
            { title: "Sign In 3", url: "/sign-in-3" },
            { title: "Sign Up 1", url: "/sign-up" },
            { title: "Sign Up 2", url: "/sign-up-2" },
            { title: "Sign Up 3", url: "/sign-up-3" },
            { title: "Forgot Password 1", url: "/forgot-password" },
            { title: "Forgot Password 2", url: "/forgot-password-2" },
            { title: "Forgot Password 3", url: "/forgot-password-3" },
          ],
        },
        {
          title: "Errors",
          url: "#",
          icon: "solar:danger-triangle-linear",
          items: [
            { title: "Unauthorized", url: "/errors/unauthorized" },
            { title: "Forbidden", url: "/errors/forbidden" },
            { title: "Not Found", url: "/errors/not-found" },
            { title: "Internal Server Error", url: "/errors/internal-server-error" },
            { title: "Under Maintenance", url: "/errors/under-maintenance" },
          ],
        },
        {
          title: "Settings",
          url: "#",
          icon: "solar:settings-linear",
          items: [
            { title: "User Settings", url: "/settings/user" },
            { title: "Account Settings", url: "/settings/account" },
            { title: "Plans & Billing", url: "/settings/billing" },
            { title: "Appearance", url: "/settings/appearance" },
            { title: "Notifications", url: "/settings/notifications" },
            { title: "Connections", url: "/settings/connections" },
          ],
        },
        
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Logo size={24} className="text-current" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Cooperative</span>
                  <span className="truncate text-xs">Admin Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* <SidebarNotification /> */}
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
