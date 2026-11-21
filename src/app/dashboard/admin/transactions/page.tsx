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

  if (loading) {
    return <TransactionsSkeleton />;
  }

  return (
    <div className="space-y-8 pb-16">
      {/* ================= EDITORIAL TOP BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/90">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-500/10 blur-[80px] dark:bg-blue-600/15" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-600/10" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
              <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
              <span className="font-mono text-[11px] uppercase tracking-wider">Financial Settlement</span>
            </div>
            <h1 className="mt-3 font-serif text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Transactions &amp; <span className="italic">Revenue</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Audited Stripe customer checkouts, platform billing history, and gross transaction volume.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchPayments();
            }}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 sm:self-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      {/* ================= KPI SUMMARY CARDS ================= */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Transactions */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Transactions
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <CreditCard size={17} />
            </div>
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {payments.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Completed Stripe checkout sessions
          </p>
        </div>

        {/* Total Revenue */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Gross Revenue
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Wallet size={17} />
            </div>
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            $
            {totalRevenue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Cumulative settled platform payments
          </p>
        </div>

        {/* Average Payment */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md sm:col-span-2 lg:col-span-1 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Average Ticket Value
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <TrendingUp size={17} />
            </div>
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            $
            {payments.length
              ? (totalRevenue / payments.length).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Mean value per verified repair booking
          </p>
        </div>
      </div>

      {/* ================= PAYMENT HISTORY TABLE CARD ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        {/* Table Header Bar */}
        <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/60">
          <div>
            <h2 className="font-serif text-base font-normal tracking-tight text-slate-900 dark:text-white">
              Settlement Ledger
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Verified Stripe checkout records across all completed customer services
            </p>
          </div>

          {!loading && payments.length > 0 && (
            <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-700 sm:self-auto dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 size={12} />
              {payments.length} Settled
            </span>
          )}
        </div>

        {/* Table Content */}
        {payments.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <CreditCard size={24} />
            </div>
            <h3 className="mt-4 font-serif text-lg font-normal text-slate-900 dark:text-white">
              No Transactions Recorded
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              Customer payments will appear here automatically upon successful Stripe checkout settlements.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                  <th className="px-6 py-3.5">Transaction ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Technician</th>
                  <th className="px-6 py-3.5">Service Title</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5 text-right">Settled Date</th>
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
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      {/* Transaction ID */}
                      <td className="px-6 py-4">
                        <div
                          className="inline-flex max-w-[190px] items-center gap-1 rounded-md border border-slate-200/80 bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300"
                          title={txnId}
                        >
                          <Hash size={11} className="shrink-0 text-slate-400" />
                          <span className="truncate">{txnId}</span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {payment.customerName || "Customer"}
                        </p>
                        <p className="mt-0.5 max-w-[180px] truncate text-slate-400 dark:text-slate-500">
                          {payment.customerEmail || "N/A"}
                        </p>
                      </td>

                      {/* Technician */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {payment.technicianName || "N/A"}
                        </p>
                        {payment.technicianEmail && (
                          <p className="mt-0.5 max-w-[180px] truncate text-slate-400 dark:text-slate-500">
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
                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
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
                      <td className="whitespace-nowrap px-6 py-4 text-right font-mono text-slate-500 dark:text-slate-400">
                        <div className="inline-flex items-center gap-1.5">
                          <CalendarDays size={13} className="text-slate-400 dark:text-slate-500" />
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

function TransactionsSkeleton() {
  return (
    <div className="space-y-8 pb-16 animate-pulse">
      <div className="h-36 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90"
          />
        ))}
      </div>
      <div className="h-96 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90" />
    </div>
  );
}
