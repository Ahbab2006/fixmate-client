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
  Mail,
  ShieldCheck,
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
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    service: Service;
    action: "approved" | "rejected";
  } | null>(null);
  const [confirmationError, setConfirmationError] = useState<string | null>(null);

  const fetchServices = async (targetFilter: FilterStatus = filter) => {
    try {
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
    let isMounted = true;

    (async () => {
      if (isMounted) {
        await fetchServices("pending");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFilterChange = (newFilter: FilterStatus) => {
    setFilter(newFilter);
    setLoading(true);
    fetchServices(newFilter);
  };

  const processApproval = async (
    serviceId: string,
    approvalStatus: "approved" | "rejected"
  ) => {
    if (processingId) return;

    try {
      setProcessingId(serviceId);
      setActionType(approvalStatus);
      setConfirmationError(null);

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
        throw new Error(
          data.message ||
            (approvalStatus === "approved"
              ? "Failed to approve service."
              : "Failed to reject service.")
        );
      }

      if (approvalStatus === "approved") {
        toast.success("Service Approved", {
          description:
            "The service has been verified and published to the public directory.",
        });
      } else {
        toast.success("Service Rejected", {
          description: "The service submission has been rejected.",
        });
      }

      setPendingConfirmation(null);
      setConfirmationError(null);

      if (selectedService?._id === serviceId) {
        setSelectedService(null);
      }

      await fetchServices(filter);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong.";
      setConfirmationError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProcessingId("");
      setActionType(null);
    }
  };

  const handleInitiateApprove = (service: Service) => {
    if (processingId) return;
    setConfirmationError(null);
    setPendingConfirmation({ service, action: "approved" });
  };

  const handleInitiateReject = (service: Service) => {
    if (processingId) return;
    setConfirmationError(null);
    setPendingConfirmation({ service, action: "rejected" });
  };

  const confirmApprovalAction = async () => {
    if (!pendingConfirmation || processingId) return;
    await processApproval(pendingConfirmation.service._id, pendingConfirmation.action);
  };

  const closeConfirmation = () => {
    if (!processingId) {
      setPendingConfirmation(null);
      setConfirmationError(null);
    }
  };

  const getApprovalBadge = (status: Service["approvalStatus"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending Review
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

  return (
    <main className="min-h-screen bg-slate-50/50 pb-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ================= EDITORIAL TOP BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-500/10 blur-[80px] dark:bg-blue-600/15" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-600/10" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
                <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
                <span className="font-mono text-[11px] uppercase tracking-wider">Service Moderation</span>
              </div>
              <h1 className="mt-3 font-serif text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Catalog <span className="italic">Verification</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review technician service proposals, audit repair specifications, and authorize public directory listings.
              </p>
            </div>

            <button
              onClick={() => {
                setLoading(true);
                fetchServices(filter);
              }}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 sm:self-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>

        {/* ================= FILTER TABS & SUMMARY BAR ================= */}
        <div className="grid gap-5 lg:grid-cols-12 lg:items-center">
          {/* Status Filter Tabs */}
          <div className="lg:col-span-8">
            <div className="inline-flex flex-wrap gap-1.5 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
              {filterTabs.map((tab) => {
                const active = filter === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleFilterChange(tab.value)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                      active
                        ? "bg-slate-900 text-white shadow-sm dark:bg-blue-600"
                        : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Counter */}
          <div className="lg:col-span-4 lg:text-right">
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              Catalog Filter:{" "}
              <strong className="font-mono font-bold text-slate-900 dark:text-white">
                {services.length}
              </strong>{" "}
              services matching
            </span>
          </div>
        </div>

        {/* ================= LOADING SKELETON ================= */}
        {loading && <ServicesSkeleton />}

        {/* ================= EMPTY STATE ================= */}
        {!loading && services.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <Layers size={26} />
            </div>
            <h2 className="mt-4 font-serif text-xl font-normal text-slate-900 dark:text-white">
              {filter === "pending"
                ? "No Pending Submissions"
                : filter === "all"
                ? "No Services Found"
                : `No ${
                    filter.charAt(0).toUpperCase() + filter.slice(1)
                  } Listings`}
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              {filter === "pending"
                ? "All technician service submissions have been reviewed and verified."
                : `There are currently no listings matching the "${filter}" filter criteria.`}
            </p>
          </div>
        )}

        {/* ================= SERVICE CARDS GRID ================= */}
        {!loading && services.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
              >
                {/* Service Image Cover */}
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

                  <span className="absolute top-3.5 left-3.5 rounded-full border border-white/40 bg-white/95 px-3 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200">
                    {service.category}
                  </span>

                  <div className="absolute top-3.5 right-3.5">
                    {getApprovalBadge(service.approvalStatus)}
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h2 className="line-clamp-1 font-serif text-lg font-normal tracking-tight text-slate-900 dark:text-white">
                      {service.title}
                    </h2>

                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {service.description}
                    </p>

                    {/* Key Specs Box */}
                    <div className="mt-4 space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-950/50">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          <UserCheck size={13} className="text-blue-600 dark:text-blue-400" />
                          Technician
                        </span>
                        <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                          {service.technicianName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          <DollarSign size={13} className="text-emerald-600 dark:text-emerald-400" />
                          Base Price
                        </span>
                        <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                          ${service.basePrice}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          <Timer size={13} className="text-indigo-600 dark:text-indigo-400" />
                          Duration
                        </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {service.estimatedDuration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedService(service)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <Eye size={14} />
                      <span>Inspect Specifications</span>
                    </button>

                    {service.approvalStatus === "pending" && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleInitiateApprove(service)}
                          disabled={Boolean(processingId)}
                          className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                          {processingId === service._id && actionType === "approved" ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              <span>Approving...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle size={14} />
                              <span>Approve</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleInitiateReject(service)}
                          disabled={Boolean(processingId)}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400"
                        >
                          {processingId === service._id && actionType === "rejected" ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              <span>Rejecting...</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={14} />
                              <span>Reject</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {service.approvalStatus === "approved" && (
                      <button
                        onClick={() => handleInitiateReject(service)}
                        disabled={Boolean(processingId)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400"
                      >
                        {processingId === service._id && actionType === "rejected" ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Revoking...</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={14} />
                            <span>Revoke Approval</span>
                          </>
                        )}
                      </button>
                    )}

                    {service.approvalStatus === "rejected" && (
                      <button
                        onClick={() => handleInitiateApprove(service)}
                        disabled={Boolean(processingId)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {processingId === service._id && actionType === "approved" ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Approving...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} />
                            <span>Re-approve Listing</span>
                          </>
                        )}
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
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-5 dark:border-slate-800 dark:bg-slate-900/60">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Listing Review & Audit
                </span>
                <h2 className="mt-0.5 font-serif text-lg font-normal tracking-tight text-slate-900 dark:text-white">
                  Service Dossier
                </h2>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="relative h-56 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-3.5 left-3.5 rounded-full border border-white/40 bg-white/95 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200">
                  {selectedService.category}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-xl font-normal tracking-tight text-slate-900 dark:text-white">
                  {selectedService.title}
                </h3>
                {getApprovalBadge(selectedService.approvalStatus)}
              </div>

              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {selectedService.description}
              </p>

              {/* Technician Info Box */}
              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-slate-950/50">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Authoring Specialist
                </span>
                <div className="mt-1.5 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {selectedService.technicianName}
                  </p>
                  <p className="font-mono text-slate-500 dark:text-slate-400">
                    {selectedService.technicianEmail}
                  </p>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/50">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Base Price
                  </span>
                  <p className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-white">
                    ${selectedService.basePrice}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/50">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Est. Duration
                  </span>
                  <p className="mt-1 font-medium text-slate-900 dark:text-white">
                    {selectedService.estimatedDuration}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/50">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Service Mode
                  </span>
                  <p className="mt-1 font-medium capitalize text-slate-900 dark:text-white">
                    {selectedService.serviceMode}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/50">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Coverage Area
                  </span>
                  <p className="mt-1 truncate font-medium text-slate-900 dark:text-white">
                    {selectedService.serviceArea}
                  </p>
                </div>
              </div>

              {/* Modal Footer Controls */}
              {selectedService.approvalStatus === "pending" && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleInitiateApprove(selectedService)}
                    disabled={Boolean(processingId)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    {processingId === selectedService._id && actionType === "approved" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Approving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        <span>Approve Listing</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleInitiateReject(selectedService)}
                    disabled={Boolean(processingId)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 py-3 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400"
                  >
                    {processingId === selectedService._id && actionType === "rejected" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Rejecting...</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} />
                        <span>Reject Listing</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Service Approval & Rejection */}
      <ConfirmationModal
        isOpen={Boolean(pendingConfirmation)}
        onClose={closeConfirmation}
        onConfirm={confirmApprovalAction}
        title={
          pendingConfirmation?.action === "approved"
            ? "Approve This Service Listing?"
            : "Reject This Service Listing?"
        }
        description={
          pendingConfirmation?.action === "approved"
            ? "Are you sure you want to approve this service? It will become publicly visible and bookable by customers."
            : "Are you sure you want to reject this service? The technician will be notified of the decision."
        }
        confirmText={
          pendingConfirmation?.action === "approved"
            ? "Yes, Approve Listing"
            : "Yes, Reject Listing"
        }
        cancelText="Cancel"
        loadingText={
          pendingConfirmation?.action === "approved"
            ? "Approving..."
            : "Rejecting..."
        }
        isLoading={Boolean(
          processingId &&
            pendingConfirmation &&
            pendingConfirmation.service._id === processingId
        )}
        error={confirmationError}
        variant={
          pendingConfirmation?.action === "approved" ? "success" : "danger"
        }
      />
    </main>
  );
}

function ServicesSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-80 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90"
        />
      ))}
    </div>
  );
}
