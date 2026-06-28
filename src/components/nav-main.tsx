"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type NavItem = {
  title: string
  url: string
  icon?: string
  isActive?: boolean
  badge?: number | string
  statusBadge?: { label: string; color?: "green" | "red" | "yellow" }
  items?: { title: string; url: string; isActive?: boolean }[]
}

export function NavMain({ label, items }: { label: string; items: NavItem[] }) {
  const pathname = usePathname()

  const isActive = (item: NavItem) =>
    pathname === item.url || item.items?.some((s) => pathname === s.url) || false

  return (
    <div className="px-3">
      {label && (
        <p className="mb-1 mt-5 px-1 text-[14px] font-semibold uppercase tracking-[0.08em] text-nav-label select-none">
          {label}
        </p>
      )}

      <ul className="flex flex-col">
        {items.map((item) =>
          item.items?.length ? (
            <Collapsible key={item.title} defaultOpen={isActive(item)} className="group/collapsible">
              <li>
                <CollapsibleTrigger asChild>
                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[15.5px] font-semibold text-nav-item-text hover:bg-nav-hover-bg transition-colors">
                    {item.icon && (
                      <Icon icon={item.icon} className="size-[22px] shrink-0 text-nav-label" />
                    )}
                    <span className="flex-1 text-left">{item.title}</span>
                    {item.badge !== undefined && (
                      <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full border border-nav-border text-[12px] font-semibold leading-none text-nav-label">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="size-4 text-nav-label transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="ml-[38px] border-l border-nav-border pl-4 pt-0.5 pb-2 flex flex-col">
                    {item.items.map((sub) => (
                      <li key={sub.title}>
                        <Link
                          href={sub.url}
                          className={cn(
                            "block rounded-lg px-2 py-2 text-[14px] font-medium transition-colors",
                            pathname === sub.url
                              ? "text-nav-active-text font-semibold"
                              : "text-nav-label hover:text-nav-item-text"
                          )}
                        >
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </li>
            </Collapsible>
          ) : (
            <li key={item.title}>
              <Link
                href={item.url}
                className={cn(
                  "relative flex items-center gap-3 rounded-sm px-3 py-3 text-[15.5px] font-semibold transition-colors",
                  pathname === item.url
                    ? "bg-background border text-nav-active-text"
                    : "text-nav-item-text hover:bg-nav-hover-bg"
                )}
              >
                {pathname === item.url && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-[22px] w-[3.5px] rounded-r-full bg-nav-active-text" />
                )}

                {item.icon && (
                  <Icon
                    icon={item.icon}
                    className={cn(
                      "size-[22px] shrink-0",
                      pathname === item.url ? "text-nav-active-text" : "text-nav-label"
                    )}
                  />
                )}

                <span className="flex-1">{item.title}</span>

                {item.badge !== undefined && (
                  <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full border border-nav-border text-[12px] font-semibold leading-none text-nav-label">
                    {item.badge}
                  </span>
                )}

                {item.statusBadge && (
                  <span className="flex items-center gap-1 rounded-xs border border-nav-border bg-sidebar px-2 py-1">
                    <span
                      className={cn(
                        "size-[6px] rounded-full",
                        item.statusBadge.color === "red"
                          ? "bg-danger"
                          : item.statusBadge.color === "yellow"
                          ? "bg-warning"
                          : "bg-success"
                      )}
                    />
                    <span className="text-[10px] font-semibold leading-none text-nav-label">
                      {item.statusBadge.label}
                    </span>
                  </span>
                )}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  )
}
