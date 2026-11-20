
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Wrench,
  Loader2,
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
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="flex min-h-screen items-center justify-center gap-3">
        <Loader2 className="animate-spin" />
        Loading service details...
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Service Not Found
        </h2>

        <p className="mt-2 text-gray-500">
          {error || "This service is unavailable."}
        </p>

        <Link
          href="/services"
          className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">

        <button
          onClick={() => router.back()}
          className="mb-7 flex items-center gap-2 font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid gap-8 overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-2">

          {/* Service Image */}
          <div>
            <img
              src={service.image}
              alt={service.title}
              className="h-full min-h-80 w-full object-cover"
            />
          </div>

          {/* Service Information */}
          <div className="p-6 sm:p-8">

            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              {service.category}
            </span>

            <h1 className="mt-5 text-3xl font-bold text-gray-900">
              {service.title}
            </h1>

            <p className="mt-4 leading-7 text-gray-600">
              {service.description}
            </p>

            <div className="mt-7 space-y-5">

              <div className="flex items-center gap-3">
                <Wrench className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Technician</p>
                  <p className="font-semibold text-gray-800">
                    {service.technicianName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">
                    Estimated Duration
                  </p>
                  <p className="font-semibold text-gray-800">
                    {service.estimatedDuration}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">
                    Service Area
                  </p>
                  <p className="font-semibold text-gray-800">
                    {service.serviceArea}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Service Mode</p>
                <p className="font-semibold text-gray-800">
                  {service.serviceMode}
                </p>
              </div>

            </div>

            <div className="mt-8 border-t pt-6">
              <p className="text-sm text-gray-500">
                Starting Price
              </p>

              <p className="text-3xl font-bold text-blue-600">
                ${service.basePrice}
              </p>

              <Link
                href={`/services/${service._id}/book`}
                className="mt-5 block w-full rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
              >
                Book This Service
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
