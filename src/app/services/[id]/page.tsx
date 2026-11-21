
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Wrench,
  Loader2,
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

export default function ServiceDetailsPage() {
  const params = useParams();

  const serviceId = params.id as string;

  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, [serviceId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 bg-slate-50 text-slate-700 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-300">
        <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" />
        Loading service details...
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center transition-colors duration-200 dark:bg-slate-950">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Service Not Found
        </h2>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {error || "This service is unavailable."}
        </p>

        <Link
          href="/services"
          className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/services"
          className="mb-7 inline-flex items-center gap-2 font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
        >
          <ArrowLeft size={18} />
          Back to Services
        </Link>

        <div className="grid gap-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2">

          {/* Service Image */}
          <div className="bg-slate-100 dark:bg-slate-800">
            <img
              src={service.image}
              alt={service.title}
              className="h-full min-h-80 w-full object-cover"
            />
          </div>

          {/* Service Information */}
          <div className="p-6 sm:p-8">

            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              {service.category}
            </span>

            <h1 className="mt-5 text-3xl font-extrabold text-slate-900 dark:text-white">
              {service.title}
            </h1>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
              {service.description}
            </p>

            <div className="mt-7 space-y-5">

              <div className="flex items-center gap-3">
                <Wrench className="text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Technician</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {service.technicianName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Estimated Duration
                  </p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {service.estimatedDuration}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Service Area
                  </p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {service.serviceArea}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Service Mode</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {service.serviceMode}
                </p>
              </div>

            </div>

            <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Starting Price
              </p>

              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                ${service.basePrice}
              </p>

              {isRestrictedRole ? (
                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    onClick={(e) => e.preventDefault()}
                    className="block w-full cursor-not-allowed rounded-xl bg-slate-100 px-6 py-3 text-center font-semibold text-slate-400 transition dark:bg-slate-800 dark:text-slate-500"
                  >
                    Book This Service
                  </button>
                  <p className="text-center text-sm font-medium text-amber-600 dark:text-amber-400">
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
                  className="mt-5 block w-full rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                >
                  Book This Service
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
