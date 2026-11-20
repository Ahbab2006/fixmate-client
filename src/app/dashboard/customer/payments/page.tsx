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
  Sparkles,
  Hash,
  UserCheck,
  Mail,
  ShieldCheck,
  Loader2,
  CheckCircle2,
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
      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(apiUrl("/api/payments/my-payments"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

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
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (session) {
      (async () => {
        if (isMounted) {
          await fetchPayments();
        }
      })();
    }

    return () => {
      isMounted = false;
    };
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
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="rounded-3xl border border-slate-200/80 bg-white px-10 py-12 text-center shadow-sm">
          <Loader2 className="mx-auto animate-spin text-blue-600" size={38} />
          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading payment history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ================= TOP DARK PREMIUM BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-600/25 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <Sparkles size={13} className="text-blue-400" />
                <span>Billing &amp; Receipts</span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Payment{" "}
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  History
                </span>
              </h1>
              <p className="mt-1.5 text-sm text-slate-300">
                View all your completed Stripe transactions, digital receipts,
                and service billing details.
              </p>
            </div>

            <button
              onClick={() => {
                setLoading(true);
                fetchPayments();
              }}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-blue-600 sm:self-auto"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* ================= SUMMARY KPI CARDS ================= */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Total Payments Card */}
          <div className="group rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Total Payments
                </p>
                <h2 className="mt-2.5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  {payments.length}
                </h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-600/15 transition-transform group-hover:scale-110">
                <CreditCard size={28} />
              </div>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400">
              Completed service payment transactions
            </p>
          </div>

          {/* Total Amount Paid Highlight Card */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-7 text-white shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-300">
                  Total Amount Paid
                </p>
                <h2 className="mt-2.5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  $
                  {totalAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-400/30 transition-transform group-hover:scale-110">
                <Receipt size={28} />
              </div>
            </div>
            <p className="relative mt-4 text-xs font-medium text-emerald-300/90">
              Total settled via verified Stripe checkout
            </p>
          </div>
        </div>

        {/* ================= PAYMENT LIST ================= */}
        {payments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Package size={32} />
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-slate-900">
              No Payments Found
            </h2>

            <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
              Your completed transactions and digital receipts will appear here
              after paying for a service.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
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
                  className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5 sm:p-7"
                >
                  {/* Top Header Row */}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Receipt size={18} />
                        </span>
                        <h2 className="text-xl font-extrabold text-slate-900">
                          {payment.serviceTitle || "Service Repair"}
                        </h2>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                        <div className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 font-mono font-semibold text-slate-700">
                          <Hash size={12} className="shrink-0 text-slate-400" />
                          <span className="break-all">Txn: {txnId}</span>
                        </div>

                        <div className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 font-mono font-medium text-slate-600">
                          <span className="break-all">
                            Booking: {payment.bookingId || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold capitalize text-emerald-700 ring-1 ring-emerald-600/20">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      {payment.paymentStatus || "paid"}
                    </span>
                  </div>

                  {/* Metadata Grid */}
                  <div className="mt-6 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 sm:grid-cols-2 lg:grid-cols-5">
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Payment Amount
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-slate-900">
                        $
                        {payment.amount !== undefined && payment.amount !== null
                          ? payment.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "0.00"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Payment Date
                      </p>
                      <p className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                        <CalendarDays size={16} className="text-blue-600" />
                        <span>{formatDate(paymentDate)}</span>
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Technician
                      </p>
                      <p className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                        <UserCheck size={16} className="text-indigo-600" />
                        <span>{payment.technicianName || "N/A"}</span>
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Customer Email
                      </p>
                      <p className="mt-1.5 flex items-center gap-1.5 break-all text-sm font-semibold text-slate-700">
                        <Mail size={15} className="shrink-0 text-slate-400" />
                        <span>{payment.customerEmail || "N/A"}</span>
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Payment Method
                      </p>
                      <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm ring-1 ring-slate-200/80">
                        <ShieldCheck size={14} className="text-blue-600" />
                        <span>Stripe</span>
                      </div>
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