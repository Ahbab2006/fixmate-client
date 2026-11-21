"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import {
  Wrench,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import {
  getSafeRedirectUrl,
  getFinalRedirectUrl,
} from "@/lib/auth-redirect";

export { getSafeRedirectUrl } from "@/lib/auth-redirect";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const redirectParam =
    searchParams.get("redirect") ||
    searchParams.get("callbackUrl") ||
    searchParams.get("returnUrl");
  const safeRedirect = getSafeRedirectUrl(redirectParam);

  // If user is already authenticated, redirect to intended target or role dashboard
  useEffect(() => {
    if (sessionLoading) return;

    if (session?.user) {
      const role = session.user.role;
      const destination = getFinalRedirectUrl(safeRedirect, role);
      router.replace(destination);
    }
  }, [session, sessionLoading, safeRedirect, router]);

  const validate = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        const errorMsg =
          error.message || "Invalid email or password. Please try again.";
        toast.error(errorMsg);
        setFieldErrors((prev) => ({ ...prev, password: errorMsg }));
        return;
      }

      toast.success("Welcome back! Signed in successfully.");

      // Fetch fresh session to verify the authenticated user's actual role
      const sessionRes = await authClient.getSession();
      const user =
        sessionRes.data?.user ||
        (data as { user?: { role?: string } })?.user;
      const role = user?.role;

      // Check for intended destination redirect and role authorization
      const destination = getFinalRedirectUrl(safeRedirect, role);
      router.push(destination);
    } catch {
      toast.error("Something went wrong during sign-in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      const callbackURL = safeRedirect || "/dashboard/customer";

      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });

      if (res?.error) {
        toast.error(
          res.error.message ||
            "Failed to initialize Google sign-in. Please try again."
        );
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Something went wrong during Google sign-in. Please try again.");
      setGoogleLoading(false);
    }
  };

  // Prevent flash of sign-in form for already-authenticated users
  if (sessionLoading || session?.user) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 transition-colors duration-200 dark:bg-slate-950">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-xl">
          <Loader2 className="mx-auto animate-spin text-blue-600 dark:text-blue-400" size={34} />
          <p className="mt-3 text-xs font-mono text-slate-600 dark:text-slate-400">
            Verifying session...
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
              <ShieldCheck size={13} className="text-blue-400" />
              <span>Verified Home Service Platform</span>
            </div>

            <h2 className="mt-5 text-2xl font-extrabold leading-snug tracking-tight text-white xl:text-3xl">
              Precision repairs delivered by{" "}
              <span className="font-editorial italic font-normal text-blue-400">
                certified specialists
              </span>
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Access your personalized dashboard to manage bookings, track repair milestones, and communicate with verified technicians.
            </p>

            <div className="mt-8 space-y-3.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <CheckCircle2 size={13} />
                </div>
                <span>100% Background-verified repair specialists</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <CheckCircle2 size={13} />
                </div>
                <span>Upfront, fixed pricing with no surprises</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <CheckCircle2 size={13} />
                </div>
                <span>Encrypted authentication & payment security</span>
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
              <span>Secure</span>
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Welcome{" "}
              <span className="font-editorial italic font-normal text-blue-600 dark:text-blue-400">
                Back
              </span>
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Sign in to your account to review bookings and schedule repairs.
            </p>
          </div>

          {/* Social Google Sign-In */}
          <div className="mt-6 sm:mt-8">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className="flex min-h-[44px] w-full items-center justify-center gap-3 rounded-xl border border-slate-200/90 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
            >
              {googleLoading ? (
                <>
                  <Loader2 size={17} className="animate-spin text-blue-600 dark:text-blue-400" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <FcGoogle size={18} />
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/80 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 font-semibold text-slate-400 dark:bg-slate-900 dark:text-slate-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5" noValidate>
            {/* Email Field */}
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
                  disabled={loading || googleLoading}
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

            {/* Password Field */}
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
                  disabled={loading || googleLoading}
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
                  placeholder="Enter your password"
                  className={`w-full min-h-[44px] rounded-xl border bg-slate-50/70 py-2.5 pr-11 pl-10 text-xs sm:text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950 dark:focus:border-blue-500 ${
                    fieldErrors.password
                      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/15"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/15"
                  }`}
                />
                <button
                  type="button"
                  disabled={loading || googleLoading}
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="group flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
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
              Don&apos;t have an account?{" "}
              <Link
                href={
                  safeRedirect
                    ? `/sign-up?redirect=${encodeURIComponent(safeRedirect)}`
                    : "/sign-up"
                }
                className="font-bold text-blue-600 transition hover:text-indigo-600 hover:underline dark:text-blue-400"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}
