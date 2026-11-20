"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wrench,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const footerCategories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export default function Footer() {
  const pathname = usePathname();

  // Hide public footer on all dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-slate-300">
      {/* Subtle Ambient Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-10 bottom-0 h-64 w-64 rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Information */}
          <div className="lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 transition-transform duration-300 group-hover:scale-105">
                <Wrench size={20} />
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Fix
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  Mate
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              Your trusted home service partner. Connect with background-verified
              technicians for fast, transparent, and reliable repair solutions.
            </p>

            {/* Trust Pill */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-300">
              <ShieldCheck size={15} className="text-blue-400" />
              <span>100% Verified Home Specialists</span>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-blue-600 hover:text-white"
              >
                <FaFacebookF size={17} />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-500/40 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-800 hover:text-white"
              >
                <FaXTwitter size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-3.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 transition-colors hover:text-blue-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-slate-400 transition-colors hover:text-blue-400"
                >
                  Explore Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 transition-colors hover:text-blue-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@fixmate.com"
                  className="text-slate-400 transition-colors hover:text-blue-400"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="text-slate-400 transition-colors hover:text-blue-400"
                >
                  Become a Technician
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Categories */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Our Services
            </h3>

            <ul className="mt-6 space-y-3.5 text-sm">
              {footerCategories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/services?category=${encodeURIComponent(category)}`}
                    className="text-slate-400 transition-colors hover:text-blue-400"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact Us
            </h3>

            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-center gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                  <Mail size={16} />
                </span>
                <a
                  href="mailto:support@fixmate.com"
                  className="text-slate-300 transition-colors hover:text-blue-400"
                >
                  support@fixmate.com
                </a>
              </li>

              <li className="flex items-center gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                  <Phone size={16} />
                </span>
                <a
                  href="tel:+8801XXXXXXXXX"
                  className="text-slate-300 transition-colors hover:text-blue-400"
                >
                  +880 1XXXXXXXXX
                </a>
              </li>

              <li className="flex items-center gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                  <MapPin size={16} />
                </span>
                <span className="text-slate-300">Bangladesh</span>
              </li>
            </ul>

            <a
              href="mailto:support@fixmate.com"
              className="group mt-7 inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-300 transition-all hover:border-blue-400 hover:bg-blue-600 hover:text-white"
            >
              Get in Touch
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="relative border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 FixMate. All rights reserved.</p>

          <p className="text-slate-400">
            Crafted with care for seamless home services.
          </p>
        </div>
      </div>
    </footer>
  );
}