
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  RefreshCw,
  CreditCard,
  Wallet,
  TrendingUp,
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
      setLoading(true);

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(
        apiUrl("/api/admin/payments"),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    fetchPayments();
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Transactions & Revenue
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor all customer payments and platform revenue.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <CreditCard size={22} className="text-blue-600" />
          </div>
          <h2 className="mt-3 text-2xl font-bold">{payments.length}</h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <Wallet size={22} className="text-green-600" />
          </div>
          <h2 className="mt-3 text-2xl font-bold">
            ${totalRevenue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Average Payment</p>
            <TrendingUp size={22} className="text-purple-600" />
          </div>
          <h2 className="mt-3 text-2xl font-bold">
            $
            {payments.length
              ? (totalRevenue / payments.length).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </h2>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <h2 className="mb-5 text-lg font-semibold">Payment History</h2>

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Loading transactions...
          </div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center">
            <CreditCard className="mx-auto mb-3 text-gray-400" size={40} />
            <h3 className="font-semibold text-gray-700">
              No Transactions Yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Customer payments will appear here after successful payments.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="px-4 py-3 font-medium">Transaction ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Technician</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Payment Date</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => {
                  const txnId =
                    payment.transactionId ||
                    payment.paymentIntentId ||
                    payment.stripeSessionId ||
                    "N/A";

                  const paymentDate = payment.paidAt || payment.createdAt;

                  return (
                    <tr key={payment._id} className="border-b last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-4 font-mono text-xs font-medium text-gray-900 max-w-[180px] truncate" title={txnId}>
                        {txnId}
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        <p className="font-medium text-gray-900">
                          {payment.customerName || "Customer"}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[170px]">
                          {payment.customerEmail || "N/A"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-gray-700">
                        <p className="font-medium text-gray-900">
                          {payment.technicianName || "N/A"}
                        </p>
                        {payment.technicianEmail && (
                          <p className="text-xs text-gray-500 truncate max-w-[170px]">
                            {payment.technicianEmail}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 text-gray-700 max-w-[180px] truncate" title={payment.serviceTitle || "N/A"}>
                        {payment.serviceTitle || "N/A"}
                      </td>

                      <td className="px-4 py-4 font-semibold text-gray-900 whitespace-nowrap">
                        ${payment.amount !== undefined && payment.amount !== null
                          ? payment.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "0.00"}
                      </td>

                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                        {formatDate(paymentDate)}
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
