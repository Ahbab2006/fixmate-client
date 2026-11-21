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
  RotateCcw,
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

  // Track user email to detect account changes
  const lastLoadedEmailRef = useRef<string | null>(null);

  // Ref to track unsaved edits across lifecycle renders
  const isDirtyRef = useRef(false);

  // Fetch authenticated user profile from backend
  const fetchProfile = useCallback(
    async (options?: { forceReset?: boolean }) => {
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
        lastLoadedEmailRef.current = p.email;

        // Only overwrite form inputs if forced (initial load, explicit refresh, retry)
        // or if the user has not started modifying any fields.
        const shouldUpdateForm = options?.forceReset || !isDirtyRef.current;

        if (shouldUpdateForm) {
          setFormData({
            name: p.name || "",
            phone: p.phone || "",
            area: p.area || "",
            bio: p.bio || "",
          });
          setPreviewUrl(p.image || null);
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      } catch (error: unknown) {
        const err = error as Error;
        toast.error(err.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    let isMounted = true;

    if (!sessionLoading) {
      const currentUserEmail = session?.user?.email;
      const needsFetch =
        !profile ||
        (currentUserEmail && lastLoadedEmailRef.current !== currentUserEmail);

      if (needsFetch) {
        (async () => {
          if (isMounted) {
            await fetchProfile({ forceReset: !isDirtyRef.current });
          }
        })();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [sessionLoading, session?.user?.email, profile, fetchProfile]);

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
    setPreviewUrl(profile.image || null);
    toast.info("Changes reset to current profile values.");
  };

  // Reliable change detection across all profile attributes
  const isNameChanged = formData.name.trim() !== (profile?.name || "").trim();
  const isPhoneChanged = formData.phone.trim() !== (profile?.phone || "").trim();
  const isAreaChanged = formData.area.trim() !== (profile?.area || "").trim();
  const isBioChanged = formData.bio.trim() !== (profile?.bio || "").trim();
  const isImageRemoved = Boolean(profile?.image) && previewUrl === null;
  const isImageChanged = Boolean(selectedFile) || isImageRemoved;

  const isDirty =
    Boolean(profile) &&
    (isNameChanged ||
      isPhoneChanged ||
      isAreaChanged ||
      isBioChanged ||
      isImageChanged);

  // Synchronize ref on every render so lifecycle effects have immediate dirty visibility
  isDirtyRef.current = isDirty;

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

    const currentNameChanged = trimmedName !== (profile?.name || "").trim();
    const currentPhoneChanged = trimmedPhone !== (profile?.phone || "").trim();
    const currentAreaChanged = trimmedArea !== (profile?.area || "").trim();
    const currentBioChanged = trimmedBio !== (profile?.bio || "").trim();
    const currentImageRemoved = Boolean(profile?.image) && previewUrl === null;
    const currentImageChanged = Boolean(selectedFile) || currentImageRemoved;

    const hasChanges =
      currentNameChanged ||
      currentPhoneChanged ||
      currentAreaChanged ||
      currentBioChanged ||
      currentImageChanged;

    if (!hasChanges) {
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
      } else if (currentImageRemoved) {
        payload.image = "";
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
      lastLoadedEmailRef.current = updatedProfile.email;
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

      // Synchronize updated Name and Image across the app (Navbar, layout, etc.)
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

        if (updatedProfile.email) {
          try {
            localStorage.setItem(
              `fixmate_profile_${updatedProfile.email}`,
              JSON.stringify(updateDetail)
            );
          } catch {
            // Silently ignore storage issues
          }
        }
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
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
            <Shield size={11} />
            Administrator
          </span>
        );
      case "technician":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
            <Sparkles size={11} />
            Technician
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300">
            <User size={11} />
            Customer
          </span>
        );
    }
  };

  if (loading || sessionLoading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-xl rounded-3xl border border-rose-200 bg-rose-50/80 p-8 text-center shadow-sm dark:border-rose-900/60 dark:bg-rose-950/40">
          <p className="font-serif text-lg font-normal text-rose-900 dark:text-rose-200">
            Unable to load profile data.
          </p>
          <p className="mt-2 text-xs text-rose-700 dark:text-rose-400">
            Please make sure you are signed in and try again.
          </p>
          <button
            onClick={() => {
              setLoading(true);
              fetchProfile({ forceReset: true });
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
          >
            <RefreshCw size={14} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
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
                <span className="font-mono text-[11px] uppercase tracking-wider">Account Credentials</span>
              </div>
              <h1 className="mt-3 font-serif text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Profile &amp; <span className="italic">Identity</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage your personal credentials, contact coordinates, and public FixMate specialist identity.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchProfile({ forceReset: true });
              }}
              disabled={loading || saving}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 sm:self-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Refresh Profile</span>
            </button>
          </div>
        </div>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Avatar & Account Summary */}
          <div className="lg:col-span-4">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
              {/* Subtle Top Header Frame */}
              <div className="relative h-20 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-transparent" />
              </div>

              <div className="px-6 pb-6">
                <div className="-mt-12 flex flex-col items-center text-center">
                  {/* Avatar with Camera Overlay */}
                  <div className="group relative">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md ring-1 ring-slate-200/80 dark:border-slate-900 dark:bg-slate-800 dark:ring-slate-700">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt={formData.name || "User Avatar"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-serif text-2xl font-normal text-slate-700 dark:text-slate-200">
                          {formData.name ? (
                            formData.name.charAt(0).toUpperCase()
                          ) : (
                            <User size={36} className="text-slate-400 dark:text-slate-500" />
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
                      className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition hover:scale-105 hover:bg-slate-800 focus:outline-none disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                      <Camera size={15} />
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
                    <div className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3 py-0.5 font-mono text-[10px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
                      <span className="max-w-[150px] truncate">
                        {selectedFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelSelectedPhoto}
                        className="text-blue-500 transition hover:text-rose-600 dark:text-blue-400 dark:hover:text-rose-400"
                        title="Discard selected image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  {/* Photo Removal Notice */}
                  {!selectedFile && !previewUrl && profile?.image && (
                    <div className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50/80 px-3 py-0.5 font-mono text-[10px] font-semibold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-300">
                      <span>Photo marked for removal</span>
                      <button
                        type="button"
                        onClick={() => setPreviewUrl(profile.image)}
                        className="text-amber-500 transition hover:text-slate-700 dark:text-amber-400 dark:hover:text-slate-200"
                        title="Undo photo removal"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  {/* Remove Photo Action */}
                  {!selectedFile && previewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        toast.info(
                          "Photo marked for removal. Click 'Save Changes' to apply."
                        );
                      }}
                      disabled={saving}
                      className="mt-2 text-xs font-medium text-slate-400 transition hover:text-rose-600 dark:hover:text-rose-400"
                    >
                      Remove photo
                    </button>
                  )}

                  {/* User Name & Role */}
                  <h2 className="mt-3 font-serif text-xl font-normal tracking-tight text-slate-900 dark:text-white">
                    {profile.name || "FixMate Member"}
                  </h2>

                  <div className="mt-1.5">{getRoleBadge(profile.role)}</div>

                  <p className="mt-2 break-all font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {profile.email}
                  </p>

                  {profile.createdAt && (
                    <div className="mt-3.5 inline-flex items-center gap-1.5 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                      <Calendar size={12} className="text-slate-400 dark:text-slate-500" />
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
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-slate-950/50">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Photo Standards
                  </span>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        size={13}
                        className="shrink-0 text-blue-600 dark:text-blue-400"
                      />
                      <span>JPEG, PNG, or WebP up to 5MB</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        size={13}
                        className="shrink-0 text-blue-600 dark:text-blue-400"
                      />
                      <span>Square aspect ratio recommended</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        size={13}
                        className="shrink-0 text-blue-600 dark:text-blue-400"
                      />
                      <span>Applied instantly across Navbar & Sidebar</span>
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
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/90"
            >
              <div className="border-b border-slate-100 pb-5 dark:border-slate-800">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Account Details
                </span>
                <h2 className="mt-1 font-serif text-xl font-normal tracking-tight text-slate-900 dark:text-white">
                  Personal Information
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Keep your coordinates current. Email address and account authority are locked to your authentication identity.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                {/* Row 1: Email (Read-Only) & Role (Read-Only) */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <span>Email Address</span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] lowercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <Lock size={10} /> read-only
                      </span>
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        value={profile.email}
                        readOnly
                        disabled
                        aria-label="Email address (read-only)"
                        className="w-full cursor-not-allowed select-none rounded-xl border border-slate-200/70 bg-slate-50/80 py-2.5 pr-4 pl-10 font-mono text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <span>Account Role</span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] lowercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <Lock size={10} /> read-only
                      </span>
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                        <Shield size={16} />
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
                        className="w-full cursor-not-allowed select-none rounded-xl border border-slate-200/70 bg-slate-50/80 py-2.5 pr-4 pl-10 font-mono text-xs font-semibold capitalize text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300"
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
                      <User size={16} />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
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
                        <Phone size={16} />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+880 1700 000000"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      Used for dispatch coordination and service scheduling.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="area"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                      Area / Region
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                        <MapPin size={16} />
                      </div>
                      <input
                        id="area"
                        name="area"
                        type="text"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="e.g. Dhanmondi, Dhaka"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      Primary coverage zone or residence neighborhood.
                    </p>
                  </div>
                </div>

                {/* Row 4: Bio / Description */}
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Biography &amp; Background
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute top-3 left-0 flex items-start pl-3.5 text-slate-400 dark:text-slate-500">
                      <FileText size={16} />
                    </div>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Outline your background, hardware repair focus, or platform profile notes..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    Brief synopsis visible across your FixMate service profile.
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={saving || uploadingImage || !isDirty}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 sm:self-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <RotateCcw size={13} />
                  <span>Reset Changes</span>
                </button>

                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  {saving || uploadingImage ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>
                        {uploadingImage
                          ? "Uploading Photo..."
                          : "Saving Changes..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
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

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 transition-colors duration-200 dark:bg-slate-950 animate-pulse">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="h-36 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="h-96 rounded-3xl border border-slate-200/80 bg-white lg:col-span-4 dark:border-slate-800 dark:bg-slate-900/90" />
          <div className="h-96 rounded-3xl border border-slate-200/80 bg-white lg:col-span-8 dark:border-slate-800 dark:bg-slate-900/90" />
        </div>
      </div>
    </div>
  );
}
