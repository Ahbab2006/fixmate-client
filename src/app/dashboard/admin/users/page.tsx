"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Users,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Wrench,
  Sparkles,
  Filter,
  Mail,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { apiUrl } from "@/lib/api";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "technician" | "admin";
  image?: string;
  createdAt: string;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(apiUrl("/api/users"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users.");
      }

      setUsers(data.users || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, role: string) => {
    const previousUser = users.find((user) => user._id === userId);

    if (!previousUser || previousUser.role === role) return;

    const confirmed = window.confirm(
      `Are you sure you want to change ${previousUser.name}'s role to ${role}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(userId);

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(apiUrl(`/api/users/${userId}/role`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update role.");
      }

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === userId
            ? { ...user, role: role as User["role"] }
            : user
        )
      );

      toast.success("User role updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers =
    filter === "all" ? users : users.filter((user) => user.role === filter);

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20";
      case "technician":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20";
      default:
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";
    }
  };

  const getRoleDot = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-indigo-500";
      case "technician":
        return "bg-blue-500";
      default:
        return "bg-emerald-500";
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* ================= TOP DARK PREMIUM BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-600/25 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
              <Sparkles size={13} className="text-blue-400" />
              <span>Access Control</span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Manage{" "}
              <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                Users
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-300">
              View all registered platform members and manage customer,
              technician, or admin permissions.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-blue-600 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ================= KPI SUMMARY CARDS ================= */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Total Users</p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
              <Users size={21} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
            {users.length}
          </h2>
          <p className="mt-1 text-xs text-slate-400">Registered accounts</p>
        </div>

        {/* Customers */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Customers</p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
              <UserRound size={21} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
            {users.filter((user) => user.role === "customer").length}
          </h2>
          <p className="mt-1 text-xs text-slate-400">Homeowners &amp; clients</p>
        </div>

        {/* Technicians */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-900/5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Technicians</p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-transform group-hover:scale-110">
              <Wrench size={21} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
            {users.filter((user) => user.role === "technician").length}
          </h2>
          <p className="mt-1 text-xs text-slate-400">Service specialists</p>
        </div>

        {/* Admins */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-900/5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Admins</p>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110">
              <ShieldCheck size={21} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
            {users.filter((user) => user.role === "admin").length}
          </h2>
          <p className="mt-1 text-xs text-slate-400">Platform moderators</p>
        </div>
      </div>

      {/* ================= USERS TABLE CARD ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        {/* Table Header Bar */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Registered Users
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {users.length}
              </span>{" "}
              users
            </p>
          </div>

          <div className="relative inline-flex items-center">
            <Filter
              size={15}
              className="pointer-events-none absolute left-3.5 text-slate-400"
            />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2.5 pr-9 pl-9 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="technician">Technicians</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center py-16 text-center">
            <Loader2 className="animate-spin text-blue-600" size={34} />
            <p className="mt-3 text-sm font-medium text-slate-500">
              Loading registered users...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Users size={26} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">
              No Users Found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              No registered users match the selected role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Change Role</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-slate-50/90"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-11 w-11 shrink-0 rounded-full border border-slate-200/80 object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/15 to-indigo-600/15 text-sm font-extrabold text-blue-700 ring-1 ring-blue-600/20">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}

                        <div>
                          <p className="font-bold text-slate-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: {user._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-slate-600">
                      <div className="inline-flex items-center gap-1.5 font-medium">
                        <Mail size={14} className="text-slate-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ${getRoleStyle(user.role)}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getRoleDot(user.role)}`}
                        />
                        {user.role}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 text-slate-600">
                      <div className="inline-flex items-center gap-1.5 font-medium">
                        <CalendarDays size={15} className="text-slate-400" />
                        <span>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    {/* Change Role Selector */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {updatingId === user._id && (
                          <Loader2
                            size={15}
                            className="animate-spin text-blue-600"
                          />
                        )}
                        <select
                          value={user.role}
                          disabled={updatingId === user._id}
                          onChange={(event) =>
                            handleRoleChange(user._id, event.target.value)
                          }
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold capitalize text-slate-700 shadow-sm outline-none transition hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                        >
                          <option value="customer">Customer</option>
                          <option value="technician">Technician</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}