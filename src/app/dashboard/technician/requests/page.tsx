
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  RefreshCw,
  CalendarDays,
  MapPin,
  Phone,
  User,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface Booking {
  _id: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status:
    | "requested"
    | "accepted"
    | "rejected"
    | "in-progress"
    | "completed"
    | "cancelled";
  finalAmount?: number;
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
}

export default function TechnicianRequestsPage() {
  const { data: session } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [finalAmounts, setFinalAmounts] = useState<
    Record<string, string>
  >({});

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        "http://localhost:5000/api/bookings/technician",
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
          result.message || "Failed to load booking requests."
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

  const updateStatus = async (
    bookingId: string,
    status: "accepted" | "rejected" | "in-progress" | "completed"
  ) => {
    try {
      if (status === "completed") {
        const amount = Number(finalAmounts[bookingId]);

        if (!Number.isFinite(amount) || amount <= 0) {
          toast.error("Please enter a valid final amount.");
          return;
        }
      }

      setUpdatingId(bookingId);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      const body: {
        status: string;
        finalAmount?: number;
      } = { status };

      if (status === "completed") {
        body.finalAmount = Number(finalAmounts[bookingId]);
      }

      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update booking status."
        );
      }

      toast.success(`Booking ${status} successfully!`);

      await fetchBookings();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status: Booking["status"]) => {
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

  const requestedCount = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  const activeCount = bookings.filter(
    (booking) =>
      booking.status === "accepted" ||
      booking.status === "in-progress"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Booking Requests
            </h1>
            <p className="mt-2 text-gray-600">
              Manage customer requests and repair jobs.
            </p>
          </div>

          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 font-medium hover:bg-gray-100"
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
            title="New Requests"
            value={requestedCount}
            icon={<Clock size={22} />}
          />

          <StatCard
            title="Active Jobs"
            value={activeCount}
            icon={<User size={22} />}
          />

          <StatCard
            title="Completed"
            value={completedCount}
            icon={<CheckCircle size={22} />}
          />
        </div>

        {/* Booking List */}
        {bookings.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center">
            <CalendarDays
              size={45}
              className="mx-auto mb-4 text-gray-400"
            />

            <h2 className="text-xl font-semibold text-gray-800">
              No Booking Requests
            </h2>

            <p className="mt-2 text-gray-500">
              New customer requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <div className="grid md:grid-cols-[220px_1fr]">

                  {/* Service Image */}
                  <img
                    src={booking.serviceImage}
                    alt={booking.serviceTitle}
                    className="h-52 w-full object-cover md:h-full"
                  />

                  <div className="p-5 md:p-6">

                    {/* Service Details */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-sm font-medium text-blue-600">
                          {booking.category}
                        </span>

                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                          {booking.serviceTitle}
                        </h2>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {booking.status.replace("-", " ")}
                      </span>
                    </div>

                    {/* Customer Information */}
                    <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                      <p className="flex items-center gap-2">
                        <User size={17} />
                        {booking.customerName}
                      </p>

                      <p>
                        <strong>Email:</strong>{" "}
                        {booking.customerEmail}
                      </p>

                      <p className="flex items-center gap-2">
                        <Phone size={17} />
                        {booking.customerPhone}
                      </p>

                      <p className="flex items-center gap-2">
                        <CalendarDays size={17} />
                        {new Date(
                          booking.preferredDate
                        ).toLocaleDateString()}
                      </p>

                      <p className="flex items-center gap-2 sm:col-span-2">
                        <MapPin size={17} />
                        {booking.address}
                      </p>
                    </div>

                    {/* Problem Description */}
                    <div className="mt-5 rounded-lg bg-gray-50 p-4">
                      <p className="mb-1 font-semibold text-gray-800">
                        Customer Problem
                      </p>

                      <p className="text-sm text-gray-600">
                        {booking.problemDescription}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mt-4 flex flex-wrap gap-5 text-sm">
                      <p>
                        <strong>Base Price:</strong> ৳
                        {booking.basePrice}
                      </p>

                      {booking.finalAmount !== undefined && (
                        <p>
                          <strong>Final Amount:</strong> ৳
                          {booking.finalAmount}
                        </p>
                      )}

                      <p>
                        <strong>Payment:</strong>{" "}
                        <span className="capitalize">
                          {booking.paymentStatus}
                        </span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 border-t pt-5">

                      {booking.status === "requested" && (
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() =>
                              updateStatus(
                                booking._id,
                                "accepted"
                              )
                            }
                            disabled={updatingId === booking._id}
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            <CheckCircle size={17} />
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(
                                booking._id,
                                "rejected"
                              )
                            }
                            disabled={updatingId === booking._id}
                            className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            <XCircle size={17} />
                            Reject
                          </button>
                        </div>
                      )}

                      {booking.status === "accepted" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              booking._id,
                              "in-progress"
                            )
                          }
                          disabled={updatingId === booking._id}
                          className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          Start Repair
                        </button>
                      )}

                      {booking.status === "in-progress" && (
                        <div className="flex flex-wrap items-end gap-3">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              Final Amount (৳)
                            </label>

                            <input
                              type="number"
                              min="1"
                              placeholder="Enter final amount"
                              value={finalAmounts[booking._id] || ""}
                              onChange={(e) =>
                                setFinalAmounts((prev) => ({
                                  ...prev,
                                  [booking._id]: e.target.value,
                                }))
                              }
                              className="rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                          </div>

                          <button
                            onClick={() =>
                              updateStatus(
                                booking._id,
                                "completed"
                              )
                            }
                            disabled={updatingId === booking._id}
                            className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            Complete Job
                          </button>
                        </div>
                      )}

                      {booking.status === "completed" && (
                        <p className="font-medium text-green-600">
                          <CheckCircle
                            size={18}
                            className="mr-2 inline"
                          />
                          Repair completed successfully.
                        </p>
                      )}

                      {booking.status === "rejected" && (
                        <p className="font-medium text-red-600">
                          This booking request was rejected.
                        </p>
                      )}

                      {booking.status === "cancelled" && (
                        <p className="font-medium text-gray-500">
                          Customer cancelled this booking.
                        </p>
                      )}
                    </div>
                  </div>
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
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <span className="text-blue-600">{icon}</span>
      </div>

      <p className="mt-3 text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}
