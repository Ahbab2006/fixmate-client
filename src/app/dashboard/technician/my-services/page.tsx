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

function MyServicesSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* KPI Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="mt-4 h-8 w-12 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Services Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div className="h-52 bg-slate-200 dark:bg-slate-800" />
            <div className="p-6 space-y-4">
              <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-10 w-full rounded bg-slate-100 dark:bg-slate-800/60" />
              <div className="h-20 w-full rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
              <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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

      const response = await fetch(apiUrl("/api/services/my-services"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load services.");
      }

      setServices(result.services || []);
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
        error instanceof Error ? error.message : "Something went wrong."
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
        throw new Error(result.message || "Failed to delete service.");
      }

      setServices((prev) =>
        prev.filter((service) => service._id !== serviceToDelete._id)
      );

      toast.success("Service deleted successfully!");
      setServiceToDelete(null);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Something went wrong.";
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

  return (
    <div className="min-h-screen bg-slate-50/60 pb-12 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ================= EDITORIAL TOP BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/70 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
                <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
                <span>Technician Catalog</span>
              </div>
              <h1 className="font-serif text-3xl font-normal tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
                My <span className="italic">Services</span>
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Manage your listed repair offerings, modify rates, and control live
                customer booking availability in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setLoading(true);
                  fetchServices();
                }}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:text-sm"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>

              <Link
                href="/dashboard/technician/add-service"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 sm:text-sm"
              >
                <Plus size={16} />
                <span>Add Service</span>
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <MyServicesSkeleton />
        ) : (
          <>
            {/* ================= KPI SUMMARY CARDS ================= */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Services"
                value={services.length}
                subtitle="All listed packages"
                icon={<Package size={19} />}
                accent="bg-blue-50 text-blue-700 ring-1 ring-blue-600/15 dark:bg-blue-950/60 dark:text-blue-400 dark:ring-blue-500/20"
              />

              <StatCard
                title="Approved"
                value={approvedCount}
                subtitle="Live on marketplace"
                icon={<CheckCircle size={19} />}
                accent="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-500/20"
              />

              <StatCard
                title="Pending Review"
                value={pendingCount}
                subtitle="Awaiting admin approval"
                icon={<Clock size={19} />}
                accent="bg-amber-50 text-amber-700 ring-1 ring-amber-600/15 dark:bg-amber-950/60 dark:text-amber-400 dark:ring-amber-500/20"
              />

              <StatCard
                title="Rejected"
                value={rejectedCount}
                subtitle="Requires revision"
                icon={<XCircle size={19} />}
                accent="bg-rose-50 text-rose-700 ring-1 ring-rose-600/15 dark:bg-rose-950/60 dark:text-rose-400 dark:ring-rose-500/20"
              />
            </div>

            {/* ================= SERVICES GRID ================= */}
            {services.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900/90">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <Package size={28} />
                </div>

                <h2 className="mt-4 font-serif text-2xl font-normal tracking-tight text-slate-900 dark:text-white">
                  No Services Listed Yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Publish your first repair package to showcase your specialties
                  and receive verified customer bookings.
                </p>

                <Link
                  href="/dashboard/technician/add-service"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 sm:text-sm"
                >
                  <Plus size={16} />
                  <span>Create Your First Service</span>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

                      <span className="absolute top-3.5 left-3.5 rounded-full border border-white/40 bg-white/95 px-3 py-1 text-[11px] font-semibold text-slate-800 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200">
                        {service.category}
                      </span>

                      <span
                        className={`absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize shadow-sm backdrop-blur-md ${getStatusStyle(
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
                      <div className="space-y-3">
                        <h2 className="line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                          {service.title}
                        </h2>

                        <p className="line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {service.description}
                        </p>

                        {/* Specs Box */}
                        <div className="grid grid-cols-2 gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-950/50">
                          <div className="flex items-start gap-2">
                            <DollarSign
                              size={14}
                              className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                            />
                            <div>
                              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Base Price
                              </p>
                              <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                                ${service.basePrice}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Timer
                              size={14}
                              className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                            />
                            <div>
                              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Duration
                              </p>
                              <p className="font-medium text-slate-800 dark:text-slate-200">
                                {service.estimatedDuration}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Briefcase
                              size={14}
                              className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
                            />
                            <div>
                              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Mode
                              </p>
                              <p className="font-medium text-slate-800 dark:text-slate-200">
                                {service.serviceMode}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <MapPin
                              size={14}
                              className="mt-0.5 shrink-0 text-sky-600 dark:text-sky-400"
                            />
                            <div className="min-w-0">
                              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Area
                              </p>
                              <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                                {service.serviceArea}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Controls */}
                      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                        {/* Edit and Delete Buttons */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <Link
                            href={`/dashboard/technician/edit-service/${service._id}`}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Pencil size={13} />
                            <span>Edit</span>
                          </Link>

                          <button
                            onClick={() => {
                              setServiceToDelete(service);
                              setDeleteError(null);
                            }}
                            disabled={updatingId === service._id}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200/80 bg-rose-50/60 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/50"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>

                        {/* Availability Toggle Row */}
                        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-950/40">
                          <div>
                            <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                              Booking Availability
                            </p>
                            <p
                              className={`text-[11px] font-semibold ${
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
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
                              service.isAvailable
                                ? "bg-slate-900 dark:bg-blue-600"
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
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
          </>
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
            ? `Are you sure you want to delete "${serviceToDelete.title}"? This service listing will be permanently removed.`
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
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${accent}`}
        >
          {icon}
        </span>
      </div>

      <p className="mt-3 font-mono text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}
