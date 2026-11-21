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
  Loader2,
  AlertCircle,
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
  createdAt: string;
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
        err instanceof Error
          ? err.message
          : "Something went wrong."
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
      title: "Total Services",
      subtitle: "Published service packages",
      value: services.length,
      icon: Wrench,
      color: "bg-blue-50 text-blue-600 ring-1 ring-blue-600/15 dark:bg-blue-950/60 dark:text-blue-400 dark:ring-blue-500/20",
    },
    {
      title: "Pending Services",
      subtitle: "Awaiting admin approval",
      value: pendingServices,
      icon: Clock,
      color: "bg-amber-50 text-amber-600 ring-1 ring-amber-600/15 dark:bg-amber-950/60 dark:text-amber-400 dark:ring-amber-500/20",
    },
    {
      title: "Approved Services",
      subtitle: "Live on marketplace",
      value: approvedServices,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/15 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-500/20",
    },
    {
      title: "Booking Requests",
      subtitle: "Total customer jobs",
      value: bookings.length,
      icon: ClipboardList,
      color: "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600/15 dark:bg-indigo-950/60 dark:text-indigo-400 dark:ring-indigo-500/20",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-12 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ================= TOP DARK PREMIUM WELCOME BANNER ================= */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8 dark:border dark:border-slate-800">
          <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-600/25 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <Sparkles size={13} className="text-blue-400" />
                <span>Technician Workspace</span>
              </div>

              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Welcome{" "}
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  Back!
                </span>
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                Manage your repair services, track incoming booking requests,
                and deliver top-rated service to your customers.
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
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-white/15 disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>

              <Link
                href="/dashboard/technician/add-service"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-500"
              >
                <Plus size={18} />
                Add New Service
              </Link>
            </div>
          </div>
        </section>

        {/* ================= OVERVIEW & KPI CARDS ================= */}
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Overview
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Your real-time workspace summary and service metrics
            </p>
          </div>

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

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {item.title}
                    </p>

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${item.color}`}
                    >
                      <Icon size={21} />
                    </div>
                  </div>

                  <h3 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
                    {loading ? "..." : item.value}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{item.subtitle}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= QUICK ACTIONS ================= */}
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Quick Actions
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Jump directly to your catalog or active repair requests
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Link
              href="/dashboard/technician/my-services"
              className="group flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-600/15 transition-transform duration-300 group-hover:scale-110 dark:bg-blue-950/60 dark:text-blue-400 dark:ring-blue-500/20">
                  <Wrench size={24} />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    Manage My Services
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    View, edit pricing, and control availability of your
                    listings.
                  </p>
                </div>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-blue-600">
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </Link>

            <Link
              href="/dashboard/technician/requests"
              className="group flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600/15 transition-transform duration-300 group-hover:scale-110 dark:bg-indigo-950/60 dark:text-indigo-400 dark:ring-indigo-500/20">
                  <ClipboardList size={24} />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                    Booking Requests
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Accept new jobs, start repairs, and submit final billing.
                  </p>
                </div>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-indigo-600">
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </Link>
          </div>
        </section>

        {/* ================= RECENT ACTIVITY ================= */}
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-5 dark:border-slate-800 dark:bg-slate-900/60">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Recent Activity
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Your latest 5 customer booking updates
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <CalendarDays size={20} />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={32} />
              <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                Loading recent activities...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <TrendingUp size={28} />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                No recent activity
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your customer booking activities will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking._id}
                  className="flex flex-col justify-between gap-3 px-6 py-4 transition-colors hover:bg-slate-50/90 sm:flex-row sm:items-center dark:hover:bg-slate-800/50"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {booking.serviceTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <User size={13} className="text-blue-600 dark:text-blue-400" />
                        Customer:{" "}
                        <strong className="font-semibold text-slate-700 dark:text-slate-300">
                          {booking.customerName}
                        </strong>
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-slate-400 dark:text-slate-500" />
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold capitalize ${getStatusStyle(
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
      </div>
    </main>
  );
}