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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-gray-600">Loading Dashboard...</p>
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
    <div className="min-h-screen bg-gray-50 md:flex">

      {/* Mobile Drawer (Slide-in) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Wrench size={19} />
                </span>
                <div>
                  <Link
                    href="/"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="text-xl font-bold text-gray-900"
                  >
                    Fix<span className="text-blue-600">Mate</span>
                  </Link>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    {role} Dashboard
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
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
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <Icon size={19} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer Links */}
            <div className="border-t p-4 space-y-2">
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                <Settings size={18} />
                Profile Settings
              </Link>

              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
              >
                <Home size={18} />
                Public Home
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden border-r border-gray-200 bg-white transition-all duration-300 md:flex md:flex-col md:shrink-0 ${
          isCollapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center border-b border-gray-200 px-4">
          {isCollapsed ? (
            <Link
              href="/"
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm"
              title="FixMate Home"
            >
              <Wrench size={20} />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Wrench size={19} />
              </span>
              <div>
                <Link href="/" className="text-xl font-bold text-gray-900">
                  Fix<span className="text-blue-600">Mate</span>
                </Link>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  {role} Dashboard
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-3">
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
                className={`flex items-center rounded-lg py-3 text-sm font-semibold transition ${
                  isCollapsed
                    ? "justify-center px-2"
                    : "gap-3 px-4"
                } ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Link to Profile */}
        <div className="border-t border-gray-200 p-3">
          <Link
            href="/dashboard/profile"
            title="Profile Settings"
            className={`flex items-center rounded-lg py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition ${
              isCollapsed ? "justify-center px-2" : "gap-3 px-3"
            }`}
          >
            <Settings size={19} className="shrink-0" />
            {!isCollapsed && <span>Profile Settings</span>}
          </Link>
        </div>
      </aside>

      {/* Right Column: Topbar + Page Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Dashboard Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          {/* Left: Mobile drawer toggle & Desktop collapse toggle & Home Link */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile drawer toggle */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
              aria-label="Open sidebar menu"
            >
              <Menu size={22} />
            </button>

            {/* Desktop collapse/expand toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:flex"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen size={20} />
              ) : (
                <PanelLeftClose size={20} />
              )}
            </button>

            {/* Home link */}
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
              title="Back to Public Home"
            >
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>

          {/* Right: User Display Name, Role Badge, Avatar */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-40 truncate text-sm font-bold text-gray-900">
                {displayName}
              </p>
              <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-blue-700">
                {role}
              </span>
            </div>

            {/* Avatar */}
            <Link
              href="/dashboard/profile"
              className="flex shrink-0 items-center rounded-full ring-2 ring-transparent transition hover:ring-blue-400"
              title="Update Profile"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-700">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={20} />
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {children}
        </main>
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
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-gray-600">Loading Dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
