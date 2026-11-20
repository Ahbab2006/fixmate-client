"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
  Clock,
  Layers,
  Sparkles,
  UserCheck,
  DollarSign,
  Timer,
  MapPin,
  Briefcase,
  Eye,
  X,
} from "lucide-react";
import { apiUrl } from "@/lib/api";

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
  technicianName: string;
  technicianEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  createdAt: string;
}

type FilterStatus = "pending" | "approved" | "rejected" | "all";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("pending");
  const [processingId, setProcessingId] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const fetchServices = async (targetFilter: FilterStatus = filter) => {
    try {
      setLoading(true);

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        apiUrl(`/api/services/admin/services?approvalStatus=${targetFilter}`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch services.");
      }

      setServices(data.services || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices("pending");
  }, []);

  const handleFilterChange = (newFilter: FilterStatus) => {
    setFilter(newFilter);
    fetchServices(newFilter);
  };

  const handleApproval = async (
    serviceId: string,
    approvalStatus: "approved" | "rejected"
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${approvalStatus} this service?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(serviceId);

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        apiUrl(`/api/services/admin/${serviceId}/approval`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ approvalStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Approval update failed.");
      }

      toast.success(data.message);

      if (selectedService?._id === serviceId) {
        setSelectedService(null);
      }

      // Refresh current filter view without losing filter selection
      await fetchServices(filter);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setProcessingId("");
    }
  };

  const getSummaryInfo = () => {
    switch (filter) {
      case "approved":
        return {
          label: "Approved Services",
          subtitle: "Live and visible to customers",
          color: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/20",
          icon: <CheckCircle size={24} />,
        };
      case "rejected":
        return {
          label: "Rejected Services",
          subtitle: "Declined service submissions",
          color: "bg-rose-50 text-rose-600 ring-1 ring-rose-600/20",
          icon: <XCircle size={24} />,
        };
      case "all":
        return {
          label: "Total Services",
          subtitle: "All technician listings across platform",
          color: "bg-blue-50 text-blue-600 ring-1 ring-blue-600/20",
          icon: <Layers size={24} />,
        };
      case "pending":
      default:
        return {
          label: "Pending Services",
          subtitle: "Awaiting admin verification",
          color: "bg-amber-50 text-amber-600 ring-1 ring-amber-600/20",
          icon: <Clock size={24} />,
        };
    }
  };

  const getApprovalBadge = (status: Service["approvalStatus"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
    }
  };

  const filterTabs: { label: string; value: FilterStatus }[] = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "All Services", value: "all" },
  ];

  const summary = getSummaryInfo();

  return (
    <main className="min-h-screen bg-slate-50 pb-12 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ================= TOP DARK PREMIUM BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-600/25 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <Sparkles size={13} className="text-blue-400" />
                <span>Service Moderation</span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Manage{" "}
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  Services
                </span>
              </h1>
              <p className="mt-1.5 text-sm text-slate-300">
                Review, verify, and approve technician service listings before
                they go live.
              </p>
            </div>

            <button
              onClick={() => fetchServices(filter)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-blue-600 disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* ================= FILTER TABS & SUMMARY BAR ================= */}
        <div className="grid gap-5 lg:grid-cols-12 lg:items-center">
          {/* Status Filter Tabs */}
          <div className="lg:col-span-7">
            <div className="inline-flex flex-wrap gap-2 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm">
              {filterTabs.map((tab) => {
                const active = filter === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleFilterChange(tab.value)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary Count Card */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-6 py-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${summary.color}`}
                >
                  {summary.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {summary.label}
                  </p>
                  <p className="text-xs text-slate-500">{summary.subtitle}</p>
                </div>
              </div>

              <span className="text-3xl font-extrabold text-slate-900">
                {services.length}
              </span>
            </div>
          </div>
        </div>

        {/* ================= LOADING STATE ================= */}
        {loading && (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white py-20">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <p className="mt-3 text-sm font-medium text-slate-500">
              Loading service submissions...
            </p>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && services.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle size={32} />
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-slate-900">
              {filter === "pending"
                ? "No Pending Services"
                : filter === "all"
                ? "No Services Found"
                : `No ${
                    filter.charAt(0).toUpperCase() + filter.slice(1)
                  } Services`}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {filter === "pending"
                ? "All technician service requests have been reviewed."
                : `There are currently no services under the "${filter}" filter.`}
            </p>
          </div>
        )}

        {/* ================= SERVICE CARDS GRID ================= */}
        {!loading && services.length > 0 && (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5"
              >
                {/* Service Image */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

                  <span className="absolute top-4 left-4 rounded-full border border-white/40 bg-white/90 px-3.5 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-md">
                    {service.category}
                  </span>

                  <div className="absolute top-4 right-4">
                    {getApprovalBadge(service.approvalStatus)}
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h2 className="line-clamp-1 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                      {service.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-slate-500">
                      {service.description}
                    </p>

                    {/* Key Specs Box */}
                    <div className="mt-5 space-y-2.5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-medium text-slate-500">
                          <UserCheck size={14} className="text-blue-600" />
                          Technician
                        </span>
                        <span className="truncate font-bold text-slate-800">
                          {service.technicianName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-medium text-slate-500">
                          <DollarSign size={14} className="text-emerald-600" />
                          Base Price
                        </span>
                        <span className="text-sm font-extrabold text-slate-900">
                          ${service.basePrice}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-medium text-slate-500">
                          <Timer size={14} className="text-indigo-600" />
                          Duration
                        </span>
                        <span className="font-semibold text-slate-700">
                          {service.estimatedDuration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => setSelectedService(service)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={16} />
                      View Full Details
                    </button>

                    {service.approvalStatus === "pending" && (
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() =>
                            handleApproval(service._id, "approved")
                          }
                          disabled={processingId === service._id}
                          className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <CheckCircle size={16} />
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleApproval(service._id, "rejected")
                          }
                          disabled={processingId === service._id}
                          className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </div>
                    )}

                    {service.approvalStatus === "approved" && (
                      <button
                        onClick={() =>
                          handleApproval(service._id, "rejected")
                        }
                        disabled={processingId === service._id}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-600 hover:text-white disabled:opacity-50"
                      >
                        <XCircle size={16} />
                        Reject Service
                      </button>
                    )}

                    {service.approvalStatus === "rejected" && (
                      <button
                        onClick={() =>
                          handleApproval(service._id, "approved")
                        }
                        disabled={processingId === service._id}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 py-2.5 text-sm font-bold text-emerald-600 transition hover:bg-emerald-600 hover:text-white disabled:opacity-50"
                      >
                        <CheckCircle size={16} />
                        Approve Service
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= SERVICE DETAILS MODAL ================= */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Dark Header */}
            <div className="relative overflow-hidden bg-slate-950 px-6 py-5 text-white">
              <div className="pointer-events-none absolute -top-10 right-0 h-32 w-32 rounded-full bg-blue-600/30 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Service Review
                  </span>
                  <h2 className="mt-0.5 text-xl font-extrabold text-white">
                    Service Details
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedService(null)}
                  className="rounded-xl border border-white/10 bg-white/10 p-2 text-slate-300 transition hover:bg-white/20 hover:text-white"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="relative h-56 overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-3.5 left-3.5 rounded-full bg-white/95 px-3.5 py-1 text-xs font-bold text-slate-800 shadow-sm">
                  {selectedService.category}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {selectedService.title}
                </h3>
                {getApprovalBadge(selectedService.approvalStatus)}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {selectedService.description}
              </p>

              {/* Technician Info Box */}
              <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Submitted By
                </p>
                <div className="mt-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <p className="text-base font-bold text-slate-900">
                    {selectedService.technicianName}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {selectedService.technicianEmail}
                  </p>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="mt-4 grid grid-cols-2 gap-3.5 text-sm sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <DollarSign size={13} className="text-emerald-600" />
                    <span>Price</span>
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-slate-900">
                    ${selectedService.basePrice}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <Timer size={13} className="text-blue-600" />
                    <span>Duration</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {selectedService.estimatedDuration}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <Briefcase size={13} className="text-indigo-600" />
                    <span>Mode</span>
                  </div>
                  <p className="mt-1 text-sm font-bold capitalize text-slate-900">
                    {selectedService.serviceMode}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <MapPin size={13} className="text-sky-600" />
                    <span>Area</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {selectedService.serviceArea}
                  </p>
                </div>
              </div>

              {/* Modal Footer Approval Controls */}
              {selectedService.approvalStatus === "pending" && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      handleApproval(selectedService._id, "approved")
                    }
                    disabled={processingId === selectedService._id}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    Approve Service
                  </button>

                  <button
                    onClick={() =>
                      handleApproval(selectedService._id, "rejected")
                    }
                    disabled={processingId === selectedService._id}
                    className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700 disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    Reject Service
                  </button>
                </div>
              )}

              {selectedService.approvalStatus === "approved" && (
                <div className="mt-6">
                  <button
                    onClick={() =>
                      handleApproval(selectedService._id, "rejected")
                    }
                    disabled={processingId === selectedService._id}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3.5 text-sm font-bold text-rose-600 transition hover:bg-rose-600 hover:text-white disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    Reject Service
                  </button>
                </div>
              )}

              {selectedService.approvalStatus === "rejected" && (
                <div className="mt-6">
                  <button
                    onClick={() =>
                      handleApproval(selectedService._id, "approved")
                    }
                    disabled={processingId === selectedService._id}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3.5 text-sm font-bold text-emerald-600 transition hover:bg-emerald-600 hover:text-white disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    Approve Service
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}