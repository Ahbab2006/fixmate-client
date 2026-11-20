
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, RefreshCw, ArrowRight } from "lucide-react";
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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [sort, setSort] = useState("newest");

  const [initialized, setInitialized] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Read filters from URL on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const category = params.get("category");
    const mode = params.get("serviceMode");
    const sortValue = params.get("sort");

    setSearch(params.get("search") || "");

    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    }

    if (mode && serviceModes.includes(mode)) {
      setSelectedMode(mode);
    }

    if (
      sortValue &&
      ["newest", "price-low", "price-high"].includes(sortValue)
    ) {
      setSort(sortValue);
    }

    setInitialized(true);
  }, []);

  // Update URL and fetch filtered services
  useEffect(() => {
    if (!initialized) return;

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
    initialized,
    search,
    selectedCategory,
    selectedMode,
    sort,
    refreshKey,
  ]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Explore Our Services
          </h1>

          <p className="mt-3 text-gray-600">
            Find the right repair service for your device.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-6 flex max-w-xl items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm">
          <Search className="text-gray-400" size={20} />

          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-gray-800 outline-none"
          />
        </div>

        {/* Categories */}
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "border bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Service Mode and Sorting */}
        <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">

          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="rounded-lg border bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            {serviceModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode === "All" ? "All Service Modes" : mode}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Results */}
        <div className="mb-5 flex items-center justify-between">
          <p className="font-semibold text-gray-800">
            {loading ? "Loading services..." : `${services.length} Services Found`}
          </p>

          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-100"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center text-gray-600">
            Loading services...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            <p>{error}</p>

            <button
              onClick={() => setRefreshKey((prev) => prev + 1)}
              className="mt-3 font-semibold underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="rounded-xl bg-white py-16 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No Services Found
            </h2>

            <p className="mt-2 text-gray-500">
              Try another search or filter.
            </p>
          </div>
        )}

        {/* Service Cards */}
        {!loading && !error && services.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-52 w-full object-cover"
                />

                <div className="p-5">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                    {service.category}
                  </span>

                  <h2 className="mt-3 text-xl font-bold text-gray-900">
                    {service.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {service.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Technician:</strong>{" "}
                      {service.technicianName}
                    </p>

                    <p>
                      <strong>Duration:</strong>{" "}
                      {service.estimatedDuration}
                    </p>

                    <p>
                      <strong>Service Mode:</strong>{" "}
                      {service.serviceMode}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="text-xs text-gray-500">
                        Starting Price
                      </p>

                      <p className="text-xl font-bold text-blue-600">
                        ${service.basePrice}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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
      </div>
    </main>
  );
}
