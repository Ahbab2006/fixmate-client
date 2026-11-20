"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiUrl } from "@/lib/api";
import { toast } from "sonner";
import {
  Sparkles,
  Wrench,
  Tag,
  FileText,
  DollarSign,
  Clock,
  Briefcase,
  MapPin,
  Link2,
  UserCheck,
  Mail,
  ArrowLeft,
  Save,
  Loader2,
  Info,
  Image as ImageIcon,
} from "lucide-react";

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

    if (
      !Number.isFinite(Number(formData.basePrice)) ||
      Number(formData.basePrice) <= 0
    ) {
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
        apiUrl(`/api/services/${id}`),
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
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="rounded-3xl border border-slate-200/80 bg-white px-10 py-12 text-center shadow-sm">
          <Loader2 className="mx-auto animate-spin text-blue-600" size={38} />
          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading service details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* ================= TOP DARK PREMIUM BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-600/25 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <Sparkles size={13} className="text-blue-400" />
                <span>Technician Studio</span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Edit{" "}
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  Service
                </span>
              </h1>
              <p className="mt-1.5 text-sm text-slate-300">
                Modify your service details, pricing, or cover image and
                resubmit for review.
              </p>
            </div>

            <Link
              href="/dashboard/technician/my-services"
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-blue-600 sm:self-auto"
            >
              <ArrowLeft size={16} />
              My Services
            </Link>
          </div>
        </div>

        {/* ================= MAIN EDIT FORM GRID ================= */}
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Service Information Card */}
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Service Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update your listing specifications below.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                {/* Service Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Service Title <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Wrench size={17} />
                    </div>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Service title"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                      required
                    />
                  </div>
                </div>

                {/* Category & Service Mode */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Tag size={17} />
                      </div>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                        required
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Service Mode <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Briefcase size={17} />
                      </div>
                      <select
                        name="serviceMode"
                        value={formData.serviceMode}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                        required
                      >
                        {serviceModes.map((mode) => (
                          <option key={mode} value={mode}>
                            {mode}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Base Price & Estimated Duration */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Base Price ($) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <DollarSign size={17} />
                      </div>
                      <input
                        type="number"
                        name="basePrice"
                        min="1"
                        value={formData.basePrice}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Estimated Duration{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Clock size={17} />
                      </div>
                      <input
                        name="estimatedDuration"
                        value={formData.estimatedDuration}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Service Area */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Service Area <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <MapPin size={17} />
                    </div>
                    <input
                      name="serviceArea"
                      value={formData.serviceArea}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute top-3.5 left-0 flex items-start pl-3.5 text-slate-400">
                      <FileText size={17} />
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Image URL, Preview & Actions */}
          <div className="space-y-6 lg:col-span-5">
            {/* Image Preview & URL Input Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Service Image URL <span className="text-rose-500">*</span>
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Live preview of your service cover image
                  </p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ImageIcon size={18} />
                </span>
              </div>

              {/* Live Cover Image Preview */}
              {formData.image && (
                <div className="relative mt-4 h-48 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100">
                  <img
                    src={formData.image}
                    alt={formData.title || "Service preview"}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Image URL
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Link2 size={17} />
                  </div>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                    required
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  Paste an image URL to change the service image.
                </p>
              </div>
            </div>

            {/* Technician Information Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
              <h3 className="text-base font-extrabold text-slate-900">
                Technician Details
              </h3>
              <div className="mt-4 space-y-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm">
                <div className="flex items-center gap-2.5">
                  <UserCheck size={16} className="shrink-0 text-blue-600" />
                  <span className="text-slate-500">Technician:</span>
                  <strong className="truncate font-bold text-slate-900">
                    {session?.user?.name}
                  </strong>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="shrink-0 text-indigo-600" />
                  <span className="text-slate-500">Email:</span>
                  <strong className="truncate font-semibold text-slate-700">
                    {session?.user?.email}
                  </strong>
                </div>
              </div>

              {/* Re-approval Notice */}
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs text-amber-800">
                <Info size={16} className="mt-0.5 shrink-0 text-amber-600" />
                <p className="leading-relaxed">
                  Updating a service resets its status to{" "}
                  <strong className="font-bold">Pending</strong> until an
                  administrator verifies your changes.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    <span>Update Service</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}