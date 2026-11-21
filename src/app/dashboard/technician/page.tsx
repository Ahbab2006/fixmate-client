"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Clock,
  CheckCircle2,
  ClipboardList,
  Plus,
  ArrowRight,
  CalendarDays,
  TrendingUp,
  RefreshCw,
  Sparkles,
  User,
  AlertCircle,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiUrl } from "@/lib/api";

interface Service {
  _id: string;
  title: string;
  approvalStatus: string;
  isAvailable: boolean;
}

interface Booking {
  _id: string;
  serviceTitle: string;
  customerName: string;
  status: string;
  basePrice?: number;
  finalAmount?: number;
  createdAt: string;
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="h-6 w-36 rounded-full bg-slate-200 dark:bg-slate-800 mb-4" />
        <div className="h-10 w-72 rounded-xl bg-slate-200 dark:bg-slate-800 mb-3" />
        <div className="h-4 w-96 max-w-full rounded bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* KPI Grid skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="mt-4 h-8 w-16 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-3 w-32 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Quick Actions skeleton */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="h-32 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60" />
        <div className="h-32 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60" />
      </div>

      {/* Recent Activity skeleton */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
        <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TechnicianDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Authentication failed. Please login again.");
      }

      const headers = {
        Authorization: `Bearer ${data.token}`,
      };

      const [serviceResponse, bookingResponse] = await Promise.all([
        fetch(apiUrl("/api/services/my-services"), { headers }),
        fetch(apiUrl("/api/bookings/technician"), { headers }),
      ]);

      if (!serviceResponse.ok || !bookingResponse.ok) {
        throw new Error("Failed to load dashboard data.");
      }

      const serviceData = await serviceResponse.json();
      const bookingData = await bookingResponse.json();

      setServices(serviceData.services || []);
      setBookings(bookingData.bookings || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
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

  const pendingServices = services.filter(
    (service) => service.approvalStatus === "pending"
  ).length;

  const approvedServices = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length;

  const requestedJobs = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  const activeJobs = bookings.filter(
    (booking) =>
      booking.status === "accepted" || booking.status === "in-progress"
  ).length;

  const completedJobs = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const totalEarnings = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.finalAmount ?? b.basePrice ?? 0), 0);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-500/20";
      case "accepted":
      case "in-progress":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-950/60 dark:text-blue-400 dark:ring-blue-500/20";
      case "rejected":
      case "cancelled":
        return "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/60 dark:text-rose-400 dark:ring-rose-500/20";
      default:
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/60 dark:text-amber-400 dark:ring-amber-500/20";
    }
  };

  const getStatusDot = (status: string) => {
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

  const stats = [
    {
      title: "Active Jobs",
      subtitle: "Accepted & in progress",
      value: activeJobs,
      icon: Briefcase,
      color:
        "bg-blue-50 text-blue-700 ring-1 ring-blue-600/15 dark:bg-blue-950/60 dark:text-blue-400 dark:ring-blue-500/20",
    },
    {
      title: "New Requests",
      subtitle: "Awaiting confirmation",
      value: requestedJobs,
      icon: Clock,
      color:
        "bg-amber-50 text-amber-700 ring-1 ring-amber-600/15 dark:bg-amber-950/60 dark:text-amber-400 dark:ring-amber-500/20",
    },
    {
      title: "Completed Jobs",
      subtitle: "Successfully finished",
      value: completedJobs,
      icon: CheckCircle2,
      color:
        "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-500/20",
    },
    {
      title: "Live Services",
      subtitle: `${pendingServices} pending approval`,
      value: approvedServices,
      icon: Wrench,
      color:
        "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/15 dark:bg-indigo-950/60 dark:text-indigo-400 dark:ring-indigo-500/20",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50/60 pb-12 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ================= EDITORIAL WELCOME BANNER ================= */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/70 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
                <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
                <span>Technician Workspace</span>
              </div>

              <h1 className="font-serif text-3xl font-normal tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
                Workspace <span className="italic">Overview</span>
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Manage your repair packages, process incoming customer requests,
                and maintain service delivery excellence across your assigned areas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setLoading(true);
                  setError("");
                  fetchDashboardData();
                }}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:text-sm"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>

              <Link
                href="/dashboard/technician/add-service"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 sm:text-sm"
              >
                <Plus size={16} />
                <span>Add Service</span>
              </Link>
            </div>
          </div>

          {/* Quick metric highlights strip */}
          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-dashed border-slate-200 pt-5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:gap-6">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-slate-400 dark:text-slate-500">Total Catalog:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {services.length} services
              </span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-slate-400 dark:text-slate-500">Lifetime Bookings:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {bookings.length} jobs
              </span>
            </div>
            {totalEarnings > 0 && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <DollarSign size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-slate-400 dark:text-slate-500">Completed Volume:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ${totalEarnings.toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        {loading ? (
          <OverviewSkeleton />
        ) : (
          <>
            {/* Error Banner */}
            {error && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-400">
                <div className="flex items-center gap-2.5 font-medium">
                  <AlertCircle size={18} className="shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => {
                    setLoading(true);
                    setError("");
                    fetchDashboardData();
                  }}
                  className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-rose-700"
                >
                  Try again
                </button>
              </div>
            )}

            {/* ================= KPI STATS GRID ================= */}
            <section className="space-y-4">
              <div className="flex items-end justify-between border-b border-dashed border-slate-200 pb-3 dark:border-slate-800">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900 dark:text-white">
                    Operations <span className="italic font-normal">Pulse</span>
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Real-time workload metrics across services and repair requests
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700 sm:p-6"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {item.title}
                        </p>

                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${item.color}`}
                        >
                          <Icon size={18} />
                        </div>
                      </div>

                      <h3 className="mt-3 font-mono text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        {item.value}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {item.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ================= QUICK ACTIONS ================= */}
            <section className="grid gap-5 md:grid-cols-2">
              <Link
                href="/dashboard/technician/my-services"
                className="group flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-600/15 transition-transform duration-200 group-hover:scale-105 dark:bg-blue-950/60 dark:text-blue-400 dark:ring-blue-500/20">
                    <Wrench size={22} />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      Manage My Services
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      Review listings, adjust rates, and toggle live customer booking availability.
                    </p>
                  </div>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all group-hover:bg-slate-900 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-blue-600">
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </Link>

              <Link
                href="/dashboard/technician/requests"
                className="group flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/15 transition-transform duration-200 group-hover:scale-105 dark:bg-indigo-950/60 dark:text-indigo-400 dark:ring-indigo-500/20">
                    <ClipboardList size={22} />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                      Job Requests & Dispatch
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      Accept incoming repairs, start servicing, and finalize billings.
                    </p>
                  </div>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all group-hover:bg-slate-900 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-indigo-600">
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            </section>

            {/* ================= RECENT ACTIVITY ================= */}
            <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/60">
                <div>
                  <h2 className="font-serif text-lg font-normal tracking-tight text-slate-900 dark:text-white">
                    Recent <span className="italic">Activity</span>
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Latest customer booking dispatches and status changes
                  </p>
                </div>

                <Link
                  href="/dashboard/technician/requests"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <span>View All</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    <TrendingUp size={24} />
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                    No recent activity
                  </h3>

                  <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                    Customer booking requests and job updates will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking._id}
                      className="flex flex-col justify-between gap-3 px-6 py-4 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center dark:hover:bg-slate-800/40"
                    >
                      <div className="space-y-1 min-w-0">
                        <h3 className="truncate font-semibold text-slate-900 dark:text-white text-sm">
                          {booking.serviceTitle}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <User size={12} className="text-blue-600 dark:text-blue-400" />
                            <span>Customer:</span>
                            <strong className="font-medium text-slate-700 dark:text-slate-300">
                              {booking.customerName}
                            </strong>
                          </span>

                          <span className="text-slate-300 dark:text-slate-700">•</span>

                          <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                            <CalendarDays size={12} className="text-slate-400" />
                            {new Date(booking.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize shrink-0 ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                            booking.status
                          )}`}
                        />
                        {booking.status.replace("-", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
