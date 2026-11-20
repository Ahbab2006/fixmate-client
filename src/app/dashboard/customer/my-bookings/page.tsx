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
      setLoading(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        apiUrl("/api/bookings/my-bookings"),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load bookings.");
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

    window.location.href = result.checkoutUrl;
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Payment failed."
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
        throw new Error(
          result.message || "Failed to cancel booking."
        );
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
        error instanceof Error
          ? error.message
          : "Something went wrong.";
      setCancelError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setCancellingId(null);
    }
  };

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
          <p className="mt-4 text-gray-600">Loading bookings...</p>
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
              My Bookings
            </h1>
            <p className="mt-2 text-gray-600">
              View and manage all your repair bookings.
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

        {/* Booking Count */}
        <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {bookings.length}
          </p>
        </div>

        {/* Booking List */}
        {bookings.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center">
            <Package
              size={45}
              className="mx-auto mb-4 text-gray-400"
            />

            <h2 className="text-xl font-semibold text-gray-800">
              No Bookings Found
            </h2>

            <p className="mt-2 text-gray-500">
              Your bookings will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <div className="grid md:grid-cols-[200px_1fr]">
                  <img
                    src={booking.serviceImage}
                    alt={booking.serviceTitle}
                    className="h-48 w-full object-cover md:h-full"
                  />

                  <div className="p-5 md:p-6">

                    {/* Title and Status */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
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

                    {/* Details */}
                    <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                      <p>
                        <strong>Technician:</strong>{" "}
                        {booking.technicianName}
                      </p>

                      <p className="flex items-center gap-2">
                        <CalendarDays size={17} />
                        {new Date(
                          booking.preferredDate
                        ).toLocaleDateString()}
                      </p>

                      <p>
                        <strong>Base Price:</strong> $
                        {booking.basePrice}
                      </p>

                      <p>
                        <strong>Payment:</strong>{" "}
                        <span className="capitalize">
                          {booking.paymentStatus}
                        </span>
                      </p>

                      {booking.finalAmount !== undefined && (
                        <p>
                          <strong>Final Amount:</strong> $
                          {booking.finalAmount}
                        </p>
                      )}
                    </div>

                    {/* Problem */}
                    <div className="mt-4 rounded-lg bg-gray-50 p-4">
                      <p className="mb-1 font-semibold text-gray-800">
                        Problem Description
                      </p>

                      <p className="text-sm text-gray-600">
                        {booking.problemDescription}
                      </p>
                    </div>


{/* Payment Button */}
{booking.status === "completed" &&
  booking.paymentStatus === "unpaid" && (
    <div className="mt-5 border-t pt-4">
      <button
        onClick={() => handlePayment(booking._id)}
        disabled={payingId === booking._id}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CreditCard size={18} />

        {payingId === booking._id
          ? "Redirecting to Payment..."
          : "Pay Now"}
      </button>

      <p className="mt-2 text-xs text-gray-500">
        Complete your payment securely using Stripe.
      </p>
    </div>
  )}

{booking.paymentStatus === "paid" && (
  <p className="mt-5 border-t pt-4 font-semibold text-green-600">
    Payment Completed
  </p>
)}


                    {/* Cancel Button */}
                    {booking.status === "requested" && (
                      <div className="mt-5 border-t pt-4">
                        <button
                          onClick={() => {
                            setBookingToCancel(booking);
                            setCancelError(null);
                          }}
                          disabled={cancellingId === booking._id}
                          className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          <XCircle size={17} />
                          Cancel Booking
                        </button>

                        <p className="mt-2 text-xs text-gray-500">
                          You can cancel a booking only while it is requested.
                        </p>
                      </div>
                    )}

                    {booking.status === "cancelled" && (
                      <p className="mt-5 border-t pt-4 text-sm font-medium text-red-600">
                        This booking has been cancelled.
                      </p>
                    )}

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
