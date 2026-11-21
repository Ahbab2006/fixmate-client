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
  Wrench,
  AlertCircle,
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

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "accepted":
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
      case "in-progress":
        return {
          pill: "bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900/60",
          dot: "bg-indigo-500",
        };
      case "completed":
        return {
          pill: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/60",
          dot: "bg-emerald-500",
        };
      default:
        return {
          pill: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/60",
          dot: "bg-amber-500",
        };
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
    return <RequestsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ================= EDITORIAL TOP BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-500/10 blur-[80px] dark:bg-blue-600/15" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-600/10" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
                <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
                <span className="font-mono text-[11px] uppercase tracking-wider">Field Operations</span>
              </div>
              <h1 className="mt-3 font-serif text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Job Requests & <span className="italic">Dispatch</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review incoming client bookings, manage on-site repairs, and finalize service billing.
              </p>
            </div>

            <button
              onClick={() => {
                setLoading(true);
                fetchBookings();
              }}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 sm:self-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <RefreshCw size={14} />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>

        {/* ================= KPI SUMMARY CARDS ================= */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            subtitle="All assigned requests"
            icon={<CalendarDays size={18} />}
            accent="bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
          />

          <StatCard
            title="New Requests"
            value={requestedCount}
            subtitle="Awaiting response"
            icon={<Clock size={18} />}
            accent="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
          />

          <StatCard
            title="Active Jobs"
            value={activeCount}
            subtitle="Accepted / In progress"
            icon={<Wrench size={18} />}
            accent="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
          />

          <StatCard
            title="Completed"
            value={completedCount}
            subtitle="Successfully finalized"
            icon={<CheckCircle size={18} />}
            accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          />
        </div>

        {/* ================= STATUS FILTER TABS ================= */}
        <div className="inline-flex flex-wrap gap-1.5 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          {filterTabs.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  active
                    ? "bg-slate-900 text-white shadow-sm dark:bg-blue-600"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
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
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <CalendarDays size={26} />
            </div>

            <h2 className="mt-4 font-serif text-xl font-normal text-slate-900 dark:text-white">
              No Booking Requests Yet
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              When customers schedule services from your published catalog, incoming requests will appear here.
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <CalendarDays size={26} />
            </div>

            <h2 className="mt-4 font-serif text-xl font-normal text-slate-900 dark:text-white">
              No Matching Bookings
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              There are currently no requests with status &ldquo;{filterTabs.find((t) => t.value === statusFilter)?.label}&rdquo;.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const statusStyle = getStatusBadge(booking.status);

              return (
                <div
                  key={booking._id}
                  className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
                >
                  <div className="grid md:grid-cols-[260px_1fr] lg:grid-cols-[290px_1fr]">
                    {/* Service Image Column */}
                    <div className="relative min-h-[220px] overflow-hidden bg-slate-100 md:min-h-full dark:bg-slate-800">
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent md:hidden" />
                      <span className="absolute top-4 left-4 rounded-full border border-white/40 bg-white/95 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200">
                        {booking.category}
                      </span>
                    </div>

                    {/* Job Details Column */}
                    <div className="flex flex-col justify-between p-6 sm:p-7">
                      <div>
                        {/* Title & Status Bar */}
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                              {booking.category}
                            </span>

                            <h2 className="mt-1 font-serif text-xl font-normal tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                              {booking.serviceTitle}
                            </h2>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider ${statusStyle.pill}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                            />
                            {booking.status.replace("-", " ")}
                          </span>
                        </div>

                        {/* Customer Information Grid */}
                        <div className="mt-5 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-950/50">
                          <div className="flex items-start gap-2.5">
                            <User
                              size={15}
                              className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                            />
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Customer Name
                              </p>
                              <p className="mt-0.5 font-semibold text-slate-900 dark:text-slate-100">
                                {booking.customerName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <Phone
                              size={15}
                              className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                            />
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Contact Number
                              </p>
                              <p className="mt-0.5 font-semibold text-slate-800 dark:text-slate-200">
                                {booking.customerPhone}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <Mail
                              size={15}
                              className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
                            />
                            <div className="min-w-0">
                              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Email Address
                              </p>
                              <p className="mt-0.5 truncate font-medium text-slate-700 dark:text-slate-300">
                                {booking.customerEmail}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <CalendarDays
                              size={15}
                              className="mt-0.5 shrink-0 text-sky-600 dark:text-sky-400"
                            />
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Scheduled Date
                              </p>
                              <p className="mt-0.5 font-mono font-semibold text-slate-800 dark:text-slate-200">
                                {new Date(
                                  booking.preferredDate
                                ).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 sm:col-span-2 border-t border-slate-200/50 pt-2.5 dark:border-slate-800/80">
                            <MapPin
                              size={15}
                              className="mt-0.5 shrink-0 text-rose-500 dark:text-rose-400"
                            />
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Dispatch Location
                              </p>
                              <p className="mt-0.5 font-medium text-slate-800 dark:text-slate-200">
                                {booking.address}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Problem Description */}
                        <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
                          <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <FileText size={13} className="text-blue-600 dark:text-blue-400" />
                            <span>Reported Issue</span>
                          </div>

                          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            {booking.problemDescription}
                          </p>
                        </div>

                        {/* Pricing & Billing Strip */}
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                          <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800/60">
                            <DollarSign size={13} className="text-slate-400" />
                            <span className="text-slate-500 dark:text-slate-400">Base Price:</span>
                            <strong className="font-mono font-bold text-slate-900 dark:text-white">
                              ${booking.basePrice}
                            </strong>
                          </div>

                          {booking.finalAmount !== undefined && (
                            <div className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200/80 bg-blue-50/70 px-3 py-1.5 dark:border-blue-900/60 dark:bg-blue-950/50">
                              <DollarSign size={13} className="text-blue-600 dark:text-blue-400" />
                              <span className="text-blue-700 dark:text-blue-300">Final Settled:</span>
                              <strong className="font-mono font-bold text-blue-700 dark:text-blue-400">
                                ${booking.finalAmount}
                              </strong>
                            </div>
                          )}

                          <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800/60">
                            <span className="text-slate-500 dark:text-slate-400">Payment:</span>
                            <span
                              className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${
                                booking.paymentStatus === "paid"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              {booking.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Workflow Actions */}
                      <div className="mt-5 border-t border-dashed border-slate-200 pt-5 dark:border-slate-800">
                        {booking.status === "requested" && (
                          <div className="flex flex-wrap gap-2.5">
                            <button
                              onClick={() =>
                                updateStatus(booking._id, "accepted")
                              }
                              disabled={updatingId === booking._id}
                              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                            >
                              <CheckCircle size={15} />
                              <span>Accept Request</span>
                            </button>

                            <button
                              onClick={() => {
                                setBookingToReject(booking);
                                setRejectError(null);
                              }}
                              disabled={updatingId === booking._id}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/80 px-5 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700 disabled:opacity-50 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60"
                            >
                              <XCircle size={15} />
                              <span>Decline</span>
                            </button>
                          </div>
                        )}

                        {booking.status === "accepted" && (
                          <button
                            onClick={() =>
                              updateStatus(booking._id, "in-progress")
                            }
                            disabled={updatingId === booking._id}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                          >
                            <Play size={14} />
                            <span>Initiate Repair Work</span>
                          </button>
                        )}

                        {booking.status === "in-progress" && (
                          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:flex-row sm:items-end dark:border-slate-800 dark:bg-slate-950/50">
                            <div className="flex-1 sm:max-w-xs">
                              <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                Final Settled Amount ($)
                              </label>

                              <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                  <DollarSign size={14} />
                                </div>
                                <input
                                  type="number"
                                  min="1"
                                  placeholder="e.g. 95"
                                  value={finalAmounts[booking._id] || ""}
                                  onChange={(e) =>
                                    setFinalAmounts((prev) => ({
                                      ...prev,
                                      [booking._id]: e.target.value,
                                    }))
                                  }
                                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-9 font-mono text-xs font-semibold text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500"
                                />
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                updateStatus(booking._id, "completed")
                              }
                              disabled={updatingId === booking._id}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <CheckCircle size={15} />
                              <span>Complete & Settle</span>
                            </button>
                          </div>
                        )}

                        {booking.status === "completed" && (
                          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle size={16} />
                            <span>Repair finalized and service record archived.</span>
                          </div>
                        )}

                        {booking.status === "rejected" && (
                          <div className="inline-flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-400">
                            <XCircle size={15} />
                            <span>Booking request was declined by technician.</span>
                          </div>
                        )}

                        {booking.status === "cancelled" && (
                          <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                            <AlertCircle size={15} />
                            <span>Customer cancelled this booking before dispatch.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
        title="Decline Repair Request"
        description={
          bookingToReject
            ? `Are you sure you wish to decline the request for "${bookingToReject.serviceTitle}" from ${bookingToReject.customerName}? The customer will be informed promptly.`
            : ""
        }
        confirmText="Yes, Decline Request"
        cancelText="Cancel"
        loadingText="Declining..."
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
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}>
          {icon}
        </span>
      </div>

      <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}

function RequestsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 transition-colors duration-200 dark:bg-slate-950 animate-pulse">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="h-36 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90"
            />
          ))}
        </div>
        <div className="h-12 w-96 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90" />
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
