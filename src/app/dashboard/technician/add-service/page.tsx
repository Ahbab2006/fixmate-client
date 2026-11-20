
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiUrl } from "@/lib/api";
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

export default function AddServicePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    basePrice: "",
    estimatedDuration: "",
    serviceMode: "",
    serviceArea: "",
  });

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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setImage(file);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select a service image.");
      return;
    }

    if (!session?.user) {
      toast.error("Please login first.");
      router.push(
        `/sign-in?redirect=${encodeURIComponent("/dashboard/technician/add-service")}`
      );
      return;
    }

    if (
      !formData.title.trim() ||
      !formData.category ||
      !formData.description.trim() ||
      !formData.basePrice ||
      !formData.estimatedDuration.trim() ||
      !formData.serviceMode ||
      !formData.serviceArea.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (Number(formData.basePrice) <= 0) {
      toast.error("Base price must be greater than 0.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Get JWT Token
      const tokenResult = await authClient.token();

      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found.");
      }

      // Step 2: Upload image to ImgBB
      const imageData = new FormData();
      imageData.append("image", image);

      const imageResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imageData,
        }
      );

      const imageResult = await imageResponse.json();

      if (!imageResponse.ok || !imageResult.success) {
        throw new Error("Image upload failed.");
      }

      const imageUrl = imageResult.data.url;

      // Step 3: Create service in Backend
      const response = await fetch(
        apiUrl("/api/services"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            basePrice: Number(formData.basePrice),
            image: imageUrl,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create service."
        );
      }

      toast.success("Service submitted for admin approval!");

      setFormData({
        title: "",
        category: "",
        description: "",
        basePrice: "",
        estimatedDuration: "",
        serviceMode: "",
        serviceArea: "",
      });

      setImage(null);

      router.push("/dashboard/technician/my-services");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Add New Service
          </h1>
          <p className="mt-2 text-gray-600">
            Submit your repair service for admin approval.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Service Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Laptop Repair Service"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your repair service..."
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Base Price ($)
              </label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                min="1"
                placeholder="50"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Estimated Duration
              </label>
              <input
                type="text"
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleChange}
                placeholder="e.g. 2-3 Hours"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Service Mode
            </label>
            <select
              name="serviceMode"
              value={formData.serviceMode}
              onChange={handleChange}
              className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Service Mode</option>
              {serviceModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Service Area
            </label>
            <input
              type="text"
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              placeholder="e.g. Sylhet City"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Service Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-lg border p-3"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Maximum image size: 5MB.
            </p>
            {image && (
              <p className="mt-2 text-sm text-green-700">
                Selected: {image.name}
              </p>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 font-semibold text-gray-800">
              Technician Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm text-gray-500">
                  Technician Name
                </label>
                <input
                  value={session?.user?.name || ""}
                  readOnly
                  className="w-full rounded-lg border bg-gray-100 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-500">
                  Technician Email
                </label>
                <input
                  value={session?.user?.email || ""}
                  readOnly
                  className="w-full rounded-lg border bg-gray-100 px-4 py-3"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Service"}
          </button>
        </form>
      </div>
    </div>
  );
}
