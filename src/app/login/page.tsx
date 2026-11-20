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
} from "lucide-react";

function getSafeRedirectUrl(url: string | null): string | null {
  if (!url) return null;

  // Must be a relative path starting with a single '/'
  if (!url.startsWith("/")) return null;

  // Prevent protocol-relative URLs (e.g. '//evil.com')
  if (url.startsWith("//")) return null;

  // Prevent scheme or port tricks (e.g. 'javascript:', 'https:')
  if (url.includes(":")) return null;

  // Prevent redirect loops back to auth pages
  if (
    url.startsWith("/login") ||
    url.startsWith("/sign-in") ||
    url.startsWith("/sign-up")
  ) {
    return null;
  }

  return url;
}

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

  // If user is already authenticated, redirect to intended target or role dashboard
  useEffect(() => {
    if (sessionLoading) return;

    if (session?.user) {
      const role = session.user.role;
      const redirectParam =
        searchParams.get("redirect") ||
        searchParams.get("callbackUrl") ||
        searchParams.get("returnUrl");
      const safeRedirect = getSafeRedirectUrl(redirectParam);

      if (safeRedirect) {
        router.replace(safeRedirect);
      } else if (role === "admin") {
        router.replace("/dashboard/admin");
      } else if (role === "technician") {
        router.replace("/dashboard/technician");
      } else {
        router.replace("/dashboard/customer");
      }
    }
  }, [session, sessionLoading, searchParams, router]);

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

      // Check for intended destination redirect
      const redirectParam =
        searchParams.get("redirect") ||
        searchParams.get("callbackUrl") ||
        searchParams.get("returnUrl");
      const safeRedirect = getSafeRedirectUrl(redirectParam);

      if (safeRedirect) {
        router.push(safeRedirect);
      } else if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "technician") {
        router.push("/dashboard/technician");
      } else {
        router.push("/dashboard/customer");
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong during sign-in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      const redirectParam =
        searchParams.get("redirect") ||
        searchParams.get("callbackUrl") ||
        searchParams.get("returnUrl");
      const safeRedirect = getSafeRedirectUrl(redirectParam);
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
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
        <div className="pointer-events-none absolute top-1/4 left-1/3 h-80 w-80 rounded-full bg-blue-600/20 blur-[110px]" />
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center backdrop-blur-xl">
          <Loader2 className="mx-auto animate-spin text-blue-400" size={34} />
          <p className="mt-3 text-sm font-medium text-slate-300">
            Verifying session...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-16 sm:px-6">
      {/* Ambient Background Glows & Grid */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 -bottom-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]" />

      {/* Sign In Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white p-8 shadow-2xl shadow-blue-950/50 sm:p-10">
        {/* Top Brand Emblem */}
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="group inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 transition-transform duration-300 hover:scale-105"
          >
            <Wrench size={22} />
          </Link>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 ring-1 ring-blue-600/15">
            <ShieldCheck size={13} />
            <span>Secure Account Access</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to your{" "}
            <span className="font-bold text-slate-800">FixMate</span> account
            to manage your services
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-5" noValidate>
          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail size={17} />
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
                placeholder="you@example.com"
                className={`w-full rounded-xl border bg-slate-50/50 py-3 pr-4 pl-10 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
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

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Password
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock size={17} />
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
                className={`w-full rounded-xl border bg-slate-50/50 py-3 pr-11 pl-10 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
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
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
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

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 font-semibold text-slate-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {googleLoading ? (
            <>
              <Loader2 size={18} className="animate-spin text-blue-600" />
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Link to Sign Up */}
        <div className="mt-7 border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-blue-600 transition hover:text-indigo-600 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center backdrop-blur-xl">
            <Loader2 className="mx-auto animate-spin text-blue-400" size={34} />
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}