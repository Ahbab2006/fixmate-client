"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { XCircle, RotateCcw, Home, Loader2 } from "lucide-react";

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
      <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 p-5">
        <div className="text-center">
          <Loader2 size={50} className="mx-auto animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Verifying customer access...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 p-5">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-lg">
        <XCircle size={65} className="mx-auto text-red-500" />

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-gray-600">
          Your payment was not completed. No amount has been charged and your
          booking has not been changed.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <Link
            href="/dashboard/customer/my-bookings"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <RotateCcw size={18} />
            Try Again
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
