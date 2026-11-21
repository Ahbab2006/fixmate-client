"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  Sparkles,
  CalendarDays,
  Hash,
  ArrowRight,
  ShieldAlert,
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
    let isMounted = true;

    (async () => {
      if (isMounted) {
        await fetchDashboardData();
      }
    })();

    return () => {
      isMounted = false;
    };
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
        return {
          pill: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/60",
          dot: "bg-emerald-500",
        };
      case "accepted":
      case "in-progress":
        return {
          pill: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/60",
          dot: "bg-blue-500",
        };
      case "rejected":
      case "cancelled":
        return {
          pill: "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/60",
          dot: "bg-rose-500",
        };
      default:
        return {
          pill: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/60",
          dot: "bg-amber-500",
        };
    }
  };

  if (loading) {
    return <AdminOverviewSkeleton />;
  }

  return (
    <main className="space-y-8 pb-16">
      {/* ================= EDITORIAL TOP BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/90">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-500/10 blur-[80px] dark:bg-blue-600/15" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-600/10" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
              <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
              <span className="font-mono text-[11px] uppercase tracking-wider">Control & Governance</span>
            </div>
            <h1 className="mt-3 font-serif text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Platform <span className="italic">Administration</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Real-time platform overview of verified members, service moderation, dispatch queues, and cumulative revenue.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchDashboardData();
            }}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 sm:self-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh Metrics</span>
          </button>
        </div>
      </div>

      {/* ================= FINANCIAL & TRANSACTION HIGHLIGHT ================= */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Total Revenue Highlight Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Settled Platform Volume
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Wallet size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              ${totalRevenue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Verified gross revenue processed via automated Stripe checkout sessions
            </p>
          </div>
          <div className="mt-5 border-t border-dashed border-slate-100 pt-4 dark:border-slate-800/80">
            <Link
              href="/dashboard/admin/transactions"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span>View Settlement History</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Total Transactions Card */}
        <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Transaction Volume
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {payments.length}
            </p>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Individual customer payments successfully recorded and archived
            </p>
          </div>
          <div className="mt-5 border-t border-dashed border-slate-100 pt-4 dark:border-slate-800/80">
            <Link
              href="/dashboard/admin/bookings"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span>Inspect All Bookings</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ================= PLATFORM METRICS LEDGER ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-normal tracking-tight text-slate-900 dark:text-white">
              Operational <span className="italic">Inventory</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live breakdown of platform accounts, listings, and service requests
            </p>
          </div>
        </div>

        {/* User Breakdown */}
        <div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Member Directory
          </span>
          <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AdminMetricCard
              title="Total Accounts"
              value={users.length}
              subtitle="Registered users"
              icon={<Users size={16} />}
              accent="bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
              href="/dashboard/admin/users"
            />
            <AdminMetricCard
              title="Customers"
              value={customers}
              subtitle="Service clients"
              icon={<UserRound size={16} />}
              accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
              href="/dashboard/admin/users"
            />
            <AdminMetricCard
              title="Technicians"
              value={technicians}
              subtitle="Verified specialists"
              icon={<Wrench size={16} />}
              accent="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
              href="/dashboard/admin/users"
            />
            <AdminMetricCard
              title="Administrators"
              value={admins}
              subtitle="Governance team"
              icon={<ShieldCheck size={16} />}
              accent="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
              href="/dashboard/admin/users"
            />
          </div>
        </div>

        {/* Services Moderation */}
        <div className="pt-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Service Catalog Moderation
          </span>
          <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AdminMetricCard
              title="Total Catalog"
              value={serviceStats.totalServices}
              subtitle="All listings"
              icon={<Wrench size={16} />}
              accent="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              href="/dashboard/admin/services"
            />
            <AdminMetricCard
              title="Approved & Live"
              value={serviceStats.approvedServices}
              subtitle="Customer visible"
              icon={<CheckCircle size={16} />}
              accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
              href="/dashboard/admin/services"
            />
            <AdminMetricCard
              title="Pending Review"
              value={serviceStats.pendingServices}
              subtitle="Awaiting sign-off"
              icon={<Clock size={16} />}
              accent="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
              href="/dashboard/admin/services"
            />
            <AdminMetricCard
              title="Rejected Listings"
              value={serviceStats.rejectedServices}
              subtitle="Declined submissions"
              icon={<ShieldAlert size={16} />}
              accent="bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
              href="/dashboard/admin/services"
            />
          </div>
        </div>

        {/* Dispatch Pipeline */}
        <div className="pt-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Service Request Pipeline
          </span>
          <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AdminMetricCard
              title="Total Bookings"
              value={bookings.length}
              subtitle="All-time requests"
              icon={<ClipboardList size={16} />}
              accent="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
              href="/dashboard/admin/bookings"
            />
            <AdminMetricCard
              title="New Requests"
              value={pendingBookings}
              subtitle="Awaiting technician"
              icon={<Clock size={16} />}
              accent="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
              href="/dashboard/admin/bookings"
            />
            <AdminMetricCard
              title="Active In Field"
              value={activeBookings}
              subtitle="In progress"
              icon={<Wrench size={16} />}
              accent="bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
              href="/dashboard/admin/bookings"
            />
            <AdminMetricCard
              title="Completed"
              value={completedBookings}
              subtitle="Successfully settled"
              icon={<CheckCircle size={16} />}
              accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
              href="/dashboard/admin/bookings"
            />
          </div>
        </div>
      </section>

      {/* ================= RECENT BOOKINGS TABLE ================= */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex flex-col gap-1 border-b border-slate-100 bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/60">
          <div>
            <h2 className="font-serif text-base font-normal tracking-tight text-slate-900 dark:text-white">
              Recent Service Requests
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest customer appointments logged across all categories
            </p>
          </div>
          <Link
            href="/dashboard/admin/bookings"
            className="inline-flex items-center gap-1.5 self-start font-mono text-xs font-semibold text-blue-600 hover:text-blue-700 sm:self-auto dark:text-blue-400"
          >
            <span>View All ({bookings.length})</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <p className="py-12 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
            No booking records available yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                  <th className="px-6 py-3.5">Service Title</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Technician</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Created</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentBookings.map((booking) => {
                  const statusStyle = getBookingStatusStyle(booking.status);

                  return (
                    <tr
                      key={booking._id}
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        {booking.serviceTitle}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {booking.customerName}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {booking.technicianName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${statusStyle.pill}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                          />
                          {booking.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-500 dark:text-slate-400">
                        <div className="inline-flex items-center gap-1.5">
                          <CalendarDays size={13} className="text-slate-400 dark:text-slate-500" />
                          <span>{formatDate(booking.createdAt)}</span>
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

      {/* ================= RECENT TRANSACTIONS TABLE ================= */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex flex-col gap-1 border-b border-slate-100 bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/60">
          <div>
            <h2 className="font-serif text-base font-normal tracking-tight text-slate-900 dark:text-white">
              Recent Stripe Transactions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified incoming payments logged from customer checkout sessions
            </p>
          </div>
          <Link
            href="/dashboard/admin/transactions"
            className="inline-flex items-center gap-1.5 self-start font-mono text-xs font-semibold text-blue-600 hover:text-blue-700 sm:self-auto dark:text-blue-400"
          >
            <span>View All ({payments.length})</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {recentPayments.length === 0 ? (
          <p className="py-12 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
            No transaction records available yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                  <th className="px-6 py-3.5">Session / ID</th>
                  <th className="px-6 py-3.5">Customer Email</th>
                  <th className="px-6 py-3.5">Settled Amount</th>
                  <th className="px-6 py-3.5 text-right">Payment Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentPayments.map((payment) => {
                  const txnId = payment.stripeSessionId || payment._id;

                  return (
                    <tr
                      key={payment._id}
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4">
                        <div
                          className="inline-flex max-w-[200px] items-center gap-1 rounded-md border border-slate-200/80 bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300"
                          title={txnId}
                        >
                          <Hash size={11} className="shrink-0 text-slate-400" />
                          <span className="truncate">{txnId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {payment.customerEmail}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          ${payment.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-500 dark:text-slate-400">
                        <div className="inline-flex items-center gap-1.5">
                          <CalendarDays size={13} className="text-slate-400 dark:text-slate-500" />
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

function AdminMetricCard({
  title,
  value,
  subtitle,
  icon,
  accent,
  href,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>
          {icon}
        </span>
      </div>
      <p className="mt-2.5 font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{subtitle}</p>
    </Link>
  );
}

function AdminOverviewSkeleton() {
  return (
    <div className="space-y-8 pb-16 animate-pulse">
      <div className="h-36 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90" />
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="h-44 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90" />
        <div className="h-44 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90"
          />
        ))}
      </div>
      <div className="h-64 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90" />
    </div>
  );
}
