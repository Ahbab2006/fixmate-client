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
  X,
  AlertCircle,
  MapPin,
  RotateCcw,
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

function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-0 shadow-xs dark:border-slate-800 dark:bg-slate-900 animate-pulse">
      {/* Image Skeleton */}
      <div className="h-52 sm:h-56 w-full bg-slate-200 dark:bg-slate-800" />
      {/* Body Skeleton */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="h-6 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
            <div className="h-4 w-5/6 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
          </div>
          {/* Metadata Skeleton */}
          <div className="mt-5 space-y-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800/60 dark:bg-slate-950/40">
            <div className="h-4 w-1/2 rounded bg-slate-200/80 dark:bg-slate-800/80" />
            <div className="h-4 w-2/3 rounded bg-slate-200/80 dark:bg-slate-800/80" />
          </div>
        </div>
        {/* Footer Skeleton */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="h-7 w-20 rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

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

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedMode !== "All" ||
    sort !== "newest";

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedMode("All");
    setSort("newest");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* ================= DARK PREMIUM HERO & SEARCH HEADER ================= */}
      <section className="relative overflow-hidden bg-slate-950 px-4 pt-14 pb-18 text-white sm:px-6 sm:pt-16 sm:pb-20 lg:px-8 lg:pt-20 lg:pb-24">
        {/* Ambient Glows & Subtle Grid */}
        <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-indigo-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-blue-300 backdrop-blur-md">
            <Sparkles size={14} className="text-blue-400" />
            <span>Verified Repair Marketplace</span>
          </div>

          <h1 className="mt-4 sm:mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Explore Our{" "}
            <span className="font-editorial italic font-normal text-blue-400">
              Services
            </span>
          </h1>

          <p className="mx-auto mt-3.5 sm:mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Find certified specialists for your smartphone, laptop, AC, or home
            appliances with transparent upfront pricing.
          </p>

          {/* Elevated Search Bar */}
          <div className="mx-auto mt-7 sm:mt-8 max-w-2xl">
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/95 p-1.5 pl-4 shadow-2xl shadow-blue-950/50 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/20 dark:border-white/10 dark:bg-slate-900/95">
              <Search className="shrink-0 text-slate-400 dark:text-slate-500" size={20} />

              <input
                type="text"
                placeholder="Search by service, device, or issue..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none dark:text-white dark:placeholder:text-slate-500 sm:text-base"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FILTERS & CATALOG SECTION ================= */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`min-h-[40px] rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  active
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/15 dark:bg-blue-600 dark:text-white dark:shadow-blue-600/25"
                    : "border border-slate-200/90 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:text-blue-400"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Filter Bar: Count + Mode/Sort + Refresh */}
        <div className="mt-8 sm:mt-10 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
              {loading
                ? "Searching services..."
                : `${services.length} Service${services.length === 1 ? "" : "s"} Available`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Service Mode Select */}
            <div className="relative inline-flex items-center flex-1 sm:flex-none">
              <SlidersHorizontal
                size={15}
                className="pointer-events-none absolute left-3.5 text-slate-400"
              />
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                aria-label="Filter by service mode"
                className="w-full sm:w-auto min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pr-8 pl-9 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:focus:bg-slate-900 sm:text-sm"
              >
                {serviceModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode === "All" ? "All Service Modes" : mode}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="relative inline-flex items-center flex-1 sm:flex-none">
              <ArrowUpDown
                size={15}
                className="pointer-events-none absolute left-3.5 text-slate-400"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort services"
                className="w-full sm:w-auto min-h-[42px] rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pr-8 pl-9 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:focus:bg-slate-900 sm:text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => setRefreshKey((prev) => prev + 1)}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 sm:text-sm"
              aria-label="Refresh service list"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              <span className="hidden xs:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-slate-100/70 p-3 text-xs dark:bg-slate-900/60 sm:px-4">
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              Active Filters:
            </span>

            {search.trim() && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <span>Query: &ldquo;{search.trim()}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Clear search filter"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <span>Category: {selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="rounded p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Reset category"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {selectedMode !== "All" && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <span>Mode: {selectedMode}</span>
                <button
                  type="button"
                  onClick={() => setSelectedMode("All")}
                  className="rounded p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Reset mode"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {sort !== "newest" && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <span>
                  Sort: {sort === "price-low" ? "Price Low-High" : "Price High-Low"}
                </span>
                <button
                  type="button"
                  onClick={() => setSort("newest")}
                  className="rounded p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Reset sort"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 ml-auto"
            >
              <RotateCcw size={12} />
              <span>Reset All</span>
            </button>
          </div>
        )}

        {/* ================= LOADING SKELETON STATE ================= */}
        {loading && (
          <div className="mt-8 sm:mt-10 grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <ServiceCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* ================= ERROR STATE ================= */}
        {!loading && error && (
          <div className="mt-10 rounded-3xl border border-rose-200 bg-rose-50/90 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/40">
            <AlertCircle className="mx-auto text-rose-600 dark:text-rose-400" size={36} />
            <p className="mt-3 text-base font-bold text-rose-900 dark:text-rose-200">{error}</p>
            <p className="mt-1 text-xs text-rose-700 dark:text-rose-300">
              Could not communicate with the services catalog. Please check your connection.
            </p>

            <button
              type="button"
              onClick={() => setRefreshKey((prev) => prev + 1)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 active:scale-95"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && !error && services.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900/60 sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              {hasActiveFilters ? <Search size={28} /> : <Wrench size={28} />}
            </div>

            <h2 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {hasActiveFilters ? "No Matching Services Found" : "No Services Available Yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              {hasActiveFilters
                ? "We couldn't find any services matching your current filters. Try adjusting your query or reset all filters."
                : "Our service catalog is constantly expanding. Please check back soon or refresh the page."}
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-95"
                >
                  <RotateCcw size={15} />
                  <span>Reset All Filters</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setRefreshKey((prev) => prev + 1)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <RefreshCw size={15} />
                  <span>Refresh Services</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= SERVICE CARDS GRID ================= */}
        {!loading && !error && services.length > 0 && (
          <div className="mt-8 sm:mt-10 grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/50"
              >
                {/* Service Image */}
                <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/15 to-transparent" />

                  <span className="absolute top-3.5 left-3.5 rounded-full border border-white/20 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-xs dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200">
                    {service.category}
                  </span>

                  <span className="absolute right-3.5 bottom-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/75 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                    <Briefcase size={12} className="text-blue-400" />
                    {service.serviceMode}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <h2 className="line-clamp-1 text-lg sm:text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {service.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem] text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {service.description}
                    </p>

                    {/* Metadata Pills */}
                    <div className="mt-4 space-y-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-xs dark:border-slate-800/80 dark:bg-slate-950/50">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
                          <UserCheck size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                          Technician
                        </span>
                        <span className="truncate font-semibold text-slate-800 dark:text-slate-200 max-w-[140px]">
                          {service.technicianName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
                          <Timer size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                          Est. Duration
                        </span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {service.estimatedDuration}
                        </span>
                      </div>

                      {service.serviceArea && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
                            <MapPin size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                            Service Area
                          </span>
                          <span className="truncate text-slate-700 dark:text-slate-300 max-w-[140px]">
                            {service.serviceArea}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Details CTA Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div>
                      <p className="text-[11px] font-mono font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Starting Price
                      </p>

                      <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                        ${service.basePrice}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-blue-600 hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                      <span>View Details</span>
                      <ArrowRight size={15} />
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
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Loading services...
            </p>
          </div>
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
