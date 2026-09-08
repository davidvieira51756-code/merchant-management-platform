"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  authSchema,
  type AuthFormValues,
} from "@/lib/validations/auth";

const inputClassName =
  "h-11 w-full min-w-0 rounded-lg border border-input bg-card px-3 text-base text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/20 sm:text-sm";

const labelClassName = "mb-2 block text-sm font-medium";

const errorClassName = "mt-2 text-sm text-destructive";

export default function LoginPage() {
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      mode: "login",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: AuthFormValues) {
    setErrorMessage(null);

    if (data.mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }
    }

    router.push("/dashboard");
    router.refresh();
  }

  function toggleMode() {
    const nextIsSignUp = !isSignUp;

    setIsSignUp(nextIsSignUp);
    setErrorMessage(null);

    if (nextIsSignUp) {
      reset({
        mode: "signup",
        fullName: "",
        email: "",
        password: "",
      });
    } else {
      reset({
        mode: "login",
        email: "",
        password: "",
      });
    }

    setValue("mode", nextIsSignUp ? "signup" : "login");
  }

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 py-10 sm:px-6">
      <div className="my-auto w-full max-w-sm self-center py-6">
        <div className="mb-10 flex items-center justify-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-5"
            >
              <path d="M3 10 5 3h14l2 7" />
              <path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
              <path d="M5 13v8h14v-8" />
              <path d="M9 21v-6h6v6" />
            </svg>
          </span>

          <span className="text-sm font-semibold tracking-tight">
            Merchant Platform
          </span>
        </div>

        <header className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            {isSignUp ? "Create account" : "Welcome back"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {isSignUp
              ? "Create an account to manage your stores and products."
              : "Log in to manage your stores and products."}
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-busy={isSubmitting}
          className="mt-8 space-y-5"
        >
          <input type="hidden" {...register("mode")} />

          {isSignUp && (
            <div>
              <label htmlFor="fullName" className={labelClassName}>
                Full name
              </label>

              <input
                id="fullName"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                {...register("fullName")}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={
                  errors.fullName ? "fullName-error" : undefined
                }
                className={inputClassName}
              />

              {errors.fullName && (
                <p id="fullName-error" className={errorClassName}>
                  {errors.fullName.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className={labelClassName}>
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="you@example.com"
              {...register("email")}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "email-error" : undefined
              }
              className={inputClassName}
            />

            {errors.email && (
              <p id="email-error" className={errorClassName}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className={labelClassName}>
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete={
                isSignUp ? "new-password" : "current-password"
              }
              {...register("password")}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              className={inputClassName}
            />

            {errors.password && (
              <p id="password-error" className={errorClassName}>
                {errors.password.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full"
          >
            {isSubmitting
              ? isSignUp
                ? "Creating account..."
                : "Logging in..."
              : isSignUp
                ? "Create account"
                : "Log in"}
          </Button>
        </form>

        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isSignUp
              ? "Already have an account?"
              : "Don't have an account?"}
          </p>

          <Button
            type="button"
            variant="link"
            onClick={toggleMode}
            className="mt-1 h-10 px-3"
          >
            {isSignUp ? "Log in" : "Create an account"}
          </Button>
        </div>
      </div>
    </main>
  );
}