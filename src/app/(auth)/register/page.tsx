"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
  GraduationCap,
  BookOpen,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { registerSchema, type RegisterFormData } from "@/lib/validations";

const departments = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Business Administration",
  "Mathematics",
  "Physics",
  "Chemistry",
];

const steps = [
  { id: 1, label: "Account", icon: User },
  { id: 2, label: "Role", icon: GraduationCap },
  { id: 3, label: "Details", icon: BookOpen },
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "STUDENT" },
  });

  const selectedRole = watch("role");

  const nextStep = async () => {
    let valid = false;
    if (currentStep === 1) {
      valid = await trigger(["name", "email", "password", "confirmPassword"]);
    } else if (currentStep === 2) {
      valid = await trigger(["role"]);
    }
    if (valid) setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || "Registration failed.");
        return;
      }
      router.push("/login?registered=true");
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
          Create your account
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Join thousands of students and faculty on AttendAI Pro.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = currentStep === s.id;
          const isDone = currentStep > s.id;
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "gradient-brand text-white shadow-md shadow-blue-500/30"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 rounded ${
                    isDone
                      ? "bg-green-400"
                      : "bg-slate-200 dark:bg-slate-800"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Error */}
      {serverError && (
        <div className="flex items-center gap-3 p-4 mb-5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm animate-scale-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ── Step 1: Account Details ───────────────────────────── */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-slide-up">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                id="register-name"
                type="text"
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${errors.name ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
                {...register("name")}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${errors.email ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
                {...register("email")}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className={`w-full px-4 py-3 pr-11 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${errors.password ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <input
                id="register-confirm-password"
                type="password"
                placeholder="Re-enter your password"
                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${errors.confirmPassword ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>
        )}

        {/* ── Step 2: Role Selection ────────────────────────────── */}
        {currentStep === 2 && (
          <div className="animate-slide-up">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Select your role in the institution:
            </p>
            <div className="grid grid-cols-2 gap-4">
              {(["STUDENT", "FACULTY"] as const).map((role) => (
                <label
                  key={role}
                  htmlFor={`role-${role}`}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedRole === role
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                      : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                  }`}
                >
                  <input
                    id={`role-${role}`}
                    type="radio"
                    value={role}
                    className="sr-only"
                    {...register("role")}
                  />
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      selectedRole === role
                        ? "gradient-brand"
                        : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    {role === "STUDENT" ? "🎓" : "👨‍🏫"}
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-sm font-semibold ${
                        selectedRole === role
                          ? "text-blue-700 dark:text-blue-400"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {role === "STUDENT" ? "Student" : "Faculty"}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {role === "STUDENT" ? "Mark attendance & view records" : "Manage classes & generate QR"}
                    </div>
                  </div>
                  {selectedRole === role && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  )}
                </label>
              ))}
            </div>
            {errors.role && <p className="mt-2 text-xs text-red-500">{errors.role.message}</p>}
          </div>
        )}

        {/* ── Step 3: Details ───────────────────────────────────── */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-slide-up">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Department
              </label>
              <select
                id="register-department"
                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${errors.department ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
                {...register("department")}
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {selectedRole === "STUDENT" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Semester
                </label>
                <select
                  id="register-semester"
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors border-slate-300 dark:border-slate-700`}
                  {...register("semester", { valueAsNumber: true })}
                >
                  <option value="">Select semester</option>
                  {Array.from({ length: 8 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 text-sm text-green-700 dark:text-green-400">
              <CheckCircle2 className="inline w-4 h-4 mr-1.5" />
              You&apos;re almost done! Click <strong>Create Account</strong> to complete your registration.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-2">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-6 rounded-xl gradient-brand text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl gradient-brand text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          )}
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
