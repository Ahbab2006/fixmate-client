"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

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
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle size={40} className="text-red-600" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
          Something went wrong
        </h1>

        <p className="mt-3 leading-7 text-gray-600">
          We could not load this page. Please try again, or head back to the
          home page if the problem continues.
        </p>

        {process.env.NODE_ENV === "development" && error instanceof Error && (
          <pre className="mt-4 max-h-32 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-gray-50 px-4 py-3 text-left text-xs text-gray-500">
            {error.message}
          </pre>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => retry()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={18} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
