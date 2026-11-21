"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  RefreshCw,
  CreditCard,
  Wallet,
  TrendingUp,
  Sparkles,
  CalendarDays,
  Loader2,
  Hash,
  CheckCircle2,
} from "lucide-react";
import { apiUrl } from "@/lib/api";

type Payment = {
  _id: string;
  bookingId: string;
  customerName?: string;
  customerEmail: string;
  technicianName?: string;
  technicianEmail?: string;
  serviceTitle?: string;
  amount: number;
  transactionId?: string;
  paymentIntentId?: string;
  stripeSessionId?: string;
  paidAt?: string;
  createdAt?: string;
};

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(apiUrl("/api/admin/payments"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch transactions.");
      }

      setPayments(data.payments || []);
      setTotalRevenue(data.totalRevenue || 0);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (isMounted) {
        await fetchPayments();
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

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

  return (
    <div className="space-y-8 pb-8">
      {/* ================= TOP DARK PREMIUM BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8 dark:border dark:border-slate-800">
        <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-600/25 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
              <Sparkles size={13} className="text-blue-400" />
              <span>Financial Overview</span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Transactions &amp;{" "}
              <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                Revenue
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-300">
              Monitor all verified Stripe customer payments and total platform
              earnings.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchPayments();
            }}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-blue-600 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ================= KPI SUMMARY CARDS ================= */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Transactions */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Total Transactions
            </p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-950/60 dark:text-blue-400">
              <CreditCard size={21} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
            {payments.length}
          </h2>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Completed checkout records
          </p>
        </div>

        {/* Total Revenue (Highlighted Premium Card) */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 dark:border dark:border-slate-800">
          <div className="pointer-events-none absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-300">
              Total Revenue
            </p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-400/30 transition-transform group-hover:scale-110">
              <Wallet size={21} />
            </div>
          </div>
          <h2 className="relative mt-4 text-3xl font-extrabold text-white">
            $
            {totalRevenue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
          <p className="relative mt-1 text-xs text-emerald-300/90">
            Cumulative platform volume
          </p>
        </div>

        {/* Average Payment */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-900/5 sm:col-span-2 lg:col-span-1 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Average Payment
            </p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110 dark:bg-indigo-950/60 dark:text-indigo-400">
              <TrendingUp size={21} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
            $
            {payments.length
              ? (totalRevenue / payments.length).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </h2>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Mean value per service booking
          </p>
        </div>
      </div>

      {/* ================= PAYMENT HISTORY TABLE CARD ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Table Header Bar */}
        <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/60">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Payment History
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Verified Stripe payment logs across all completed services
            </p>
          </div>

          {!loading && payments.length > 0 && (
            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20 sm:self-auto dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-500/20">
              <CheckCircle2 size={13} />
              {payments.length} Settled
            </span>
          )}
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center py-16 text-center">
            <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={34} />
            <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              Loading transaction records...
            </p>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <CreditCard size={26} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              No Transactions Yet
            </h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
              Customer payments will appear here automatically after successful
              Stripe checkouts.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Technician</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((payment) => {
                  const txnId =
                    payment.transactionId ||
                    payment.paymentIntentId ||
                    payment.stripeSessionId ||
                    "N/A";

                  const paymentDate = payment.paidAt || payment.createdAt;

                  return (
                    <tr
                      key={payment._id}
                      className="transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-800/50"
                    >
                      {/* Transaction ID */}
                      <td className="px-6 py-4">
                        <div
                          className="inline-flex max-w-[190px] items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                          title={txnId}
                        >
                          <Hash size={12} className="shrink-0 text-slate-400 dark:text-slate-500" />
                          <span className="truncate">{txnId}</span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {payment.customerName || "Customer"}
                        </p>
                        <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-500 dark:text-slate-400">
                          {payment.customerEmail || "N/A"}
                        </p>
                      </td>

                      {/* Technician */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {payment.technicianName || "N/A"}
                        </p>
                        {payment.technicianEmail && (
                          <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-500 dark:text-slate-400">
                            {payment.technicianEmail}
                          </p>
                        )}
                      </td>

                      {/* Service */}
                      <td className="px-6 py-4">
                        <span
                          className="block max-w-[200px] truncate font-medium text-slate-700 dark:text-slate-300"
                          title={payment.serviceTitle || "N/A"}
                        >
                          {payment.serviceTitle || "N/A"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-extrabold text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-500/20">
                          $
                          {payment.amount !== undefined &&
                          payment.amount !== null
                            ? payment.amount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : "0.00"}
                        </span>
                      </td>

                      {/* Payment Date */}
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600 dark:text-slate-400">
                        <div className="inline-flex items-center gap-1.5 font-medium">
                          <CalendarDays size={15} className="text-slate-400 dark:text-slate-500" />
                          <span>{formatDate(paymentDate)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}