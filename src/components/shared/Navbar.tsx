"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiUrl } from "@/lib/api";
import ThemeToggle from "@/components/shared/ThemeToggle";
import {
  Menu,
  X,
  Wrench,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

function ProfileAvatar({
  size = "h-9 w-9",
  image,
  name,
}: {
  size?: string;
  image?: string | null;
  name?: string;
}) {
  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-300 ring-1 ring-blue-400/30`}
    >
      {image ? (
        <img
          src={image}
          alt={name || "User"}
          className="h-full w-full object-cover"
        />
      ) : (
        <User size={18} />
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isAuthPath =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/sign-in") ||
    pathname?.startsWith("/sign-up");

  const searchString = searchParams?.toString();
  const currentTarget =
    pathname && !isAuthPath
      ? `${pathname}${searchString ? `?${searchString}` : ""}`
      : null;

  const signInHref = currentTarget
    ? `/sign-in?redirect=${encodeURIComponent(currentTarget)}`
    : "/sign-in";

  const signUpHref = currentTarget
    ? `/sign-up?redirect=${encodeURIComponent(currentTarget)}`
    : "/sign-up";

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
    let isMounted = true;

    if (!userEmail) {
      (async () => {
        if (isMounted) {
          setProfileData(null);
        }
      })();
      return () => {
        isMounted = false;
      };
    }

    const syncProfile = async () => {
      // Read immediate cached data if available to prevent flicker
      if (typeof window !== "undefined" && cacheKey) {
        try {
          const cached = localStorage.getItem(cacheKey);
          if (cached && isMounted) {
            const parsed = JSON.parse(cached);
            if (parsed && typeof parsed === "object") {
              setProfileData(parsed);
            }
          }
        } catch {
          // Silently ignore storage issues
        }
      }

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

    (async () => {
      if (isMounted) {
        await syncProfile();
      }
    })();

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



  // Hide public navbar on all dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 text-slate-900 backdrop-blur-xl transition-colors duration-200 dark:border-white/10 dark:bg-slate-950/90 dark:text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="group flex items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 transition-transform duration-300 group-hover:scale-105">
            <Wrench size={20} />
          </span>

          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Fix
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-sky-300">
              Mate
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-100/70 p-1.5 dark:border-white/10 dark:bg-white/[0.04] md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-white text-slate-950 shadow-sm dark:bg-white/10 dark:text-white"
                    : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions & Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme Toggle */}
          <ThemeToggle />

          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/80 p-1.5 pr-3.5 text-left transition-all hover:border-blue-400/50 hover:bg-slate-50 dark:border-white/15 dark:bg-slate-900/80 dark:hover:border-blue-400/40 dark:hover:bg-slate-800/90"
                aria-label="Open profile menu"
                aria-expanded={profileMenuOpen}
              >
                <ProfileAvatar image={displayImage} name={displayName} />
                <span className="max-w-28 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {displayName || "My Account"}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    profileMenuOpen ? "rotate-180 text-blue-500" : ""
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-68 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-950/10 ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/60 dark:ring-white/5">
                  <div className="border-b border-slate-100 bg-slate-50/90 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/60">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {displayName || "My Account"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>

                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-600/15 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-500/20">
                      <ShieldCheck size={13} />
                      {roleLabel}
                    </span>
                  </div>

                  <div className="space-y-1 p-2">
                    <Link
                      href={dashboardPath}
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                    >
                      <LayoutDashboard size={17} className="text-slate-400 dark:text-slate-500" />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                    >
                      <Settings size={17} className="text-slate-400 dark:text-slate-500" />
                      Update Profile
                    </Link>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    >
                      <LogOut size={17} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href={signInHref}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href={signUpHref}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-500"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Actions: ThemeToggle + Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-slate-200 bg-slate-100/80 p-2 text-slate-700 transition hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white/98 px-4 py-5 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/98 md:hidden">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    active
                      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-500/30 dark:bg-blue-600/15 dark:text-blue-400"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="mt-3 border-t border-slate-200 pt-4 dark:border-white/10">
              {isPending ? (
                <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
              ) : user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-white/10 dark:bg-slate-900/90">
                    <ProfileAvatar size="h-10 w-10" image={displayImage} name={displayName} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {displayName || "My Account"}
                      </p>
                      <span className="mt-0.5 inline-block text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {roleLabel}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={dashboardPath}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <LayoutDashboard size={18} className="text-blue-600 dark:text-blue-400" />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <Settings size={18} className="text-blue-600 dark:text-blue-400" />
                    Update Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="mt-1 flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href={signInHref}
                    onClick={closeMenus}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
                  >
                    Sign In
                  </Link>

                  <Link
                    href={signUpHref}
                    onClick={closeMenus}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/25"
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