import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, SearchX, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found | FixMate",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-50">
          <Wrench size={52} className="text-blue-600" />

          <span className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow ring-1 ring-gray-100">
            <SearchX size={20} className="text-red-500" />
          </span>
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-widest text-blue-600">
          Error 404
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          This page needs a repair
        </h1>

        <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
          We could not find the page you are looking for. It may have been
          moved, removed, or the link might be broken.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Browse Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
