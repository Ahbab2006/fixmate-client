"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiUrl } from "@/lib/api";
import { toast } from "sonner";
import {
  User,
  Mail,
  Shield,
  Phone,
  MapPin,
  FileText,
  Camera,
  Save,
  RefreshCw,
  Loader2,
  Lock,
  Calendar,
  X,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  image: string | null;
  phone: string;
  area: string;
  bio: string;
  createdAt?: string | null;
}

export default function ProfilePage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form input state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
    bio: "",
  });

  // Avatar upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch authenticated user profile from backend
  const fetchProfile = useCallback(async () => {
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(apiUrl("/api/users/profile"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load profile data.");
      }

      const p: UserProfile = result.profile;
      setProfile(p);
      setFormData({
        name: p.name || "",
        phone: p.phone || "",
        area: p.area || "",
        bio: p.bio || "",
      });
      setPreviewUrl(p.image || null);
      setSelectedFile(null);
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!sessionLoading) {
      (async () => {
        if (isMounted) {
          await fetchProfile();
        }
      })();
    }

    return () => {
      isMounted = false;
    };
  }, [sessionLoading, fetchProfile]);

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle form text changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    // Revoke previous blob URL if created
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    toast.info("Image selected. Click 'Save Changes' to apply.");
  };

  // Cancel selected photo
  const handleCancelSelectedPhoto = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(profile?.image || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Reset form to last saved profile data
  const handleReset = () => {
    if (!profile) return;
    setFormData({
      name: profile.name || "",
      phone: profile.phone || "",
      area: profile.area || "",
      bio: profile.bio || "",
    });
    handleCancelSelectedPhoto();
    toast.info("Changes reset to current profile values.");
  };

  // Submit profile update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (saving || uploadingImage) return;

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      toast.error("Full name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    // Check if there are any changes
    const trimmedPhone = formData.phone.trim();
    const trimmedArea = formData.area.trim();
    const trimmedBio = formData.bio.trim();

    const isNameSame = trimmedName === (profile?.name || "");
    const isPhoneSame = trimmedPhone === (profile?.phone || "");
    const isAreaSame = trimmedArea === (profile?.area || "");
    const isBioSame = trimmedBio === (profile?.bio || "");
    const isImageSame = !selectedFile;

    if (isNameSame && isPhoneSame && isAreaSame && isBioSame && isImageSame) {
      toast.info("No changes to save.");
      return;
    }

    setSaving(true);

    try {
      // Step 1: Get JWT Token
      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      let uploadedImageUrl: string | undefined = undefined;

      // Step 2: If a new image was selected, upload to ImgBB first
      if (selectedFile) {
        setUploadingImage(true);

        const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        if (!imgbbApiKey) {
          throw new Error("ImgBB API key is not configured.");
        }

        const uploadFormData = new FormData();
        uploadFormData.append("image", selectedFile);

        const uploadResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          {
            method: "POST",
            body: uploadFormData,
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.success) {
          throw new Error(
            uploadResult?.error?.message ||
              "Failed to upload profile picture to image server."
          );
        }

        uploadedImageUrl = uploadResult.data.url;
        setUploadingImage(false);
      }

      // Step 3: Call backend PATCH /api/users/profile
      const payload: {
        name: string;
        phone: string;
        area: string;
        bio: string;
        image?: string;
      } = {
        name: trimmedName,
        phone: trimmedPhone,
        area: trimmedArea,
        bio: trimmedBio,
      };

      if (uploadedImageUrl !== undefined) {
        payload.image = uploadedImageUrl;
      }

      const response = await fetch(apiUrl("/api/users/profile"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update profile.");
      }

      // Step 4: Update state with updated profile
      const updatedProfile: UserProfile = result.profile;
      setProfile(updatedProfile);
      setFormData({
        name: updatedProfile.name || "",
        phone: updatedProfile.phone || "",
        area: updatedProfile.area || "",
        bio: updatedProfile.bio || "",
      });
      setPreviewUrl(updatedProfile.image || null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Synchronize updated Name and Image across the app (Navbar, etc.)
      if (typeof window !== "undefined") {
        const updateDetail = {
          name: updatedProfile.name,
          image: updatedProfile.image,
        };
        window.dispatchEvent(
          new CustomEvent("fixmate:profile-updated", { detail: updateDetail })
        );
        window.dispatchEvent(
          new CustomEvent("profile-updated", { detail: updateDetail })
        );
      }

      toast.success(result.message || "Profile updated successfully!");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  // Role Badge Styling
  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/60 dark:text-rose-400 dark:ring-rose-500/20">
            <Shield size={13} />
            Administrator
          </span>
        );
      case "technician":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-600/20 dark:bg-indigo-950/60 dark:text-indigo-400 dark:ring-indigo-500/20">
            <Sparkles size={13} />
            Technician
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-950/60 dark:text-blue-400 dark:ring-blue-500/20">
            <User size={13} />
            Customer
          </span>
        );
    }
  };

  if (loading || sessionLoading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center p-6">
        <div className="rounded-3xl border border-slate-200/80 bg-white px-10 py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="mx-auto animate-spin text-blue-600 dark:text-blue-400" size={38} />
          <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-xl rounded-3xl border border-rose-200 bg-rose-50/80 p-8 text-center shadow-sm dark:border-rose-900/60 dark:bg-rose-950/40">
          <p className="text-lg font-extrabold text-rose-900 dark:text-rose-200">
            Unable to load profile data.
          </p>
          <p className="mt-2 text-sm text-rose-700 dark:text-rose-400">
            Please make sure you are signed in and try again.
          </p>
          <button
            onClick={() => {
              setLoading(true);
              fetchProfile();
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* ================= TOP DARK PREMIUM BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-600/25 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <Sparkles size={13} className="text-blue-400" />
                <span>Account Preferences</span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Profile{" "}
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  Settings
                </span>
              </h1>
              <p className="mt-1.5 text-sm text-slate-300">
                Manage your personal information, contact details, and public
                FixMate identity.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchProfile();
              }}
              disabled={loading || saving}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-blue-400/40 hover:bg-blue-600 disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Avatar & Account Summary */}
          <div className="lg:col-span-4">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {/* Decorative Top Cover Strip */}
              <div className="relative h-24 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:20px_20px]" />
              </div>

              <div className="px-6 pb-6">
                <div className="-mt-14 flex flex-col items-center text-center">
                  {/* Avatar with Camera Overlay */}
                  <div className="group relative">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-tr from-blue-100 to-indigo-100 shadow-lg ring-1 ring-slate-200/80 dark:border-slate-900 dark:from-blue-950 dark:to-indigo-950 dark:ring-slate-700">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt={formData.name || "User Avatar"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                          {formData.name ? (
                            formData.name.charAt(0).toUpperCase()
                          ) : (
                            <User size={44} className="text-slate-400 dark:text-slate-500" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Camera overlay button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={saving}
                      aria-label="Upload profile photo"
                      className="absolute right-0 bottom-0 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition hover:scale-105 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      <Camera size={17} />
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Selected File Notice */}
                  {selectedFile && (
                    <div className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-950/60 dark:text-blue-400 dark:ring-blue-500/20">
                      <span className="max-w-[160px] truncate">
                        {selectedFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelSelectedPhoto}
                        className="text-blue-500 transition hover:text-rose-600 dark:text-blue-400 dark:hover:text-rose-400"
                        title="Discard selected image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* User Name & Role */}
                  <h2 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white">
                    {profile.name || "FixMate User"}
                  </h2>

                  <div className="mt-2">{getRoleBadge(profile.role)}</div>

                  <p className="mt-2.5 break-all text-xs font-medium text-slate-500 dark:text-slate-400">
                    {profile.email}
                  </p>

                  {profile.createdAt && (
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <Calendar size={13} className="text-blue-600 dark:text-blue-400" />
                      <span>
                        Member since{" "}
                        {new Date(profile.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                          }
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload Guidelines Box */}
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-xs dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    Photo Requirements
                  </p>
                  <ul className="mt-2.5 space-y-1.5 text-slate-500 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        size={13}
                        className="shrink-0 text-blue-600 dark:text-blue-400"
                      />
                      <span>Supported formats: JPG, PNG, WEBP</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        size={13}
                        className="shrink-0 text-blue-600 dark:text-blue-400"
                      />
                      <span>Maximum file size: 5 MB</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        size={13}
                        className="shrink-0 text-blue-600 dark:text-blue-400"
                      />
                      <span>Click Save Changes to apply new photo</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editable Profile Details */}
          <div className="lg:col-span-8">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="border-b border-slate-100 pb-5 dark:border-slate-800">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Update your account details. Email address and account role
                  are managed by system administrators.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                {/* Row 1: Email (Read-Only) & Role (Read-Only) */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <span>Email Address</span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold lowercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <Lock size={10} /> read-only
                      </span>
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                        <Mail size={17} />
                      </div>
                      <input
                        type="email"
                        value={profile.email}
                        readOnly
                        disabled
                        aria-label="Email address (read-only)"
                        className="w-full cursor-not-allowed select-none rounded-xl border border-slate-200 bg-slate-100/80 py-3 pr-4 pl-10 text-sm font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <span>Account Role</span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold lowercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <Lock size={10} /> read-only
                      </span>
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                        <Shield size={17} />
                      </div>
                      <input
                        type="text"
                        value={
                          profile.role.charAt(0).toUpperCase() +
                          profile.role.slice(1)
                        }
                        readOnly
                        disabled
                        aria-label="Account role (read-only)"
                        className="w-full cursor-not-allowed select-none rounded-xl border border-slate-200 bg-slate-100/80 py-3 pr-4 pl-10 text-sm font-semibold capitalize text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Full Name (Required) */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                      <User size={17} />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Row 3: Phone & Area */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                      Phone Number
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                        <Phone size={17} />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+880 1700 000000"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      Helps technicians or customers contact you directly.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="area"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                      Area / City
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                        <MapPin size={17} />
                      </div>
                      <input
                        id="area"
                        name="area"
                        type="text"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="e.g. Dhanmondi, Dhaka"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      Your primary service area or living location.
                    </p>
                  </div>
                </div>

                {/* Row 4: Bio / About */}
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Bio / Description
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute top-3.5 left-0 flex items-start pl-3.5 text-slate-400 dark:text-slate-500">
                      <FileText size={17} />
                    </div>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us a little bit about yourself, your device preferences, or your repair specialties..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    Brief background or introductory notes visible across your
                    FixMate activities.
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={saving || uploadingImage}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving || uploadingImage ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>
                        {uploadingImage
                          ? "Uploading Photo..."
                          : "Saving Changes..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}