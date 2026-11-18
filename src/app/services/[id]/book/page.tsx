
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Service {
  _id: string;
  title: string;
  category: string;
  image: string;
  basePrice: number;
  technicianName: string;
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
      router.replace("/login");
      return;
    }

    if (session.user.role !== "customer") {
      toast.error("Only customers can book a service.");
      router.replace("/services");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/services/${serviceId}`
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

      const response = await fetch("http://localhost:5000/api/bookings", {
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
    return (
      <div className="flex min-h-screen items-center justify-center gap-3">
        <Loader2 className="animate-spin" />
        Loading booking form...
      </div>
    );
  }

  if (!session || session.user.role !== "customer") {
    return null;
  }

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="text-xl font-bold">Service Not Found</h2>
        <Link href="/services" className="mt-4 text-blue-600 underline">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">

        <Link
          href={`/services/${serviceId}`}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Service
        </Link>

        <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Book Repair Service
          </h1>

          <p className="mt-2 text-gray-500">
            Submit your repair request to the technician.
          </p>

          {/* Selected Service */}
          <div className="mt-6 flex gap-4 rounded-xl bg-gray-50 p-4">
            <img
              src={service.image}
              alt={service.title}
              className="h-24 w-24 rounded-lg object-cover"
            />

            <div>
              <p className="font-bold text-gray-900">{service.title}</p>
              <p className="mt-1 text-sm text-gray-500">
                {service.category}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Technician: {service.technicianName}
              </p>
              <p className="mt-1 font-bold text-blue-600">
                ৳{service.basePrice}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            {/* Customer Information */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Customer Name
              </label>
              <input
                value={session.user.name || ""}
                readOnly
                className="w-full rounded-lg border bg-gray-100 px-4 py-3 text-gray-600 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email Address
              </label>
              <input
                value={session.user.email || ""}
                readOnly
                className="w-full rounded-lg border bg-gray-100 px-4 py-3 text-gray-600 outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Address *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full address"
                required
                rows={3}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Preferred Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Preferred Service Date *
              </label>
              <input
                type="date"
                min={getToday()}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Problem Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Describe Your Problem *
              </label>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Describe the problem with your device (minimum 20 characters)"
                required
                minLength={20}
                rows={5}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum 20 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Booking Request"
              )}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}
