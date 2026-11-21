"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Home,
  RefreshCw,
  ShieldAlert,
  Terminal,
} from "lucide-react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-slate-50 px-4 py-16 sm:px-6 dark:bg-slate-950">
      {/* Ambient Glows & Subtle Grid */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-rose-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 -bottom-24 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:36px_36px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" />

      {/* Error Card */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-2xl dark:shadow-slate-950/60 sm:p-10">
        {/* Icon Emblem */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/60 dark:bg-rose-950/60 dark:text-rose-400 dark:ring-rose-900/30">
          <AlertTriangle size={40} strokeWidth={2.2} />
        </div>

        {/* Status Pill */}
        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-500/20">
          <ShieldAlert size={13} />
          <span>Unexpected Error</span>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
          We couldn&apos;t load this page properly. Please try refreshing the
          view, or return to the home page if the issue persists.
        </p>

        {/* Development Error Log Box */}
        {process.env.NODE_ENV === "development" && error instanceof Error && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-left dark:border-slate-800">
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-3.5 py-2 text-[11px] font-semibold text-slate-400">
              <Terminal size={13} className="text-rose-400" />
              <span>Development Error Trace</span>
            </div>
            <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-xs text-rose-300">
              {error.message}
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => retry()}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:from-blue-500 hover:to-indigo-500"
          >
            <RefreshCw
              size={17}
              className="transition-transform duration-300 group-hover:rotate-180"
            />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <Home size={17} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}