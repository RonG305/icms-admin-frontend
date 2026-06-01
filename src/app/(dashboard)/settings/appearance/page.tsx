"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useTheme } from "@/hooks/use-theme"
import { useSidebarConfig } from "@/contexts/sidebar-context"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PREF_KEY = "appearance-preferences"

const schema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  fontFamily: z.string().min(1),
  fontSize: z.string().min(1),
  sidebarWidth: z.enum(["compact", "comfortable", "spacious"]),
  contentWidth: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

const DEFAULTS: FormValues = {
  theme: "system",
  fontFamily: "inter",
  fontSize: "medium",
  sidebarWidth: "comfortable",
  contentWidth: "fluid",
}

const FONT_SIZE_MAP: Record<string, string> = {
  small: "0.875rem",
  medium: "1rem",
  large: "1.125rem",
}

function loadPrefs(): Partial<FormValues> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(PREF_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Partial<FormValues>
    if (!["compact", "comfortable", "spacious"].includes(parsed.sidebarWidth ?? ""))
      delete parsed.sidebarWidth
    if (!["fixed", "fluid", "container"].includes(parsed.contentWidth ?? ""))
      delete parsed.contentWidth
    if (!["light", "dark", "system"].includes(parsed.theme ?? ""))
      delete parsed.theme
    return parsed
  } catch {
    return {}
  }
}

export default function AppearanceSettings() {
  const { theme: currentTheme, setTheme } = useTheme()
  const { config, updateConfig } = useSidebarConfig()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
  })

  React.useEffect(() => {
    const prefs = loadPrefs()
    form.reset({
      ...DEFAULTS,
      ...prefs,
      theme: (currentTheme as "light" | "dark" | "system") ?? "system",
      sidebarWidth: config.sidebarWidth ?? "comfortable",
      contentWidth: config.contentWidth ?? "fluid",
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function onSubmit(data: FormValues) {
    setTheme(data.theme)
    updateConfig({
      sidebarWidth: data.sidebarWidth,
      contentWidth: data.contentWidth as "fixed" | "fluid" | "container",
    })
    document.documentElement.style.setProperty(
      "--app-font-size",
      FONT_SIZE_MAP[data.fontSize] ?? "1rem"
    )
    try { localStorage.setItem(PREF_KEY, JSON.stringify(data)) } catch {}
  }

  function onCancel() {
    const prefs = loadPrefs()
    form.reset({
      ...DEFAULTS,
      ...prefs,
      theme: (currentTheme as "light" | "dark" | "system") ?? "system",
      sidebarWidth: config.sidebarWidth ?? "comfortable",
      contentWidth: config.contentWidth ?? "fluid",
    })
  }

  return (
    <div className="space-y-6 px-4 lg:px-6 w-full">
      <div>
        <h1 className="text-3xl font-bold">Appearance</h1>
        <p className="text-muted-foreground">
          Customize the appearance of the application.
        </p>
      </div>

      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          {/* Theme */}
          <div className="space-y-3 w-full">
            <h3 className="text-base font-semibold">Theme</h3>
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4 flex-wrap"
                    >
                      {/* Light */}
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
                          <FormControl>
                            <RadioGroupItem value="light" className="sr-only" />
                          </FormControl>
                          <div className="rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
                            <div className="space-y-2">
                              <div className="w-20 h-20 bg-white border rounded-md p-3">
                                <div className="space-y-2">
                                  <div className="h-2 bg-gray-200 rounded w-3/4" />
                                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                                  <div className="flex space-x-2">
                                    <div className="h-2 w-2 bg-gray-300 rounded-full" />
                                    <div className="h-2 bg-gray-200 rounded flex-1" />
                                  </div>
                                  <div className="flex space-x-2">
                                    <div className="h-2 w-2 bg-gray-300 rounded-full" />
                                    <div className="h-2 bg-gray-200 rounded flex-1" />
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm font-medium">Light</span>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>

                      {/* Dark */}
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
                          <FormControl>
                            <RadioGroupItem value="dark" className="sr-only" />
                          </FormControl>
                          <div className="rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
                            <div className="space-y-2">
                              <div className="w-20 h-20 bg-gray-900 border border-gray-700 rounded-md p-3">
                                <div className="space-y-2">
                                  <div className="h-2 bg-gray-600 rounded w-3/4" />
                                  <div className="h-2 bg-gray-600 rounded w-1/2" />
                                  <div className="flex space-x-2">
                                    <div className="h-2 w-2 bg-gray-500 rounded-full" />
                                    <div className="h-2 bg-gray-600 rounded flex-1" />
                                  </div>
                                  <div className="flex space-x-2">
                                    <div className="h-2 w-2 bg-gray-500 rounded-full" />
                                    <div className="h-2 bg-gray-600 rounded flex-1" />
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm font-medium">Dark</span>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>

                      {/* System */}
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
                          <FormControl>
                            <RadioGroupItem value="system" className="sr-only" />
                          </FormControl>
                          <div className="rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
                            <div className="space-y-2">
                              <div className="w-20 h-20 rounded-md border overflow-hidden">
                                <div className="flex h-full">
                                  <div className="w-1/2 h-full bg-white flex flex-col p-1.5 gap-1">
                                    4<div className="h-1.5 bg-gray-200 rounded w-full" />
                                    <div className="h-1.5 bg-gray-200 rounded w-2/3" />
                                    <div className="h-1.5 bg-gray-200 rounded w-1/2" />
                                  </div>
                                  <div className="w-1/2 h-full bg-gray-900 flex flex-col p-1.5 gap-1">
                                    <div className="h-1.5 bg-gray-600 rounded w-full" />
                                    <div className="h-1.5 bg-gray-600 rounded w-2/3" />
                                    <div className="h-1.5 bg-gray-600 rounded w-1/2" />
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm font-medium">System</span>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Font Family */}
          <FormField
            control={form.control}
            name="fontFamily"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font Family</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="cursor-pointer w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Font Size */}
          <FormField
            control={form.control}
            name="fontSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font Size</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="cursor-pointer w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sidebar Width */}
          <FormField
            control={form.control}
            name="sidebarWidth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sidebar Width</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="cursor-pointer w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="compact">Compact (13rem)</SelectItem>
                    <SelectItem value="comfortable">Comfortable (16rem)</SelectItem>
                    <SelectItem value="spacious">Spacious (20rem)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content Width */}
          <FormField
            control={form.control}
            name="contentWidth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Width</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="cursor-pointer w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="fluid">Fluid</SelectItem>
                    <SelectItem value="container">Container</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit" className="cursor-pointer">
              Save Preferences
            </Button>
            <Button
              variant="outline"
              type="button"
              className="cursor-pointer"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
