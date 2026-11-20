"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Receipt,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { apiUrl } from "@/lib/api";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const userRole = session?.user?.role;

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const [message, setMessage] = useState(
    "Verifying your payment..."
  );

  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      const redirectUrl = sessionId
        ? `/payment/success?session_id=${encodeURIComponent(sessionId)}`
        : "/payment/success";
      router.replace(`/sign-in?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    if (userRole !== "customer") {
      toast.error("Payment pages are accessible to customers only.");
      router.replace(
        userRole === "admin"
          ? "/dashboard/admin"
          : "/dashboard/technician"
      );
      return;
    }

    let active = true;

    const verifyPayment = async () => {
      try {
        if (!sessionId) {
          throw new Error("Stripe session ID not found.");
        }

        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (tokenResult.error || !token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(
          apiUrl("/api/payments/verify-checkout-session"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ sessionId }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Payment verification failed."
          );
        }

        if (active) {
          setStatus("success");
          setMessage(result.message);
        }
      } catch (error) {
        if (active) {
          setStatus("error");
          setMessage(
            error instanceof Error
              ? error.message
              : "Something went wrong."
          );
        }
      }
    };

    verifyPayment();

    return () => {
      active = false;
    };
  }, [session, sessionLoading, userRole, sessionId, router]);

  if (sessionLoading || !session?.user || userRole !== "customer") {
    return (
      <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-slate-950 p-5">
        <div className="pointer-events-none absolute top-1/3 left-1/3 h-80 w-80 rounded-full bg-blue-600/20 blur-[110px]" />
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 px-10 py-10 text-center backdrop-blur-xl">
          <Loader2 size={42} className="mx-auto animate-spin text-blue-400" />
          <p className="mt-4 text-sm font-medium text-slate-300">
            Verifying customer access...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-slate-950 px-4 py-16 sm:px-6">
      {/* Ambient Dynamic Glows & Subtle Grid */}
      <div
        className={`pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full blur-[120px] transition-colors duration-700 ${
          status === "success"
            ? "bg-emerald-500/20"
            : status === "error"
              ? "bg-rose-500/15"
              : "bg-blue-600/20"
        }`}
      />
      <div className="pointer-events-none absolute right-1/4 -bottom-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]" />

      {/* Main Status Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white p-8 text-center shadow-2xl shadow-slate-950/60 sm:p-10">
        {/* ================= LOADING STATE ================= */}
        {status === "loading" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/60">
              <Loader2 size={40} className="animate-spin" />
            </div>

            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-600/15">
              <Sparkles size={13} />
              <span>Processing Transaction</span>
            </div>

            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
              Verifying Payment
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Please wait while we securely confirm your Stripe checkout
              session with our server.
            </p>
          </>
        )}

        {/* ================= SUCCESS STATE ================= */}
        {status === "success" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
              <CheckCircle2 size={44} strokeWidth={2.2} />
            </div>

            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20">
              <ShieldCheck size={13} />
              <span>Verified Payment</span>
            </div>

            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Payment Successful!
            </h1>

            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">
              {message}
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/90 px-4 py-3 text-xs font-semibold text-slate-600">
              <Receipt size={16} className="shrink-0 text-emerald-600" />
              <span>Your payment has been verified and saved to your history</span>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <Link
                href="/dashboard/customer/my-bookings"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:from-blue-500 hover:to-indigo-500"
              >
                <span>View My Bookings</span>
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/dashboard/customer/payments"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <Receipt size={16} className="text-blue-600" />
                <span>View Payment Receipt</span>
              </Link>
            </div>
          </>
        )}

        {/* ================= ERROR STATE ================= */}
        {status === "error" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/60">
              <XCircle size={44} strokeWidth={2.2} />
            </div>

            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-600/20">
              <AlertTriangle size={13} />
              <span>Verification Issue</span>
            </div>

            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
              Payment Verification Failed
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {message}
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:from-blue-500 hover:to-indigo-500"
              >
                <RotateCcw
                  size={17}
                  className="transition-transform duration-300 group-hover:-rotate-45"
                />
                <span>Try Again</span>
              </button>

              <Link
                href="/dashboard/customer/my-bookings"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <span>Back to My Bookings</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[85vh] items-center justify-center bg-slate-950">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 px-10 py-10 text-center backdrop-blur-xl">
            <Loader2 size={40} className="mx-auto animate-spin text-blue-400" />
            <p className="mt-3 text-sm font-medium text-slate-300">
              Loading Payment...
            </p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}