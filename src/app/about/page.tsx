import Link from "next/link";
import {
  Target,
  Eye,
  ShieldCheck,
  Users,
  Wrench,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  CalendarCheck,
  Clock,
  Briefcase,
  User,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-slate-950 px-4 pt-16 pb-20 text-white sm:px-6 sm:pt-20 sm:pb-24 lg:px-8 lg:pt-24 lg:pb-28">
        {/* Subtle Ambient Glows & Grid */}
        <div className="pointer-events-none absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-indigo-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-blue-300 backdrop-blur-md">
            <Sparkles size={14} className="text-blue-400" />
            <span>About FixMate</span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.15]">
            Connecting Homeowners with Skilled{" "}
            <span className="font-editorial italic font-normal text-blue-400">
              Repair Specialists
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base lg:text-lg">
            FixMate is an on-demand home service marketplace designed to make
            discovering, requesting, and tracking home and device repairs
            transparent and straightforward.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link
              href="/services"
              className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.01] active:scale-[0.99] sm:w-auto"
            >
              <span>Explore Our Services</span>
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/sign-up"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm sm:text-base font-semibold text-slate-200 backdrop-blur-md transition-all duration-200 hover:border-slate-500 hover:bg-slate-800 hover:text-white sm:w-auto"
            >
              <span>Join as Technician</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHAT FIXMATE DOES ================= */}
      <section className="bg-white px-4 py-16 transition-colors duration-200 dark:bg-slate-900 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 ring-1 ring-blue-600/15 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-500/20">
              Core Capabilities
            </span>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
              What FixMate{" "}
              <span className="font-editorial italic font-normal text-blue-600 dark:text-blue-400">
                Delivers
              </span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              A structured workflow that replaces informal, uncertain service
              booking with clarity and accountability.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Capability 1 */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-blue-500/50 dark:hover:bg-slate-950">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-600/15 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-500/20">
                  <Wrench size={22} />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
                  7+ Core Categories
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Discover dedicated services for smartphones, laptops, ACs,
                  refrigerators, TVs, washing machines, and electrical repairs.
                </p>
              </div>
            </div>

            {/* Capability 2 */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-blue-500/50 dark:hover:bg-slate-950">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600/15 dark:bg-indigo-950/50 dark:text-indigo-400 dark:ring-indigo-500/20">
                  <CalendarCheck size={22} />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
                  Direct Service Booking
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Choose your preferred service date, specify your address, and
                  describe device symptoms with diagnostic detail.
                </p>
              </div>
            </div>

            {/* Capability 3 */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-blue-500/50 dark:hover:bg-slate-950">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-600/15 dark:bg-sky-950/50 dark:text-sky-400 dark:ring-sky-500/20">
                  <Clock size={22} />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
                  Real-Time Tracking
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Monitor the status of your repair request through every stage—from
                  submission to technician review and completion.
                </p>
              </div>
            </div>

            {/* Capability 4 */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-blue-500/50 dark:hover:bg-slate-950">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/15 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-500/20">
                  <Briefcase size={22} />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
                  Flexible Delivery Modes
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Select between on-site Home Visits or Shop Drop-off fulfillment
                  depending on the service scope.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="border-y border-slate-200/70 bg-slate-50/80 px-4 py-16 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-blue-100/70 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              Our Direction
            </span>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
              Mission &amp;{" "}
              <span className="font-editorial italic font-normal text-blue-600 dark:text-blue-400">
                Vision
              </span>
            </h2>

            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Clear commitments that guide the development of our service
              ecosystem.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
            {/* Mission Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25">
                <Target size={24} />
              </div>

              <h3 className="mt-6 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Our Mission
              </h3>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                To simplify the home maintenance process by providing a reliable,
                organized platform where customers can easily discover verified
                services, request appointments, and coordinate directly with
                skilled technicians.
              </p>
            </div>

            {/* Vision Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-600 text-white shadow-md shadow-indigo-600/25">
                <Eye size={24} />
              </div>

              <h3 className="mt-6 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Our Vision
              </h3>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                To become the premier local service destination where customers
                schedule repairs with confidence through transparent base pricing,
                and where dedicated independent technicians build lasting client
                relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE FIXMATE ================= */}
      <section className="bg-white px-4 py-16 transition-colors duration-200 dark:bg-slate-900 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 ring-1 ring-blue-600/15 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-500/20">
              Platform Values
            </span>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
              Why Use{" "}
              <span className="font-editorial italic font-normal text-blue-600 dark:text-blue-400">
                FixMate
              </span>
            </h2>

            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Carefully engineered features built to provide an honest,
              dependable repair experience.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Value 1: Admin Reviewed Catalog */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-600/15 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-500/20">
                <ShieldCheck size={20} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Admin-Reviewed Catalog
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Every service listing undergoes administrative review and
                verification before becoming active on the marketplace.
              </p>
            </div>

            {/* Value 2: Upfront Pricing */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600/15 dark:bg-indigo-950/50 dark:text-indigo-400 dark:ring-indigo-500/20">
                <Sparkles size={20} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Transparent Starting Prices
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Each service displays an explicit base rate upfront so you know
                starting costs before submitting your booking.
              </p>
            </div>

            {/* Value 3: Direct Coordination */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-600/15 dark:bg-sky-950/50 dark:text-sky-400 dark:ring-sky-500/20">
                <Users size={20} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Direct Coordination
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Technicians receive customer contact details to confirm schedule
                times and specific device symptoms before dispatch.
              </p>
            </div>

            {/* Value 4: Dedicated Dashboard */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/15 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-500/20">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Centralized Dashboards
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Customers and technicians access dedicated portals to track
                bookings, manage listings, and review service history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= USER GROUPS / PLATFORM VALUE ================= */}
      <section className="border-t border-slate-200/70 bg-slate-50/80 px-4 py-16 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-blue-100/70 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              User Roles
            </span>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
              Built for Customers &amp;{" "}
              <span className="font-editorial italic font-normal text-blue-600 dark:text-blue-400">
                Technicians
              </span>
            </h2>

            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              A balanced ecosystem providing dedicated value for both sides of the
              repair marketplace.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* For Customers */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-9">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-600/15 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-500/20">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      For Homeowners &amp; Clients
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Reliable repairs when you need them most
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>Explore diverse repair services across major appliance types</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>View starting base prices and estimated turnaround times</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>Schedule appointments with customized diagnostic notes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>Track progress from request submission to final sign-off</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/services"
                  className="inline-flex min-h-[44px] items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <span>Explore Available Services</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* For Technicians */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-9">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600/15 dark:bg-indigo-950/50 dark:text-indigo-400 dark:ring-indigo-500/20">
                    <Wrench size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      For Independent Specialists
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Expand your local service client base
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Create and publish categorized repair packages</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Receive direct booking requests from local customers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Manage job statuses from pending review to completion</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Transparent workflow with no arbitrary listing commissions</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/sign-up"
                  className="inline-flex min-h-[44px] items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <span>Register as a Technician</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLOSING CTA SECTION ================= */}
      <section className="bg-white px-4 py-16 transition-colors duration-200 dark:bg-slate-900 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-center shadow-xl sm:px-12 sm:py-18 lg:py-20">
            {/* Ambient Lighting */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-600/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300 backdrop-blur-md font-mono">
                Get Started
              </span>

              <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-white">
                Ready to Schedule Your{" "}
                <span className="font-editorial italic font-normal text-blue-400">
                  Next Repair?
                </span>
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm sm:leading-relaxed text-slate-300">
                Explore available repair services in your area or register as an
                independent technician to start accepting client requests.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row">
                <Link
                  href="/services"
                  className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm sm:text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500"
                >
                  <span>Explore Services</span>
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/sign-up"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 px-7 py-3 text-sm sm:text-base font-semibold text-white backdrop-blur-md transition-all hover:border-slate-500 hover:bg-slate-800"
                >
                  <span>Become a Technician</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
