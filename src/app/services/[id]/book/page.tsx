"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Calendar,
  MapPin,
  Phone,
  User,
  Mail,
  FileText,
  ShieldCheck,
  CalendarCheck,
  ChevronRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Wrench,
  Clock,
} from "lucide-react";
import { apiUrl } from "@/lib/api";

interface Service {
  _id: string;
  title: string;
  category: string;
  image: string;
  basePrice: number;
  technicianName: string;
  estimatedDuration?: string;
  serviceMode?: string;
}

function BookingPageSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:py-12 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 h-5 w-48 rounded-md bg-slate-200 dark:bg-slate-800" />

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Form Column Skeleton */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            <div className="space-y-3">
              <div className="h-8 w-2/3 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-1/2 rounded bg-slate-200/70 dark:bg-slate-800/70" />
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-1/2 rounded bg-slate-200/70 dark:bg-slate-800/70" />
                </div>
              </div>
              <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-slate-200/70 dark:bg-slate-800/70" />
                <div className="h-4 w-4/5 rounded bg-slate-200/70 dark:bg-slate-800/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const { data: session, isPending } = authClient.useSession();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const targetUrl = `/services/${serviceId}/book${search}`;
      router.replace(
        `/sign-in?redirect=${encodeURIComponent(targetUrl)}`
      );
      return;
    }

    if (session.user.role !== "customer") {
      toast.error("Only customers can book a service.");
      router.replace("/services");
    }
  }, [session, isPending, router, serviceId]);

  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
      try {
        const response = await fetch(
          apiUrl(`/api/services/${serviceId}`)
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Service not found.");
        }

        setService(data.service);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load service."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!phone.trim() || !address.trim() || !preferredDate || !problemDescription.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (problemDescription.trim().length < 20) {
      toast.error("Problem description must be at least 20 characters.");
      return;
    }

    if (preferredDate < getToday()) {
      toast.error("Please select today or a future date.");
      return;
    }

    try {
      setSubmitting(true);

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(apiUrl("/api/bookings"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId,
          customerPhone: phone.trim(),
          address: address.trim(),
          preferredDate,
          problemDescription: problemDescription.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Booking request failed.");
      }

      toast.success("Repair request submitted successfully!");

      router.push("/dashboard/customer/my-bookings");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return <BookingPageSkeleton />;
  }

  if (!session || session.user.role !== "customer") {
    return null;
  }

  if (!service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16 transition-colors duration-200 dark:bg-slate-950 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-8 text-center shadow-lg shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900 sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
            <AlertCircle size={32} />
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Service Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            This service may have been deactivated or removed from FixMate.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
          >
            <ArrowLeft size={16} />
            <span>Back to Services</span>
          </Link>
        </div>
      </main>
    );
  }

  const descLength = problemDescription.trim().length;

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
            href={`/services/${serviceId}`}
            className="transition hover:text-blue-600 dark:hover:text-blue-400"
          >
            {service.title}
          </Link>
          <ChevronRight size={13} className="text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Book Service
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <Link
            href={`/services/${serviceId}`}
            className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeft size={15} />
            <span>Back to Service Details</span>
          </Link>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            Schedule Your{" "}
            <span className="font-editorial italic font-normal text-blue-600 dark:text-blue-400">
              Repair Request
            </span>
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Complete the details below to dispatch your verified specialist. Transparent pricing with no upfront deposit.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ================= LEFT / BOOKING FORM ================= */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Section 1: Customer Contact Info */}
                <div>
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                      1
                    </span>
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Customer Contact Details
                    </h2>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {/* Read-Only Name */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <User size={13} className="text-slate-400" />
                        <span>Customer Name</span>
                      </label>
                      <input
                        value={session.user.name || ""}
                        readOnly
                        aria-label="Customer Name"
                        className="w-full min-h-[44px] rounded-xl border border-slate-200/80 bg-slate-100/70 px-3.5 py-2.5 text-xs font-medium text-slate-600 outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400"
                      />
                    </div>

                    {/* Read-Only Email */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Mail size={13} className="text-slate-400" />
                        <span>Email Address</span>
                      </label>
                      <input
                        value={session.user.email || ""}
                        readOnly
                        aria-label="Email Address"
                        className="w-full min-h-[44px] rounded-xl border border-slate-200/80 bg-slate-100/70 px-3.5 py-2.5 text-xs font-medium text-slate-600 outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="mt-4">
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <Phone size={13} className="text-blue-600 dark:text-blue-400" />
                      <span>Phone Number <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +880 1700 000000"
                      required
                      className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
                    />
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      The technician will call this number to confirm arrival details.
                    </p>
                  </div>
                </div>

                {/* Section 2: Service Location & Schedule */}
                <div>
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                      2
                    </span>
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Location & Preferred Schedule
                    </h2>
                  </div>

                  {/* Address */}
                  <div className="mt-4">
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <MapPin size={13} className="text-blue-600 dark:text-blue-400" />
                      <span>Service Address <span className="text-rose-500">*</span></span>
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter house, road, apartment, or landmark details"
                      required
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
                    />
                  </div>

                  {/* Preferred Date */}
                  <div className="mt-4">
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <Calendar size={13} className="text-blue-600 dark:text-blue-400" />
                      <span>Preferred Service Date <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      type="date"
                      min={getToday()}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      required
                      className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
                    />
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Earliest available dispatch starts from today.
                    </p>
                  </div>
                </div>

                {/* Section 3: Problem Description */}
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                        3
                      </span>
                      <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Problem Details
                      </h2>
                    </div>

                    <span
                      className={`text-[11px] font-mono font-semibold transition-colors ${
                        descLength >= 20
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {descLength}/20 min chars
                    </span>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <FileText size={13} className="text-blue-600 dark:text-blue-400" />
                      <span>Describe Your Device Issue <span className="text-rose-500">*</span></span>
                    </label>
                    <textarea
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      placeholder="Please describe symptoms, device brand, model, or specific issues (minimum 20 characters)..."
                      required
                      minLength={20}
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
                    />
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Detailed diagnostic notes help the specialist arrive with the right replacement parts and tools.
                    </p>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Submitting Booking Request...</span>
                      </>
                    ) : (
                      <>
                        <CalendarCheck size={18} />
                        <span>Submit Booking Request</span>
                      </>
                    )}
                  </button>

                  <div className="mt-3.5 flex items-center justify-center gap-2 text-center text-xs text-slate-500 dark:text-slate-400">
                    <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Free booking request. Pay after the service is performed.</span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* ================= RIGHT / STICKY BOOKING SUMMARY ================= */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Booking Summary
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-600/15 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-500/20">
                  <Sparkles size={11} />
                  Verified
                </span>
              </div>

              {/* Service Header Info */}
              <div className="mt-5 flex gap-4">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-black/5 dark:ring-white/10"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    {service.category}
                  </span>
                  <p className="truncate text-base font-bold text-slate-900 dark:text-white">
                    {service.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Wrench size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">{service.technicianName}</span>
                  </p>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="mt-6 space-y-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-950/60 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Base Service Fee</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    ${service.basePrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Platform & Diagnostic Fee</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    $0.00 (Waived)
                  </span>
                </div>

                <div className="border-t border-slate-200/80 pt-2.5 dark:border-slate-800 flex items-baseline justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Estimated Total
                  </span>
                  <div className="text-right">
                    <span className="font-mono text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                      ${service.basePrice.toFixed(2)}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Pay upon completion
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Pillars */}
              <div className="mt-6 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>100% Background-verified specialist</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Direct phone coordination with technician</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Free cancellation before technician dispatch</span>
                </div>
              </div>

              {/* Back to Service Link */}
              <div className="mt-6 border-t border-slate-100 pt-4 text-center dark:border-slate-800">
                <Link
                  href={`/services/${serviceId}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  <ArrowLeft size={13} />
                  <span>Review Service Specifications</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
