"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  RefreshCw,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Package,
  Sparkles,
  UserCheck,
  DollarSign,
  Wrench,
} from "lucide-react";
import { apiUrl } from "@/lib/api";

interface Booking {
  _id: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  preferredDate: string;
  status: string;
  finalAmount?: number;
  paymentStatus: string;
  createdAt: string;
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="h-44 w-full rounded-3xl bg-slate-200 dark:bg-slate-900" />

      {/* KPI Cards Skeleton */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-8 w-16 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Callout Skeleton */}
      <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-900" />

      {/* Recent Bookings Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-44 rounded bg-slate-200 dark:bg-slate-800" />
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900"
          />
        ))}
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const { data: session } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(apiUrl("/api/bookings/my-bookings"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load bookings.");
      }

      setBookings(result.bookings || []);
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
          await fetchBookings();
        }
      })();
    }

    return () => {
      isMounted = false;
    };
  }, [session, fetchBookings]);

  const requestedCount = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return {
          bg: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-500/25",
          dot: "bg-blue-500",
          label: "Accepted",
        };
      case "in-progress":
        return {
          bg: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20 dark:bg-indigo-950/50 dark:text-indigo-300 dark:ring-indigo-500/25",
          dot: "bg-indigo-500",
          label: "In Progress",
        };
      case "completed":
        return {
          bg: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/25",
          dot: "bg-emerald-500",
          label: "Completed",
        };
      case "rejected":
      case "cancelled":
        return {
          bg: "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-500/25",
          dot: "bg-rose-500",
          label: status === "rejected" ? "Rejected" : "Cancelled",
        };
      default:
        return {
          bg: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-500/25",
          dot: "bg-amber-500",
          label: "Pending Review",
        };
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <OverviewSkeleton />;
  }

  const displayName = session?.user?.name || "Customer";

  return (
    <div className="space-y-8">
      {/* ================= TOP EDITORIAL BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-600/25 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md">
              <Sparkles size={13} className="text-blue-400" />
              <span>Customer Workspace</span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Welcome back,{" "}
              <span className="font-editorial italic font-normal text-blue-400">
                {displayName}
              </span>
            </h1>

            <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
              Manage your home repair requests, track technician progress, and
              explore approved repair services with transparent pricing.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchBookings();
            }}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-blue-600 active:scale-[0.98] sm:self-auto"
            aria-label="Refresh dashboard data"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ================= KPI SUMMARY CARDS ================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          subtitle="All recorded service requests"
          icon={<CalendarDays size={20} />}
          accent="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
        />

        <StatCard
          title="Pending Requests"
          value={requestedCount}
          subtitle="Awaiting technician review"
          icon={<Clock size={20} />}
          accent="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
        />

        <StatCard
          title="Completed"
          value={completedCount}
          subtitle="Successfully resolved repairs"
          icon={<CheckCircle size={20} />}
          accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
        />

        <StatCard
          title="Cancelled"
          value={cancelledCount}
          subtitle="Cancelled bookings"
          icon={<XCircle size={20} />}
          accent="bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
        />
      </div>

      {/* ================= QUICK ACTION CALLOUT ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white shadow-md sm:p-8">
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-blue-500/20 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30 sm:flex">
              <Wrench size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Need an appliance or device repaired?
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Browse our admin-reviewed catalog of skilled specialists and
                request a service visit with transparent starting rates.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/services"
              className="group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98]"
            >
              <span>Browse Services</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/dashboard/customer/my-bookings"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-white/15"
            >
              <span>View All Bookings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= RECENT BOOKINGS SECTION ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
              Recent Repair Requests
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing your latest 5 bookings and current fulfillment status
            </p>
          </div>

          <Link
            href="/dashboard/customer/my-bookings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span>View Full History ({bookings.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900/60 sm:py-20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Package size={28} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No Bookings Yet
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Your service requests will appear here once you schedule your first
              repair.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              <Wrench size={15} />
              <span>Explore Services</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            {bookings.slice(0, 5).map((booking) => {
              const badge = getStatusBadge(booking.status);

              return (
                <div
                  key={booking._id}
                  className="group flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40 sm:flex-row sm:items-center sm:p-5"
                >
                  {/* Service Thumbnail */}
                  <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 sm:h-20 sm:w-28">
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceTitle}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {booking.category}
                      </span>
                    </div>

                    <h3 className="truncate text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {booking.serviceTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <UserCheck size={13} className="text-slate-400" />
                        <strong className="font-semibold text-slate-700 dark:text-slate-200">
                          {booking.technicianName}
                        </strong>
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={13} className="text-slate-400" />
                        <span>{formatDate(booking.preferredDate)}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 font-mono">
                        <DollarSign size={13} className="text-slate-400" />
                        <strong className="font-bold text-slate-800 dark:text-slate-200">
                          ${booking.basePrice}
                        </strong>
                        {booking.finalAmount !== undefined && (
                          <span className="text-slate-700 dark:text-slate-300">
                            {" "}(Final:{" "}
                            <strong className="font-bold text-blue-600 dark:text-blue-400">
                              ${booking.finalAmount}
                            </strong>
                            )
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Status & Payment Column */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badge.bg}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>

                    <span
                      className={`text-[11px] font-semibold sm:mt-2 ${
                        booking.paymentStatus === "paid"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      Payment: <span className="capitalize">{booking.paymentStatus}</span>
                    </span>
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

function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </p>

        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}
        >
          {icon}
        </span>
      </div>

      <p className="mt-3 text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{subtitle}</p>
    </div>
  );
}
