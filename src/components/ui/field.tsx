import * as React from "react"
import { cn } from "@/lib/utils"

function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn("cursor-pointer", className)}
      {...props}
    />
  )
}

function Field({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        "rounded-lg border p-3 transition-colors",
        "hover:border-primary hover:bg-primary/5",
        "data-[orientation=horizontal]:flex data-[orientation=horizontal]:items-center data-[orientation=horizontal]:justify-between data-[orientation=horizontal]:gap-4",
        "data-[orientation=vertical]:flex data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-2",
        "data-[invalid=true]:border-destructive",
        "has-[button[data-state=checked]]:border-2 has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/5",
        className
      )}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("flex flex-col gap-0.5 min-w-0 flex-1", className)}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-title"
      className={cn("text-sm font-medium leading-snug", className)}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-xs text-muted-foreground leading-snug", className)}
      {...props}
    />
  )
}

export { Field, FieldLabel, FieldContent, FieldTitle, FieldDescription }
