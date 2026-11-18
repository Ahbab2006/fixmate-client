
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const serviceModes = ["Home Visit", "Shop Drop-off"];

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: session } = authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    basePrice: "",
    estimatedDuration: "",
    serviceMode: "",
    serviceArea: "",
    image: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (tokenResult.error || !token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(
          "http://localhost:5000/api/services/my-services",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load service.");
        }

        const service = result.services?.find(
          (item: { _id: string }) => item._id === id
        );

        if (!service) {
          throw new Error("Service not found.");
        }

        setFormData({
          title: service.title,
          category: service.category,
          description: service.description,
          basePrice: String(service.basePrice),
          estimatedDuration: service.estimatedDuration,
          serviceMode: service.serviceMode,
          serviceArea: service.serviceArea,
          image: service.image,
        });
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );
        router.replace("/dashboard/technician/my-services");
      } finally {
        setLoading(false);
      }
    };

    if (session && id) {
      fetchService();
    }
  }, [session, id, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.category ||
      !formData.description.trim() ||
      !formData.basePrice ||
      !formData.estimatedDuration.trim() ||
      !formData.serviceMode ||
      !formData.serviceArea.trim() ||
      !formData.image.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!Number.isFinite(Number(formData.basePrice)) ||
        Number(formData.basePrice) <= 0) {
      toast.error("Base price must be greater than 0.");
      return;
    }

    try {
      setSaving(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `http://localhost:5000/api/services/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            basePrice: Number(formData.basePrice),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update service.");
      }

      toast.success(
        "Service updated! It is now pending admin approval."
      );

      router.push("/dashboard/technician/my-services");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading service...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Edit Service
        </h1>

        <p className="mb-8 text-gray-600">
          Update your service information.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block font-medium">Service Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border bg-white px-4 py-3"
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border px-4 py-3"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">Base Price (৳)</label>
              <input
                type="number"
                name="basePrice"
                min="1"
                value={formData.basePrice}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Estimated Duration</label>
              <input
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium">Service Mode</label>
            <select
              name="serviceMode"
              value={formData.serviceMode}
              onChange={handleChange}
              className="w-full rounded-lg border bg-white px-4 py-3"
              required
            >
              {serviceModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">Service Area</label>
            <input
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Service Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Paste an image URL to change the service image.
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            <p><strong>Technician:</strong> {session?.user?.name}</p>
            <p><strong>Email:</strong> {session?.user?.email}</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-lg border py-3 font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
