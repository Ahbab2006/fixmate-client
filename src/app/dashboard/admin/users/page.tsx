
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

      const response = await fetch(
        apiUrl(`/api/users/${userId}/role`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role }),
        }
      );

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
        return "bg-purple-100 text-purple-700";
      case "technician":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            View registered users and manage their roles.
          </p>
        </div>

        <button
          onClick={fetchUsers}
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
            <p className="text-sm text-gray-500">Total Users</p>
            <Users className="text-blue-600" size={22} />
          </div>
          <h2 className="mt-3 text-2xl font-bold">{users.length}</h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Customers</p>
            <UserRound className="text-green-600" size={22} />
          </div>
          <h2 className="mt-3 text-2xl font-bold">
            {users.filter((user) => user.role === "customer").length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Technicians</p>
            <Wrench className="text-blue-600" size={22} />
          </div>
          <h2 className="mt-3 text-2xl font-bold">
            {users.filter((user) => user.role === "technician").length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Admins</p>
            <ShieldCheck className="text-purple-600" size={22} />
          </div>
          <h2 className="mt-3 text-2xl font-bold">
            {users.filter((user) => user.role === "admin").length}
          </h2>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">All Registered Users</h2>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="technician">Technicians</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Joined Date</th>
                  <th className="px-4 py-3 font-medium">Change Role</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b last:border-0">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}

                        <span className="font-medium text-gray-800">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getRoleStyle(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={user.role}
                        disabled={updatingId === user._id}
                        onChange={(event) =>
                          handleRoleChange(user._id, event.target.value)
                        }
                        className="rounded-lg border px-3 py-2 text-sm capitalize outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="customer">Customer</option>
                        <option value="technician">Technician</option>
                        <option value="admin">Admin</option>
                      </select>

                      {updatingId === user._id && (
                        <span className="ml-2 text-xs text-gray-500">
                          Updating...
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>
    </div>
  );
}
