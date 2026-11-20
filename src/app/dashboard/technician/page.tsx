
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
      setLoading(true);
      setError("");

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
    fetchDashboardData();
  }, []);

  const pendingServices = services.filter(
    (service) => service.approvalStatus === "pending"
  ).length;

  const approvedServices = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length;

  const stats = [
    {
      title: "Total Services",
      value: services.length,
      icon: Wrench,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending Services",
      value: pendingServices,
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Approved Services",
      value: approvedServices,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Booking Requests",
      value: bookings.length,
      icon: ClipboardList,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Welcome Section */}
        <section className="flex flex-col justify-between gap-5 rounded-2xl bg-blue-600 p-6 text-white shadow-sm sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-sm font-medium text-blue-100">
              Technician Workspace
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Welcome Back!
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
              Manage your repair services, track booking requests
              and keep your customers updated.
            </p>
          </div>

          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            <Plus size={18} />
            Add New Service
          </Link>
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your real-time workspace summary.
              </p>
            </div>

            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
              <button
                onClick={fetchDashboardData}
                className="ml-2 font-semibold underline"
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
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {item.title}
                      </p>

                      <h3 className="mt-3 text-3xl font-bold text-slate-800">
                        {loading ? "..." : item.value}
                      </h3>
                    </div>

                    <div className={`rounded-xl p-3 ${item.color}`}>
                      <Icon size={23} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="mb-5 text-xl font-bold text-slate-800">
            Quick Actions
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Link
              href="/dashboard/technician/my-services"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <Wrench size={24} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Manage My Services
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    View, edit and manage your services.
                  </p>
                </div>
              </div>

              <ArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
            </Link>

            <Link
              href="/dashboard/technician/requests"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-purple-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                  <ClipboardList size={24} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Booking Requests
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Review and manage customer requests.
                  </p>
                </div>
              </div>

              <ArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-purple-600" />
            </Link>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recent Activity
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest booking activities.
              </p>
            </div>

            <CalendarDays className="text-slate-400" size={23} />
          </div>

          {loading ? (
            <p className="py-12 text-center text-sm text-slate-500">
              Loading activities...
            </p>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                <TrendingUp size={30} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-700">
                No recent activity
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Your booking activities will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-slate-100">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking._id}
                  className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {booking.serviceTitle}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Customer: {booking.customerName}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                    {booking.status}
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
