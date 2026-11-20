"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  ClipboardList,
  CreditCard,
  PlusCircle,
  Wrench,
  Users,
  Settings,
  Receipt,
  Menu,
  X,
  Home,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const navigation = {
  customer: [
    {
      label: "Dashboard",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      label: "My Bookings",
      href: "/dashboard/customer/my-bookings",
      icon: ClipboardList,
    },
    {
      label: "Payment History",
      href: "/dashboard/customer/payments",
      icon: CreditCard,
    },
  ],

  technician: [
    {
      label: "Dashboard",
      href: "/dashboard/technician",
      icon: LayoutDashboard,
    },
    {
      label: "Add Service",
      href: "/dashboard/technician/add-service",
      icon: PlusCircle,
    },
    {
      label: "My Services",
      href: "/dashboard/technician/my-services",
      icon: Wrench,
    },
    {
      label: "Manage Requests",
      href: "/dashboard/technician/requests",
      icon: ClipboardList,
    },
  ],

  admin: [
    {
      label: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Manage Services",
      href: "/dashboard/admin/services",
      icon: Wrench,
    },
    {
      label: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      label: "All Bookings",
      href: "/dashboard/admin/bookings",
      icon: ClipboardList,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: Receipt,
    },
  ],
};

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as
    | {
        name?: string;
        email?: string;
        role?: string;
        image?: string | null;
      }
    | undefined;

  const role = user?.role;

  // Local synced profile data to match Navbar and live updates
  const [profileData, setProfileData] = useState<{
    name?: string;
    image?: string | null;
  } | null>(null);

  const userEmail = user?.email;
  const cacheKey = userEmail ? `fixmate_profile_${userEmail}` : null;

  useEffect(() => {
    if (!userEmail) return;

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

    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{
        name?: string;
        image?: string | null;
      }>;

      if (customEvent.detail) {
        setProfileData((prev) => ({
          name: customEvent.detail.name ?? prev?.name,
          image:
            customEvent.detail.image !== undefined
              ? customEvent.detail.image
              : prev?.image,
        }));
      }
    };

    window.addEventListener("fixmate:profile-updated", handleProfileUpdate);
    window.addEventListener("profile-updated", handleProfileUpdate);

    return () => {
      window.removeEventListener(
        "fixmate:profile-updated",
        handleProfileUpdate
      );
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, [userEmail, cacheKey]);

  const displayName = profileData?.name ?? user?.name ?? "User";
  const displayImage =
    profileData?.image !== undefined ? profileData.image : user?.image;

  // Role guard protection
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      const redirectTarget = pathname
        ? `/sign-in?redirect=${encodeURIComponent(pathname)}`
        : "/sign-in";
      router.replace(redirectTarget);
      return;
    }

    if (
      pathname.startsWith("/dashboard/technician") &&
      role !== "technician"
    ) {
      router.replace(
        role === "admin"
          ? "/dashboard/admin"
          : "/dashboard/customer"
      );
    }

    if (
      pathname.startsWith("/dashboard/customer") &&
      role !== "customer"
    ) {
      router.replace(
        role === "admin"
          ? "/dashboard/admin"
          : "/dashboard/technician"
      );
    }

    if (
      pathname.startsWith("/dashboard/admin") &&
      role !== "admin"
    ) {
      router.replace(
        role === "technician"
          ? "/dashboard/technician"
          : "/dashboard/customer"
      );
    }
  }, [session, isPending, role, pathname, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-3xl border border-slate-200/80 bg-white px-10 py-12 text-center shadow-sm">
          <Loader2 className="mx-auto animate-spin text-blue-600" size={38} />
          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const isProfileRoute =
    pathname === "/dashboard/profile" ||
    pathname.startsWith("/dashboard/profile/");

  const allowed =
    isProfileRoute ||
    (pathname.startsWith("/dashboard/technician") &&
      role === "technician") ||
    (pathname.startsWith("/dashboard/customer") &&
      role === "customer") ||
    (pathname.startsWith("/dashboard/admin") &&
      role === "admin");

  if (!allowed) {
    return null;
  }

  const menu =
    role === "admin"
      ? navigation.admin
      : role === "technician"
        ? navigation.technician
        : navigation.customer;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      {/* ================= MOBILE DRAWER (SLIDE-IN DARK SIDEBAR) ================= */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-white/10 bg-slate-950 text-white shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
                  <Wrench size={19} />
                </span>
                <div>
                  <Link
                    href="/"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="text-xl font-extrabold tracking-tight text-white"
                  >
                    Fix
                    <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                      Mate
                    </span>
                  </Link>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300/80">
                    {role} Portal
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close sidebar"
              >
                <X size={19} />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
              {menu.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard/" + role &&
                    pathname.startsWith(item.href + "/"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon
                      size={19}
                      className={isActive ? "text-white" : "text-slate-400"}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer Links */}
            <div className="space-y-1.5 border-t border-white/10 p-4">
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isProfileRoute
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Settings size={18} className="text-blue-400" />
                Profile Settings
              </Link>

              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/10 hover:text-blue-200"
              >
                <Home size={18} />
                Public Home
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ================= DESKTOP COLLAPSIBLE DARK SIDEBAR ================= */}
      <aside
        className={`relative hidden overflow-hidden border-r border-white/10 bg-slate-950 text-white transition-all duration-300 md:flex md:shrink-0 md:flex-col ${
          isCollapsed ? "md:w-20" : "md:w-68"
        }`}
      >
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -top-20 -left-16 h-52 w-52 rounded-full bg-blue-600/20 blur-[80px]" />

        {/* Sidebar Header */}
        <div className="relative flex h-16 items-center border-b border-white/10 px-4">
          {isCollapsed ? (
            <Link
              href="/"
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 transition-transform hover:scale-105"
              title="FixMate Home"
            >
              <Wrench size={20} />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
                <Wrench size={19} />
              </span>
              <div>
                <Link
                  href="/"
                  className="text-xl font-extrabold tracking-tight text-white"
                >
                  Fix
                  <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                    Mate
                  </span>
                </Link>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300/80">
                  {role} Portal
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="relative flex-1 space-y-1.5 overflow-y-auto p-3.5">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard/" + role &&
                pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`group flex items-center rounded-xl py-3 text-sm font-semibold transition-all duration-200 ${
                  isCollapsed ? "justify-center px-2" : "gap-3.5 px-4"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Icon
                  size={19}
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-blue-400"
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Link to Profile */}
        <div className="relative space-y-1.5 border-t border-white/10 p-3.5">
          <Link
            href="/dashboard/profile"
            title="Profile Settings"
            className={`group flex items-center rounded-xl py-2.5 text-sm font-semibold transition-all ${
              isCollapsed ? "justify-center px-2" : "gap-3.5 px-4"
            } ${
              isProfileRoute
                ? "bg-white/10 text-white"
                : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <Settings
              size={19}
              className="shrink-0 text-slate-400 transition-colors group-hover:text-blue-400"
            />
            {!isCollapsed && <span>Profile Settings</span>}
          </Link>
        </div>
      </aside>

      {/* ================= RIGHT COLUMN: TOPBAR + PAGE CONTENT ================= */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Dashboard Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          {/* Left: Mobile drawer toggle & Desktop collapse toggle & Home Link */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Mobile drawer toggle */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>

            {/* Desktop collapse/expand toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 md:flex"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen size={19} />
              ) : (
                <PanelLeftClose size={19} />
              )}
            </button>

            {/* Home link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 sm:text-sm"
              title="Back to Public Home"
            >
              <Home size={16} className="text-blue-600" />
              <span className="hidden sm:inline">Public Home</span>
            </Link>
          </div>

          {/* Right: User Display Name, Role Badge, Avatar */}
          <div className="flex items-center gap-3.5">
            <div className="hidden text-right sm:block">
              <p className="max-w-44 truncate text-sm font-bold text-slate-900">
                {displayName}
              </p>
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold capitalize text-blue-700 ring-1 ring-blue-600/15">
                <ShieldCheck size={11} />
                {role}
              </span>
            </div>

            {/* Avatar */}
            <Link
              href="/dashboard/profile"
              className="flex shrink-0 items-center rounded-full ring-2 ring-slate-200 transition hover:ring-blue-500"
              title="Update Profile"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={19} />
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="rounded-3xl border border-slate-200/80 bg-white px-10 py-12 text-center shadow-sm">
            <Loader2 className="mx-auto animate-spin text-blue-600" size={38} />
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading Dashboard...
            </p>
          </div>
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}