"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  RefreshCw,
  CalendarDays,
  XCircle,
  Package,
  CreditCard,
  Sparkles,
  UserCheck,
  DollarSign,
  FileText,
  CheckCircle2,
  ClipboardList,
  Clock,
  ShieldCheck,
  Search,
  Wrench,
  X,
  RotateCcw,
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
  preferredDate: string;
  problemDescription: string;
  status: string;
  finalAmount?: number;
  paymentStatus: string;
  createdAt: string;
}

function MyBookingsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="h-44 w-full rounded-3xl bg-slate-200 dark:bg-slate-900" />

      {/* KPI Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-8 w-16 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Booking Cards Skeleton */}
      <div className="space-y-5">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900"
          />
        ))}
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const { data: session } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const [payingId, setPayingId] = useState<string | null>(null);

  // Client-side filter controls
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  const handlePayment = async (bookingId: string) => {
    try {
      setPayingId(bookingId);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        apiUrl("/api/payments/create-checkout-session"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookingId }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create payment session."
        );
      }

      if (!result.checkoutUrl) {
        throw new Error("Stripe checkout URL not found.");
      }

      window.location.assign(result.checkoutUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Payment failed."
      );
      setPayingId(null);
    }
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel || cancellingId) return;

    try {
      setCancellingId(bookingToCancel._id);
      setCancelError(null);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        apiUrl(`/api/bookings/${bookingToCancel._id}/cancel`),
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to cancel booking.");
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingToCancel._id
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

      toast.success("Booking cancelled successfully!");
      setBookingToCancel(null);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Something went wrong.";
      setCancelError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setCancellingId(null);
    }
  };

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

  const activeOrPendingCount = bookings.filter((b) =>
    ["requested", "accepted", "in-progress"].includes(b.status)
  ).length;

  const completedCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;

  // Filtered bookings calculation
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Status filtering
      if (statusFilter === "active") {
        if (!["requested", "accepted", "in-progress"].includes(b.status)) {
          return false;
        }
      } else if (statusFilter === "completed") {
        if (b.status !== "completed") return false;
      } else if (statusFilter === "cancelled") {
        if (!["cancelled", "rejected"].includes(b.status)) return false;
      }

      // Search query filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = b.serviceTitle?.toLowerCase().includes(q);
        const matchesCategory = b.category?.toLowerCase().includes(q);
        const matchesTech = b.technicianName?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesTech) return false;
      }

      return true;
    });
  }, [bookings, statusFilter, searchQuery]);

  if (loading) {
    return <MyBookingsSkeleton />;
  }

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
              <span>Customer Portal</span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              My Service{" "}
              <span className="font-editorial italic font-normal text-blue-400">
                Bookings
              </span>
            </h1>

            <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
              Track your ongoing repair progress, review completed appointments,
              and settle payments with verified Stripe checkout.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchBookings();
            }}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-blue-600 active:scale-[0.98] sm:self-auto"
            aria-label="Refresh bookings data"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ================= SUMMARY KPI CARDS ================= */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Bookings
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <ClipboardList size={18} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
            {bookings.length}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">All service history</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active &amp; Pending
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Clock size={18} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
            {activeOrPendingCount}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
            Scheduled or in progress
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Completed
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
            {completedCount}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">Resolved repairs</p>
        </div>
      </div>

      {/* ================= FILTER & SEARCH TOOLBAR ================= */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "All Bookings" },
            { id: "active", label: "Active & Pending" },
            { id: "completed", label: "Completed" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`min-h-[38px] rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? "bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[38px] rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 pr-8 pl-9 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 dark:border-slate-800 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ================= BOOKINGS LIST ================= */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900/60 sm:py-20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Package size={28} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            {bookings.length === 0
              ? "No Bookings Found"
              : "No Bookings Match Your Filter"}
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {bookings.length === 0
              ? "Your scheduled repair requests and service history will appear here once you book a service."
              : "Try adjusting your search query or reset your status filter to see other service orders."}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            {bookings.length > 0 && (statusFilter !== "all" || searchQuery) ? (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setSearchQuery("");
                }}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
              >
                <RotateCcw size={14} />
                <span>Reset Filters</span>
              </button>
            ) : (
              <Link
                href="/services"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
              >
                <Wrench size={15} />
                <span>Explore Services</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredBookings.map((booking) => {
            const badge = getStatusBadge(booking.status);

            return (
              <div
                key={booking._id}
                className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xs transition-all duration-200 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40"
              >
                <div className="grid md:grid-cols-[240px_1fr] lg:grid-cols-[270px_1fr]">
                  {/* Service Image */}
                  <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800 md:h-full">
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceTitle}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent md:hidden" />
                    <span className="absolute top-3.5 left-3.5 rounded-full border border-white/30 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-2xs dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200">
                      {booking.category}
                    </span>
                  </div>

                  {/* Booking Content */}
                  <div className="flex flex-col justify-between p-5 sm:p-7">
                    <div>
                      {/* Title and Status */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            {booking.category}
                          </span>

                          <h2 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                            {booking.serviceTitle}
                          </h2>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badge.bg}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </div>

                      {/* Metadata Grid */}
                      <div className="mt-4 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs dark:border-slate-800/80 dark:bg-slate-950/50 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-start gap-2">
                          <UserCheck
                            size={15}
                            className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                          />
                          <div className="min-w-0">
                            <p className="font-mono text-[10px] uppercase text-slate-400">
                              Technician
                            </p>
                            <p className="truncate font-bold text-slate-800 dark:text-slate-200">
                              {booking.technicianName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <CalendarDays
                            size={15}
                            className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
                          />
                          <div>
                            <p className="font-mono text-[10px] uppercase text-slate-400">
                              Preferred Date
                            </p>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {formatDate(booking.preferredDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <DollarSign
                            size={15}
                            className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                          />
                          <div>
                            <p className="font-mono text-[10px] uppercase text-slate-400">
                              {booking.finalAmount !== undefined
                                ? "Final Amount"
                                : "Base Price"}
                            </p>
                            <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                              $
                              {booking.finalAmount !== undefined
                                ? booking.finalAmount
                                : booking.basePrice}
                              {booking.finalAmount !== undefined && (
                                <span className="ml-1 text-[11px] font-normal text-slate-400 line-through">
                                  ${booking.basePrice}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <CreditCard
                            size={15}
                            className="mt-0.5 shrink-0 text-sky-600 dark:text-sky-400"
                          />
                          <div>
                            <p className="font-mono text-[10px] uppercase text-slate-400">
                              Payment Status
                            </p>
                            <span
                              className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                                booking.paymentStatus === "paid"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : "bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              }`}
                            >
                              {booking.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Problem Description Box */}
                      <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-3.5 dark:border-slate-800/80 dark:bg-slate-950/80">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          <FileText size={13} className="text-blue-600 dark:text-blue-400" />
                          <span>Reported Problem</span>
                        </div>

                        <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {booking.problemDescription}
                        </p>
                      </div>
                    </div>

                    {/* Footer Action Area */}
                    <div className="mt-5">
                      {/* Payment Action */}
                      {booking.status === "completed" &&
                        booking.paymentStatus === "unpaid" && (
                          <div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <ShieldCheck
                                size={15}
                                className="shrink-0 text-blue-600 dark:text-blue-400"
                              />
                              <span>
                                Repair complete. Please complete payment via Stripe.
                              </span>
                            </div>

                            <button
                              onClick={() => handlePayment(booking._id)}
                              disabled={payingId === booking._id}
                              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CreditCard size={16} />
                              <span>
                                {payingId === booking._id
                                  ? "Redirecting to Stripe..."
                                  : `Pay Now ($${
                                      booking.finalAmount !== undefined
                                        ? booking.finalAmount
                                        : booking.basePrice
                                    })`}
                              </span>
                            </button>
                          </div>
                        )}

                      {booking.paymentStatus === "paid" && (
                        <div className="flex items-center gap-2 border-t border-slate-100 pt-3.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 dark:border-slate-800">
                          <CheckCircle2 size={16} />
                          <span>Payment Completed via Stripe</span>
                        </div>
                      )}

                      {/* Cancel Booking Action */}
                      {booking.status === "requested" && (
                        <div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-3.5 dark:border-slate-800 sm:flex-row sm:items-center">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Cancellation is available while the request is still pending review.
                          </p>

                          <button
                            onClick={() => {
                              setBookingToCancel(booking);
                              setCancelError(null);
                            }}
                            disabled={cancellingId === booking._id}
                            className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-600 hover:text-white dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white disabled:opacity-50"
                          >
                            <XCircle size={15} />
                            <span>Cancel Booking</span>
                          </button>
                        </div>
                      )}

                      {booking.status === "cancelled" && (
                        <div className="flex items-center gap-2 border-t border-slate-100 pt-3.5 text-xs font-semibold text-rose-600 dark:text-rose-400 dark:border-slate-800">
                          <XCircle size={15} />
                          <span>This booking was cancelled.</span>
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

      {/* Confirmation Modal for Booking Cancellation */}
      <ConfirmationModal
        isOpen={!!bookingToCancel}
        onClose={() => {
          if (!cancellingId) {
            setBookingToCancel(null);
            setCancelError(null);
          }
        }}
        onConfirm={confirmCancelBooking}
        title="Cancel Repair Booking"
        description={
          bookingToCancel
            ? `Are you sure you want to cancel your repair booking for "${bookingToCancel.serviceTitle}"? This action cannot be undone.`
            : ""
        }
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        loadingText="Cancelling..."
        isLoading={!!cancellingId}
        error={cancelError}
        variant="danger"
      />
    </div>
  );
}
