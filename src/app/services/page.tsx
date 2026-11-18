
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, RefreshCw, ArrowRight } from "lucide-react";

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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/services"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load services.");
      }

      setServices(data.services || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        selectedCategory === "All" ||
        service.category === selectedCategory;

      const searchText = search.toLowerCase();

      const matchesSearch =
        service.title.toLowerCase().includes(searchText) ||
        service.category.toLowerCase().includes(searchText) ||
        service.description.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [services, search, selectedCategory]);

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
        <div className="mx-auto mb-8 flex max-w-xl items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm">
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
        <div className="mb-8 flex flex-wrap justify-center gap-3">
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

        {/* Results */}
        <div className="mb-5 flex items-center justify-between">
          <p className="font-semibold text-gray-800">
            {filteredServices.length} Services Found
          </p>

          <button
            onClick={fetchServices}
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
              onClick={fetchServices}
              className="mt-3 font-semibold underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredServices.length === 0 && (
          <div className="rounded-xl bg-white py-16 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No Services Found
            </h2>
            <p className="mt-2 text-gray-500">
              Try another search or category.
            </p>
          </div>
        )}

        {/* Service Cards */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
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
                        ৳{service.basePrice}
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
