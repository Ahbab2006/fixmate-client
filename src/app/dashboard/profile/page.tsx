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
      setLoading(true);

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
    if (!sessionLoading) {
      fetchProfile();
    }
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
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            <Shield size={13} />
            Administrator
          </span>
        );
      case "technician":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Sparkles size={13} />
            Technician
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <User size={13} />
            Customer
          </span>
        );
    }
  };

  if (loading || sessionLoading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-800">
            Unable to load profile data.
          </p>
          <p className="mt-2 text-sm text-red-600">
            Please make sure you are signed in and try again.
          </p>
          <button
            onClick={fetchProfile}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Profile Settings
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your personal information, contact details, and public profile.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchProfile}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Avatar & Account Summary */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                {/* Avatar with Camera Overlay */}
                <div className="relative group">
                  <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={formData.name || "User Avatar"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-blue-600">
                        {formData.name
                          ? formData.name.charAt(0).toUpperCase()
                          : <User size={44} className="text-gray-400" />}
                      </div>
                    )}
                  </div>

                  {/* Camera overlay button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                    aria-label="Upload profile photo"
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    <Camera size={18} />
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
                  <div className="mt-3 flex items-center gap-2 rounded-md bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
                    <span className="truncate max-w-[160px] font-medium">
                      {selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleCancelSelectedPhoto}
                      className="text-blue-500 hover:text-blue-700"
                      title="Discard selected image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* User Name & Role */}
                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {profile.name || "FixMate User"}
                </h2>

                <div className="mt-2">{getRoleBadge(profile.role)}</div>

                <p className="mt-2 text-sm text-gray-500 break-all">
                  {profile.email}
                </p>

                {profile.createdAt && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={13} />
                    <span>
                      Member since{" "}
                      {new Date(profile.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Guidelines */}
              <div className="mt-6 border-t border-gray-100 pt-5 text-xs text-gray-500">
                <p className="font-semibold text-gray-700">Photo Requirements:</p>
                <ul className="mt-2 space-y-1 list-disc pl-4 text-gray-500">
                  <li>Supported formats: JPG, PNG, WEBP</li>
                  <li>Maximum file size: 5 MB</li>
                  <li>Click Save Changes after selecting a new photo</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Editable Profile Details */}
          <div className="lg:col-span-8">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
            >
              <div className="border-b border-gray-100 pb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update your account details. Email address and account role are managed by system administrators.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                {/* Row 1: Email (Read-Only) & Role (Read-Only) */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <span>Email Address</span>
                      <span className="flex items-center gap-1 text-[11px] font-medium lowercase text-gray-400">
                        <Lock size={11} /> read-only
                      </span>
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <Mail size={17} />
                      </div>
                      <input
                        type="email"
                        value={profile.email}
                        readOnly
                        disabled
                        aria-label="Email address (read-only)"
                        className="w-full rounded-lg border border-gray-200 bg-gray-100 py-2.5 pl-10 pr-4 text-sm text-gray-600 cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <span>Account Role</span>
                      <span className="flex items-center gap-1 text-[11px] font-medium lowercase text-gray-400">
                        <Lock size={11} /> read-only
                      </span>
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
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
                        className="w-full rounded-lg border border-gray-200 bg-gray-100 py-2.5 pl-10 pr-4 text-sm font-medium capitalize text-gray-600 cursor-not-allowed select-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Full Name (Required) */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
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
                      className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Row 3: Phone & Area */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
                    >
                      Phone Number
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <Phone size={17} />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+880 1700 000000"
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">
                      Helps technicians or customers contact you directly.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="area"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
                    >
                      Area / City
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <MapPin size={17} />
                      </div>
                      <input
                        id="area"
                        name="area"
                        type="text"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="e.g. Dhanmondi, Dhaka"
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">
                      Your primary service area or living location.
                    </p>
                  </div>
                </div>

                {/* Row 4: Bio / About */}
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
                  >
                    Bio / Description
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute top-3 left-0 flex items-start pl-3.5 text-gray-400">
                      <FileText size={17} />
                    </div>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us a little bit about yourself, your device preferences, or your repair specialties..."
                      className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Brief background or introductory notes visible across your FixMate activities.
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={saving || uploadingImage}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
