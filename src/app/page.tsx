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
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-slate-950 pt-16 pb-24 text-white lg:pt-24 lg:pb-32">
        {/* Ambient Glow Effects */}
        <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-indigo-500/15 blur-[130px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
          {/* Left Column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-md">
              <Sparkles size={15} className="text-blue-400" />
              <span>Next-Gen Home Care & Repair Platform</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.12]">
              Your Trusted{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Home Service
              </span>{" "}
              Partner
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Book background-verified technicians for all your home repair and
              appliance maintenance needs. Transparent pricing, rapid dispatch,
              and guaranteed satisfaction.
            </p>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-500"
              >
                Explore Services
                <ArrowRight
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-7 py-4 text-base font-semibold text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-slate-500 hover:bg-slate-800 hover:text-white"
              >
                Become a Technician
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-8 sm:max-w-lg">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Trusted Platform
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Vetted experts
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Fast Service
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Same-day slots
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                  <Headset size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    24/7 Support
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Always available
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Premium Hero Image & Floating Glass Cards */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Frame */}
              <div className="relative h-[380px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl sm:h-[460px] lg:h-[510px]">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=85"
                  alt="FixMate certified technician performing precision home appliance repair"
                  className="h-full w-full object-cover object-center transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Bottom Overlay Info inside Image */}
                <div className="absolute right-5 bottom-5 left-5 rounded-2xl border border-white/15 bg-slate-900/75 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Certified Home Specialists
                        </p>
                        <p className="text-xs text-slate-300">
                          100% Satisfaction & Safe Payment
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 rounded-lg bg-amber-400/15 px-2.5 py-1 text-xs font-bold text-amber-300">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      4.9/5
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Floating Badge */}
              <div className="absolute -top-5 -left-4 hidden items-center gap-3 rounded-2xl border border-white/15 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-md sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Wrench size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    On-Demand Care
                  </p>
                  <p className="text-sm font-bold text-white">
                    7+ Core Categories
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICE CATEGORIES SECTION ================= */}
      <section className="relative bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-600 ring-1 ring-blue-600/15">
              What We Offer
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Explore Our Service Categories
            </h2>

            <p className="mt-4 text-base leading-relaxed text-slate-600">
              From precision electronics repair to essential home appliances,
              connect with certified specialists tailored to your needs.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {serviceCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  href={`/services?category=${encodeURIComponent(category.name)}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5"
                >
                  <div>
                    <div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.accent} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <IconComponent size={26} strokeWidth={2} />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                    <span>Explore Services</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FEATURED SERVICES SECTION ================= */}
      <section className="border-y border-slate-200/70 bg-slate-50/80 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-100/70 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
                Popular Services
              </span>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Featured Services
              </h2>

              <p className="mt-3 max-w-2xl text-base text-slate-600">
                Top-rated repair and maintenance packages delivered by
                verified technicians.
              </p>
            </div>

            <Link
              href="/services"
              className="group inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 sm:self-auto"
            >
              View All Services
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {loadingServices ? (
            <div className="mt-14 flex min-h-60 flex-col items-center justify-center rounded-3xl border border-slate-200/70 bg-white">
              <Loader2 className="animate-spin text-blue-600" size={38} />
              <p className="mt-3 text-sm font-medium text-slate-500">
                Loading featured services...
              </p>
            </div>
          ) : featuredServices.length === 0 ? (
            <div className="mt-14 rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Wrench size={30} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No Services Available Yet
              </h3>
              <p className="mt-1.5 text-sm text-slate-500">
                Approved services will appear here shortly.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service) => (
                <div
                  key={service._id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5"
                >
                  {/* Card Image */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

                    <span className="absolute top-4 left-4 rounded-full border border-white/40 bg-white/90 px-3.5 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-md">
                      {service.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <h3 className="line-clamp-1 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                        {service.title}
                      </h3>

                      <p className="mt-2.5 line-clamp-2 min-h-[3rem] text-sm leading-relaxed text-slate-500">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-6">
                      {/* Technician Pill */}
                      <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <UserCheck size={13} />
                        </span>
                        <span>
                          Technician:{" "}
                          <strong className="font-semibold text-slate-700">
                            {service.technicianName}
                          </strong>
                        </span>
                      </div>

                      {/* Price & Action Footer */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                            Starting from
                          </p>
                          <p className="text-2xl font-extrabold text-slate-900">
                            ${service.basePrice}
                          </p>
                        </div>

                        <Link
                          href={`/services/${service._id}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-md hover:shadow-blue-600/20"
                        >
                          View Details
                          <ArrowRight size={16} />
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
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-600 ring-1 ring-blue-600/15">
              Simple Process
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              How FixMate Works
            </h2>

            <p className="mt-4 text-base text-slate-600">
              Getting your home repaired has never been easier. Follow four
              seamless steps from booking to completion.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((item) => {
              const StepIcon = item.icon;
              return (
                <div
                  key={item.step}
                  className="group relative rounded-3xl border border-slate-200/80 bg-slate-50/60 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-transform duration-300 group-hover:scale-110">
                      <StepIcon size={24} />
                    </div>
                    <span className="text-3xl font-black text-slate-200 transition-colors group-hover:text-blue-100">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700"
            >
              Book a Service Now
              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE FIXMATE SECTION ================= */}
      <section className="border-t border-slate-200/70 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-12">
          {/* Left Content */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center rounded-full bg-blue-100/70 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
              Why FixMate
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Making Home Services{" "}
              <span className="text-blue-600">Simple & Reliable</span>
            </h2>

            <p className="mt-5 text-base leading-relaxed text-slate-600">
              FixMate connects you with skilled, vetted technicians to make
              your home repair experience effortless, transparent, and
              worry-free.
            </p>

            <div className="mt-9 space-y-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Verified Service Providers
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Work with professionals whose profiles and services are
                    reviewed and approved by our platform.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80">
                  <Clock size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Quick & Easy Booking
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Request a service online in under a minute without
                    unnecessary phone calls or hidden fees.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80">
                  <CreditCard size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Secure Online Payments
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Pay safely through our integrated Stripe checkout only
                    after your repair is completed.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80">
                  <Activity size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Track Your Service Requests
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Monitor real-time booking progress and payment receipts
                    directly from your personal dashboard.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/services"
              className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-600"
            >
              Explore Services
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Right Bento Grid Card */}
          <div className="relative lg:col-span-6">
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-blue-600/10 via-indigo-500/10 to-sky-400/10 blur-2xl" />

            <div className="relative rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-10">
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-6 transition hover:border-blue-200 hover:bg-blue-50/40">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                    <UserCheck size={22} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    Skilled
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Certified Technicians
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-6 transition hover:border-blue-200 hover:bg-blue-50/40">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600">
                    <Wrench size={22} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    Complete
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Home Repair Solutions
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-6 transition hover:border-blue-200 hover:bg-blue-50/40">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600">
                    <ShieldCheck size={22} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    Secure
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Stripe Checkout Protection
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-6 transition hover:border-blue-200 hover:bg-blue-50/40">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                    <Star size={22} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    Reliable
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    5-Star Service Experience
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white shadow-lg">
                <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Your Home, Our Responsibility
                    </h3>
                    <p className="mt-1 text-sm text-slate-300">
                      Making everyday repairs effortless with FixMate.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-500/20 px-3.5 py-1.5 text-xs font-semibold text-blue-300 ring-1 ring-blue-400/30">
                    100% Guaranteed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION SECTION ================= */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-16 text-center shadow-2xl sm:px-12 lg:py-20">
            {/* Ambient Glows */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-600/25 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 backdrop-blur-md">
                Let&apos;s Get Started
              </span>

              <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Need a Repair? <br />
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  We&apos;re Here to Help!
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300">
                Don&apos;t let household breakdowns interrupt your day. Book a
                skilled technician and get your repair done right with FixMate.
              </p>

              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/services"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500"
                >
                  Book a Service
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:border-slate-500 hover:bg-slate-800"
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