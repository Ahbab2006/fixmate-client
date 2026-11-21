"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  RefreshCw,
  ArrowRight,
  Sparkles,
  UserCheck,
  Timer,
  Briefcase,
  SlidersHorizontal,
  ArrowUpDown,
  Wrench,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import { apiUrl } from "@/lib/api";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
}

const categories = [
  "All",
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const serviceModes = [
  "All",
  "Home Visit",
  "Shop Drop-off",
];

function ServicesContent() {
  const searchParams = useSearchParams();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(() => {
    return searchParams.get("search") || "";
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const cat = searchParams.get("category");
    return cat && categories.includes(cat) ? cat : "All";
  });
  const [selectedMode, setSelectedMode] = useState(() => {
    const mode = searchParams.get("serviceMode");
    return mode && serviceModes.includes(mode) ? mode : "All";
  });
  const [sort, setSort] = useState(() => {
    const s = searchParams.get("sort");
    return s && ["newest", "price-low", "price-high"].includes(s) ? s : "newest";
  });

  const [refreshKey, setRefreshKey] = useState(0);

  // Sync state with URL search params when navigated to via client-side links
  useEffect(() => {
    const searchParam = searchParams.get("search") || "";
    const cat = searchParams.get("category");
    const mode = searchParams.get("serviceMode");
    const s = searchParams.get("sort");

    setSearch(searchParam);
    setSelectedCategory(cat && categories.includes(cat) ? cat : "All");
    setSelectedMode(mode && serviceModes.includes(mode) ? mode : "All");
    setSort(s && ["newest", "price-low", "price-high"].includes(s) ? s : "newest");
  }, [searchParams]);

  // Update URL and fetch filtered services
  useEffect(() => {

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (selectedCategory !== "All") {
      params.set("category", selectedCategory);
    }

    if (selectedMode !== "All") {
      params.set("serviceMode", selectedMode);
    }

    if (sort !== "newest") {
      params.set("sort", sort);
    }

    const queryString = params.toString();

    const newURL = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    window.history.replaceState(null, "", newURL);

    // Fetch services from backend
    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const apiParams = new URLSearchParams();

        if (search.trim()) {
          apiParams.set("search", search.trim());
        }

        if (selectedCategory !== "All") {
          apiParams.set("category", selectedCategory);
        }

        if (selectedMode !== "All") {
          apiParams.set("serviceMode", selectedMode);
        }

        apiParams.set("sort", sort);

        const response = await fetch(
          apiUrl(`/api/services?${apiParams.toString()}`),
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load services.");
        }

        setServices(data.services || []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // Small delay prevents unnecessary requests while typing
    const timer = setTimeout(fetchServices, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    search,
    selectedCategory,
    selectedMode,
    sort,
    refreshKey,
  ]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* ================= DARK PREMIUM HERO & SEARCH HEADER ================= */}
      <section className="relative overflow-hidden bg-slate-950 px-4 pt-16 pb-20 text-white sm:px-6 lg:px-8 lg:pt-20 lg:pb-24">
        {/* Ambient Glows & Subtle Grid */}
        <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-indigo-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-md">
            <Sparkles size={15} className="text-blue-400" />
            <span>Verified Repair Marketplace</span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Services
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            Find certified specialists for your smartphone, laptop, AC, or home
            appliances with transparent upfront pricing.
          </p>

          {/* Elevated Search Bar */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/95 p-2 pl-4 shadow-2xl shadow-blue-950/50 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/20 dark:bg-slate-900/95 dark:border-white/10">
              <Search className="shrink-0 text-slate-400 dark:text-slate-500" size={20} />

              <input
                type="text"
                placeholder="Search by service, device, or issue..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none dark:text-white dark:placeholder:text-slate-500 sm:text-base"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FILTERS & CATALOG SECTION ================= */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                  active
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/15 dark:bg-blue-600 dark:text-white dark:shadow-blue-600/25"
                    : "border border-slate-200/80 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:text-blue-400"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Filter Bar: Count + Mode/Sort + Refresh */}
        <div className="mt-10 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {loading
                ? "Searching services..."
                : `${services.length} Service${services.length === 1 ? "" : "s"} Found`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Service Mode Select */}
            <div className="relative inline-flex items-center">
              <SlidersHorizontal
                size={15}
                className="pointer-events-none absolute left-3.5 text-slate-400"
              />
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pr-8 pl-9 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:focus:bg-slate-900 sm:text-sm"
              >
                {serviceModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode === "All" ? "All Service Modes" : mode}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="relative inline-flex items-center">
              <ArrowUpDown
                size={15}
                className="pointer-events-none absolute left-3.5 text-slate-400"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pr-8 pl-9 text-xs font-bold text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:focus:bg-slate-900 sm:text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => setRefreshKey((prev) => prev + 1)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 sm:text-sm"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* ================= LOADING STATE ================= */}
        {loading && (
          <div className="mt-10 flex min-h-72 flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white py-20 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={38} />
            <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Loading available services...
            </p>
          </div>
        )}

        {/* ================= ERROR STATE ================= */}
        {!loading && error && (
          <div className="mt-10 rounded-3xl border border-rose-200 bg-rose-50/90 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/40">
            <AlertCircle className="mx-auto text-rose-600 dark:text-rose-400" size={34} />
            <p className="mt-3 text-base font-bold text-rose-900 dark:text-rose-200">{error}</p>

            <button
              onClick={() => setRefreshKey((prev) => prev + 1)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && !error && services.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <Wrench size={30} />
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white">
              No Services Found
            </h2>

            <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500 dark:text-slate-400">
              We couldn&apos;t find any services matching your current search or
              filters. Try adjusting your criteria.
            </p>
          </div>
        )}

        {/* ================= SERVICE CARDS GRID ================= */}
        {!loading && !error && services.length > 0 && (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/50"
              >
                {/* Service Image */}
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

                  <span className="absolute top-4 left-4 rounded-full border border-white/40 bg-white/95 px-3.5 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200">
                    {service.category}
                  </span>

                  <span className="absolute right-4 bottom-3.5 inline-flex items-center gap-1 rounded-lg bg-slate-950/75 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    <Briefcase size={12} className="text-blue-400" />
                    {service.serviceMode}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h2 className="line-clamp-1 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {service.title}
                    </h2>

                    <p className="mt-2.5 line-clamp-2 min-h-[3rem] text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {service.description}
                    </p>

                    {/* Metadata Pills */}
                    <div className="mt-5 space-y-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-950/60">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
                          <UserCheck size={14} className="text-blue-600 dark:text-blue-400" />
                          Technician
                        </span>
                        <span className="truncate font-bold text-slate-800 dark:text-slate-200">
                          {service.technicianName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
                          <Timer size={14} className="text-indigo-600 dark:text-indigo-400" />
                          Est. Duration
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {service.estimatedDuration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Details CTA Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Starting Price
                      </p>

                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        ${service.basePrice}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-md hover:shadow-blue-600/20 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                      Details
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={36} />
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}