"use client"

import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ThemeCustomizer, ThemeCustomizerTrigger } from "@/components/theme-customizer"
import { useSidebarConfig } from "@/hooks/use-sidebar-config"

export function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  const [themeCustomizerOpen, setThemeCustomizerOpen] = React.useState(false)
  const { config } = useSidebarConfig()

  const sidebarWidthMap: Record<string, string> = {
    compact: "13rem",
    comfortable: "16rem",
    spacious: "20rem",
  }

  const contentWidthClass: Record<string, string> = {
    fluid: "w-full",
    container: "max-w-screen-xl mx-auto w-full",
    fixed: "max-w-5xl mx-auto w-full",
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": sidebarWidthMap[config.sidebarWidth] ?? "16rem",
        "--sidebar-width-icon": "3rem",
        "--header-height": "calc(var(--spacing) * 14)",
      } as React.CSSProperties}
      className={config.collapsible === "none" ? "sidebar-none-mode" : ""}
    >
      {config.side === "left" ? (
        <>
          <AppSidebar
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className={`flex flex-col gap-4 py-4 md:gap-6 md:py-6 md:px-6 px-4 ${contentWidthClass[config.contentWidth] ?? "w-full"}`}>
                  {children}
                </div>
              </div>
            </div>
            <SiteFooter />
          </SidebarInset>
        </>
      ) : (
        <>
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className={`flex flex-col gap-4 py-4 md:gap-6 md:py-6 md:px-6 px-4 ${contentWidthClass[config.contentWidth] ?? "w-full"}`}>
                  {children}
                </div>
              </div>
            </div>
            <SiteFooter />
          </SidebarInset>
          <AppSidebar
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />
        </>
      )}

      <ThemeCustomizerTrigger onClick={() => setThemeCustomizerOpen(true)} />
      <ThemeCustomizer
        open={themeCustomizerOpen}
        onOpenChange={setThemeCustomizerOpen}
      />
    </SidebarProvider>
  )
}
