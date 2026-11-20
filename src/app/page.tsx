
"use client";

import Image from "next/image";
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
                href="/sign-up"
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
                          ${service.basePrice}
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


{/* How It Works Section */}
<section className="bg-white px-4 py-16 sm:py-20">
  <div className="mx-auto max-w-7xl">
    <div className="mb-14 text-center">
      <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
        Simple Process
      </span>

      <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
        How FixMate Works
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-gray-600">
        Getting your home repaired has never been easier.
        Follow these four simple steps.
      </p>
    </div>

    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {/* Step 1 */}
      <div className="relative rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center transition hover:-translate-y-1 hover:shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
          🔍
        </div>

        <span className="mt-5 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-bold text-blue-700">
          Step 01
        </span>

        <h3 className="mt-4 text-xl font-bold text-gray-900">
          Find a Service
        </h3>

        <p className="mt-3 leading-7 text-gray-600">
          Browse our service categories and find the right
          professional for your repair needs.
        </p>
      </div>

      {/* Step 2 */}
      <div className="relative rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center transition hover:-translate-y-1 hover:shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
          📅
        </div>

        <span className="mt-5 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-bold text-blue-700">
          Step 02
        </span>

        <h3 className="mt-4 text-xl font-bold text-gray-900">
          Send a Request
        </h3>

        <p className="mt-3 leading-7 text-gray-600">
          Submit your repair request with your preferred date,
          address, and problem details.
        </p>
      </div>

      {/* Step 3 */}
      <div className="relative rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center transition hover:-translate-y-1 hover:shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
          🛠️
        </div>

        <span className="mt-5 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-bold text-blue-700">
          Step 03
        </span>

        <h3 className="mt-4 text-xl font-bold text-gray-900">
          Technician Fixes It
        </h3>

        <p className="mt-3 leading-7 text-gray-600">
          A skilled technician visits or repairs your item
          and completes the service efficiently.
        </p>
      </div>

      {/* Step 4 */}
      <div className="relative rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center transition hover:-translate-y-1 hover:shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
          💳
        </div>

        <span className="mt-5 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-bold text-blue-700">
          Step 04
        </span>

        <h3 className="mt-4 text-xl font-bold text-gray-900">
          Pay After Completion
        </h3>

        <p className="mt-3 leading-7 text-gray-600">
          Review the final amount and pay securely online
          only after the service is successfully completed.
        </p>
      </div>
    </div>

    <div className="mt-12 text-center">
      <Link
        href="/services"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
      >
        Book a Service Now
        <ArrowRight size={20} />
      </Link>
    </div>
  </div>
</section>


{/* Why Choose FixMate Section */}
<section className="bg-blue-50 px-4 py-16 sm:py-20">
  <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">

    {/* Left Content */}
    <div>
      <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
        Why FixMate
      </span>

      <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
        Making Home Services
        <span className="text-blue-600"> Simple & Reliable</span>
      </h2>

      <p className="mt-5 leading-7 text-gray-600">
        FixMate connects you with skilled technicians to make
        your home repair experience easier, safer and more convenient.
      </p>

      <div className="mt-8 space-y-6">

        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
            🛡️
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Verified Service Providers
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Find professionals whose services are reviewed
              and approved by our platform.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
            ⚡
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Quick & Easy Booking
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Request a service online without unnecessary
              calls or complicated processes.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
            💳
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Secure Online Payments
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Pay online through our integrated Stripe
              checkout after your service is completed.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
            📋
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Track Your Service Requests
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Monitor booking progress and payment status
              from your personal dashboard.
            </p>
          </div>
        </div>

      </div>

      <Link
        href="/services"
        className="mt-9 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
      >
        Explore Services
        <ArrowRight size={20} />
      </Link>
    </div>

    {/* Right Content */}
    <div className="relative">
      <div className="absolute -left-5 -top-5 h-32 w-32 rounded-full bg-blue-200/60 blur-2xl" />

      <div className="relative rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <div className="grid grid-cols-2 gap-5">

          <div className="rounded-2xl bg-blue-50 p-6 text-center">
            <span className="text-4xl">👨‍🔧</span>
            <h3 className="mt-4 font-bold text-gray-900">
              Skilled
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Technicians
            </p>
          </div>

          <div className="rounded-2xl bg-blue-50 p-6 text-center">
            <span className="text-4xl">🏠</span>
            <h3 className="mt-4 font-bold text-gray-900">
              Home
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Repair Solutions
            </p>
          </div>

          <div className="rounded-2xl bg-blue-50 p-6 text-center">
            <span className="text-4xl">🔒</span>
            <h3 className="mt-4 font-bold text-gray-900">
              Secure
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Booking & Payment
            </p>
          </div>

          <div className="rounded-2xl bg-blue-50 p-6 text-center">
            <span className="text-4xl">⭐</span>
            <h3 className="mt-4 font-bold text-gray-900">
              Reliable
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Service Experience
            </p>
          </div>

        </div>

        <div className="mt-6 rounded-2xl bg-blue-600 p-6 text-center text-white">
          <h3 className="text-xl font-bold">
            Your Home, Our Responsibility
          </h3>
          <p className="mt-2 text-sm text-blue-100">
            Making everyday repairs easier with FixMate.
          </p>
        </div>
      </div>
    </div>

  </div>
</section>




{/* Call To Action Section */}
<section className="bg-white px-4 py-16 sm:py-20">
  <div className="mx-auto max-w-7xl">
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-14 text-center shadow-xl sm:px-12 sm:py-16">

      {/* Background Decorations */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
      <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-white/10" />

      <div className="relative z-10">
        <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white">
          Let's Get Started
        </span>

        <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
          Need a Repair?
          <br />
          We're Here to Help!
        </h2>

        <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
          Don't let household problems interrupt your day.
          Find a skilled technician and get your repair done
          with FixMate.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3.5 font-bold text-blue-700 shadow-lg transition hover:bg-blue-50"
          >
            Book a Service
            <ArrowRight size={20} />
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center rounded-lg border-2 border-white/80 px-7 py-3.5 font-bold text-white transition hover:bg-white/10"
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
