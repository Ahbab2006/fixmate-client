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
    <footer className="relative overflow-hidden border-t border-slate-200/80 bg-slate-50 text-slate-600 transition-colors duration-200 dark:border-slate-800/80 dark:bg-slate-950/90 dark:text-slate-300">
      {/* Subtle Ambient Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-blue-600/5 blur-[120px] dark:bg-blue-500/10" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-indigo-600/5 blur-[120px] dark:bg-indigo-500/10" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Information */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="FixMate Home"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105">
                <Wrench size={20} />
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Fix
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-sky-300">
                  Mate
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Your trusted on-demand home service partner. Connect with
              background-verified technicians for fast, transparent, and guaranteed
              repair solutions.
            </p>

            {/* Trust Pill */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
              <ShieldCheck size={14} className="text-blue-600 dark:text-blue-400" />
              <span>100% Background-Verified Specialists</span>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-2.5">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/50 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                <FaFacebookF size={15} />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-500/50 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-transparent"
              >
                <FaInstagram size={16} />
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-900"
              >
                <FaXTwitter size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="inline-block text-slate-600 transition-colors duration-200 hover:translate-x-0.5 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="inline-block text-slate-600 transition-colors duration-200 hover:translate-x-0.5 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Explore Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="inline-block text-slate-600 transition-colors duration-200 hover:translate-x-0.5 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@fixmate.com"
                  className="inline-block text-slate-600 transition-colors duration-200 hover:translate-x-0.5 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="inline-block text-slate-600 transition-colors duration-200 hover:translate-x-0.5 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Become a Technician
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Categories */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Our Services
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              {footerCategories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/services?category=${encodeURIComponent(category)}`}
                    className="inline-block text-slate-600 transition-colors duration-200 hover:translate-x-0.5 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Contact Us
            </h3>

            <ul className="mt-5 space-y-3.5 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400">
                  <Mail size={15} />
                </span>
                <a
                  href="mailto:support@fixmate.com"
                  className="text-slate-700 transition-colors duration-200 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                >
                  support@fixmate.com
                </a>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400">
                  <Phone size={15} />
                </span>
                <a
                  href="tel:+8801XXXXXXXXX"
                  className="text-slate-700 transition-colors duration-200 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                >
                  +880 1XXXXXXXXX
                </a>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400">
                  <MapPin size={15} />
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  Dhaka, Bangladesh
                </span>
              </li>
            </ul>

            <a
              href="mailto:support@fixmate.com"
              className="group mt-6 inline-flex items-center gap-2 rounded-xl border border-blue-600/20 bg-blue-50/70 px-4 py-2.5 text-xs font-semibold text-blue-700 shadow-xs transition-all duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white"
            >
              Get in Touch
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="relative border-t border-slate-200/80 bg-slate-100/70 dark:border-slate-800/80 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8 dark:text-slate-400">
          <p className="font-mono">© 2026 FixMate. All rights reserved.</p>

          <p className="text-slate-600 dark:text-slate-400">
            Crafted with care for seamless home repairs and verified technician booking.
          </p>
        </div>
      </div>
    </footer>
  );
}
