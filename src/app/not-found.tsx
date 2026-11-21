import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, SearchX, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found | FixMate",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-slate-50 px-4 py-16 sm:px-6 dark:bg-slate-950">
      {/* Ambient Glows & Subtle Grid */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 -bottom-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:36px_36px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" />

      {/* 404 Card */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-2xl dark:shadow-slate-950/60 sm:p-10">
        {/* Dual Icon Emblem */}
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 ring-8 ring-blue-50/70 dark:from-blue-950/60 dark:to-indigo-950/60 dark:text-blue-400 dark:ring-blue-900/30">
          <Wrench size={44} strokeWidth={2.1} />

          <span className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-slate-200/80 dark:bg-slate-800 dark:ring-slate-700">
            <SearchX size={19} className="text-rose-500 dark:text-rose-400" />
          </span>
        </div>

        {/* Error 404 Badge */}
        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-blue-700 ring-1 ring-blue-600/15 dark:bg-blue-950/60 dark:text-blue-300 dark:ring-blue-500/20">
          <span>Error 404</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          This page needs a{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            repair
          </span>
        </h1>

        <p className="mx-auto mt-3.5 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
          We couldn&apos;t find the page you&apos;re looking for. It may have
          been moved, removed, or the link might be broken.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:from-blue-500 hover:to-indigo-500"
          >
            <Home size={17} />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/services"
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500/40 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <span>Browse Services</span>
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}