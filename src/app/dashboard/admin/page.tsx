"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Users,
  UserRound,
  Wrench,
  ShieldCheck,
  ClipboardList,
  Clock,
  CheckCircle,
  CreditCard,
  Wallet,
  RefreshCw,
  Loader2,
  Sparkles,
  CalendarDays,
  Hash,
} from "lucide-react";
import { apiUrl } from "@/lib/api";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "technician" | "admin";
};

type Service = {
  _id: string;
  title: string;
  technicianName: string;
  createdAt: string;
};

type Booking = {
  _id: string;
  serviceTitle: string;
  customerName: string;
  technicianName: string;
  status: string;
  createdAt: string;
};

type Payment = {
  _id: string;
  bookingId: string;
  customerEmail: string;
  serviceTitle?: string;
  amount: number;
  stripeSessionId?: string;
  createdAt: string;
};

type ServiceStats = {
  totalServices: number;
  approvedServices: number;
  pendingServices: number;
  rejectedServices: number;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const [serviceStats, setServiceStats] = useState<ServiceStats>({
    totalServices: 0,
    approvedServices: 0,
    pendingServices: 0,
    rejectedServices: 0,
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const endpoints = [
        apiUrl("/api/users"),
        apiUrl("/api/services/admin/pending"),
        apiUrl("/api/bookings/admin/all"),
        apiUrl("/api/payments/admin/all"),
        apiUrl("/api/services/admin/stats"),
      ];

      const responses = await Promise.all(
        endpoints.map((url) => fetch(url, { headers }))
      );

      const results = await Promise.all(
        responses.map(async (response) => {
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to load dashboard data.");
          }

          return data;
        })
      );

      const [
        usersData,
        servicesData,
        bookingsData,
        paymentsData,
        serviceStatsData,
      ] = results;

      setServiceStats(serviceStatsData.stats);

      setUsers(usersData.users || []);
      setServices(servicesData.services || []);
      setBookings(bookingsData.bookings || []);
      setPayments(paymentsData.payments || []);
      setTotalRevenue(paymentsData.totalRevenue || 0);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const customers = users.filter((user) => user.role === "customer").length;
  const technicians = users.filter(
    (user) => user.role === "technician"
  ).length;
  const admins = users.filter((user) => user.role === "admin").length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  const activeBookings = bookings.filter((booking) =>
    ["accepted", "in-progress"].includes(booking.status)
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const recentPayments = [...payments]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getBookingStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";
      case "accepted":
      case "in-progress":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20";
      case "rejected":
      case "cancelled":
        return "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20";
      default:
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";
    }
  };

  const getBookingStatusDot = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500";
      case "accepted":
      case "in-progress":
        return "bg-blue-500";
      case "rejected":
      case "cancelled":
        return "bg-rose-500";
      default:
        return "bg-amber-500";
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600 ring-1 ring-blue-600/15",
    },
    {
      title: "Customers",
      value: customers,
      icon: UserRound,
      color: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/15",
    },
    {
      title: "Technicians",
      value: technicians,
      icon: Wrench,
      color: "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600/15",
    },
    {
      title: "Admins",
      value: admins,
      icon: ShieldCheck,
      color: "bg-amber-50 text-amber-600 ring-1 ring-amber-600/15",
    },
    {
      title: "Total Services",
      value: serviceStats.totalServices,
      icon: Wrench,
      color: "bg-sky-50 text-sky-600 ring-1 ring-sky-600/15",
    },
    {
      title: "Approved Services",
      value: serviceStats.approvedServices,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/15",
    },
    {
      title: "Pending Services",
      value: serviceStats.pendingServices,
      icon: Clock,
      color: "bg-amber-50 text-amber-600 ring-1 ring-amber-600/15",
    },
    {
      title: "Rejected Services",
      value: serviceStats.rejectedServices,
      icon: ShieldCheck,
      color: "bg-rose-50 text-rose-600 ring-1 ring-rose-600/15",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: ClipboardList,
      color: "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600/15",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      icon: Clock,
      color: "bg-amber-50 text-amber-600 ring-1 ring-amber-600/15",
    },
    {
      title: "Active Jobs",
      value: activeBookings,
      icon: Wrench,
      color: "bg-blue-50 text-blue-600 ring-1 ring-blue-600/15",
    },
    {
      title: "Completed Jobs",
      value: completedBookings,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/15",
    },
    {
      title: "Total Transactions",
      value: payments.length,
      icon: CreditCard,
      color: "bg-purple-50 text-purple-600 ring-1 ring-purple-600/15",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="rounded-3xl border border-slate-200/80 bg-white px-10 py-12 text-center shadow-sm">
          <Loader2 className="mx-auto animate-spin text-blue-600" size={38} />
          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading Admin Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-8 pb-10">
      {/* ================= TOP DARK PREMIUM BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-600/25 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
              <Sparkles size={13} className="text-blue-400" />
              <span>Control Center</span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Admin{" "}
              <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-300">
              Complete real-time overview of your FixMate ecosystem, users,
              services, and revenue.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-blue-600 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* ================= REVENUE & TRANSACTIONS HIGHLIGHT ================= */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Total Revenue Highlight Card */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-7 text-white shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-300">
                Total Revenue
              </p>
              <h2 className="mt-2.5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                $
                {totalRevenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-400/30 transition-transform group-hover:scale-110">
              <Wallet size={28} />
            </div>
          </div>
          <p className="relative mt-4 text-xs font-medium text-emerald-300/90">
            Revenue collected from verified Stripe payments
          </p>
        </div>

        {/* Total Transactions Card */}
        <div className="group rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Total Transactions
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
            Successfully recorded customer checkout sessions
          </p>
        </div>
      </div>

      {/* ================= PLATFORM STATISTICS GRID ================= */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              Platform Statistics
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Key operational metrics across users, services, and bookings
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-500">
                    {card.title}
                  </p>
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${card.color}`}
                  >
                    <Icon size={18} />
                  </div>
                </div>

                <h3 className="mt-4 text-2xl font-extrabold text-slate-900">
                  {card.value}
                </h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= RECENT BOOKINGS TABLE ================= */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-100 bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Bookings
            </h2>
            <p className="text-xs text-slate-500">
              Latest customer service requests across the platform
            </p>
          </div>
          <span className="self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-600/15 sm:self-auto">
            Latest 5 records
          </span>
        </div>

        {recentBookings.length === 0 ? (
          <p className="py-12 text-center text-sm font-medium text-slate-500">
            No bookings available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Technician</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition-colors hover:bg-slate-50/90"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {booking.serviceTitle}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {booking.customerName}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {booking.technicianName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ${getBookingStatusStyle(booking.status)}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getBookingStatusDot(booking.status)}`}
                        />
                        {booking.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">
                      <div className="inline-flex items-center gap-1.5 font-medium">
                        <CalendarDays size={14} className="text-slate-400" />
                        <span>{formatDate(booking.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ================= RECENT TRANSACTIONS TABLE ================= */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-100 bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Transactions
            </h2>
            <p className="text-xs text-slate-500">
              Most recent settled customer payments
            </p>
          </div>
          <span className="self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/15 sm:self-auto">
            Latest 5 payments
          </span>
        </div>

        {recentPayments.length === 0 ? (
          <p className="py-12 text-center text-sm font-medium text-slate-500">
            No transactions available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Payment Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentPayments.map((payment) => {
                  const txnId = payment.stripeSessionId || payment._id;
                  return (
                    <tr
                      key={payment._id}
                      className="transition-colors hover:bg-slate-50/90"
                    >
                      <td className="px-6 py-4">
                        <div
                          className="inline-flex max-w-[220px] items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-700"
                          title={txnId}
                        >
                          <Hash size={12} className="shrink-0 text-slate-400" />
                          <span className="truncate">{txnId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {payment.customerEmail}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-extrabold text-emerald-700 ring-1 ring-emerald-600/20">
                          $
                          {payment.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600">
                        <div className="inline-flex items-center gap-1.5 font-medium">
                          <CalendarDays size={14} className="text-slate-400" />
                          <span>{formatDate(payment.createdAt)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}