"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, LogIn } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError("");
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError("Invalid email or password. Please try again.");
      } else {
        // Let middleware redirect to the right dashboard
        router.refresh();
        if (callbackUrl) {
          router.push(callbackUrl);
        } else {
          router.push("/student");
        }
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sign in to your AttendAI Pro account to continue.
        </p>
      </div>

      {/* Error Banner */}
      {serverError && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm animate-scale-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {serverError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${
              errors.email
                ? "border-red-400 dark:border-red-600"
                : "border-slate-300 dark:border-slate-700"
            }`}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <Link
              href="#"
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`w-full px-4 py-3 pr-11 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${
                errors.password
                  ? "border-red-400 dark:border-red-600"
                  : "border-slate-300 dark:border-slate-700"
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl gradient-brand text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Demo Accounts */}
      <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">
          🎓 Demo Accounts
        </p>
        <div className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
          <div>Admin: admin@attendai.pro / Admin@1234</div>
          <div>Faculty: faculty@attendai.pro / Faculty@1234</div>
          <div>Student: student@attendai.pro / Student@1234</div>
        </div>
      </div>

      {/* Register Link */}
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Create one free
        </Link>
      </p>
    </div>
  );
}
