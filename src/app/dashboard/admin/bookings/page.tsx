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
  Loader2,
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
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-500/20";
      case "accepted":
      case "in-progress":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-950/60 dark:text-blue-400 dark:ring-blue-500/20";
      case "rejected":
      case "cancelled":
        return "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/60 dark:text-rose-400 dark:ring-rose-500/20";
      default:
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/60 dark:text-amber-400 dark:ring-amber-500/20";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500";
      case "accepted":
      case "in-progress":
        return "bg-blue-500";
      case "rejected":
      case "cancelled":
        return "bg-rose-500";
      default:
        return "bg-amber-500";
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* ================= TOP DARK PREMIUM BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8 dark:border dark:border-slate-800">
        <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-600/25 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
              <Sparkles size={13} className="text-blue-400" />
              <span>Admin Management</span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              All{" "}
              <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                Bookings
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-300">
              Monitor all customer service requests, assigned technicians, and
              real-time progress.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchBookings();
            }}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-blue-600 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* ================= KPI SUMMARY CARDS ================= */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Bookings */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Total Bookings
            </p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-950/60 dark:text-blue-400">
              <ClipboardList size={21} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
            {bookings.length}
          </h2>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">All-time requests</p>
        </div>

        {/* Pending */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pending</p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform group-hover:scale-110 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock size={21} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
            {bookings.filter((b) => b.status === "requested").length}
          </h2>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Awaiting response</p>
        </div>

        {/* Active Jobs */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Active Jobs</p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Wrench size={21} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
            {
              bookings.filter((b) =>
                ["accepted", "in-progress"].includes(b.status)
              ).length
            }
          </h2>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Currently in progress</p>
        </div>

        {/* Completed */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Completed</p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 size={21} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
            {bookings.filter((b) => b.status === "completed").length}
          </h2>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Successfully resolved</p>
        </div>
      </div>

      {/* ================= BOOKING RECORDS TABLE CARD ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Table Header Bar */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/60">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Booking Records
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {filteredBookings.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {bookings.length}
              </span>{" "}
              bookings
            </p>
          </div>

          <div className="relative inline-flex items-center">
            <Filter
              size={15}
              className="pointer-events-none absolute left-3.5 text-slate-400 dark:text-slate-500"
            />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2.5 pr-9 pl-9 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center py-16 text-center">
            <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={34} />
            <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              Loading booking records...
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <ClipboardList size={26} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              No Bookings Found
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              No records match the selected status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Technician</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-800/50"
                  >
                    {/* Service */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        {booking.serviceImage ? (
                          <img
                            src={booking.serviceImage}
                            alt={booking.serviceTitle}
                            className="h-12 w-12 shrink-0 rounded-xl border border-slate-200/80 object-cover dark:border-slate-700"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                            <ClipboardList size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {booking.serviceTitle}
                          </p>
                          <span className="mt-0.5 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
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
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {booking.customerEmail}
                      </p>
                    </td>

                    {/* Technician */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {booking.technicianName}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {booking.technicianEmail}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      <div className="inline-flex items-center gap-1.5 font-medium">
                        <CalendarDays size={15} className="text-slate-400 dark:text-slate-500" />
                        <span>
                          {new Date(booking.preferredDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        ${booking.finalAmount ?? booking.basePrice}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(booking.status)}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getStatusDot(booking.status)}`}
                        />
                        {booking.status.replace("-", " ")}
                      </span>
                    </td>

                    {/* Details Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-600 hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-600"
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
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
            <div className="relative overflow-hidden bg-slate-950 px-6 py-5 text-white dark:border-b dark:border-slate-800">
              <div className="pointer-events-none absolute -top-10 right-0 h-32 w-32 rounded-full bg-blue-600/30 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Booking Summary
                  </span>
                  <h2 className="mt-0.5 text-xl font-extrabold text-white">
                    {selectedBooking.serviceTitle}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-xl border border-white/10 bg-white/10 p-2 text-slate-300 transition hover:bg-white/20 hover:text-white"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 p-6 text-sm">
              {/* Status & Date Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Status:
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(selectedBooking.status)}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${getStatusDot(selectedBooking.status)}`}
                    />
                    {selectedBooking.status.replace("-", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <CalendarDays size={15} className="text-blue-600 dark:text-blue-400" />
                  <span>
                    Preferred Date:{" "}
                    {new Date(
                      selectedBooking.preferredDate
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Customer & Technician Info Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    <User size={14} />
                    <span>Customer Details</span>
                  </div>
                  <p className="mt-2.5 text-base font-bold text-slate-900 dark:text-white">
                    {selectedBooking.customerName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {selectedBooking.customerEmail}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {selectedBooking.customerPhone}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    <UserCheck size={14} />
                    <span>Assigned Technician</span>
                  </div>
                  <p className="mt-2.5 text-base font-bold text-slate-900 dark:text-white">
                    {selectedBooking.technicianName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {selectedBooking.technicianEmail}
                  </p>
                </div>
              </div>

              {/* Address & Problem Description */}
              <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
                    <span>Service Address</span>
                  </div>
                  <p className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                    {selectedBooking.address}
                  </p>
                </div>

                <div className="border-t border-slate-200/70 pt-3 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <FileText size={14} className="text-blue-600 dark:text-blue-400" />
                    <span>Problem Description</span>
                  </div>
                  <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
                    {selectedBooking.problemDescription}
                  </p>
                </div>
              </div>

              {/* Billing & Payment Summary */}
              <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <DollarSign size={13} className="text-slate-400 dark:text-slate-500" />
                    <span>Base Price</span>
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
                    ${selectedBooking.basePrice}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <DollarSign size={13} className="text-blue-600 dark:text-blue-400" />
                    <span>Final Amount</span>
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-blue-600 dark:text-blue-400">
                    {selectedBooking.finalAmount
                      ? `$${selectedBooking.finalAmount}`
                      : "Not set"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <CreditCard size={13} className="text-slate-400 dark:text-slate-500" />
                    <span>Payment</span>
                  </div>
                  <p className="mt-1.5 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold capitalize text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                    {selectedBooking.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Modal Footer Button */}
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}