"use client"

import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ActionDropdownProps {
  children: React.ReactNode
  align?: "start" | "center" | "end"
}

export function ActionDropdown({ children, align = "end" }: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[200px]">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
