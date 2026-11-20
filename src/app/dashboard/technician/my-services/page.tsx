
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
    Pencil,
  Trash2,
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

const router = useRouter();

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);

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
    if (session) {
      fetchServices();
    }
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
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Services
            </h1>
            <p className="mt-2 text-gray-600">
              Manage and monitor all your repair services.
            </p>
          </div>

          <button
            onClick={fetchServices}
            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Services"
            value={services.length}
            icon={<Package size={22} />}
          />

          <StatCard
            title="Pending"
            value={pendingCount}
            icon={<Clock size={22} />}
          />

          <StatCard
            title="Approved"
            value={approvedCount}
            icon={<CheckCircle size={22} />}
          />

          <StatCard
            title="Rejected"
            value={rejectedCount}
            icon={<XCircle size={22} />}
          />
        </div>

        {/* Services */}
        {services.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center">
            <Package
              size={45}
              className="mx-auto mb-4 text-gray-400"
            />

            <h2 className="text-xl font-semibold text-gray-800">
              No Services Found
            </h2>

            <p className="mt-2 text-gray-500">
              You have not added any services yet.
            </p>
          </div>
        ) : (
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

                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {service.category}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                        service.approvalStatus
                      )}`}
                    >
                      {service.approvalStatus}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900">
                    {service.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {service.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t pt-4 text-sm text-gray-600">
                    <p>
                      <strong>Base Price:</strong> $
                      {service.basePrice}
                    </p>

                    <p>
                      <strong>Duration:</strong>{" "}
                      {service.estimatedDuration}
                    </p>

                    <p>
                      <strong>Mode:</strong> {service.serviceMode}
                    </p>

                    <p>
                      <strong>Area:</strong> {service.serviceArea}
                    </p>
                  </div>


                  {/* Edit and Delete Buttons */}
<div className="mt-4 flex gap-3 border-t pt-4">
  <button
    onClick={() =>
      router.push(
        `/dashboard/technician/edit-service/${service._id}`
      )
    }
    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 py-2.5 font-medium text-blue-600 hover:bg-blue-100"
  >
    <Pencil size={17} />
    Edit
  </button>

  <button
    onClick={() => {
      setServiceToDelete(service);
      setDeleteError(null);
    }}
    disabled={updatingId === service._id}
    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2.5 font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
  >
    <Trash2 size={17} />
    Delete
  </button>
</div>

                  {/* Availability */}
                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Availability
                      </p>

                      <p
                        className={`mt-1 text-sm ${
                          service.isAvailable
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {service.isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAvailability(service)}
                      disabled={updatingId === service._id}
                      className="text-blue-600 disabled:opacity-50"
                      title="Toggle availability"
                    >
                      {service.isAvailable ? (
                        <ToggleRight size={36} />
                      ) : (
                        <ToggleLeft size={36} />
                      )}
                    </button>
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
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <span className="text-blue-600">{icon}</span>
      </div>

      <p className="mt-3 text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}
