"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);
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

  // Prevent flash of sign-in form for already-authenticated users
  if (sessionLoading || session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Welcome Back
        </h1>

        <p className="mb-6 text-center text-gray-500">
          Sign in to your FixMate account
        </p>

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
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
              placeholder="Enter your email"
              className={`w-full rounded-lg border px-4 py-2 text-gray-900 outline-none transition focus:border-blue-500 ${
                fieldErrors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
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
              placeholder="Enter your password"
              className={`w-full rounded-lg border px-4 py-2 text-gray-900 outline-none transition focus:border-blue-500 ${
                fieldErrors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Link to Sign Up */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
