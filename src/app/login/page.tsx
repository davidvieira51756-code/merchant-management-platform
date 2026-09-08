"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createClient } from "@/lib/supabase/client";
import {
  authSchema,
  AuthFormValues,
} from "@/lib/validations/auth";

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
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold">
          {isSignUp ? "Create account" : "Login"}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <input
            type="hidden"
            {...register("mode")}
          />

          {isSignUp && (
            <div>
              <label
                htmlFor="fullName"
                className="mb-1 block text-sm font-medium"
              >
                Full name
              </label>

              <input
                id="fullName"
                type="text"
                {...register("fullName")}
                className="w-full rounded-md border px-3 py-2"
              />

              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full rounded-md border px-3 py-2"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full rounded-md border px-3 py-2"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {isSubmitting
              ? "Loading..."
              : isSignUp
                ? "Create account"
                : "Login"}
          </button>
        </form>

        <button
          type="button"
          onClick={toggleMode}
          className="mt-4 w-full text-sm underline"
        >
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </main>
  );
}