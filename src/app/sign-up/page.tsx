"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Check, X, User, Wrench } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "technician">("customer");

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  // Redirect authenticated users away from sign-up
  useEffect(() => {
    if (sessionLoading) return;

    if (session?.user) {
      const userRole = session.user.role;
      if (userRole === "admin") {
        router.replace("/dashboard/admin");
      } else if (userRole === "technician") {
        router.replace("/dashboard/technician");
      } else {
        router.replace("/dashboard/customer");
      }
    }
  }, [session, sessionLoading, router]);

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
        if (userRole === "technician") {
          router.push("/dashboard/technician");
        } else {
          router.push("/dashboard/customer");
        }
        router.refresh();
      } else {
        toast.info("Please sign in with your new account credentials.");
        router.push("/sign-in");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading || session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Create Account
        </h1>

        <p className="mb-6 text-center text-gray-500">
          Join FixMate today
        </p>

        <form onSubmit={handleSignUp} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>
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
              className={`w-full rounded-lg border px-4 py-2 text-gray-900 outline-none transition focus:border-blue-500 ${
                fieldErrors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your name"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
            )}
          </div>

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
              className={`w-full rounded-lg border px-4 py-2 text-gray-900 outline-none transition focus:border-blue-500 ${
                fieldErrors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password with real-time requirement indicator */}
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
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              required
              className={`w-full rounded-lg border px-4 py-2 text-gray-900 outline-none transition focus:border-blue-500 ${
                fieldErrors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your password"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.password}
              </p>
            )}

            {/* Password Validation Checklist */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1 rounded-lg bg-gray-50 p-3 text-xs">
                <p className="font-semibold text-gray-700">
                  Password Requirements:
                </p>
                <div className="flex items-center gap-1.5">
                  {hasMinLength ? (
                    <Check size={14} className="text-green-600" />
                  ) : (
                    <X size={14} className="text-red-500" />
                  )}
                  <span
                    className={
                      hasMinLength ? "text-green-700 font-medium" : "text-gray-600"
                    }
                  >
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasUppercase ? (
                    <Check size={14} className="text-green-600" />
                  ) : (
                    <X size={14} className="text-red-500" />
                  )}
                  <span
                    className={
                      hasUppercase ? "text-green-700 font-medium" : "text-gray-600"
                    }
                  >
                    At least one uppercase letter (A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasLowercase ? (
                    <Check size={14} className="text-green-600" />
                  ) : (
                    <X size={14} className="text-red-500" />
                  )}
                  <span
                    className={
                      hasLowercase ? "text-green-700 font-medium" : "text-gray-600"
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
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Register As
            </label>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Register As">
              {/* Customer */}
              <label
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border p-4 text-center transition ${
                  role === "customer"
                    ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
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
                <div
                  className={`mb-2 rounded-full p-2.5 ${
                    role === "customer"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <User size={20} />
                </div>
                <span className="font-semibold text-gray-900">Customer</span>
                <span className="mt-1 text-xs text-gray-500">
                  Book repair services
                </span>
              </label>

              {/* Technician */}
              <label
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border p-4 text-center transition ${
                  role === "technician"
                    ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
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
                <div
                  className={`mb-2 rounded-full p-2.5 ${
                    role === "technician"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Wrench size={20} />
                </div>
                <span className="font-semibold text-gray-900">Technician</span>
                <span className="mt-1 text-xs text-gray-500">
                  Provide repair services
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Link to Sign In */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
