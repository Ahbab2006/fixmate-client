
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { RefreshCw, CalendarDays, ClipboardList } from "lucide-react";

type Booking = {
  _id: string;
  serviceTitle: string;
  serviceImage?: string;
  category: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  technicianName: string;
  technicianEmail: string;
  preferredDate: string;
  basePrice: number;
  finalAmount?: number;
  status: string;
  paymentStatus: string;
  address: string;
  problemDescription: string;
  createdAt: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/bookings/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bookings.");
      }

      setBookings(data.bookings || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "accepted":
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor all customer service requests and their progress.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <ClipboardList size={22} className="text-blue-600" />
          </div>
          <h2 className="mt-3 text-2xl font-bold">{bookings.length}</h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="mt-3 text-2xl font-bold">
            {bookings.filter((b) => b.status === "requested").length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Active Jobs</p>
          <h2 className="mt-3 text-2xl font-bold">
            {bookings.filter((b) => ["accepted", "in-progress"].includes(b.status)).length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="mt-3 text-2xl font-bold">
            {bookings.filter((b) => b.status === "completed").length}
          </h2>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Booking Records</h2>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="requested">Requested</option>
            <option value="accepted">Accepted</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Loading bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No bookings found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Technician</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-b last:border-0">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {booking.serviceImage ? (
                          <img
                            src={booking.serviceImage}
                            alt={booking.serviceTitle}
                            className="h-11 w-11 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                            <ClipboardList size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">
                            {booking.serviceTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-xs text-gray-500">
                        {booking.customerEmail}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium">{booking.technicianName}</p>
                      <p className="text-xs text-gray-500">
                        {booking.technicianEmail}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {new Date(booking.preferredDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4 font-medium">
                      ৳{booking.finalAmount ?? booking.basePrice}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(booking.status)}`}
                      >
                        {booking.status.replace("-", " ")}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-gray-50"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-sm text-gray-500">
          Showing {filteredBookings.length} of {bookings.length} bookings
        </p>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Service</p>
                <p className="font-semibold">{selectedBooking.serviceTitle}</p>
              </div>

              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium">{selectedBooking.customerName}</p>
                <p>{selectedBooking.customerEmail}</p>
                <p>{selectedBooking.customerPhone}</p>
              </div>

              <div>
                <p className="text-gray-500">Technician</p>
                <p className="font-medium">{selectedBooking.technicianName}</p>
                <p>{selectedBooking.technicianEmail}</p>
              </div>

              <div>
                <p className="text-gray-500">Address</p>
                <p>{selectedBooking.address}</p>
              </div>

              <div>
                <p className="text-gray-500">Problem Description</p>
                <p>{selectedBooking.problemDescription}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Base Price</p>
                  <p className="font-semibold">৳{selectedBooking.basePrice}</p>
                </div>
                <div>
                  <p className="text-gray-500">Final Amount</p>
                  <p className="font-semibold">
                    {selectedBooking.finalAmount
                      ? `৳${selectedBooking.finalAmount}`
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Booking Status</p>
                  <p className="font-medium capitalize">
                    {selectedBooking.status.replace("-", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Status</p>
                  <p className="font-medium capitalize">
                    {selectedBooking.paymentStatus}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-gray-500">Preferred Date</p>
                <p>
                  {new Date(selectedBooking.preferredDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full rounded-lg bg-gray-900 py-2.5 font-medium text-white hover:bg-gray-800"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
