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
    let isMounted = true;

    (async () => {
      if (isMounted) {
        await fetchUsers();
      }
    })();

    return () => {
      isMounted = false;
    };
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
        return {
          pill: "bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900/60",
          dot: "bg-indigo-500",
        };
      case "technician":
        return {
          pill: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/60",
          dot: "bg-blue-500",
        };
      default:
        return {
          pill: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/60",
          dot: "bg-emerald-500",
        };
    }
  };

  if (loading) {
    return <UsersSkeleton />;
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
              <span className="font-mono text-[11px] uppercase tracking-wider">Access Control</span>
            </div>
            <h1 className="mt-3 font-serif text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Manage <span className="italic">Users</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Inspect all registered accounts across FixMate and reassign customer, technician, or administrator permissions.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchUsers();
            }}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 sm:self-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh Users</span>
          </button>
        </div>
      </div>

      {/* ================= KPI SUMMARY CARDS ================= */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Users
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Users size={17} />
            </div>
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {users.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Registered platform profiles</p>
        </div>

        {/* Customers */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Customers
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <UserRound size={17} />
            </div>
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {users.filter((user) => user.role === "customer").length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Homeowners &amp; clients</p>
        </div>

        {/* Technicians */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Technicians
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <Wrench size={17} />
            </div>
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {users.filter((user) => user.role === "technician").length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Service specialists</p>
        </div>

        {/* Admins */}
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Admins
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <ShieldCheck size={17} />
            </div>
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {users.filter((user) => user.role === "admin").length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Governance moderators</p>
        </div>
      </div>

      {/* ================= USERS TABLE CARD ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        {/* Table Header Bar */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/60">
          <div>
            <h2 className="font-serif text-base font-normal tracking-tight text-slate-900 dark:text-white">
              All Registered Members
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                {users.length}
              </span>{" "}
              accounts
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
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="technician">Technicians</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <Users size={24} />
            </div>
            <h3 className="mt-4 font-serif text-lg font-normal text-slate-900 dark:text-white">
              No Members Found
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              No registered user accounts match the selected role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                  <th className="px-6 py-3.5">Member Identity</th>
                  <th className="px-6 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Joined Date</th>
                  <th className="px-6 py-3.5 text-right">Assign Role</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user) => {
                  const roleStyle = getRoleStyle(user.role);

                  return (
                    <tr
                      key={user._id}
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="h-10 w-10 shrink-0 rounded-full border border-slate-200/80 object-cover dark:border-slate-700"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                              ID: {user._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        <div className="inline-flex items-center gap-1.5 font-medium">
                          <Mail size={13} className="text-slate-400 dark:text-slate-500" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${roleStyle.pill}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${roleStyle.dot}`}
                          />
                          {user.role}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        <div className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                          <CalendarDays size={13} className="text-slate-400 dark:text-slate-500" />
                          <span>
                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Change Role Selector */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {updatingId === user._id && (
                            <Loader2
                              size={14}
                              className="animate-spin text-blue-600 dark:text-blue-400"
                            />
                          )}
                          <select
                            value={user.role}
                            disabled={updatingId === user._id}
                            onChange={(event) =>
                              handleRoleChange(user._id, event.target.value)
                            }
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs font-semibold capitalize text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-blue-500"
                          >
                            <option value="customer">Customer</option>
                            <option value="technician">Technician</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function UsersSkeleton() {
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
      <div className="h-80 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90" />
    </div>
  );
}
