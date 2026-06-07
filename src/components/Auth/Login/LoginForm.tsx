"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import Image from "next/image"
import { AlertCircleIcon, ArrowLeft, Building2, CheckCircle2, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Logo } from "@/components/logo"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Stepper, StepConfig } from "@/components/common/Stepper"
import { loginUser } from "@/actions/auth"
import { Organization } from "@/types/organization"

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type FormValues = z.infer<typeof schema>

const STEPS: StepConfig[] = [
  { title: "Credentials", description: "Email & password" },
  { title: "Organization", description: "Select your org" },
]

interface LoginFormProps extends React.ComponentProps<"div"> {
  organizations: Organization[]
}

export function LoginForm({ className, organizations, ...props }: LoginFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
  const [orgSearch, setOrgSearch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  const safeOrgs: Organization[] = Array.isArray(organizations) ? organizations : []
  const filteredOrgs = safeOrgs.filter(
    (org) =>
      org.organization_name.toLowerCase().includes(orgSearch.toLowerCase()) ||
      org.short_name?.toLowerCase().includes(orgSearch.toLowerCase())
  )

  const handleNext = async () => {
    const valid = await form.trigger(["email", "password"])
    if (valid) {
      setError(null)
      setCurrentStep(1)
    }
  }

  const handleBack = () => {
    setCurrentStep(0)
    setError(null)
  }

  const handleSignIn = async () => {
    const { email, password } = form.getValues()
    setError(null)
    setIsSubmitting(true)
    try {
      const result = await loginUser(email, password, selectedOrgId ?? undefined)
      if (result?.message || result?.error) {
        setError(result.message || result.error)
        return
      }
      router.push("/dashboard")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-1">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-5">

              <div className="flex justify-center mb-1">
                <Link href="/" className="flex items-center gap-2 font-medium">
                  <div className="bg-primary text-primary-foreground flex size-14 items-center justify-center rounded-xl">
                    <Logo size={22} />
                  </div>
                  <span className="text-xl">Cooperative</span>
                </Link>
              </div>

          
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Sign in to your account to continue
                </p>
              </div>

     
              <Stepper steps={STEPS} currentStep={currentStep} />

       
              {error && (
                <Alert variant="destructive">
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertTitle>Login failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

   
              {currentStep === 0 && (
                <Form {...form}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleNext()
                    }}
                    className="flex flex-col gap-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="m@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <Link
                              href="/forgot-password"
                              className="text-sm underline underline-offset-4 hover:text-primary"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full cursor-pointer">
                      Next
                    </Button>
                  </form>
                </Form>
              )}

              {currentStep === 1 && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    Select an organization to sign in to, or skip to continue without one.
                  </p>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Search organizations..."
                      value={orgSearch}
                      onChange={(e) => setOrgSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <ScrollArea className="h-44 rounded-md border">
                    {filteredOrgs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-44 text-muted-foreground gap-2">
                        <Building2 className="h-8 w-8 opacity-30" />
                        <p className="text-sm">No organizations found</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5 p-2">
                        {filteredOrgs.map((org) => (
                          <button
                            key={org.id}
                            type="button"
                            onClick={() =>
                              setSelectedOrgId(org.id === selectedOrgId ? null : org.id)
                            }
                            className={cn(
                              "flex items-center gap-3 p-2.5 rounded-md border text-left w-full transition-all duration-150",
                              "hover:border-primary hover:bg-primary/5",
                              selectedOrgId === org.id
                                ? "border-primary bg-primary/5"
                                : "border-transparent bg-muted/40"
                            )}
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted shrink-0">
                              <Building2 className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">
                                {org.organization_name}
                              </p>
                              {org.short_name && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {org.short_name}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Badge
                                variant={org.status === "active" ? "default" : "secondary"}
                                className="text-xs capitalize"
                              >
                                {org.status}
                              </Badge>
                              {selectedOrgId === org.id && (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleBack}
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 cursor-pointer"
                      disabled={isSubmitting}
                      onClick={handleSignIn}
                    >
                      {isSubmitting ? <Spinner /> : "Sign in"}
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </div>

          
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
