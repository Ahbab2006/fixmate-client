"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ImagePlus,
  UserCheck,
  Mail,
  Lock,
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle2,
  ShieldAlert,
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

export default function AddServicePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    basePrice: "",
    estimatedDuration: "",
    serviceMode: "",
    serviceArea: "",
  });

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
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
      setImagePreview(null);

      router.push("/dashboard/technician/my-services");
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
                <span className="font-mono text-[11px] uppercase tracking-wider">Technician Studio</span>
              </div>
              <h1 className="mt-3 font-serif text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Publish New <span className="italic">Service</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Author a bespoke repair offering, define your rates and coverage, then submit for platform verification.
              </p>
            </div>

            <Link
              href="/dashboard/technician/my-services"
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 sm:self-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <ArrowLeft size={15} />
              <span>Back to Catalog</span>
            </Link>
          </div>
        </div>

        {/* ================= MAIN FORM GRID ================= */}
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Service Details Card */}
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/90">
              <div className="border-b border-slate-100 pb-5 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  <Wrench size={13} />
                  <span>Specification Sheet</span>
                </div>
                <h2 className="mt-1 font-serif text-xl font-normal tracking-tight text-slate-900 dark:text-white">
                  Service Information
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Provide detailed specifications to help customers discover and select your repair packages.
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
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Precision MacBook Logic Board Diagnostic & Repair"
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
                        <option value="">Select Category</option>
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
                        <option value="">Select Service Mode</option>
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
                        value={formData.basePrice}
                        onChange={handleChange}
                        min="1"
                        placeholder="75"
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
                        type="text"
                        name="estimatedDuration"
                        value={formData.estimatedDuration}
                        onChange={handleChange}
                        placeholder="e.g. 2 - 3 Hours"
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
                      type="text"
                      name="serviceArea"
                      value={formData.serviceArea}
                      onChange={handleChange}
                      placeholder="e.g. Downtown Metro & Greater Suburbs"
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
                      placeholder="Outline included diagnostics, genuine component replacements, warranty coverage, and customer requirements..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Image Upload & Verified Identity */}
          <div className="space-y-6 lg:col-span-5">
            {/* Image Upload Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900/90">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <h2 className="font-serif text-base font-normal tracking-tight text-slate-900 dark:text-white">
                    Cover Imagery <span className="text-rose-500">*</span>
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    A clear, crisp photo of your workshop or repairs
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Max 5MB
                </span>
              </div>

              {/* Preview Box */}
              {imagePreview && (
                <div className="relative mt-5 h-48 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
                  <img
                    src={imagePreview}
                    alt="Service cover preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-3 bottom-3 left-3 flex items-center gap-2 rounded-xl bg-slate-950/80 px-3 py-2 text-xs font-medium text-white backdrop-blur-md">
                    <CheckCircle2
                      size={14}
                      className="shrink-0 text-emerald-400"
                    />
                    <span className="truncate">{image?.name}</span>
                  </div>
                </div>
              )}

              {/* File Picker Input */}
              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center transition hover:border-slate-400 hover:bg-slate-100/50 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-slate-600 dark:hover:bg-slate-950/70">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <ImagePlus size={22} />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {image ? "Replace Image File" : "Choose Service Image"}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  JPG, PNG, or WEBP up to 5MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                  required
                />
              </label>
            </div>

            {/* Verified Technician Identity Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900/90">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <h3 className="font-serif text-base font-normal tracking-tight text-slate-900 dark:text-white">
                    Technician Credentials
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Linked to your active professional profile
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Lock size={10} /> Verified
                </span>
              </div>

              <div className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Technician Name
                  </label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <UserCheck size={15} />
                    </div>
                    <input
                      value={session?.user?.name || ""}
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200/70 bg-slate-100/70 py-2.5 pr-4 pl-10 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Registered Email
                  </label>
                  <div className="relative mt-1.5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail size={15} />
                    </div>
                    <input
                      value={session?.user?.email || ""}
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200/70 bg-slate-100/70 py-2.5 pr-4 pl-10 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Verification Advisory */}
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                <ShieldAlert size={16} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="leading-relaxed">
                  Every new service listing undergoes platform compliance verification prior to public directory indexing.
                </p>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Submitting for Review...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Service for Approval</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
