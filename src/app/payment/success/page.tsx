
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const [message, setMessage] = useState(
    "Verifying your payment..."
  );

  useEffect(() => {
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
          "http://localhost:5000/api/payments/verify-checkout-session",
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
  }, [sessionId]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 p-5">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-lg">

        {status === "loading" && (
          <>
            <Loader2
              size={60}
              className="mx-auto animate-spin text-blue-600"
            />

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Verifying Payment
            </h1>

            <p className="mt-3 text-gray-600">
              Please wait while we verify your payment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2
              size={65}
              className="mx-auto text-green-600"
            />

            <h1 className="mt-5 text-2xl font-bold text-green-700">
              Payment Successful!
            </h1>

            <p className="mt-3 text-gray-600">
              {message}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Your payment has been verified and saved successfully.
            </p>

            <Link
              href="/dashboard/customer/my-bookings"
              className="mt-7 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              View My Bookings
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle
              size={65}
              className="mx-auto text-red-600"
            />

            <h1 className="mt-5 text-2xl font-bold text-red-700">
              Payment Verification Failed
            </h1>

            <p className="mt-3 text-gray-600">
              {message}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-7 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          Loading Payment...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
