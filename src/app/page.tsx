
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Headset,
  Loader2,
  Wrench,
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
    icon: "📱",
    description: "Mobile repair and troubleshooting",
  },
  {
    name: "Laptop & PC",
    icon: "💻",
    description: "Computer repair and maintenance",
  },
  {
    name: "AC",
    icon: "❄️",
    description: "Air conditioner repair and servicing",
  },
  {
    name: "Refrigerator",
    icon: "🧊",
    description: "Refrigerator repair and maintenance",
  },
  {
    name: "TV",
    icon: "📺",
    description: "Television repair services",
  },
  {
    name: "Washing Machine",
    icon: "🧺",
    description: "Washing machine repair services",
  },
  {
    name: "Electrical",
    icon: "⚡",
    description: "Electrical repair and installation",
  },
];

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/services"
        );

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
    <main>
      {/* Hero Section */}
      <section className="overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Welcome to FixMate
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Your Trusted
              <span className="block text-blue-600">
                Home Service
              </span>
              Partner
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
              Book skilled technicians for all your home repair
              and maintenance needs. Fast, reliable and affordable!
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Explore Services
                <ArrowRight size={20} />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg border-2 border-blue-600 px-6 py-3.5 font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Become a Technician
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-blue-100 pt-6">
              <div>
                <ShieldCheck className="text-blue-600" size={28} />
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  Trusted Platform
                </p>
              </div>

              <div>
                <Zap className="text-blue-600" size={28} />
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  Fast Service
                </p>
              </div>

              <div>
                <Headset className="text-blue-600" size={28} />
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  24/7 Support
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-[320px] overflow-hidden rounded-2xl shadow-2xl sm:h-[420px] md:h-[500px]">
            <Image
              src="/images/fixmate-hero.png"
              alt="FixMate home repair technician servicing an air conditioner"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-[90%_center]"
            />
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
              What We Offer
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Explore Our Service Categories
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              From everyday repairs to essential home maintenance,
              find the right professional service for your needs.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {serviceCategories.map((category) => (
              <Link
                key={category.name}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-4xl transition group-hover:bg-blue-100">
                  {category.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900 transition group-hover:text-blue-600">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {category.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                  Explore Services
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="bg-gray-50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Popular Services
              </span>

              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Featured Services
              </h2>

              <p className="mt-4 max-w-2xl text-gray-600">
                Find trusted professionals for your repair and
                maintenance needs.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View All Services
              <ArrowRight size={18} />
            </Link>
          </div>

          {loadingServices ? (
            <div className="flex min-h-52 items-center justify-center">
              <Loader2 className="animate-spin text-blue-600" size={36} />
            </div>
          ) : featuredServices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <Wrench className="mx-auto text-gray-400" size={40} />
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                No Services Available Yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Approved services will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service) => (
                <div
                  key={service._id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow">
                      {service.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="line-clamp-1 text-xl font-bold text-gray-900">
                      {service.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-gray-500">
                      {service.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          Starting from
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          ৳{service.basePrice}
                        </p>
                      </div>

                      <Link
                        href={`/services/${service._id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                      >
                        View Details
                        <ArrowRight size={16} />
                      </Link>
                    </div>

                    <p className="mt-4 text-xs text-gray-500">
                      Technician: {service.technicianName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
