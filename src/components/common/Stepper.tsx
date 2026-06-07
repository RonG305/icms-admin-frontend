"use client"

import React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StepConfig {
  title: string
  description?: string
}

interface StepperProps {
  steps: StepConfig[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav className={cn("flex items-start w-full", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-full border-2 text-sm font-semibold transition-all duration-200",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isActive && "border-primary text-primary bg-primary/10",
                  !isCompleted && !isActive && "border-border text-muted-foreground bg-background"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
              </div>
              <div className="mt-2 text-center min-w-[72px]">
                <p
                  className={cn(
                    "text-xs font-medium leading-tight",
                    isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {!isLast && (
              <div
                className={cn(
                  "flex-1 h-0.5 mt-4 mx-2 transition-colors duration-300",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
