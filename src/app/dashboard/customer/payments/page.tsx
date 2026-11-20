
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  RefreshCw,
  CreditCard,
  Receipt,
  CalendarDays,
  Package,
} from "lucide-react";
import { apiUrl } from "@/lib/api";

interface Payment {
  _id: string;
  bookingId: string;
  stripeSessionId?: string;
  transactionId?: string;
  paymentIntentId?: string;
  customerName?: string;
  customerEmail: string;
  technicianName?: string;
  technicianEmail?: string;
  serviceTitle: string;
  amount: number;
  currency?: string;
  paymentStatus: string;
  paidAt?: string;
  createdAt?: string;
}

export default function CustomerPaymentsPage() {
  const { data: session } = authClient.useSession();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        apiUrl("/api/payments/my-payments"),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load payment history."
        );
      }

      setPayments(result.payments || []);
      setTotalAmount(result.totalAmount || 0);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchPayments();
    }
  }, [session, fetchPayments]);

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-gray-600">
            Loading payment history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Payment History
            </h1>

            <p className="mt-2 text-gray-600">
              View all your completed payments and transactions.
            </p>
          </div>

          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 font-medium hover:bg-gray-100"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-gray-500">Total Payments</p>
              <CreditCard className="text-blue-600" size={25} />
            </div>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {payments.length}
            </h2>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-gray-500">Total Amount Paid</p>
              <Receipt className="text-green-600" size={25} />
            </div>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              ${totalAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>
        </div>

        {/* Payment List */}
        {payments.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center">
            <Package
              size={45}
              className="mx-auto mb-4 text-gray-400"
            />

            <h2 className="text-xl font-semibold text-gray-800">
              No Payments Found
            </h2>

            <p className="mt-2 text-gray-500">
              Your completed transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {payments.map((payment) => {
              const txnId =
                payment.transactionId ||
                payment.paymentIntentId ||
                payment.stripeSessionId ||
                "N/A";

              const paymentDate = payment.paidAt || payment.createdAt;

              return (
                <div
                  key={payment._id}
                  className="rounded-xl border bg-white p-5 shadow-sm md:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {payment.serviceTitle || "Service Repair"}
                      </h2>

                      <p className="mt-2 break-all text-sm text-gray-500">
                        Transaction ID:{" "}
                        <span className="font-mono text-gray-700">
                          {txnId}
                        </span>
                      </p>

                      <p className="mt-1 break-all text-sm text-gray-500">
                        Booking ID: {payment.bookingId || "N/A"}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold capitalize text-green-700">
                      {payment.paymentStatus || "paid"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-500">
                        Payment Amount
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-900">
                        ${payment.amount !== undefined && payment.amount !== null
                          ? payment.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "0.00"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Payment Date
                      </p>
                      <p className="mt-2 flex items-center gap-2 font-medium text-gray-800">
                        <CalendarDays size={18} />
                        {formatDate(paymentDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Technician
                      </p>
                      <p className="mt-1 font-medium text-gray-800">
                        {payment.technicianName || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Customer Email
                      </p>
                      <p className="mt-1 break-all font-medium text-gray-800">
                        {payment.customerEmail || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Payment Method
                      </p>
                      <p className="mt-1 font-medium text-gray-800">
                        Stripe
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
