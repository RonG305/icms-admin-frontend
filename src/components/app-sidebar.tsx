"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    label: "",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: "solar:widget-2-linear" },
    ],
  },
  {
    label: "User Management",
    items: [
      {
        title: "Users",
        url: "/user/users-list",
        icon: "solar:users-group-two-rounded-linear",
      },
      {
        title: "Roles",
        url: "/user/roles",
        icon: "solar:shield-keyhole-linear",
      },
      {
        title: "Permissions",
        url: "/user/permissions",
        icon: "solar:lock-keyhole-linear",
      },
    ],
  },
  {
    label: "User Management",
    items: [
      {
        title: "Members",
        url: "/organization/members",
        icon: "solar:users-group-rounded-linear",
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
      {
        title: "Exit Requests",
        url: "/organization/exit-requests",
        icon: "solar:exit-linear",
      },
      {
        title: "References",
        url: "/organization/references",
        icon: "solar:library-linear",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Tasks",
        url: "/tasks",
        icon: "solar:calendar-mark-linear",
        badge: 5,
      },
      {
        title: "Milk collection",
        url: "/operations/milk-collection",
        icon: "solar:cup-linear",
      },
      {
        title: "Deliveries",
        url: "/operations/deliveries",
        icon: "solar:bicycle-linear",
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        title: "Revenue & Expenditure",
        url: "/finance/revenue",
        icon: "solar:graph-new-up-linear",
      },
      {
        title: "Budget Reports",
        url: "/finance/budget",
        icon: "solar:document-text-linear",
      },
    ],
  },
];

const bottomItems = [
  { title: "Settings", url: "/settings", icon: "solar:settings-linear" },
  {
    title: "Help and Support",
    url: "/help",
    icon: "solar:chat-round-dots-linear",
    statusBadge: { label: "online", color: "green" as const },
  },
];

const currentUser = {
  name: "Ronald Mutia",
  email: "mutiaronald138@gmail.com",
  avatar: "",
  role: "System administrator",
  isOnline: true,
};

function BottomItem({
  item,
}: {
  item: {
    title: string;
    url: string;
    icon?: string;
    statusBadge?: { label: string; color?: "green" | "red" | "yellow" };
  };
}) {
  const pathname = usePathname();
  const active = pathname === item.url;

  return (
    <Link
      href={item.url}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-3 py-3 text-[15.5px] font-semibold transition-colors",
        active
          ? "bg-nav-active-bg text-nav-active-text"
          : "text-nav-item-text hover:bg-nav-hover-bg",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-[22px] w-[3.5px] rounded-r-full bg-nav-active-text" />
      )}
      {item.icon && (
        <Icon
          icon={item.icon}
          className={cn(
            "size-[22px] shrink-0",
            active ? "text-nav-active-text" : "text-nav-label",
          )}
        />
      )}
      <span className="flex-1">{item.title}</span>
      {item.statusBadge && (
        <span className="flex items-center gap-1 rounded-full border border-nav-border bg-sidebar px-2 py-[3px]">
          <span
            className={cn(
              "size-[6px] rounded-full",
              item.statusBadge.color === "red"
                ? "bg-danger"
                : item.statusBadge.color === "yellow"
                  ? "bg-warning"
                  : "bg-success",
            )}
          />
          <span className="text-[10px] font-semibold leading-none text-nav-label">
            {item.statusBadge.label}
          </span>
        </span>
      )}
    </Link>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="px-4 pt-5 pb-4 border-b border-nav-border">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/saccoflow-logo-light.svg"
            width={156}
            height={40}
            alt="SaccoFlow"
            className="object-contain"
            priority
          />
        </Link>

        <div className="relative mt-4">
          <Icon
            icon="solar:magnifier-linear"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-nav-label"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-xl border border-nav-border bg-sidebar pl-10 pr-14 py-2.5 text-[14px] text-nav-item-text placeholder:text-nav-label focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
          />
          <kbd className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 select-none rounded-md border border-nav-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-nav-label leading-none">
            ⌘K
          </kbd>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {navGroups.map((group, i) => (
          <NavMain
            key={`${group.label}-${i}`}
            label={group.label}
            items={group.items}
          />
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-nav-border px-3 pt-3 pb-4 gap-0">
        <ul className="flex flex-col mb-3">
          {bottomItems.map((item) => (
            <li key={item.title}>
              <BottomItem item={item} />
            </li>
          ))}
        </ul>

        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
