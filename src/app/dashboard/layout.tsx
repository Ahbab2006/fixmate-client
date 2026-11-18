

"use client";

import { useEffect } from "react";
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  const role = session?.user?.role;

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const allowed =
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

      {/* Sidebar */}
      <aside className="w-full border-b bg-white md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">

        <div className="border-b p-5">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            FixMate
          </Link>

          <p className="mt-2 text-sm font-medium capitalize text-gray-500">
            {role} Dashboard
          </p>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-3 md:flex-col md:overflow-visible md:p-4">
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
                className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        {children}
      </main>

    </div>
  );
}

