
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Users,
  UserRound,
  Wrench,
  ShieldCheck,
  ClipboardList,
  Clock,
  CheckCircle,
  CreditCard,
  Wallet,
  RefreshCw,
  Loader2,
} from "lucide-react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "technician" | "admin";
};

type Service = {
  _id: string;
  title: string;
  technicianName: string;
  createdAt: string;
};

type Booking = {
  _id: string;
  serviceTitle: string;
  customerName: string;
  technicianName: string;
  status: string;
  createdAt: string;
};

type Payment = {
  _id: string;
  bookingId: string;
  customerEmail: string;
  serviceTitle?: string;
  amount: number;
  stripeSessionId?: string;
  createdAt: string;
};
type ServiceStats = {
  totalServices: number;
  approvedServices: number;
  pendingServices: number;
  rejectedServices: number;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

const [serviceStats, setServiceStats] = useState<ServiceStats>({
  totalServices: 0,
  approvedServices: 0,
  pendingServices: 0,
  rejectedServices: 0,
});


  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const endpoints = [
        "http://localhost:5000/api/users",
        "http://localhost:5000/api/services/admin/pending",
        "http://localhost:5000/api/bookings/admin/all",
        "http://localhost:5000/api/payments/admin/all",
          "http://localhost:5000/api/services/admin/stats",
      ];

      const responses = await Promise.all(
        endpoints.map((url) => fetch(url, { headers }))
      );

      const results = await Promise.all(
        responses.map(async (response) => {
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to load dashboard data.");
          }

          return data;
        })
      );

 const [
  usersData,
  servicesData,
  bookingsData,
  paymentsData,
  serviceStatsData,
] = results;

setServiceStats(serviceStatsData.stats);

      setUsers(usersData.users || []);
      setServices(servicesData.services || []);
      setBookings(bookingsData.bookings || []);
      setPayments(paymentsData.payments || []);
      setTotalRevenue(paymentsData.totalRevenue || 0);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const customers = users.filter((user) => user.role === "customer").length;
  const technicians = users.filter(
    (user) => user.role === "technician"
  ).length;
  const admins = users.filter((user) => user.role === "admin").length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  const activeBookings = bookings.filter((booking) =>
    ["accepted", "in-progress"].includes(booking.status)
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const recentPayments = [...payments]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const statCards = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Customers",
      value: customers,
      icon: UserRound,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Technicians",
      value: technicians,
      icon: Wrench,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Admins",
      value: admins,
      icon: ShieldCheck,
      color: "bg-orange-100 text-orange-600",
    },
   {
  title: "Total Services",
  value: serviceStats.totalServices,
  icon: Wrench,
  color: "bg-blue-100 text-blue-600",
},
{
  title: "Approved Services",
  value: serviceStats.approvedServices,
  icon: CheckCircle,
  color: "bg-green-100 text-green-600",
},
{
  title: "Pending Services",
  value: serviceStats.pendingServices,
  icon: Clock,
  color: "bg-yellow-100 text-yellow-600",
},
{
  title: "Rejected Services",
  value: serviceStats.rejectedServices,
  icon: ShieldCheck,
  color: "bg-red-100 text-red-600",
},
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: ClipboardList,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Active Jobs",
      value: activeBookings,
      icon: Wrench,
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      title: "Completed Jobs",
      value: completedBookings,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Transactions",
      value: payments.length,
      icon: CreditCard,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-blue-600" size={36} />
          <p className="mt-3 text-gray-500">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Overview of your FixMate platform.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Revenue Overview */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                ৳{totalRevenue.toLocaleString("en-BD")}
              </h2>
            </div>
            <div className="rounded-xl bg-green-100 p-4 text-green-600">
              <Wallet size={28} />
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Revenue from successful payments.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Transactions</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {payments.length}
              </h2>
            </div>
            <div className="rounded-xl bg-blue-100 p-4 text-blue-600">
              <CreditCard size={28} />
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Successfully recorded customer payments.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Platform Statistics
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <div className={`rounded-lg p-2 ${card.color}`}>
                    <Icon size={20} />
                  </div>
                </div>

                <h3 className="mt-4 text-2xl font-bold text-gray-900">
                  {card.value}
                </h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Recent Bookings
          </h2>
          <span className="text-sm text-gray-500">
            Latest 5 records
          </span>
        </div>

        {recentBookings.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No bookings available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Technician</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="border-b last:border-0">
                    <td className="px-4 py-4 font-medium text-gray-800">
                      {booking.serviceTitle}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {booking.customerName}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {booking.technicianName}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700">
                        {booking.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {formatDate(booking.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent Transactions */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Recent Transactions
          </h2>
          <span className="text-sm text-gray-500">
            Latest 5 payments
          </span>
        </div>

        {recentPayments.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No transactions available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="px-4 py-3 font-medium">Transaction ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Payment Date</th>
                </tr>
              </thead>

              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment._id} className="border-b last:border-0">
                    <td className="px-4 py-4 font-medium text-gray-800">
                      {payment.stripeSessionId || payment._id}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {payment.customerEmail}
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      ৳{payment.amount.toLocaleString("en-BD")}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {formatDate(payment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
