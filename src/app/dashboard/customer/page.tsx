
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
} from "lucide-react";

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
      setLoading(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        "http://localhost:5000/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load bookings."
        );
      }

      setBookings(result.bookings || []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchBookings();
    }
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
        return "bg-blue-100 text-blue-700";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "in-progress":
        return "bg-purple-100 text-purple-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-gray-600">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Welcome */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {session?.user?.name || "Customer"}!
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your repair bookings from your dashboard.
            </p>
          </div>

          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            icon={<CalendarDays size={22} />}
          />

          <StatCard
            title="Pending Requests"
            value={requestedCount}
            icon={<Clock size={22} />}
          />

          <StatCard
            title="Completed"
            value={completedCount}
            icon={<CheckCircle size={22} />}
          />

          <StatCard
            title="Cancelled"
            value={cancelledCount}
            icon={<XCircle size={22} />}
          />
        </div>

        {/* Quick Action */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-blue-600 p-6 text-white">
          <div>
            <h2 className="text-xl font-bold">
              Need a Repair Service?
            </h2>

            <p className="mt-1 text-sm text-blue-100">
              Find a suitable technician for your repair needs.
            </p>
          </div>

          <Link
            href="/services"
            className="flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-blue-600 hover:bg-blue-50"
          >
            Browse Services
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/dashboard/customer/my-bookings"
            className="mt-3 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800"
          >
            View My Bookings
            <ArrowRight size={18} />
          </Link>

        </div>

        {/* Recent Bookings */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            My Recent Bookings
          </h2>

          <span className="text-sm text-gray-500">
            {bookings.length} Total
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center">
            <Package
              size={45}
              className="mx-auto mb-4 text-gray-400"
            />

            <h3 className="text-xl font-semibold text-gray-800">
              No Bookings Yet
            </h3>

            <p className="mt-2 text-gray-500">
              Your repair service bookings will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center"
              >
                <img
                  src={booking.serviceImage}
                  alt={booking.serviceTitle}
                  className="h-24 w-full rounded-lg object-cover sm:w-32"
                />

                <div className="flex-1">
                  <span className="text-sm font-medium text-blue-600">
                    {booking.category}
                  </span>

                  <h3 className="mt-1 text-lg font-bold text-gray-900">
                    {booking.serviceTitle}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Technician: {booking.technicianName}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Preferred Date:{" "}
                    {new Date(
                      booking.preferredDate
                    ).toLocaleDateString()}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Base Price: ৳{booking.basePrice}
                    {booking.finalAmount !== undefined &&
                      ` | Final Amount: ৳${booking.finalAmount}`}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status.replace("-", " ")}
                  </span>

                  <p className="mt-2 text-sm text-gray-500">
                    Payment: {booking.paymentStatus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">
          {title}
        </p>

        <span className="text-blue-600">{icon}</span>
      </div>

      <p className="mt-3 text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}
