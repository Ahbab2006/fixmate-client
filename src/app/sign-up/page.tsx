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
  ShieldCheck,
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

  // Password validation rules
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
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-xl">
          <Loader2 className="mx-auto animate-spin text-blue-600 dark:text-blue-400" size={34} />
          <p className="mt-3 text-xs font-mono text-slate-600 dark:text-slate-400">
            Redirecting...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900 lg:grid lg:grid-cols-12">
        {/* Left Editorial Brand Showcase Panel (visible on lg+) */}
        <div className="relative hidden lg:col-span-5 lg:flex lg:flex-col lg:justify-between bg-slate-900 p-10 text-white overflow-hidden">
          {/* Subtle Ambient Glows & Grid */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-600/25 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/25 blur-[100px]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-white/20">
                <Wrench size={20} />
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Fix<span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">Mate</span>
              </span>
            </Link>
          </div>

          <div className="relative z-10 my-auto py-10">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md">
              <Sparkles size={13} className="text-blue-400" />
              <span>Join the FixMate Ecosystem</span>
            </div>

            <h2 className="mt-5 text-2xl font-extrabold leading-snug tracking-tight text-white xl:text-3xl">
              Empowering homeowners and{" "}
              <span className="font-editorial italic font-normal text-blue-400">
                skilled specialists
              </span>
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Create your account in seconds to schedule verified repairs or expand your independent technician business.
            </p>

            <div className="mt-8 space-y-3.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <CheckCircle2 size={13} />
                </div>
                <span>For Customers: Transparent upfront rates & zero deposits</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <CheckCircle2 size={13} />
                </div>
                <span>For Technicians: Instant repair leads & fair payouts</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <CheckCircle2 size={13} />
                </div>
                <span>Secure account management & real-time notifications</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-6">
            <p className="text-xs text-slate-400 font-mono">
              © 2026 FixMate Inc. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-7 xl:p-12">
          {/* Mobile Header Brand (hidden on lg) */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30">
                <Wrench size={18} />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Fix<span className="text-blue-600 dark:text-blue-400">Mate</span>
              </span>
            </Link>

            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              <ShieldCheck size={12} />
              <span>Verified</span>
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Create Your{" "}
              <span className="font-editorial italic font-normal text-blue-600 dark:text-blue-400">
                Account
              </span>
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Select your account type and fill in your details to get started.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5" noValidate>
            {/* Role Selection: Selectable Cards */}
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Select Your Role
              </label>
              <div
                className="mt-2 grid grid-cols-2 gap-3"
                role="radiogroup"
                aria-label="Register As"
              >
                {/* Customer */}
                <label
                  className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition-all duration-200 ${
                    role === "customer"
                      ? "border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-600/20 dark:border-blue-500 dark:bg-blue-950/40"
                      : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700 dark:hover:bg-slate-900"
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
                      size={15}
                      className="absolute top-2.5 right-2.5 text-blue-600 dark:text-blue-400"
                    />
                  )}
                  <div
                    className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                      role === "customer"
                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs"
                        : "bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    <User size={18} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Customer
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Book repairs
                  </span>
                </label>

                {/* Technician */}
                <label
                  className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition-all duration-200 ${
                    role === "technician"
                      ? "border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-600/20 dark:border-blue-500 dark:bg-blue-950/40"
                      : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700 dark:hover:bg-slate-900"
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
                      size={15}
                      className="absolute top-2.5 right-2.5 text-blue-600 dark:text-blue-400"
                    />
                  )}
                  <div
                    className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                      role === "technician"
                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs"
                        : "bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    <Wrench size={18} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Technician
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Provide services
                  </span>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={name}
                  disabled={loading}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) {
                      setFieldErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  required
                  placeholder="Enter your full name"
                  className={`w-full min-h-[44px] rounded-xl border bg-slate-50/70 py-2.5 pr-4 pl-10 text-xs sm:text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950 dark:focus:border-blue-500 ${
                    fieldErrors.name
                      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/15"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/15"
                  }`}
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
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  disabled={loading}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  required
                  placeholder="name@example.com"
                  className={`w-full min-h-[44px] rounded-xl border bg-slate-50/70 py-2.5 pr-4 pl-10 text-xs sm:text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950 dark:focus:border-blue-500 ${
                    fieldErrors.email
                      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/15"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/15"
                  }`}
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
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={loading}
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
                  placeholder="Create a strong password"
                  className={`w-full min-h-[44px] rounded-xl border bg-slate-50/70 py-2.5 pr-11 pl-10 text-xs sm:text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950 dark:focus:border-blue-500 ${
                    fieldErrors.password
                      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/15"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/15"
                  }`}
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
                  <AlertCircle size={13} />
                  <span>{fieldErrors.password}</span>
                </p>
              )}

              {/* Password Requirements Checklist */}
              {password.length > 0 && (
                <div className="mt-2.5 space-y-1 rounded-2xl border border-slate-100 bg-slate-50/90 p-3 text-xs dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                    Password Requirements:
                  </p>
                  <div className="flex items-center gap-2">
                    {hasMinLength ? (
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                        <X size={10} strokeWidth={3} />
                      </span>
                    )}
                    <span
                      className={
                        hasMinLength
                          ? "font-medium text-emerald-700 dark:text-emerald-400 text-[11px]"
                          : "text-slate-500 dark:text-slate-400 text-[11px]"
                      }
                    >
                      At least 6 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasUppercase ? (
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                        <X size={10} strokeWidth={3} />
                      </span>
                    )}
                    <span
                      className={
                        hasUppercase
                          ? "font-medium text-emerald-700 dark:text-emerald-400 text-[11px]"
                          : "text-slate-500 dark:text-slate-400 text-[11px]"
                      }
                    >
                      At least one uppercase letter (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasLowercase ? (
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                        <X size={10} strokeWidth={3} />
                      </span>
                    )}
                    <span
                      className={
                        hasLowercase
                          ? "font-medium text-emerald-700 dark:text-emerald-400 text-[11px]"
                          : "text-slate-500 dark:text-slate-400 text-[11px]"
                      }
                    >
                      At least one lowercase letter (a-z)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
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

          {/* Footer Navigation */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center dark:border-slate-800">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                href={
                  safeRedirect
                    ? `/sign-in?redirect=${encodeURIComponent(safeRedirect)}`
                    : "/sign-in"
                }
                className="font-bold text-blue-600 transition hover:text-indigo-600 hover:underline dark:text-blue-400"
              >
                Sign In
              </Link>
            </p>
          </div>
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
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900/80 backdrop-blur-xl">
            <Loader2 className="mx-auto animate-spin text-blue-600 dark:text-blue-400" size={34} />
          </div>
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
