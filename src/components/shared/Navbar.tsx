
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiUrl } from "@/lib/api";
import {
  Menu,
  X,
  Wrench,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as
    | {
        name?: string;
        email?: string;
        role?: string;
        image?: string | null;
      }
    | undefined;

  // Local synced profile data (source of truth: GET /api/users/profile & real-time events)
  const [profileData, setProfileData] = useState<{
    name?: string;
    image?: string | null;
  } | null>(null);

  const userEmail = user?.email;
  const cacheKey = userEmail ? `fixmate_profile_${userEmail}` : null;

  // Derived display values: prefer latest profileData, fallback to session
  const displayName = profileData?.name ?? user?.name ?? "";
  const displayImage =
    profileData?.image !== undefined ? profileData.image : user?.image;

  // Sync profile data from backend API to keep Navbar accurate across refreshes
  useEffect(() => {
    if (!userEmail) {
      setProfileData(null);
      return;
    }

    // Read immediate cached data if available to prevent flicker
    if (typeof window !== "undefined" && cacheKey) {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") {
            setProfileData(parsed);
          }
        }
      } catch {
        // Silently ignore storage issues
      }
    }

    let isMounted = true;

    const syncProfile = async () => {
      try {
        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (!token) return;

        const response = await fetch(apiUrl("/api/users/profile"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!response.ok) return;

        const result = await response.json();

        if (isMounted && result.success && result.profile) {
          const latest = {
            name: result.profile.name,
            image: result.profile.image,
          };

          setProfileData(latest);

          if (typeof window !== "undefined" && cacheKey) {
            try {
              localStorage.setItem(cacheKey, JSON.stringify(latest));
            } catch {
              // Silently ignore storage issues
            }
          }
        }
      } catch {
        // Fallback gracefully to existing session data
      }
    };

    syncProfile();

    return () => {
      isMounted = false;
    };
  }, [userEmail, cacheKey]);

  // Listen for real-time profile updates dispatched from /dashboard/profile
  useEffect(() => {
    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{
        name?: string;
        image?: string | null;
      }>;

      if (customEvent.detail) {
        setProfileData((prev) => {
          const updated = {
            name: customEvent.detail.name ?? prev?.name,
            image:
              customEvent.detail.image !== undefined
                ? customEvent.detail.image
                : prev?.image,
          };

          if (typeof window !== "undefined" && cacheKey) {
            try {
              localStorage.setItem(cacheKey, JSON.stringify(updated));
            } catch {
              // Silently ignore storage issues
            }
          }

          return updated;
        });
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (cacheKey && event.key === cacheKey && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (parsed && typeof parsed === "object") {
            setProfileData(parsed);
          }
        } catch {
          // Silently ignore storage issues
        }
      }
    };

    window.addEventListener("fixmate:profile-updated", handleProfileUpdate);
    window.addEventListener("profile-updated", handleProfileUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "fixmate:profile-updated",
        handleProfileUpdate
      );
      window.removeEventListener("profile-updated", handleProfileUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, [cacheKey]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "How It Works", href: "/about" },
  ];

  const dashboardPath =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "technician"
        ? "/dashboard/technician"
        : "/dashboard/customer";

  const roleLabel =
    user?.role === "admin"
      ? "Admin"
      : user?.role === "technician"
        ? "Technician"
        : "Customer";

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully.");

      setProfileData(null);
      if (typeof window !== "undefined" && cacheKey) {
        try {
          localStorage.removeItem(cacheKey);
        } catch {
          // Silently ignore
        }
      }

      setProfileMenuOpen(false);
      setMobileMenuOpen(false);

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to logout.");
    }
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const ProfileAvatar = ({ size = "h-10 w-10" }: { size?: string }) => (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-700`}
    >
      {displayImage ? (
        <img
          src={displayImage}
          alt={displayName || "User"}
          className="h-full w-full object-cover"
        />
      ) : (
        <User size={20} />
      )}
    </div>
  );

  // Hide public navbar on all dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" onClick={closeMenus} className="flex items-center gap-2">
          <span className="rounded-lg bg-blue-600 p-2 text-white">
            <Wrench size={22} />
          </span>

          <span className="text-2xl font-bold text-gray-900">
            Fix<span className="text-blue-600">Mate</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition hover:text-blue-600 ${
                isActive(link.href)
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-200 p-1.5 pr-3 transition hover:bg-gray-50"
                aria-label="Open profile menu"
                aria-expanded={profileMenuOpen}
              >
                <ProfileAvatar />
                <span className="max-w-28 truncate text-sm font-semibold text-gray-700">
                  {displayName || "My Account"}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                  <div className="border-b bg-gray-50 px-4 py-4">
                    <p className="truncate font-bold text-gray-900">
                      {displayName || "My Account"}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {user.email}
                    </p>

                    <span className="mt-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {roleLabel}
                    </span>
                  </div>

                  <div className="p-2">
                    <Link
                      href={dashboardPath}
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Settings size={18} />
                      Update Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:text-blue-600"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t bg-white px-4 py-4 shadow-md md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-2 border-t pt-4">
              {isPending ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <ProfileAvatar />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {displayName || "My Account"}
                      </p>
                      <span className="text-xs font-semibold text-blue-600">
                        {roleLabel}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={dashboardPath}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50"
                  >
                    <Settings size={18} />
                    Update Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/sign-in"
                    onClick={closeMenus}
                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-700"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={closeMenus}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
