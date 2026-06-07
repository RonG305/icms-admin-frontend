"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import Link from "next/link";
import { AlertCircleIcon, Check } from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Card, CardContent } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Field, FieldLabel, FieldContent, FieldTitle, FieldDescription } from "../ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { showToast } from "../common/ShowToast";
import RigLines from "../common/svg/RigLines";
import { cn } from "@/lib/utils";
import { loginUser } from "@/actions/auth";
import { Organization } from "@/types/organization";

const schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  organization_id: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

const STEPS = [
  {
    title: "Welcome Back",
    description: "Enter your credentials to continue",
    fields: ["email", "password"] as (keyof FormFields)[],
  },
  {
    title: "Select Organization",
    description: "Choose the organization to sign in to",
    fields: [] as (keyof FormFields)[],
  },
];

export const LoginFormContainer = ({
  organizations = [],
}: {
  organizations: Organization[];
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      organization_id: "",
    },
    mode: "onTouched",
  });

  const handleNext = async () => {
    const valid = await form.trigger(STEPS[currentStep].fields as any);
    if (valid) {
      setError(null);
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((s) => s - 1);
  };

  const onSubmit = async (values: FormFields) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await loginUser(
        values.email,
        values.password,
        values.organization_id || undefined,
      );
      if (result?.error) {
        setError(result.error);
        return;
      }
      showToast({ title: "Success", message: "Signed in successfully", type: "success" });
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8 bg-neutral-100">
      <div className="fixed inset-0  scale-110 blur-xs ">
        <RigLines bg="#e0e0e0" maxSize={180} count={10} />
      </div>

      <Card className="relative z-10 w-full max-w-3xl shadow-2xl overflow-hidden">
        <CardContent className="p-0 flex min-h-120">

          <div className="flex-1 flex flex-col p-8 md:p-10 overflow-y-auto">
            <div className="flex items-center gap-2 mb-8">
              <img
                src="/icms-logo.jpg"
                alt="Logo"
                className="h-12 w-12 object-cover rounded-lg"
                loading="lazy"
              />
              <span className="font-medium md:text-2xl text-secondary">
                Cooperative
              </span>
            </div>

            <h2 className="text-xl font-semibold">{STEPS[currentStep].title}</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              {STEPS[currentStep].description}
            </p>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Sign in failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col flex-1 gap-6"
              >
                <div className="flex-1">
                  {currentStep === 0 && (
                    <div className="flex flex-col gap-4">
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
                                href="/auth/forgot-password"
                                className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4"
                              >
                                Forgot password?
                              </Link>
                            </div>
                            <FormControl>
                              <Input type="password" placeholder="Your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="flex flex-col gap-4">
                      <FormField
                        control={form.control}
                        name="organization_id"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>
                              Organization{" "}
                              <span className="text-muted-foreground text-xs font-normal">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                name={field.name}
                                value={field.value ?? ""}
                                onValueChange={field.onChange}
                                aria-invalid={fieldState.invalid}
                                className="flex flex-col gap-2 mt-1"
                              >
                                {organizations.map((org) => (
                                  <FieldLabel
                                    key={org.id}
                                    htmlFor={`login-org-${org.id}`}
                                  >
                                    <Field
                                      orientation="horizontal"
                                      data-invalid={fieldState.invalid}
                                    >
                                      <FieldContent>
                                        <FieldTitle>{org.organization_name}</FieldTitle>
                                        <FieldDescription>
                                          {[org.short_name, org.country]
                                            .filter(Boolean)
                                            .join(" · ")}
                                        </FieldDescription>
                                      </FieldContent>
                                      <RadioGroupItem
                                        value={org.id}
                                        id={`login-org-${org.id}`}
                                        aria-invalid={fieldState.invalid}
                                      />
                                    </Field>
                                  </FieldLabel>
                                ))}
                                {organizations.length === 0 && (
                                  <p className="text-sm text-muted-foreground py-2">
                                    No organizations available.
                                  </p>
                                )}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0 || isSubmitting}
                    className="min-w-24"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant={"secondary"}
                    disabled={isSubmitting}
                    className="min-w-36"
                    onClick={
                      currentStep < STEPS.length - 1
                        ? handleNext
                        : () => form.handleSubmit(onSubmit)()
                    }
                  >
                    {currentStep < STEPS.length - 1
                      ? "Continue"
                      : isSubmitting
                      ? <Spinner />
                      : "Sign in"}
                  </Button>
                </div>
              </form>
            </Form>

            <p className=" text-center text-muted-foreground mt-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-primary hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="hidden md:flex flex-col w-64 bg-muted/40 border-l p-8 shrink-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              Sign In Steps
            </p>
            <div className="flex flex-col gap-0">
              {STEPS.map((step, i) => {
                const isCompleted = i < currentStep;
                const isCurrent = i === currentStep;
                const isLast = i === STEPS.length - 1;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full border-2 shrink-0 transition-all duration-200",
                          isCompleted
                            ? "bg-primary border-primary text-primary-foreground"
                            : isCurrent
                            ? "border-primary bg-background"
                            : "border-border bg-background"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="size-3.5 stroke-[2.5]" />
                        ) : isCurrent ? (
                          <div className="size-2 rounded-full bg-primary" />
                        ) : (
                          <div className="size-2 rounded-full bg-muted-foreground/30" />
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={cn(
                            "w-px flex-1 my-1 transition-all duration-300",
                            isCompleted ? "bg-primary" : "bg-border"
                          )}
                          style={{ minHeight: "3rem" }}
                        />
                      )}
                    </div>
                    <div className={cn("pb-10", isLast && "pb-0")}>
                      <p
                        className={cn(
                          "text-sm font-medium leading-tight",
                          isCurrent || isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};
