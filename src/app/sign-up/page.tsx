"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  getSafeRedirectUrl,
  getFinalRedirectUrl,
} from "@/lib/auth-redirect";
import { toast } from "sonner";
import {
  Check,
  X,
  User,
  Wrench,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"customer" | "technician">("customer");

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const redirectParam =
    searchParams.get("redirect") ||
    searchParams.get("callbackUrl") ||
    searchParams.get("returnUrl");
  const safeRedirect = getSafeRedirectUrl(redirectParam);

  // Redirect authenticated users away from sign-up
  useEffect(() => {
    if (sessionLoading) return;

    if (session?.user) {
      const userRole = session.user.role;
      const destination = getFinalRedirectUrl(safeRedirect, userRole);
      router.replace(destination);
    }
  }, [session, sessionLoading, safeRedirect, router]);

  // Password validation rules per Assignment 9 PDF
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const validateForm = () => {
    const errors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim()) {
      errors.name = "Full name is required.";
    }

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (!hasMinLength) {
      errors.password = "Password must be at least 6 characters long.";
    } else if (!hasUppercase) {
      errors.password = "Password must contain at least one uppercase letter.";
    } else if (!hasLowercase) {
      errors.password = "Password must contain at least one lowercase letter.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      if (!isPasswordValid) {
        toast.error(
          !hasMinLength
            ? "Password must be at least 6 characters long."
            : !hasUppercase
            ? "Password must contain at least one uppercase letter."
            : "Password must contain at least one lowercase letter."
        );
      } else {
        toast.error("Please fill in all required fields correctly.");
      }
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      if (error) {
        const errorMsg = error.message || "Registration failed!";
        toast.error(errorMsg);
        setFieldErrors((prev) => ({ ...prev, email: errorMsg }));
        return;
      }

      toast.success("Account created successfully!");

      // Verify if Better Auth created an immediate session
      const sessionRes = await authClient.getSession();
      const user =
        sessionRes.data?.user ||
        (data as { user?: { role?: string } })?.user;

      if (user) {
        const userRole = user.role || role;
        const destination = getFinalRedirectUrl(safeRedirect, userRole);
        router.push(destination);
      } else {
        toast.info("Please sign in with your new account credentials.");
        router.push(
          safeRedirect
            ? `/sign-in?redirect=${encodeURIComponent(safeRedirect)}`
            : "/sign-in"
        );
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading || session?.user) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 transition-colors duration-200 dark:bg-slate-950">
        <div className="pointer-events-none absolute top-1/4 left-1/3 h-80 w-80 rounded-full bg-blue-600/20 blur-[110px]" />
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-slate-900/80 backdrop-blur-xl">
          <Loader2 className="mx-auto animate-spin text-blue-600 dark:text-blue-400" size={34} />
          <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            Redirecting...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-16 transition-colors duration-200 dark:bg-slate-950 sm:px-6">
      {/* Ambient Background Glows & Subtle Grid */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 -bottom-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]" />

      {/* Sign Up Card */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 shadow-2xl shadow-slate-950/5 transition-all dark:border-white/10 dark:bg-slate-900/95 dark:shadow-slate-950/50 sm:p-10">
        {/* Top Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="group inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 transition-transform duration-300 hover:scale-105"
          >
            <Wrench size={22} />
          </Link>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-600/15 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-500/20">
            <Sparkles size={13} />
            <span>Join FixMate Ecosystem</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Get started as a homeowner or certified repair technician
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="mt-8 space-y-5" noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User size={17} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) {
                    setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                required
                className={`w-full rounded-xl border bg-slate-50/70 py-3 pr-4 pl-10 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 dark:border-slate-800 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950 dark:focus:border-blue-500 ${
                  fieldErrors.name
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/15"
                    : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/15"
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
                <AlertCircle size={13} />
                <span>{fieldErrors.name}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail size={17} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                required
                className={`w-full rounded-xl border bg-slate-50/70 py-3 pr-4 pl-10 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 dark:border-slate-800 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950 dark:focus:border-blue-500 ${
                  fieldErrors.email
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/15"
                    : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/15"
                }`}
                placeholder="you@example.com"
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
                <AlertCircle size={13} />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          {/* Password with real-time requirement indicator */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock size={17} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  }
                }}
                required
                className={`w-full rounded-xl border bg-slate-50/70 py-3 pr-11 pl-10 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 dark:border-slate-800 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950 dark:focus:border-blue-500 ${
                  fieldErrors.password
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/15"
                    : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/15"
                }`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
                <AlertCircle size={13} />
                <span>{fieldErrors.password}</span>
              </p>
            )}

            {/* Password Validation Checklist */}
            {password.length > 0 && (
              <div className="mt-3 space-y-1.5 rounded-2xl border border-slate-100 bg-slate-50/90 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-950/60">
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  Password Requirements:
                </p>
                <div className="flex items-center gap-2">
                  {hasMinLength ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                      <X size={11} strokeWidth={3} />
                    </span>
                  )}
                  <span
                    className={
                      hasMinLength
                        ? "font-semibold text-emerald-700 dark:text-emerald-400"
                        : "text-slate-500 dark:text-slate-400"
                    }
                  >
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasUppercase ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                      <X size={11} strokeWidth={3} />
                    </span>
                  )}
                  <span
                    className={
                      hasUppercase
                        ? "font-semibold text-emerald-700 dark:text-emerald-400"
                        : "text-slate-500 dark:text-slate-400"
                    }
                  >
                    At least one uppercase letter (A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasLowercase ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                      <X size={11} strokeWidth={3} />
                    </span>
                  )}
                  <span
                    className={
                      hasLowercase
                        ? "font-semibold text-emerald-700 dark:text-emerald-400"
                        : "text-slate-500 dark:text-slate-400"
                    }
                  >
                    At least one lowercase letter (a-z)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Role Selection: Selectable Cards / Radio Buttons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Register As
            </label>
            <div
              className="mt-2 grid grid-cols-2 gap-3.5"
              role="radiogroup"
              aria-label="Register As"
            >
              {/* Customer */}
              <label
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all duration-200 ${
                  role === "customer"
                    ? "border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-600/20 dark:border-blue-500 dark:bg-blue-950/40"
                    : "border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === "customer"}
                  onChange={() => setRole("customer")}
                  className="sr-only"
                />
                {role === "customer" && (
                  <CheckCircle2
                    size={16}
                    className="absolute top-3 right-3 text-blue-600 dark:text-blue-400"
                  />
                )}
                <div
                  className={`mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                    role === "customer"
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                      : "bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <User size={20} />
                </div>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Customer
                </span>
                <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Book repair services
                </span>
              </label>

              {/* Technician */}
              <label
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all duration-200 ${
                  role === "technician"
                    ? "border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-600/20 dark:border-blue-500 dark:bg-blue-950/40"
                    : "border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="technician"
                  checked={role === "technician"}
                  onChange={() => setRole("technician")}
                  className="sr-only"
                />
                {role === "technician" && (
                  <CheckCircle2
                    size={16}
                    className="absolute top-3 right-3 text-blue-600 dark:text-blue-400"
                  />
                )}
                <div
                  className={`mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                    role === "technician"
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                      : "bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <Wrench size={20} />
                </div>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Technician
                </span>
                <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Provide repair services
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>

        {/* Link to Sign In */}
        <div className="mt-7 border-t border-slate-100 pt-6 text-center dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href={
                safeRedirect
                  ? `/sign-in?redirect=${encodeURIComponent(safeRedirect)}`
                  : "/sign-in"
              }
              className="font-bold text-blue-600 transition hover:text-indigo-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 transition-colors duration-200 dark:bg-slate-950">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-slate-900/80 backdrop-blur-xl">
            <Loader2 className="mx-auto animate-spin text-blue-600 dark:text-blue-400" size={34} />
          </div>
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}