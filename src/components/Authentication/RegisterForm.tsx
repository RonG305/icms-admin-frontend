"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import Link from "next/link";
import { AlertCircleIcon, Check } from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Field, FieldLabel, FieldContent, FieldTitle, FieldDescription } from "../ui/field";
import { showToast } from "../common/ShowToast";
import RigLines from "../common/svg/RigLines";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { registerUser } from "@/actions/auth";
import { Organization } from "@/types/organization";

const schema = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
    account_type: z.enum(["individual", "origanization"]).catch("individual"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    middle_name: z.string().optional(),
    phone_number: z.string().min(1, "Phone number is required"),
    alternative_phone: z.string().optional(),
    gender: z.enum(["male", "female"], "Select gender"),
    date_of_birth: z.string().min(1, "Date of birth is required"),
    bio: z.string().optional(),
    national_id_type: z.enum(
      ["National ID", "Passport", "Driving License"],
      "Select ID type",
    ),
    national_id: z.string().min(1, "ID number is required"),
    avatar_url: z.url("Must be a valid URL").optional().or(z.literal("")),
    organization_id: z.string().optional(),
    street_address: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    region: z.string().min(1, "Region is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    address_type: z.enum(["Residence", "Work", "Other"], "Select address type"),
    accept_terms_conditions: z
      .boolean()
      .refine((v) => v === true, "You must accept the terms and conditions"),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type FormFields = z.infer<typeof schema>;

const STEPS = [
  {
    title: "Account Setup",
    description: "Login credentials & account type",
    fields: [
      "email",
      "password",
      "confirm_password",
      "account_type",
    ] as (keyof FormFields)[],
  },
  {
    title: "Personal Information",
    description: "Your name, contact & bio",
    fields: [
      "first_name",
      "last_name",
      "phone_number",
      "gender",
      "date_of_birth",
    ] as (keyof FormFields)[],
  },
  {
    title: "Identity Verification",
    description: "Official ID & profile details",
    fields: ["national_id_type", "national_id"] as (keyof FormFields)[],
  },
  {
    title: "Address & Terms",
    description: "Location details & agreement",
    fields: [
      "street_address",
      "city",
      "region",
      "postal_code",
      "country",
      "address_type",
      "accept_terms_conditions",
    ] as (keyof FormFields)[],
  },
];

export const RegisterFormContainer = ({ organizations = [] }: { organizations: Organization[] }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      accept_terms_conditions: false,
      account_type: undefined,
      gender: undefined,
      national_id_type: undefined,
      address_type: undefined,
      email: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      phone_number: "",
      alternative_phone: "",
      date_of_birth: "",
      bio: "",
      national_id: "",
      avatar_url: "",
      organization_id: "",
      street_address: "",
      city: "",
      region: "",
      postal_code: "",
      country: "",
    },
    mode: "onTouched",
  });

  const handleNext = async () => {
    const valid = await form.trigger(STEPS[currentStep].fields as any);
    console.log("Checking input validity: ", valid)
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
      const result = await registerUser(values);
      console.log("User creation results: ", result);
      if (result?.error) {
        setError(result.error);
        return;
      } else {
        setSuccess("Account has beeen created succesifully");
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
      showToast({
        title: "Success",
        message: "Account created successfully",
        type: "success",
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8 bg-neutral-100">
      <div className="fixed inset-0 scale-110 blur-xs">
        <RigLines bg="#e0e0e0" maxSize={180} count={10} />
      </div>

      <Card className="relative z-10 w-full max-w-5xl shadow-2xl overflow-hidden">
        <CardContent className="p-0 flex min-h-160">
          <div className="flex-1 flex flex-col p-8 md:p-10 overflow-y-auto">
            <div className="flex items-center gap-2 mb-8">
              <img
                src="/icms-logo.jpg"
                alt="Background"
                className="h-20 w-20 object-cover rounded-bl-2xl  "
                loading="lazy"
                width={100}
                height={100}
              />
              <span className=" font-medium  md:text-3xl text-secondary">
                Cooperative
              </span>
            </div>

            <h2 className="text-xl font-semibold">
              {STEPS[currentStep].title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              {STEPS[currentStep].description}
            </p>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Registration failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="mb-4">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Registration Successifull</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
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
                        name="account_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select account type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="individual">
                                  Individual
                                </SelectItem>
                                <SelectItem value="origanization">
                                  Origanization
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="m@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Min. 8 characters"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="confirm_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Repeat password"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="middle_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Middle Name{" "}
                                <span className="text-muted-foreground text-xs font-normal">
                                  (optional)
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="A." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="date_of_birth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+254722334455" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="alternative_phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Alt. Phone{" "}
                                <span className="text-muted-foreground text-xs font-normal">
                                  (optional)
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="+254711000000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Bio{" "}
                              <span className="text-muted-foreground text-xs font-normal">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Short bio about yourself"
                                className="resize-none"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="flex flex-col gap-4">
                      <FormField
                        control={form.control}
                        name="national_id_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select ID type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="National ID">
                                  National ID
                                </SelectItem>
                                <SelectItem value="Passport">
                                  Passport
                                </SelectItem>
                                <SelectItem value="Driving License">
                                  Driving License
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="national_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Number</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g 12345678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="avatar_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Profile Photo URL{" "}
                              <span className="text-muted-foreground text-xs font-normal">
                                (optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/avatar.jpg"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="organization_id"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>
                              Organization{" "}
                              <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                name={field.name}
                                value={field.value ?? ""}
                                onValueChange={field.onChange}
                                aria-invalid={fieldState.invalid}
                                className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1"
                              >
                                {organizations.map((org) => (
                                  <FieldLabel
                                    key={org.id}
                                    htmlFor={`register-org-${org.id}`}
                                  >
                                    <Field
                                      orientation="horizontal"
                                      data-invalid={fieldState.invalid}
                                    >
                                      <FieldContent>
                                        <FieldTitle>{org.organization_name}</FieldTitle>
                                        <FieldDescription>
                                          {[org.short_name, org.country].filter(Boolean).join(" · ")}
                                        </FieldDescription>
                                      </FieldContent>
                                      <RadioGroupItem
                                        value={org.id}
                                        id={`register-org-${org.id}`}
                                        aria-invalid={fieldState.invalid}
                                      />
                                    </Field>
                                  </FieldLabel>
                                ))}
                                {organizations.length === 0 && (
                                  <p className="text-sm text-muted-foreground col-span-2 py-2">No organizations available.</p>
                                )}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="address_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Residence">
                                    Residence
                                  </SelectItem>
                                  <SelectItem value="Work">Work</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="Kenya" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="street_address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Nairobi" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="region"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Region</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nairobi County"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="postal_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="00100" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="accept_terms_conditions"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-start gap-3 pt-1">
                              <FormControl>
                                <Checkbox
                                  id="terms"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="mt-0.5"
                                />
                              </FormControl>
                              <label
                                htmlFor="terms"
                                className="text-sm text-muted-foreground leading-snug cursor-pointer"
                              >
                                I agree to the{" "}
                                <Link
                                  href="#"
                                  className="text-primary underline underline-offset-4"
                                >
                                  Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                  href="#"
                                  className="text-primary underline underline-offset-4"
                                >
                                  Privacy Policy
                                </Link>
                              </label>
                            </div>
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
                    disabled={isSubmitting}
                    className="min-w-36"
                    variant={"secondary"}
                    onClick={
                      currentStep < STEPS.length - 1
                        ? handleNext
                        : () => form.handleSubmit(onSubmit)()
                    }
                  >
                    {currentStep < STEPS.length - 1 ? (
                      "Save & Continue"
                    ) : isSubmitting ? (
                      <Spinner />
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            <p className=" text-center text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="hidden md:flex flex-col w-72 bg-muted/40 border-l p-8 shrink-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              Registration Steps
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
                              : "border-border bg-background",
                        )}
                      >
                        {isCompleted ? (
                          <Check className="size-3.5 stroke-[4]" />
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
                            isCompleted ? "bg-primary" : "bg-border",
                          )}
                          style={{ minHeight: "2.5rem" }}
                        />
                      )}
                    </div>

                    <div className={cn("pb-8", isLast && "pb-0")}>
                      <p
                        className={cn(
                          "text-sm font-medium leading-tight",
                          isCurrent
                            ? "text-foreground"
                            : isCompleted
                              ? "text-foreground"
                              : "text-muted-foreground",
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
