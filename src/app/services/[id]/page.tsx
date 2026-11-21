"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Wrench,
  UserCheck,
  Briefcase,
  ShieldCheck,
  CalendarCheck,
  AlertCircle,
  Mail,
  ChevronRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { apiUrl } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

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
}

function ServiceDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:py-12 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 h-5 w-48 rounded-md bg-slate-200 dark:bg-slate-800" />

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Main Column Skeleton */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            <div className="h-72 w-full rounded-3xl bg-slate-200 dark:bg-slate-800 sm:h-96 md:h-[420px]" />
            <div className="space-y-3">
              <div className="h-6 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-9 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-full rounded bg-slate-200/70 dark:bg-slate-800/70" />
              <div className="h-4 w-5/6 rounded bg-slate-200/70 dark:bg-slate-800/70" />
            </div>

            {/* Specs Grid Skeleton */}
            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-10 w-28 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-slate-200/70 dark:bg-slate-800/70" />
                <div className="h-4 w-3/4 rounded bg-slate-200/70 dark:bg-slate-800/70" />
              </div>
              <div className="mt-4 h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ServiceDetailsPage() {
  const params = useParams();

  const serviceId = params.id as string;

  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const userRole = session?.user?.role;
  const isRestrictedRole =
    Boolean(session?.user) &&
    (userRole === "technician" || userRole === "admin" || userRole !== "customer");

  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          apiUrl(`/api/services/${serviceId}`)
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load service details."
          );
        }

        setService(data.service);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, retryKey]);

  if (loading) {
    return <ServiceDetailsSkeleton />;
  }

  if (error || !service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16 transition-colors duration-200 dark:bg-slate-950 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-8 text-center shadow-lg shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900 sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
            <AlertCircle size={32} />
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {error ? "Service Unavailable" : "Service Not Found"}
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {error || "The service you are looking for does not exist or may have been removed."}
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {error && (
              <button
                type="button"
                onClick={() => setRetryKey((k) => k + 1)}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 sm:w-auto"
              >
                <RefreshCw size={15} />
                <span>Try Again</span>
              </button>
            )}

            <Link
              href="/services"
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
            >
              <ArrowLeft size={16} />
              <span>Back to Services</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 transition-colors duration-200 dark:bg-slate-950 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link href="/" className="transition hover:text-blue-600 dark:hover:text-blue-400">
            Home
          </Link>
          <ChevronRight size={13} className="text-slate-400" />
          <Link href="/services" className="transition hover:text-blue-600 dark:hover:text-blue-400">
            Services
          </Link>
          <ChevronRight size={13} className="text-slate-400" />
          <Link
            href={`/services?category=${encodeURIComponent(service.category)}`}
            className="transition hover:text-blue-600 dark:hover:text-blue-400"
          >
            {service.category}
          </Link>
          <ChevronRight size={13} className="text-slate-400" />
          <span className="max-w-[180px] truncate font-semibold text-slate-800 dark:text-slate-200 sm:max-w-xs">
            {service.title}
          </span>
        </div>

        {/* Main 2-Column Responsive Grid */}
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ================= LEFT / MAIN CONTENT ================= */}
          <div className="space-y-8 lg:col-span-7 xl:col-span-8">
            {/* Service Hero Showcase Image */}
            <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:h-96 md:h-[420px]">
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/15 to-transparent" />

              <span className="absolute top-4 left-4 rounded-full border border-white/20 bg-slate-950/75 px-3.5 py-1 text-xs font-semibold text-white shadow-xs backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200">
                {service.category}
              </span>

              <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                <Briefcase size={13} className="text-blue-400" />
                {service.serviceMode}
              </span>
            </div>

            {/* Overview & Description */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-600/15 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-500/20">
                <Sparkles size={13} className="text-blue-600 dark:text-blue-400" />
                <span>{service.category} Solution</span>
              </span>

              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
                {service.title}
              </h1>

              <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  About This Service
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Service Specifications Bento Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Assigned Specialist */}
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-600/15 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-500/20">
                  <UserCheck size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Assigned Specialist
                  </p>
                  <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                    {service.technicianName}
                  </p>
                  {service.technicianEmail && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <Mail size={12} className="shrink-0" />
                      <span className="truncate">{service.technicianEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Delivery Mode */}
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600/15 dark:bg-indigo-950/50 dark:text-indigo-400 dark:ring-indigo-500/20">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Fulfillment Mode
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                    {service.serviceMode}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {service.serviceMode === "Home Visit"
                      ? "Specialist visits your address"
                      : "Drop off at service center"}
                  </p>
                </div>
              </div>

              {/* Estimated Turnaround */}
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-600/15 dark:bg-sky-950/50 dark:text-sky-400 dark:ring-sky-500/20">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Estimated Duration
                  </p>
                  <p className="mt-1 text-sm font-bold font-mono text-slate-900 dark:text-white sm:text-base">
                    {service.estimatedDuration}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Typical completion window
                  </p>
                </div>
              </div>

              {/* Service Coverage Area */}
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/15 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-500/20">
                  <MapPin size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Service Area
                  </p>
                  <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                    {service.serviceArea}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Local service territory
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT / STICKY BOOKING SUMMARY SIDEBAR ================= */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              {/* Price Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
                <div>
                  <p className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Starting Base Price
                  </p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white sm:text-4xl">
                      ${service.basePrice}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      / flat base rate
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/20">
                  <ShieldCheck size={13} />
                  Verified
                </span>
              </div>

              {/* Service Summary Checklist */}
              <div className="my-6 space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Clock size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    Estimated duration:{" "}
                    <strong className="font-semibold text-slate-900 dark:text-white">
                      {service.estimatedDuration}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Briefcase size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    Fulfillment:{" "}
                    <strong className="font-semibold text-slate-900 dark:text-white">
                      {service.serviceMode}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <MapPin size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    Location:{" "}
                    <strong className="font-semibold text-slate-900 dark:text-white">
                      {service.serviceArea}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Wrench size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    Specialist:{" "}
                    <strong className="font-semibold text-slate-900 dark:text-white">
                      {service.technicianName}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Booking CTA Button & Role-Based Rules */}
              <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
                {isRestrictedRole ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      onClick={(e) => e.preventDefault()}
                      className="block min-h-[48px] w-full cursor-not-allowed rounded-xl bg-slate-100 px-6 py-3.5 text-center text-sm font-semibold text-slate-400 transition dark:bg-slate-800 dark:text-slate-500"
                    >
                      Book This Service
                    </button>
                    <p className="text-center text-xs font-medium text-amber-600 dark:text-amber-400">
                      Only customers can book services.
                    </p>
                  </div>
                ) : (
                  <Link
                    href={
                      !session && !isSessionPending
                        ? `/sign-in?redirect=${encodeURIComponent(`/services/${service._id}/book`)}`
                        : `/services/${service._id}/book`
                    }
                    className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.01] active:scale-[0.99] sm:text-base"
                  >
                    <CalendarCheck size={18} />
                    <span>Book This Service</span>
                  </Link>
                )}
              </div>

              {/* Secondary Back Link */}
              <div className="mt-4 text-center">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  <ArrowLeft size={14} />
                  <span>Browse More Services</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
