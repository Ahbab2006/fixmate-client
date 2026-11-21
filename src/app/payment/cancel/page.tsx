"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  XCircle,
  RotateCcw,
  Home,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function PaymentCancelPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const userRole = session?.user?.role;

  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      router.replace(
        `/sign-in?redirect=${encodeURIComponent("/payment/cancel")}`
      );
      return;
    }

    if (userRole !== "customer") {
      toast.error("Payment pages are accessible to customers only.");
      router.replace(
        userRole === "admin"
          ? "/dashboard/admin"
          : "/dashboard/technician"
      );
    }
  }, [session, sessionLoading, userRole, router]);

  if (sessionLoading || !session?.user || userRole !== "customer") {
    return (
      <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-slate-50 p-5 dark:bg-slate-950">
        <div className="pointer-events-none absolute top-1/3 left-1/3 h-80 w-80 rounded-full bg-blue-600/20 blur-[110px]" />
        <div className="rounded-3xl border border-slate-200/80 bg-white px-10 py-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:backdrop-blur-xl">
          <Loader2 size={42} className="mx-auto animate-spin text-blue-600 dark:text-blue-400" />
          <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
            Verifying customer access...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-slate-50 px-4 py-16 sm:px-6 dark:bg-slate-950">
      {/* Ambient Glows & Subtle Grid */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-rose-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 -bottom-24 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:36px_36px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" />

      {/* Cancel Status Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-2xl dark:shadow-slate-950/60 sm:p-10">
        {/* Icon Emblem */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/60 dark:bg-rose-950/60 dark:text-rose-400 dark:ring-rose-900/30">
          <XCircle size={44} strokeWidth={2.2} />
        </div>

        {/* Status Pill */}
        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-500/20">
          <AlertTriangle size={13} />
          <span>Checkout Cancelled</span>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Your payment was not completed. No amount has been charged to your
          account, and your booking status remains unchanged.
        </p>

        {/* Reassurance Box */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/90 px-4 py-3 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
          <ShieldCheck size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
          <span>Zero charges applied • Your booking is still safe</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-col gap-3">
          <Link
            href="/dashboard/customer/my-bookings"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:from-blue-500 hover:to-indigo-500"
          >
            <RotateCcw
              size={17}
              className="transition-transform duration-300 group-hover:-rotate-45"
            />
            <span>Try Again</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <Home size={17} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}