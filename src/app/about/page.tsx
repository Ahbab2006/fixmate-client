
import Link from "next/link";
import {
  Target,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Users,
  Wrench,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            About FixMate
          </span>

          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Making Home Services
            <span className="block text-blue-600">
              Easier & Better
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-600">
            FixMate is a home service platform that connects
            customers with skilled technicians for reliable
            repair and maintenance solutions.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Explore Our Services
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Who We Are
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              About Our Platform
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              Finding a reliable technician for home repairs
              can be challenging. FixMate aims to make that
              process simple by bringing customers and skilled
              service providers together in one platform.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              From smartphone and laptop repairs to home
              appliance maintenance, customers can explore
              services, submit booking requests and track
              their service progress conveniently.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-2xl bg-blue-50 p-7 text-center">
              <Wrench className="mx-auto text-blue-600" size={38} />
              <h3 className="mt-4 font-bold text-gray-900">
                Repair Services
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Multiple service categories
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-7 text-center">
              <Users className="mx-auto text-blue-600" size={38} />
              <h3 className="mt-4 font-bold text-gray-900">
                Skilled Technicians
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Connecting customers and professionals
              </p>
            </div>

            <div className="col-span-2 rounded-2xl bg-blue-600 p-7 text-center text-white">
              <HeartHandshake className="mx-auto" size={38} />
              <h3 className="mt-4 text-xl font-bold">
                Customer First
              </h3>
              <p className="mt-2 text-sm text-blue-100">
                Focused on convenient and reliable service experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Our Purpose
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Mission & Vision
            </h2>
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                <Target className="text-blue-600" size={30} />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-gray-900">
                Our Mission
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                To simplify home repair services by making it
                easier for customers to discover, request and
                manage professional repair solutions.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                <Eye className="text-blue-600" size={30} />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-gray-900">
                Our Vision
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                To become a trusted platform where customers
                can find dependable technicians and professionals
                can grow their service opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
              What Matters to Us
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Core Values
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 p-7 text-center">
              <ShieldCheck className="mx-auto text-blue-600" size={38} />
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Trust & Safety
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                We emphasize service approval and responsible
                platform management.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-7 text-center">
              <HeartHandshake className="mx-auto text-blue-600" size={38} />
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Customer Satisfaction
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                We aim to make every service experience
                convenient and user-friendly.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-7 text-center">
              <Users className="mx-auto text-blue-600" size={38} />
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Professional Growth
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                We provide technicians with opportunities
                to connect with potential customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-blue-600 px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Experience FixMate?
          </h2>

          <p className="mt-4 leading-7 text-blue-100">
            Explore our services and find the right professional
            for your repair needs.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Explore Services
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>
    </main>
  );
}
