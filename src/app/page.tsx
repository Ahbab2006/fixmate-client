"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Headset,
  Loader2,
  Wrench,
  Smartphone,
  Laptop,
  Snowflake,
  Refrigerator,
  Tv,
  WashingMachine,
  Sparkles,
  Search,
  CalendarCheck,
  CreditCard,
  CheckCircle2,
  Star,
  UserCheck,
  Clock,
  Activity,
} from "lucide-react";

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  technicianName: string;
};

const serviceCategories = [
  {
    name: "Smartphone",
    icon: Smartphone,
    description: "Precision mobile diagnostics, screen & battery replacement",
    accent: "from-blue-500/10 to-indigo-500/10 text-blue-600",
  },
  {
    name: "Laptop & PC",
    icon: Laptop,
    description: "Hardware upgrades, OS optimization & motherboard repair",
    accent: "from-indigo-500/10 to-purple-500/10 text-indigo-600",
  },
  {
    name: "AC",
    icon: Snowflake,
    description: "Cooling restoration, gas refill & deep seasonal servicing",
    accent: "from-sky-500/10 to-cyan-500/10 text-sky-600",
  },
  {
    name: "Refrigerator",
    icon: Refrigerator,
    description: "Compressor repair, thermostat calibration & cooling care",
    accent: "from-teal-500/10 to-emerald-500/10 text-teal-600",
  },
  {
    name: "TV",
    icon: Tv,
    description: "LED/OLED display, backlight & audio board solutions",
    accent: "from-violet-500/10 to-fuchsia-500/10 text-violet-600",
  },
  {
    name: "Washing Machine",
    icon: WashingMachine,
    description: "Drum alignment, motor servicing & drainage troubleshooting",
    accent: "from-blue-600/10 to-sky-500/10 text-blue-600",
  },
  {
    name: "Electrical",
    icon: Zap,
    description: "Certified wiring, breaker panels & smart home installations",
    accent: "from-amber-500/10 to-orange-500/10 text-amber-600",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Find a Service",
    description:
      "Browse curated service categories and choose the right specialist for your home.",
    icon: Search,
  },
  {
    step: "02",
    title: "Send a Request",
    description:
      "Book online in seconds with your preferred schedule, location, and issue details.",
    icon: CalendarCheck,
  },
  {
    step: "03",
    title: "Technician Fixes It",
    description:
      "A background-verified expert arrives on time and resolves the issue cleanly.",
    icon: Wrench,
  },
  {
    step: "04",
    title: "Pay After Completion",
    description:
      "Review transparent pricing and pay securely via Stripe once you are satisfied.",
    icon: CreditCard,
  },
];

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const response = await fetch(apiUrl("/api/services"));
        const data = await response.json();

        if (response.ok && data.success) {
          setFeaturedServices(data.services.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch featured services:", error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchFeaturedServices();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-slate-950 pt-12 pb-16 text-white sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32">
        {/* Ambient Glow Effects */}
        <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-indigo-500/15 blur-[130px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-0 px-4 sm:px-6 md:grid-cols-12 md:gap-8 lg:gap-10 lg:px-8">
          {/* Left Column on Desktop / Inlined on Mobile via contents */}
          <div className="contents md:block md:col-span-7">
            {/* 1. Hero Badge */}
            <div className="order-1 self-start inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-blue-300 backdrop-blur-md">
              <Sparkles size={15} className="shrink-0 text-blue-400" />
              <span>Next-Gen Home Care & Repair Platform</span>
            </div>

            {/* 2. Main Heading */}
            <h1 className="order-2 mt-4 sm:mt-5 md:mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-[2.6rem] md:leading-[1.12] lg:text-6xl lg:leading-[1.12]">
              Your Trusted{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Home Service
              </span>{" "}
              Partner
            </h1>

            {/* 3. Description */}
            <p className="order-3 mt-3.5 sm:mt-4 md:mt-6 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base lg:text-lg">
              Book background-verified technicians for all your home repair and
              appliance maintenance needs. Transparent pricing, rapid dispatch,
              and guaranteed satisfaction.
            </p>

            {/* 5. CTA Buttons (placed after image on mobile via order-5) */}
            <div className="order-5 mt-6 sm:mt-8 md:mt-9 flex flex-col gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 sm:px-7 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-500 min-h-[48px]"
              >
                <span>Explore Services</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-6 py-3.5 sm:px-7 sm:py-4 text-sm sm:text-base font-semibold text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-slate-500 hover:bg-slate-800 hover:text-white min-h-[48px]"
              >
                Become a Technician
              </Link>
            </div>

            {/* 6. Trust Feature Items (placed after CTAs on mobile via order-6) */}
            <div className="order-6 mt-8 sm:mt-10 md:mt-12 grid grid-cols-3 gap-2 sm:gap-4 border-t border-slate-800/80 pt-6 sm:pt-8 sm:max-w-lg w-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                  <ShieldCheck size={18} className="sm:hidden" />
                  <ShieldCheck size={20} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    Trusted Platform
                  </p>
                  <p className="mt-0.5 text-[10px] sm:text-xs text-slate-400">
                    Vetted experts
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20">
                  <Zap size={18} className="sm:hidden" />
                  <Zap size={20} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    Fast Service
                  </p>
                  <p className="mt-0.5 text-[10px] sm:text-xs text-slate-400">
                    Same-day slots
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                  <Headset size={18} className="sm:hidden" />
                  <Headset size={20} className="hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    24/7 Support
                  </p>
                  <p className="mt-0.5 text-[10px] sm:text-xs text-slate-400">
                    Always available
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Right Column / Hero Image (order-4 on mobile: between Description and CTAs) */}
          <div className="relative order-4 mt-6 sm:mt-8 md:mt-0 md:col-span-5 w-full">
            <div className="relative mx-auto w-full max-w-md sm:max-w-lg md:max-w-none">
              {/* Decorative Frame */}
              <div className="relative h-[280px] sm:h-[340px] md:h-[420px] lg:h-[510px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=85"
                  alt="FixMate certified technician performing precision home appliance repair"
                  className="h-full w-full object-cover object-center transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                {/* Bottom Overlay Info inside Image */}
                <div className="absolute right-3 bottom-3 left-3 sm:right-4 sm:bottom-4 sm:left-4 md:right-3.5 md:bottom-3.5 md:left-3.5 lg:right-5 lg:bottom-5 lg:left-5 rounded-xl sm:rounded-2xl border border-white/15 bg-slate-900/85 p-3 sm:p-3.5 lg:p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 size={18} className="sm:hidden" />
                        <CheckCircle2 size={20} className="hidden sm:block" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs sm:text-sm font-semibold text-white">
                          Certified Home Specialists
                        </p>
                        <p className="truncate text-[10px] sm:text-xs text-slate-300">
                          100% Satisfaction & Safe Payment
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-1 rounded-lg bg-amber-400/15 px-2 py-1 sm:px-2.5 text-[11px] sm:text-xs font-bold text-amber-300">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span>4.9/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Floating Badge (hidden on narrow screens, visible on sm and up) */}
              <div className="absolute -top-3.5 left-2 sm:-top-4 sm:left-0 md:-top-4 md:-left-3 lg:-top-5 lg:-left-4 hidden sm:flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-white/15 bg-slate-900/90 px-3 py-2 sm:px-4 sm:py-3 shadow-xl backdrop-blur-md">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-blue-600 text-white">
                  <Wrench size={16} className="sm:hidden" />
                  <Wrench size={18} className="hidden sm:block" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-400">
                    On-Demand Care
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    7+ Core Categories
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICE CATEGORIES SECTION ================= */}
      <section className="relative bg-white px-4 py-16 sm:py-20 lg:py-28 transition-colors duration-200 dark:bg-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-600 ring-1 ring-blue-600/15 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-500/20">
              <Sparkles size={13} className="text-blue-600 dark:text-blue-400" />
              <span>What We Offer</span>
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
              Explore Our{" "}
              <span className="font-editorial italic font-normal text-blue-600 dark:text-blue-400">
                Service Categories
              </span>
            </h2>

            <p className="mt-3.5 sm:mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
              From precision electronics repair to essential home appliances,
              connect with certified specialists tailored to your needs.
            </p>
          </div>

          <div className="mt-12 sm:mt-16 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  href={`/services?category=${encodeURIComponent(category.name)}`}
                  className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-blue-500/50"
                >
                  <div>
                    <div
                      className={`inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.accent} transition-transform duration-300 group-hover:scale-110 shadow-sm`}
                    >
                      <IconComponent size={24} strokeWidth={2} />
                    </div>

                    <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-5 sm:mt-6 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
                    <span>Explore Services</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </div>
                </Link>
              );
            })}

            {/* 8th Balanced Catalog Discovery Card */}
            <Link
              href="/services"
              className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-dashed border-blue-400/50 bg-blue-50/40 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500 hover:bg-blue-50/70 hover:shadow-xl hover:shadow-blue-900/5 dark:border-blue-500/40 dark:bg-blue-950/20 dark:hover:border-blue-400 dark:hover:bg-blue-950/40"
            >
              <div>
                <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/25 transition-transform duration-300 group-hover:scale-110">
                  <Search size={24} strokeWidth={2} />
                </div>

                <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  All Services
                </h3>

                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Browse our complete catalog of verified repair packages, diagnostic options, and maintenance care.
                </p>
              </div>

              <div className="mt-5 sm:mt-6 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                <span>View Entire Catalog</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURED SERVICES SECTION ================= */}
      <section className="border-y border-slate-200/70 bg-slate-50/80 px-4 py-16 sm:py-20 lg:py-28 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                <Star size={12} className="fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400" />
                <span>Popular Services</span>
              </span>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
                Featured{" "}
                <span className="font-editorial italic font-normal text-blue-600 dark:text-blue-400">
                  Services
                </span>
              </h2>

              <p className="mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Top-rated repair and maintenance packages delivered by verified technicians.
              </p>
            </div>

            <Link
              href="/services"
              className="group inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400 sm:self-auto min-h-[44px]"
            >
              <span>View All Services</span>
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {loadingServices ? (
            <div className="mt-12 sm:mt-14 flex min-h-60 flex-col items-center justify-center rounded-3xl border border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900">
              <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={38} />
              <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                Loading featured services...
              </p>
            </div>
          ) : featuredServices.length === 0 ? (
            <div className="mt-12 sm:mt-14 rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Wrench size={30} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                No Services Available Yet
              </h3>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Approved services will appear here shortly.
              </p>
            </div>
          ) : (
            <div className="mt-10 sm:mt-12 grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service) => (
                <div
                  key={service._id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/50"
                >
                  {/* Card Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                    <span className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 rounded-full border border-white/20 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200">
                      {service.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div>
                      <h3 className="line-clamp-1 text-lg sm:text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {service.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-5 sm:mt-6">
                      {/* Technician Pill */}
                      <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                          <UserCheck size={13} />
                        </span>
                        <span className="truncate">
                          Technician:{" "}
                          <strong className="font-semibold text-slate-700 dark:text-slate-200">
                            {service.technicianName}
                          </strong>
                        </span>
                      </div>

                      {/* Price & Action Footer */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                        <div>
                          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Starting from
                          </p>
                          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                            ${service.basePrice}
                          </p>
                        </div>

                        <Link
                          href={`/services/${service._id}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-md hover:shadow-blue-600/20 dark:bg-blue-600 dark:hover:bg-blue-500 min-h-[40px]"
                        >
                          <span>View Details</span>
                          <ArrowRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="bg-white px-4 py-16 sm:py-20 lg:py-28 transition-colors duration-200 dark:bg-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-600 ring-1 ring-blue-600/15 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-500/20">
              <CalendarCheck size={13} className="text-blue-600 dark:text-blue-400" />
              <span>Simple Process</span>
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
              How FixMate{" "}
              <span className="font-editorial italic font-normal text-blue-600 dark:text-blue-400">
                Works
              </span>
            </h2>

            <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Getting your home repaired has never been easier. Follow four seamless steps from booking to completion.
            </p>
          </div>

          <div className="mt-12 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((item) => {
              const StepIcon = item.icon;
              return (
                <div
                  key={item.step}
                  className="group relative rounded-3xl border border-slate-200/80 bg-slate-50/70 p-6 sm:p-7 lg:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:bg-slate-950 dark:hover:border-blue-500/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 transition-transform duration-300 group-hover:scale-110">
                      <StepIcon size={24} />
                    </div>
                    <span className="font-mono text-2xl sm:text-3xl font-black text-slate-200 transition-colors group-hover:text-blue-300/80 dark:text-slate-800 dark:group-hover:text-blue-900/50">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 sm:mt-14 text-center">
            <Link
              href="/services"
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-500 min-h-[48px] w-full sm:w-auto"
            >
              <span>Book a Service Now</span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE FIXMATE SECTION ================= */}
      <section className="border-t border-slate-200/70 bg-slate-50/80 px-4 py-16 sm:py-20 lg:py-28 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Content */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              <ShieldCheck size={13} className="text-blue-600 dark:text-blue-400" />
              <span>Why FixMate</span>
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
              Making Home Services{" "}
              <span className="font-editorial italic font-normal text-blue-600 dark:text-blue-400">
                Simple &amp; Reliable
              </span>
            </h2>

            <p className="mt-3.5 sm:mt-5 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
              FixMate connects you with skilled, vetted technicians to make your home repair experience effortless, transparent, and worry-free.
            </p>

            <div className="mt-8 sm:mt-9 space-y-4 sm:space-y-6">
              <div className="flex gap-3.5 sm:gap-4">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:text-blue-400 dark:ring-slate-800">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Verified Service Providers
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Work with professionals whose profiles and services are reviewed and approved by our platform.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 sm:gap-4">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:text-blue-400 dark:ring-slate-800">
                  <Clock size={22} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Quick &amp; Easy Booking
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Request a service online in under a minute without unnecessary phone calls or hidden fees.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 sm:gap-4">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:text-blue-400 dark:ring-slate-800">
                  <CreditCard size={22} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Secure Online Payments
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Pay safely through our integrated Stripe checkout only after your repair is completed.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 sm:gap-4">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:text-blue-400 dark:ring-slate-800">
                  <Activity size={22} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Track Your Service Requests
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Monitor real-time booking progress and payment receipts directly from your personal dashboard.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/services"
              className="group mt-8 sm:mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 sm:px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 min-h-[48px] w-full sm:w-auto"
            >
              <span>Explore Services</span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Right Bento Grid Card */}
          <div className="relative lg:col-span-6">
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-blue-600/10 via-indigo-500/10 to-sky-400/10 blur-2xl" />

            <div className="relative rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-8 lg:p-10 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
              <div className="grid grid-cols-2 gap-3.5 sm:gap-5">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:p-6 transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <UserCheck size={22} />
                  </div>
                  <h3 className="mt-3.5 sm:mt-4 text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Skilled
                  </h3>
                  <p className="mt-0.5 sm:mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    Certified Technicians
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:p-6 transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <Wrench size={22} />
                  </div>
                  <h3 className="mt-3.5 sm:mt-4 text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Complete
                  </h3>
                  <p className="mt-0.5 sm:mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    Home Repair Solutions
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:p-6 transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <ShieldCheck size={22} />
                  </div>
                  <h3 className="mt-3.5 sm:mt-4 text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Secure
                  </h3>
                  <p className="mt-0.5 sm:mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    Stripe Checkout Protection
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:p-6 transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                    <Star size={22} />
                  </div>
                  <h3 className="mt-3.5 sm:mt-4 text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Reliable
                  </h3>
                  <p className="mt-0.5 sm:mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    5-Star Service Experience
                  </p>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-5 sm:p-6 text-white shadow-lg border border-white/10">
                <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Your Home, Our Responsibility
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-300">
                      Making everyday repairs effortless with FixMate.
                    </p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3.5 py-1.5 text-xs font-semibold text-blue-300 ring-1 ring-blue-400/30">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>100% Guaranteed</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION SECTION ================= */}
      <section className="bg-white px-4 py-16 sm:py-20 lg:py-24 transition-colors duration-200 dark:bg-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-slate-950 px-6 py-14 sm:px-12 lg:py-20 text-center shadow-2xl border border-white/10">
            {/* Ambient Glows */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-600/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:28px_28px]" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 backdrop-blur-md">
                <Sparkles size={13} className="text-blue-400" />
                <span>Let&apos;s Get Started</span>
              </span>

              <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Need a Repair? <br className="hidden sm:inline" />
                <span className="font-editorial italic font-normal bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  We&apos;re Here to Help!
                </span>
              </h2>

              <p className="mx-auto mt-4 sm:mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
                Don&apos;t let household breakdowns interrupt your day. Book a skilled technician and get your repair done right with FixMate.
              </p>

              <div className="mt-8 sm:mt-10 flex flex-col justify-center gap-3.5 sm:flex-row">
                <Link
                  href="/services"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:from-blue-500 hover:to-indigo-500 min-h-[48px] w-full sm:w-auto"
                >
                  <span>Book a Service</span>
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white backdrop-blur-md transition-all hover:border-slate-500 hover:bg-slate-800 min-h-[48px] w-full sm:w-auto"
                >
                  Join as Technician
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}