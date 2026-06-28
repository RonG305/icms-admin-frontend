"use client"

import { LogOut, CircleUser, CreditCard, BellDot, EllipsisVertical } from "lucide-react"
import Link from "next/link"
import { Icon } from "@iconify/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
    role?: string
    isOnline?: boolean
  }
}) {
  const { isMobile } = useSidebar()

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex w-full items-center gap-3 rounded-xl border border-nav-border bg-sidebar px-3 py-3 text-left transition-colors hover:bg-nav-hover-bg cursor-pointer">
          <div className="relative shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="size-9 rounded-full object-cover ring-2 ring-nav-border"
              />
            ) : (
              <div className="size-9 rounded-full bg-nav-active-bg flex items-center justify-center ring-2 ring-nav-border">
                <span className="text-[13px] font-bold text-nav-active-text">{initials}</span>
              </div>
            )}
            {user.isOnline && (
              <span className="absolute -bottom-px -right-px size-3 rounded-full bg-success ring-2 ring-sidebar" />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-semibold leading-none text-sidebar-foreground">
              {user.name}
            </span>
            <span className="truncate text-xs leading-none text-nav-label">
              {user.email}
            </span>
            {user.role && (
              <span className="flex items-center gap-1 mt-3">
                <Icon icon="solar:verified-check-linear" fontSize={20} className="size-3 text-success" />
                <span className="text-sm font-semibold leading-none text-success">
                  {user.role}
                </span>
              </span>
            )}
          </div>

          <EllipsisVertical className="size-4 shrink-0 text-nav-label opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={6}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2.5 px-2 py-2 text-left">
            <div className="relative shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="size-8 rounded-full object-cover" />
              ) : (
                <div className="size-8 rounded-full bg-nav-active-bg flex items-center justify-center">
                  <span className="text-xs font-bold text-nav-active-text">{initials}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold leading-none text-foreground">{user.name}</span>
              <span className="text-[11px] leading-none text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/settings/account"><CircleUser className="size-4" />Account</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/settings/billing"><CreditCard className="size-4" />Billing</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/settings/notifications"><BellDot className="size-4" />Notifications</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer text-destructive focus:text-destructive">
          <Link href="/sign-in"><LogOut className="size-4" />Log out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
