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
  Loader2,
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20";
      case "rejected":
      case "cancelled":
        return "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20";
      case "in-progress":
        return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20";
      case "completed":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";
      default:
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-blue-500";
      case "rejected":
      case "cancelled":
        return "bg-rose-500";
      case "in-progress":
        return "bg-indigo-500";
      case "completed":
        return "bg-emerald-500";
      default:
        return "bg-amber-500";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="rounded-3xl border border-slate-200/80 bg-white px-10 py-12 text-center shadow-sm">
          <Loader2 className="mx-auto animate-spin text-blue-600" size={38} />
          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ================= TOP DARK PREMIUM WELCOME BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-600/25 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <Sparkles size={13} className="text-blue-400" />
                <span>Customer Overview</span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Welcome,{" "}
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  {session?.user?.name || "Customer"}!
                </span>
              </h1>
              <p className="mt-1.5 text-sm text-slate-300">
                Manage your home repair requests, track technician progress,
                and book new services effortlessly.
              </p>
            </div>

            <button
              onClick={() => {
                setLoading(true);
                fetchBookings();
              }}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-blue-600 sm:self-auto"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* ================= KPI SUMMARY CARDS ================= */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            subtitle="All repair requests"
            icon={<CalendarDays size={21} />}
            accent="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Pending Requests"
            value={requestedCount}
            subtitle="Awaiting technician"
            icon={<Clock size={21} />}
            accent="bg-amber-50 text-amber-600"
          />

          <StatCard
            title="Completed"
            value={completedCount}
            subtitle="Successfully resolved"
            icon={<CheckCircle size={21} />}
            accent="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Cancelled"
            value={cancelledCount}
            subtitle="Cancelled bookings"
            icon={<XCircle size={21} />}
            accent="bg-rose-50 text-rose-600"
          />
        </div>

        {/* ================= QUICK ACTION BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white shadow-lg sm:p-8">
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-blue-500/25 blur-2xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30 sm:flex">
                <Wrench size={22} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  Need a Repair Service?
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Browse verified home specialists and schedule a technician for
                  your repair needs today.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-500"
              >
                Browse Services
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/dashboard/customer/my-bookings"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-white/15"
              >
                View My Bookings
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* ================= RECENT BOOKINGS SECTION ================= */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                My Recent Bookings
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Your latest 5 service requests and their live status
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-600/15">
              {bookings.length} Total
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Package size={32} />
              </div>

              <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                No Bookings Yet
              </h3>

              <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
                Your repair service bookings will appear here once you submit
                your first request.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking._id}
                  className="group flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5 sm:flex-row sm:items-center sm:p-6"
                >
                  {/* Service Thumbnail */}
                  <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:w-36">
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceTitle}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-bold text-blue-600">
                      {booking.category}
                    </span>

                    <h3 className="text-lg font-extrabold text-slate-900 transition-colors group-hover:text-blue-600">
                      {booking.serviceTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1 text-xs font-medium text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <UserCheck size={14} className="text-blue-600" />
                        Technician:{" "}
                        <strong className="font-semibold text-slate-700">
                          {booking.technicianName}
                        </strong>
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-indigo-600" />
                        Preferred Date:{" "}
                        <strong className="font-semibold text-slate-700">
                          {new Date(
                            booking.preferredDate
                          ).toLocaleDateString()}
                        </strong>
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <DollarSign size={14} className="text-emerald-600" />
                        Base Price:{" "}
                        <strong className="font-bold text-slate-800">
                          ${booking.basePrice}
                        </strong>
                        {booking.finalAmount !== undefined && (
                          <span className="text-slate-700">
                            {" "}
                            | Final:{" "}
                            <strong className="font-extrabold text-blue-600">
                              ${booking.finalAmount}
                            </strong>
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Status & Payment Column */}
                  <div className="flex flex-row items-center justify-between border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
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

                    <p className="mt-0 text-xs font-semibold text-slate-500 sm:mt-2.5">
                      Payment:{" "}
                      <span
                        className={`capitalize ${
                          booking.paymentStatus === "paid"
                            ? "font-bold text-emerald-600"
                            : "text-slate-700"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{title}</p>

        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${accent}`}
        >
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-extrabold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}