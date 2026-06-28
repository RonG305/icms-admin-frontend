import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm px-2.5 py-0.5 text-base font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary/15 text-primary [a&]:hover:bg-primary/25 ",
        secondary:
          "bg-muted text-muted-foreground [a&]:hover:bg-muted/80",
        success:
          "bg-success/15 text-success [a&]:hover:bg-success/25 border-success",
        accent:
          "bg-accent text-accent-foreground [a&]:hover:bg-accent/80",
        warning:
          "bg-warning/15 text-warning-foreground [a&]:hover:bg-warning/25",
        info:
          "bg-info/15 text-info-foreground [a&]:hover:bg-info/25",
        destructive:
          "bg-destructive/15 text-destructive [a&]:hover:bg-destructive/25",
        outline:
          "border border-border bg-transparent text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
