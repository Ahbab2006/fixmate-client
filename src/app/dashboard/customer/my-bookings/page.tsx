"use client";
import { useCallback, useEffect, useState } from "react";
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
  Loader2,
  ShieldCheck,
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

export default function MyBookingsPage() {
  const { data: session } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const [payingId, setPayingId] = useState<string | null>(null);

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
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  const activeOrPendingCount = bookings.filter((b) =>
    ["requested", "accepted", "in-progress"].includes(b.status)
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;

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
                <span>Customer Portal</span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                My{" "}
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  Bookings
                </span>
              </h1>
              <p className="mt-1.5 text-sm text-slate-300">
                Track your repair progress, manage active requests, and pay
                securely upon completion.
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

        {/* ================= SUMMARY KPI CARDS ================= */}
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Total Bookings
              </p>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
                <ClipboardList size={21} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {bookings.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">All repair requests</p>
          </div>

          <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-900/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Active &amp; Pending
              </p>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform group-hover:scale-110">
                <Clock size={21} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {activeOrPendingCount}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Scheduled or in progress
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Completed</p>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
                <CheckCircle2 size={21} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {completedCount}
            </p>
            <p className="mt-1 text-xs text-slate-400">Finished services</p>
          </div>
        </div>

        {/* ================= BOOKING LIST ================= */}
        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Package size={32} />
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-slate-900">
              No Bookings Found
            </h2>

            <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
              Your scheduled repair requests and service history will appear
              here once you book a service.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5"
              >
                <div className="grid md:grid-cols-[240px_1fr] lg:grid-cols-[270px_1fr]">
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

                  {/* Booking Content */}
                  <div className="flex flex-col justify-between p-6 sm:p-7">
                    <div>
                      {/* Title and Status */}
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

                      {/* Metadata Grid */}
                      <div className="mt-5 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-start gap-2.5">
                          <UserCheck
                            size={16}
                            className="mt-0.5 shrink-0 text-blue-600"
                          />
                          <div>
                            <p className="text-xs font-medium text-slate-400">
                              Technician
                            </p>
                            <p className="font-bold text-slate-800">
                              {booking.technicianName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <CalendarDays
                            size={16}
                            className="mt-0.5 shrink-0 text-indigo-600"
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

                        <div className="flex items-start gap-2.5">
                          <DollarSign
                            size={16}
                            className="mt-0.5 shrink-0 text-emerald-600"
                          />
                          <div>
                            <p className="text-xs font-medium text-slate-400">
                              {booking.finalAmount !== undefined
                                ? "Final Amount"
                                : "Base Price"}
                            </p>
                            <p className="text-base font-extrabold text-slate-900">
                              $
                              {booking.finalAmount !== undefined
                                ? booking.finalAmount
                                : booking.basePrice}
                              {booking.finalAmount !== undefined && (
                                <span className="ml-1.5 text-xs font-normal text-slate-400 line-through">
                                  ${booking.basePrice}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <CreditCard
                            size={16}
                            className="mt-0.5 shrink-0 text-sky-600"
                          />
                          <div>
                            <p className="text-xs font-medium text-slate-400">
                              Payment Status
                            </p>
                            <span
                              className={`mt-0.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                                booking.paymentStatus === "paid"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-200/80 text-slate-700"
                              }`}
                            >
                              {booking.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Problem Description Box */}
                      <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white p-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                          <FileText size={14} className="text-blue-600" />
                          <span>Problem Description</span>
                        </div>

                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                          {booking.problemDescription}
                        </p>
                      </div>
                    </div>

                    {/* Footer Action Area */}
                    <div className="mt-5">
                      {/* Payment Button */}
                      {booking.status === "completed" &&
                        booking.paymentStatus === "unpaid" && (
                          <div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <ShieldCheck
                                size={16}
                                className="shrink-0 text-blue-600"
                              />
                              <span>
                                Complete your payment securely using Stripe.
                              </span>
                            </div>

                            <button
                              onClick={() => handlePayment(booking._id)}
                              disabled={payingId === booking._id}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CreditCard size={17} />
                              {payingId === booking._id
                                ? "Redirecting to Payment..."
                                : "Pay Now"}
                            </button>
                          </div>
                        )}

                      {booking.paymentStatus === "paid" && (
                        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-bold text-emerald-600">
                          <CheckCircle2 size={18} />
                          <span>Payment Completed</span>
                        </div>
                      )}

                      {/* Cancel Button */}
                      {booking.status === "requested" && (
                        <div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
                          <p className="text-xs text-slate-500">
                            You can cancel a booking only while it is still
                            requested.
                          </p>

                          <button
                            onClick={() => {
                              setBookingToCancel(booking);
                              setCancelError(null);
                            }}
                            disabled={cancellingId === booking._id}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-bold text-rose-600 transition-all hover:bg-rose-600 hover:text-white disabled:opacity-50"
                          >
                            <XCircle size={17} />
                            Cancel Booking
                          </button>
                        </div>
                      )}

                      {booking.status === "cancelled" && (
                        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-rose-600">
                          <XCircle size={17} />
                          <span>This booking has been cancelled.</span>
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