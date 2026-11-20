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
  Sparkles,
  Mail,
  FileText,
  DollarSign,
  Play,
  Loader2,
  Wrench,
} from "lucide-react";
import { apiUrl } from "@/lib/api";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bookingToReject, setBookingToReject] = useState<Booking | null>(null);
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
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
        apiUrl("/api/bookings/technician"),
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

  const confirmRejectRequest = async () => {
    if (!bookingToReject || isRejecting) return;

    try {
      setIsRejecting(true);
      setUpdatingId(bookingToReject._id);
      setRejectError(null);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        apiUrl(`/api/bookings/${bookingToReject._id}/status`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "rejected" }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update booking status."
        );
      }

      toast.success("Booking rejected successfully!");
      setBookingToReject(null);
      await fetchBookings();
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Something went wrong.";
      setRejectError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsRejecting(false);
      setUpdatingId(null);
    }
  };

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
        apiUrl(`/api/bookings/${bookingId}/status`),
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

  const getStatusDot = (status: Booking["status"]) => {
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

  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === statusFilter);

  const filterTabs = [
    { label: "All", value: "all", count: bookings.length },
    { label: "Requested", value: "requested", count: requestedCount },
    {
      label: "Accepted",
      value: "accepted",
      count: bookings.filter((b) => b.status === "accepted").length,
    },
    {
      label: "In Progress",
      value: "in-progress",
      count: bookings.filter((b) => b.status === "in-progress").length,
    },
    { label: "Completed", value: "completed", count: completedCount },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="rounded-3xl border border-slate-200/80 bg-white px-10 py-12 text-center shadow-sm">
          <Loader2 className="mx-auto animate-spin text-blue-600" size={38} />
          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading booking requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ================= TOP DARK PREMIUM BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-600/25 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <Sparkles size={13} className="text-blue-400" />
                <span>Job Dispatch</span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Booking{" "}
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  Requests
                </span>
              </h1>
              <p className="mt-1.5 text-sm text-slate-300">
                Review incoming customer repair requests, update job progress,
                and finalize service billing.
              </p>
            </div>

            <button
              onClick={fetchBookings}
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
            subtitle="All assigned requests"
            icon={<CalendarDays size={21} />}
            accent="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="New Requests"
            value={requestedCount}
            subtitle="Awaiting confirmation"
            icon={<Clock size={21} />}
            accent="bg-amber-50 text-amber-600"
          />

          <StatCard
            title="Active Jobs"
            value={activeCount}
            subtitle="Accepted or in progress"
            icon={<Wrench size={21} />}
            accent="bg-indigo-50 text-indigo-600"
          />

          <StatCard
            title="Completed"
            value={completedCount}
            subtitle="Successfully finished"
            icon={<CheckCircle size={21} />}
            accent="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* ================= STATUS FILTER TABS ================= */}
        <div className="inline-flex flex-wrap gap-2 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm">
          {filterTabs.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ================= BOOKING LIST ================= */}
        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <CalendarDays size={32} />
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-slate-900">
              No Booking Requests
            </h2>

            <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
              New customer service requests will appear here as soon as clients
              book your services.
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <CalendarDays size={32} />
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-slate-900">
              No Requests Found
            </h2>

            <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
              No bookings found with status &quot;
              {filterTabs.find((t) => t.value === statusFilter)?.label}&quot;.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5"
              >
                <div className="grid md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr]">
                  {/* Service Image */}
                  <div className="relative h-56 overflow-hidden bg-slate-100 md:h-full">
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceTitle}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent md:hidden" />
                    <span className="absolute top-4 left-4 rounded-full border border-white/40 bg-white/95 px-3.5 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-md">
                      {booking.category}
                    </span>
                  </div>

                  {/* Job Details */}
                  <div className="flex flex-col justify-between p-6 sm:p-7">
                    <div>
                      {/* Title & Status */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            {booking.category}
                          </span>

                          <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
                            {booking.serviceTitle}
                          </h2>
                        </div>

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
                      </div>

                      {/* Customer Information Grid */}
                      <div className="mt-5 grid gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm sm:grid-cols-2">
                        <div className="flex items-start gap-2.5">
                          <User
                            size={16}
                            className="mt-0.5 shrink-0 text-blue-600"
                          />
                          <div>
                            <p className="text-xs font-medium text-slate-400">
                              Customer
                            </p>
                            <p className="font-bold text-slate-900">
                              {booking.customerName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <Phone
                            size={16}
                            className="mt-0.5 shrink-0 text-emerald-600"
                          />
                          <div>
                            <p className="text-xs font-medium text-slate-400">
                              Phone Number
                            </p>
                            <p className="font-bold text-slate-800">
                              {booking.customerPhone}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <Mail
                            size={16}
                            className="mt-0.5 shrink-0 text-indigo-600"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-400">
                              Email Address
                            </p>
                            <p className="truncate font-semibold text-slate-700">
                              {booking.customerEmail}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <CalendarDays
                            size={16}
                            className="mt-0.5 shrink-0 text-sky-600"
                          />
                          <div>
                            <p className="text-xs font-medium text-slate-400">
                              Preferred Date
                            </p>
                            <p className="font-bold text-slate-800">
                              {new Date(
                                booking.preferredDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 sm:col-span-2">
                          <MapPin
                            size={16}
                            className="mt-0.5 shrink-0 text-rose-500"
                          />
                          <div>
                            <p className="text-xs font-medium text-slate-400">
                              Service Address
                            </p>
                            <p className="font-semibold text-slate-800">
                              {booking.address}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Problem Description */}
                      <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white p-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                          <FileText size={14} className="text-blue-600" />
                          <span>Customer Problem</span>
                        </div>

                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                          {booking.problemDescription}
                        </p>
                      </div>

                      {/* Pricing & Payment Strip */}
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                        <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100/80 px-3.5 py-1.5">
                          <DollarSign size={15} className="text-slate-500" />
                          <span className="text-slate-600">Base Price:</span>
                          <strong className="font-extrabold text-slate-900">
                            ${booking.basePrice}
                          </strong>
                        </div>

                        {booking.finalAmount !== undefined && (
                          <div className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-1.5">
                            <DollarSign size={15} className="text-blue-600" />
                            <span className="text-blue-700">Final Amount:</span>
                            <strong className="font-extrabold text-blue-700">
                              ${booking.finalAmount}
                            </strong>
                          </div>
                        )}

                        <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100/80 px-3.5 py-1.5">
                          <span className="text-slate-600">Payment:</span>
                          <span
                            className={`font-bold capitalize ${
                              booking.paymentStatus === "paid"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Workflow Actions */}
                    <div className="mt-5 border-t border-slate-100 pt-5">
                      {booking.status === "requested" && (
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() =>
                              updateStatus(booking._id, "accepted")
                            }
                            disabled={updatingId === booking._id}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <CheckCircle size={17} />
                            Accept Request
                          </button>

                          <button
                            onClick={() => {
                              setBookingToReject(booking);
                              setRejectError(null);
                            }}
                            disabled={updatingId === booking._id}
                            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-6 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-600 hover:text-white disabled:opacity-50"
                          >
                            <XCircle size={17} />
                            Reject
                          </button>
                        </div>
                      )}

                      {booking.status === "accepted" && (
                        <button
                          onClick={() =>
                            updateStatus(booking._id, "in-progress")
                          }
                          disabled={updatingId === booking._id}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
                        >
                          <Play size={16} />
                          Start Repair
                        </button>
                      )}

                      {booking.status === "in-progress" && (
                        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:flex-row sm:items-end">
                          <div className="flex-1 sm:max-w-xs">
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                              Final Amount ($)
                            </label>

                            <div className="relative">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <DollarSign size={16} />
                              </div>
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
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-9 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              updateStatus(booking._id, "completed")
                            }
                            disabled={updatingId === booking._id}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <CheckCircle size={17} />
                            Complete Job
                          </button>
                        </div>
                      )}

                      {booking.status === "completed" && (
                        <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600">
                          <CheckCircle size={18} />
                          <span>Repair completed successfully.</span>
                        </div>
                      )}

                      {booking.status === "rejected" && (
                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600">
                          <XCircle size={17} />
                          <span>This booking request was rejected.</span>
                        </div>
                      )}

                      {booking.status === "cancelled" && (
                        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                          <XCircle size={17} />
                          <span>Customer cancelled this booking.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Request Rejection */}
      <ConfirmationModal
        isOpen={!!bookingToReject}
        onClose={() => {
          if (!isRejecting) {
            setBookingToReject(null);
            setRejectError(null);
          }
        }}
        onConfirm={confirmRejectRequest}
        title="Reject Repair Request"
        description={
          bookingToReject
            ? `Are you sure you want to reject the repair request for "${bookingToReject.serviceTitle}" from ${bookingToReject.customerName}? The customer will be notified of this rejection.`
            : ""
        }
        confirmText="Yes, Reject Request"
        cancelText="Cancel"
        loadingText="Rejecting..."
        isLoading={isRejecting}
        error={rejectError}
        variant="danger"
      />
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