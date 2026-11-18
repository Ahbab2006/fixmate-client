
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
} from "lucide-react";

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
  createdAt: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const fetchPendingServices = async () => {
    try {
      setLoading(true);

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        "http://localhost:5000/api/services/admin/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    fetchPendingServices();
  }, []);

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
        `http://localhost:5000/api/services/admin/${serviceId}/approval`,
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

      setServices((prev) =>
        prev.filter((service) => service._id !== serviceId)
      );

      if (selectedService?._id === serviceId) {
        setSelectedService(null);
      }

      toast.success(data.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setProcessingId("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Manage Services
            </h1>
            <p className="mt-2 text-gray-500">
              Review and manage technician service requests.
            </p>
          </div>

          <button
            onClick={fetchPendingServices}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 font-medium hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Pending Count */}
        <div className="mb-7 rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-yellow-100 p-3 text-yellow-700">
              <Clock size={25} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Pending Services</p>
              <h2 className="text-2xl font-bold text-gray-900">
                {services.length}
              </h2>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        )}

        {/* Empty */}
        {!loading && services.length === 0 && (
          <div className="rounded-xl border bg-white py-16 text-center">
            <CheckCircle className="mx-auto text-green-500" size={45} />
            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No Pending Services
            </h2>
            <p className="mt-2 text-gray-500">
              All service requests have been reviewed.
            </p>
          </div>
        )}

        {/* Service List */}
        {!loading && services.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                      {service.category}
                    </span>

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                      Pending
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-gray-900">
                    {service.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {service.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Technician:</strong> {service.technicianName}
                    </p>
                    <p>
                      <strong>Email:</strong> {service.technicianEmail}
                    </p>
                    <p>
                      <strong>Price:</strong> ৳{service.basePrice}
                    </p>
                    <p>
                      <strong>Duration:</strong> {service.estimatedDuration}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedService(service)}
                    className="mt-5 w-full rounded-lg border border-blue-600 py-2 font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    View Details
                  </button>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        handleApproval(service._id, "approved")
                      }
                      disabled={processingId === service._id}
                      className="flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle size={17} />
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        handleApproval(service._id, "rejected")
                      }
                      disabled={processingId === service._id}
                      className="flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      <XCircle size={17} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Service Details</h2>

              <button
                onClick={() => setSelectedService(null)}
                className="text-2xl text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            </div>

            <img
              src={selectedService.image}
              alt={selectedService.title}
              className="mt-5 h-52 w-full rounded-xl object-cover"
            />

            <h3 className="mt-4 text-2xl font-bold">
              {selectedService.title}
            </h3>

            <p className="mt-2 text-gray-600">
              {selectedService.description}
            </p>

            <div className="mt-5 space-y-3 text-sm text-gray-700">
              <p><strong>Category:</strong> {selectedService.category}</p>
              <p><strong>Technician:</strong> {selectedService.technicianName}</p>
              <p><strong>Email:</strong> {selectedService.technicianEmail}</p>
              <p><strong>Price:</strong> ৳{selectedService.basePrice}</p>
              <p><strong>Duration:</strong> {selectedService.estimatedDuration}</p>
              <p><strong>Service Mode:</strong> {selectedService.serviceMode}</p>
              <p><strong>Service Area:</strong> {selectedService.serviceArea}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  handleApproval(selectedService._id, "approved")
                }
                disabled={processingId === selectedService._id}
                className="rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                Approve
              </button>

              <button
                onClick={() =>
                  handleApproval(selectedService._id, "rejected")
                }
                disabled={processingId === selectedService._id}
                className="rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
