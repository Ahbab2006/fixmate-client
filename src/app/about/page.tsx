import Link from "next/link";
import {
  Target,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Users,
  Wrench,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-slate-950 px-4 pt-20 pb-24 text-white sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
        {/* Ambient Glows & Subtle Grid */}
        <div className="pointer-events-none absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-indigo-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-md">
            <Sparkles size={15} className="text-blue-400" />
            <span>About FixMate</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.12]">
            Making Home Services{" "}
            <span className="block bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Easier &amp; Better
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            FixMate is a modern home service platform that connects customers
            with skilled, vetted technicians for reliable repair and
            maintenance solutions.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/services"
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-500"
            >
              Explore Our Services
              <ArrowRight
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-7 py-4 text-base font-semibold text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-slate-500 hover:bg-slate-800 hover:text-white"
            >
              Join as Technician
            </Link>
          </div>
        </div>
      </section>

      {/* ================= OUR STORY SECTION ================= */}
      <section className="bg-white px-4 py-20 transition-colors duration-200 dark:bg-slate-900 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-12">
          {/* Left Narrative */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-600 ring-1 ring-blue-600/15 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-500/20">
              Who We Are
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              About Our Platform
            </h2>

            <p className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Finding a reliable technician for home repairs can be
              challenging. FixMate aims to make that process simple by bringing
              customers and skilled service providers together in one trusted
              platform.
            </p>

            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              From smartphone and laptop repairs to essential home appliance
              maintenance, customers can explore services, submit booking
              requests, and track their service progress conveniently from
              start to finish.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-7 dark:border-slate-800">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle2 size={18} className="shrink-0 text-blue-600 dark:text-blue-400" />
                <span>Verified Specialists</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle2 size={18} className="shrink-0 text-blue-600 dark:text-blue-400" />
                <span>Transparent Pricing</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle2 size={18} className="shrink-0 text-blue-600 dark:text-blue-400" />
                <span>Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle2 size={18} className="shrink-0 text-blue-600 dark:text-blue-400" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Right Bento Grid */}
          <div className="relative lg:col-span-6">
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-blue-600/10 via-indigo-500/10 to-sky-400/10 blur-2xl" />

            <div className="relative rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-9 dark:border-slate-800 dark:bg-slate-950/80">
              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-6 transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <Wrench size={24} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    Repair Services
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    7+ specialized home &amp; tech service categories
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-6 transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <Users size={24} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    Skilled Technicians
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    Connecting homeowners with vetted professionals
                  </p>
                </div>

                <div className="col-span-2 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-7 text-white shadow-lg">
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30">
                        <HeartHandshake size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Customer First Approach
                        </h3>
                        <p className="mt-1 text-sm text-slate-300">
                          Focused on convenient, transparent, and reliable
                          service experiences.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION & VISION SECTION ================= */}
      <section className="border-y border-slate-200/70 bg-slate-50/80 px-4 py-20 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-blue-100/70 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              Our Purpose
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Our Mission &amp; Vision
            </h2>

            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              Driven by trust, technology, and a commitment to seamless home
              maintenance.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {/* Mission Card */}
            <div className="group rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 sm:p-10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 transition-transform duration-300 group-hover:scale-110">
                <Target size={26} />
              </div>

              <h3 className="mt-7 text-2xl font-bold text-slate-900 dark:text-white">
                Our Mission
              </h3>

              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                To simplify home repair services by making it effortless for
                customers to discover, request, and manage professional repair
                solutions with complete confidence.
              </p>
            </div>

            {/* Vision Card */}
            <div className="group rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 sm:p-10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20 transition-transform duration-300 group-hover:scale-110">
                <Eye size={26} />
              </div>

              <h3 className="mt-7 text-2xl font-bold text-slate-900 dark:text-white">
                Our Vision
              </h3>

              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                To become the most trusted home care ecosystem where customers
                reliably find dependable technicians and skilled professionals
                grow sustainable service careers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CORE VALUES SECTION ================= */}
      <section className="bg-white px-4 py-20 transition-colors duration-200 dark:bg-slate-900 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-600 ring-1 ring-blue-600/15 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-500/20">
              What Matters to Us
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Our Core Values
            </h2>

            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              The principles that guide every repair, booking, and interaction
              on FixMate.
            </p>
          </div>

          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {/* Value 1 */}
            <div className="group rounded-3xl border border-slate-200/80 bg-slate-50/60 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:bg-slate-950 dark:hover:border-blue-500/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110">
                <ShieldCheck size={28} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                Trust &amp; Safety
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                We emphasize strict service approval, verified technician
                profiles, and responsible platform management.
              </p>
            </div>

            {/* Value 2 */}
            <div className="group rounded-3xl border border-slate-200/80 bg-slate-50/60 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:bg-slate-950 dark:hover:border-blue-500/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 transition-transform duration-300 group-hover:scale-110">
                <HeartHandshake size={28} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                Customer Satisfaction
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                We aim to make every service experience transparent,
                convenient, and genuinely user-friendly.
              </p>
            </div>

            {/* Value 3 */}
            <div className="group rounded-3xl border border-slate-200/80 bg-slate-50/60 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 sm:col-span-2 lg:col-span-1 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:bg-slate-950 dark:hover:border-blue-500/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400 transition-transform duration-300 group-hover:scale-110">
                <Users size={28} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                Professional Growth
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                We empower skilled technicians with meaningful opportunities to
                connect with customers and grow their business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA SECTION ================= */}
      <section className="bg-white px-4 pb-20 transition-colors duration-200 dark:bg-slate-900 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-16 text-center shadow-2xl sm:px-12 lg:py-20">
            {/* Ambient Glows */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-600/25 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 backdrop-blur-md">
                Get Started Today
              </span>

              <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to Experience{" "}
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  FixMate?
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300">
                Explore our curated services and find the right verified
                professional for your home repair needs.
              </p>

              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/services"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500"
                >
                  Explore Services
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:border-slate-500 hover:bg-slate-800"
                >
                  Become a Technician
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}