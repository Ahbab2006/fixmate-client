"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  RefreshCw,
  CalendarDays,
  ClipboardList,
  Clock,
  Wrench,
  CheckCircle2,
  Filter,
  Eye,
  X,
  User,
  UserCheck,
  MapPin,
  FileText,
  DollarSign,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { apiUrl } from "@/lib/api";

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
      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(apiUrl("/api/bookings/admin/all"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    let isMounted = true;

    (async () => {
      if (isMounted) {
        await fetchBookings();
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return {
          pill: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/60",
          dot: "bg-emerald-500",
        };
      case "accepted":
      case "in-progress":
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
      default:
        return {
          pill: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/60",
          dot: "bg-amber-500",
        };
    }
  };

  if (loading) {
    return <BookingsSkeleton />;
  }

  return (
    <div className="space-y-8 pb-16">
      {/* ================= EDITORIAL TOP BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/90">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-500/10 blur-[80px] dark:bg-blue-600/15" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-600/10" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
              <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
              <span className="font-mono text-[11px] uppercase tracking-wider">Dispatch Operations</span>
            </div>
            <h1 className="mt-3 font-serif text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              All <span className="italic">Bookings</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Monitor customer appointment lifecycles, assigned technicians, service fulfillment, and settlement status.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchBookings();
            }}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 sm:self-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh Bookings</span>
          </button>
        </div>
      </div>

      {/* ================= KPI SUMMARY CARDS ================= */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Bookings */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Bookings
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <ClipboardList size={17} />
            </div>
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {bookings.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">All-time appointments</p>
        </div>

        {/* Pending */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Response
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock size={17} />
            </div>
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {bookings.filter((b) => b.status === "requested").length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Awaiting technician acceptance</p>
        </div>

        {/* Active Jobs */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active In Field
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Wrench size={17} />
            </div>
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {
              bookings.filter((b) =>
                ["accepted", "in-progress"].includes(b.status)
              ).length
            }
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Accepted or repair in progress</p>
        </div>

        {/* Completed */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Completed Jobs
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 size={17} />
            </div>
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {bookings.filter((b) => b.status === "completed").length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Successfully finalized</p>
        </div>
      </div>

      {/* ================= BOOKINGS TABLE CARD ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        {/* Table Header Bar */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/60">
          <div>
            <h2 className="font-serif text-base font-normal tracking-tight text-slate-900 dark:text-white">
              Appointment Records
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                {filteredBookings.length}
              </span>{" "}
              of{" "}
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                {bookings.length}
              </span>{" "}
              records
            </p>
          </div>

          <div className="relative inline-flex items-center">
            <Filter
              size={14}
              className="pointer-events-none absolute left-3.5 text-slate-400 dark:text-slate-500"
            />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2 pr-8 pl-9 text-xs font-semibold text-slate-700 shadow-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-blue-500"
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
        </div>

        {/* Table Content */}
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <ClipboardList size={24} />
            </div>
            <h3 className="mt-4 font-serif text-lg font-normal text-slate-900 dark:text-white">
              No Appointments Found
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              No service records match the selected status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                  <th className="px-6 py-3.5">Service Listing</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Technician</th>
                  <th className="px-6 py-3.5">Scheduled</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBookings.map((booking) => {
                  const statusStyle = getStatusStyle(booking.status);

                  return (
                    <tr
                      key={booking._id}
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      {/* Service */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {booking.serviceImage ? (
                            <img
                              src={booking.serviceImage}
                              alt={booking.serviceTitle}
                              className="h-10 w-10 shrink-0 rounded-lg border border-slate-200/80 object-cover dark:border-slate-700"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              <ClipboardList size={18} />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {booking.serviceTitle}
                            </p>
                            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                              {booking.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {booking.customerName}
                        </p>
                        <p className="mt-0.5 text-slate-400 dark:text-slate-500">
                          {booking.customerEmail}
                        </p>
                      </td>

                      {/* Technician */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {booking.technicianName}
                        </p>
                        <p className="mt-0.5 text-slate-400 dark:text-slate-500">
                          {booking.technicianEmail}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        <div className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                          <CalendarDays size={13} className="text-slate-400 dark:text-slate-500" />
                          <span>
                            {new Date(booking.preferredDate).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          ${booking.finalAmount ?? booking.basePrice}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${statusStyle.pill}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                          />
                          {booking.status.replace("-", " ")}
                        </span>
                      </td>

                      {/* Details Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          <Eye size={13} />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= BOOKING DETAILS MODAL ================= */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-5 dark:border-slate-800 dark:bg-slate-900/60">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Dispatch Summary
                </span>
                <h2 className="mt-0.5 font-serif text-lg font-normal tracking-tight text-slate-900 dark:text-white">
                  {selectedBooking.serviceTitle}
                </h2>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 p-6 text-xs">
              {/* Status & Date Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Status:
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${getStatusStyle(selectedBooking.status).pill}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${getStatusStyle(selectedBooking.status).dot}`}
                    />
                    {selectedBooking.status.replace("-", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  <CalendarDays size={13} className="text-blue-600 dark:text-blue-400" />
                  <span>
                    Preferred Date:{" "}
                    {new Date(
                      selectedBooking.preferredDate
                    ).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Customer & Technician Info Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Customer Profile
                  </span>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                    {selectedBooking.customerName}
                  </p>
                  <p className="mt-0.5 text-slate-400 dark:text-slate-500">
                    {selectedBooking.customerEmail}
                  </p>
                  <p className="mt-0.5 font-mono text-slate-600 dark:text-slate-300">
                    {selectedBooking.customerPhone}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Assigned Technician
                  </span>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                    {selectedBooking.technicianName}
                  </p>
                  <p className="mt-0.5 text-slate-400 dark:text-slate-500">
                    {selectedBooking.technicianEmail}
                  </p>
                </div>
              </div>

              {/* Address & Problem Description */}
              <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Dispatch Location
                  </span>
                  <p className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                    {selectedBooking.address}
                  </p>
                </div>

                <div className="border-t border-slate-200/70 pt-2.5 dark:border-slate-800">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Customer Problem Stated
                  </span>
                  <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-300">
                    {selectedBooking.problemDescription}
                  </p>
                </div>
              </div>

              {/* Billing & Payment Summary */}
              <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Base Price
                  </span>
                  <p className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-white">
                    ${selectedBooking.basePrice}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Final Settled
                  </span>
                  <p className="mt-1 font-mono text-base font-bold text-blue-600 dark:text-blue-400">
                    {selectedBooking.finalAmount
                      ? `$${selectedBooking.finalAmount}`
                      : "Pending"}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Payment Status
                  </span>
                  <p className="mt-1 font-mono text-xs font-semibold capitalize text-slate-800 dark:text-slate-200">
                    {selectedBooking.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Close Action */}
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingsSkeleton() {
  return (
    <div className="space-y-8 pb-16 animate-pulse">
      <div className="h-36 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90"
          />
        ))}
      </div>
      <div className="h-96 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90" />
    </div>
  );
}
