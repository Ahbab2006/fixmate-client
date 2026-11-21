"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  RefreshCw,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
  Sparkles,
  Plus,
  DollarSign,
  Timer,
  Briefcase,
  MapPin,
  Loader2,
} from "lucide-react";
import { apiUrl } from "@/lib/api";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt: string;
}

export default function MyServicesPage() {
  const { data: session } = authClient.useSession();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);



  const fetchServices = useCallback(async () => {
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        apiUrl("/api/services/my-services"),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load services.");
      }

      setServices(result.services || []);
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
    let isMounted = true;

    if (session) {
      (async () => {
        if (isMounted) {
          await fetchServices();
        }
      })();
    }

    return () => {
      isMounted = false;
    };
  }, [session, fetchServices]);

  const handleAvailability = async (service: Service) => {
    try {
      setUpdatingId(service._id);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        apiUrl(`/api/services/${service._id}/availability`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isAvailable: !service.isAvailable,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update availability."
        );
      }

      setServices((prev) =>
        prev.map((item) =>
          item._id === service._id
            ? { ...item, isAvailable: !service.isAvailable }
            : item
        )
      );

      toast.success(
        `Service ${!service.isAvailable ? "enabled" : "disabled"} successfully.`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      setUpdatingId(serviceToDelete._id);
      setDeleteError(null);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        apiUrl(`/api/services/${serviceToDelete._id}`),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete service."
        );
      }

      setServices((prev) =>
        prev.filter((service) => service._id !== serviceToDelete._id)
      );

      toast.success("Service deleted successfully!");
      setServiceToDelete(null);
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Something went wrong.";
      setDeleteError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
      setUpdatingId(null);
    }
  };

  const pendingCount = services.filter(
    (service) => service.approvalStatus === "pending"
  ).length;

  const approvedCount = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length;

  const rejectedCount = services.filter(
    (service) => service.approvalStatus === "rejected"
  ).length;

  const getStatusStyle = (status: Service["approvalStatus"]) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-500/20";
      case "rejected":
        return "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/60 dark:text-rose-400 dark:ring-rose-500/20";
      default:
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/60 dark:text-amber-400 dark:ring-amber-500/20";
    }
  };

  const getStatusDot = (status: Service["approvalStatus"]) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500";
      case "rejected":
        return "bg-rose-500";
      default:
        return "bg-amber-500";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="rounded-3xl border border-slate-200/80 bg-white px-10 py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="mx-auto animate-spin text-blue-600 dark:text-blue-400" size={38} />
          <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
            Loading your services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ================= TOP DARK PREMIUM BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8 dark:border dark:border-slate-800">
          <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-600/25 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <Sparkles size={13} className="text-blue-400" />
                <span>Technician Catalog</span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                My{" "}
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  Services
                </span>
              </h1>
              <p className="mt-1.5 text-sm text-slate-300">
                Manage your published repair listings, update pricing, and
                control live booking availability.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setLoading(true);
                  fetchServices();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-white/15"
              >
                <RefreshCw size={16} />
                Refresh
              </button>

              <Link
                href="/dashboard/technician/add-service"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-500"
              >
                <Plus size={17} />
                Add Service
              </Link>
            </div>
          </div>
        </div>

        {/* ================= KPI SUMMARY CARDS ================= */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Services"
            value={services.length}
            subtitle="All listed packages"
            icon={<Package size={21} />}
            accent="bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
          />

          <StatCard
            title="Pending"
            value={pendingCount}
            subtitle="Awaiting admin review"
            icon={<Clock size={21} />}
            accent="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
          />

          <StatCard
            title="Approved"
            value={approvedCount}
            subtitle="Live on marketplace"
            icon={<CheckCircle size={21} />}
            accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          />

          <StatCard
            title="Rejected"
            value={rejectedCount}
            subtitle="Requires revision"
            icon={<XCircle size={21} />}
            accent="bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
          />
        </div>

        {/* ================= SERVICES GRID ================= */}
        {services.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <Package size={32} />
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white">
              No Services Found
            </h2>

            <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500 dark:text-slate-400">
              You have not added any repair services yet. Publish your first
              service to start receiving customer bookings.
            </p>

            <Link
              href="/dashboard/technician/add-service"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-500 hover:to-indigo-500"
            >
              <Plus size={17} />
              Create Your First Service
            </Link>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                {/* Cover Image */}
                <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

                  <span className="absolute top-4 left-4 rounded-full border border-white/40 bg-white/95 px-3.5 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200">
                    {service.category}
                  </span>

                  <span
                    className={`absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold capitalize shadow-sm backdrop-blur-md dark:bg-slate-900/90 ${getStatusStyle(
                      service.approvalStatus
                    )}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                        service.approvalStatus
                      )}`}
                    />
                    {service.approvalStatus}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h2 className="line-clamp-1 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {service.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {service.description}
                    </p>

                    {/* Specs Box */}
                    <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-xs dark:border-slate-800 dark:bg-slate-950/50">
                      <div className="flex items-start gap-2">
                        <DollarSign
                          size={15}
                          className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                        />
                        <div>
                          <p className="font-medium text-slate-400 dark:text-slate-500">
                            Base Price
                          </p>
                          <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                            ${service.basePrice}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Timer
                          size={15}
                          className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                        />
                        <div>
                          <p className="font-medium text-slate-400 dark:text-slate-500">Duration</p>
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {service.estimatedDuration}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Briefcase
                          size={15}
                          className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
                        />
                        <div>
                          <p className="font-medium text-slate-400 dark:text-slate-500">Mode</p>
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {service.serviceMode}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin
                          size={15}
                          className="mt-0.5 shrink-0 text-sky-600 dark:text-sky-400"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-400 dark:text-slate-500">Area</p>
                          <p className="truncate font-bold text-slate-800 dark:text-slate-200">
                            {service.serviceArea}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Controls */}
                  <div className="mt-6 space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                    {/* Edit and Delete Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href={`/dashboard/technician/edit-service/${service._id}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 py-2.5 text-sm font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
                      >
                        <Pencil size={15} />
                        Edit
                      </Link>

                      <button
                        onClick={() => {
                          setServiceToDelete(service);
                          setDeleteError(null);
                        }}
                        disabled={updatingId === service._id}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-600 hover:text-white disabled:opacity-50 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>

                    {/* Availability Toggle Row */}
                    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Booking Availability
                        </p>
                        <p
                          className={`mt-0.5 text-xs font-semibold ${
                            service.isAvailable
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {service.isAvailable
                            ? "Accepting bookings"
                            : "Currently unavailable"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAvailability(service)}
                        disabled={updatingId === service._id}
                        aria-label="Toggle availability"
                        title="Toggle availability"
                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-50 ${
                          service.isAvailable ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                            service.isAvailable
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Service Deletion */}
      <ConfirmationModal
        isOpen={!!serviceToDelete}
        onClose={() => {
          if (!isDeleting) {
            setServiceToDelete(null);
            setDeleteError(null);
          }
        }}
        onConfirm={confirmDeleteService}
        title="Delete Repair Service"
        description={
          serviceToDelete
            ? `Are you sure you want to delete "${serviceToDelete.title}"? This service will be permanently removed and customers will no longer be able to book it.`
            : ""
        }
        confirmText="Yes, Delete Service"
        cancelText="Cancel"
        loadingText="Deleting..."
        isLoading={isDeleting}
        error={deleteError}
        variant="danger"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${accent}`}
        >
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
    </div>
  );
}