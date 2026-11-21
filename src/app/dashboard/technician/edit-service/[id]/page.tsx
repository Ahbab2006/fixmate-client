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
  Lock,
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
    return <EditServiceSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* ================= EDITORIAL TOP BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-500/10 blur-[80px] dark:bg-blue-600/15" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-600/10" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
                <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
                <span className="font-mono text-[11px] uppercase tracking-wider">Listing Revision</span>
              </div>
              <h1 className="mt-3 font-serif text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Edit <span className="italic">Service</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Modify your service specifications, pricing, or imagery and resubmit for verification.
              </p>
            </div>

            <Link
              href="/dashboard/technician/my-services"
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 sm:self-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <ArrowLeft size={15} />
              <span>Cancel & Return</span>
            </Link>
          </div>
        </div>

        {/* ================= MAIN EDIT FORM GRID ================= */}
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Service Information Card */}
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/90">
              <div className="border-b border-slate-100 pb-5 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  <Wrench size={13} />
                  <span>Specification Revision</span>
                </div>
                <h2 className="mt-1 font-serif text-xl font-normal tracking-tight text-slate-900 dark:text-white">
                  Service Information
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Update your listing parameters, base price, and service coverage below.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                {/* Service Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Service Title <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Wrench size={16} />
                    </div>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Service title"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                      required
                    />
                  </div>
                </div>

                {/* Category & Service Mode */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Tag size={16} />
                      </div>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Service Mode <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Briefcase size={16} />
                      </div>
                      <select
                        name="serviceMode"
                        value={formData.serviceMode}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Base Price ($) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <DollarSign size={16} />
                      </div>
                      <input
                        type="number"
                        name="basePrice"
                        min="1"
                        value={formData.basePrice}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 font-mono text-sm font-semibold text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Estimated Duration{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Clock size={16} />
                      </div>
                      <input
                        name="estimatedDuration"
                        value={formData.estimatedDuration}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Service Area */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Service Area / Region <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <MapPin size={16} />
                    </div>
                    <input
                      name="serviceArea"
                      value={formData.serviceArea}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Service Description & Scope <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute top-3.5 left-0 flex items-start pl-3.5 text-slate-400">
                      <FileText size={16} />
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
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
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900/90">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <h2 className="font-serif text-base font-normal tracking-tight text-slate-900 dark:text-white">
                    Cover Imagery URL <span className="text-rose-500">*</span>
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Live preview of your published service thumbnail
                  </p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <ImageIcon size={16} />
                </span>
              </div>

              {/* Live Cover Image Preview */}
              {formData.image && (
                <div className="relative mt-4 h-48 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
                  <img
                    src={formData.image}
                    alt={formData.title || "Service preview"}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Image URL
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Link2 size={16} />
                  </div>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                    required
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  Direct link to high-resolution JPEG, PNG, or WebP cover image.
                </p>
              </div>
            </div>

            {/* Technician Details Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900/90">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <h3 className="font-serif text-base font-normal tracking-tight text-slate-900 dark:text-white">
                  Technician Details
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Lock size={10} /> Verified
                </span>
              </div>
              <div className="mt-4 space-y-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-xs dark:border-slate-800 dark:bg-slate-950/50">
                <div className="flex items-center gap-2.5">
                  <UserCheck size={15} className="shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider text-[10px]">Technician:</span>
                  <strong className="truncate font-semibold text-slate-900 dark:text-slate-100">
                    {session?.user?.name}
                  </strong>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail size={15} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider text-[10px]">Email:</span>
                  <strong className="truncate font-medium text-slate-700 dark:text-slate-300">
                    {session?.user?.email}
                  </strong>
                </div>
              </div>

              {/* Re-approval Notice */}
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-3.5 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                <Info size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="leading-relaxed">
                  Saving modifications will return this listing to{" "}
                  <strong className="font-semibold">Pending Review</strong> until an
                  administrator verifies your changes.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3.5">
              <Link
                href="/dashboard/technician/my-services"
                className="rounded-2xl border border-slate-200 bg-white py-3.5 text-center text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
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

function EditServiceSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 transition-colors duration-200 dark:bg-slate-950 animate-pulse">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="h-36 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="h-96 rounded-3xl border border-slate-200/80 bg-white lg:col-span-7 dark:border-slate-800 dark:bg-slate-900/90" />
          <div className="h-96 rounded-3xl border border-slate-200/80 bg-white lg:col-span-5 dark:border-slate-800 dark:bg-slate-900/90" />
        </div>
      </div>
    </div>
  );
}
