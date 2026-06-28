"use client";

import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import Navbar from "../common/OuterNavbar ";
import Footer from "../common/OuterFooter";
import Link from "next/link";
import { AlertCircleIcon, MailIcon } from "lucide-react";
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
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldTitle,
  FieldDescription,
} from "../ui/field";
import { showToast } from "../common/ShowToast";
import { loginUser, verifyLoginOtp } from "@/actions/auth";
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
    description: "Enter your credentials and select your organization",
    fields: ["email", "password"] as (keyof FormFields)[],
  },
  {
    title: "Verify Identity",
    description: "Enter the 6-digit code sent to your email",
    fields: [] as (keyof FormFields)[],
  },
];

function OtpInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const slots = Array.from({ length: 6 }, (_, i) => value[i] ?? "");

  const update = (index: number, digit: string) => {
    const next = [...slots];
    next[index] = digit;
    onChange(next.join(""));
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleChange = (index: number, raw: string) => {
    update(index, raw.replace(/\D/g, "").slice(-1));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (slots[index]) {
        update(index, "");
      } else if (index > 0) {
        update(index - 1, "");
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, ""));
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {slots.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="size-12 text-center text-xl font-bold rounded-lg border border-input bg-background focus:border-2 focus:border-primary focus:outline-none transition-all"
        />
      ))}
    </div>
  );
}

const LoginForm = ({ organizations }: { organizations: Organization[] }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preAuthToken, setPreAuthToken] = useState<string | null>(null);
  const [otp, setOtp] = useState("");

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", organization_id: "" },
    mode: "onTouched",
  });

  // Step 1 → call /login, get pre_auth_token, advance to OTP step
  const handleSendOtp = async () => {
    const valid = await form.trigger(["email", "password"]);
    if (!valid) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const values = form.getValues();
      const result = await loginUser(
        values.email,
        values.password,
        values.organization_id || undefined,
      );
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setPreAuthToken(result.pre_auth_token);
      setCurrentStep(1);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setError(null);
    setOtp("");
    setCurrentStep(0);
  };

  const handleVerifyOtp = async () => {
    const cleanOtp = otp.replace(/\D/g, "");
    if (cleanOtp.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    if (!preAuthToken) {
      setError("Session expired. Please go back and try again.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await verifyLoginOtp(preAuthToken, cleanOtp);
      if ("error" in result) {
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
    <div className="rounded-2xl md:w-112.5 w-full flex flex-col md:items-start items-center justify-center md:px-0 md:mx-0 px-8 py-10">
      <div className="mb-6 w-full">
        <h1 className="font-bold text-3xl text-primary">
          {currentStep === 0 ? (
            <>
              Welcome <span className="text-secondary">Back</span>
            </>
          ) : (
            STEPS[currentStep].title
          )}
        </h1>
        <p className="font-semibold text-sm text-muted-foreground mt-1">
          {STEPS[currentStep].description}
        </p>
        {currentStep === 1 && (
          <p className="text-sm text-primary mt-1 font-medium">
            {form.getValues("email")}
          </p>
        )}
        <div className="flex gap-1.5 mt-3">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i <= currentStep ? "bg-primary w-6" : "bg-muted w-3"
              }`}
            />
          ))}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4 w-full">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Sign in failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="w-full flex flex-col gap-4">
        {currentStep === 0 && (
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="rounded-lg py-3"
                        placeholder="e.g james@example.com"
                        {...field}
                      />
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
                      <Input
                        type="password"
                        className="rounded-lg py-3"
                        placeholder="Your Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {organizations.length > 0 && (
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
                            <FieldLabel key={org.id} htmlFor={`login-org-${org.id}`}>
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
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        )}

        {currentStep === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                <MailIcon className="size-7 text-primary" />
              </div>
              <p className="text-sm text-center text-muted-foreground max-w-xs">
                We sent a 6-digit verification code to your email. It expires in 10 minutes.
              </p>
            </div>
            <OtpInput value={otp} onChange={setOtp} />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
            className="min-w-24 rounded-lg"
          >
            Back
          </Button>
          <Button
            type="button"
            className="min-w-36  rounded-lg"
            disabled={isSubmitting}
            onClick={currentStep === 0 ? handleSendOtp : handleVerifyOtp}
          >
            {isSubmitting ? (
              <Spinner />
            ) : currentStep === 0 ? (
              "Send OTP"
            ) : (
              "Verify & Sign In"
            )}
          </Button>
        </div>
      </div>

      <div className="mt-6 text-center w-full">
        <Link href="/auth/signup" className="text-secondary hover:underline text-sm">
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </div>
  );
};

export const LoginFormContainer = ({
  organizations = [],
}: {
  organizations: Organization[];
}) => {
  return (
    <div className="relative min-h-screen bg-card overflow-x-hidden">
      <div className="md:absolute top-8 inset-0 md:w-247 w-full m-auto">
        <div>
          <Navbar
            buttonBackgroundColor="#49A743"
            logo={"/milk-cooperation.jpg"}
            btnTextColor="#fff"
            navbarStyle="shadow-lg rounded-lg bg-white"
            iconColor=""
          />
        </div>
        <div className="md:block flex items-center justify-center">
          <LoginForm organizations={organizations} />
        </div>
      </div>

      <div className="md:flex h-full hidden">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-8" />
        <div className="hidden md:block w-1/2 h-screen rounded-lg">
          <img
            src="/cooperative-bg2.jpg"
            alt="Background"
            className="h-full w-full object-cover rounded-bl-2xl"
            loading="lazy"
            width={500}
            height={500}
          />
        </div>
      </div>

      <div className="fixed bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
};
