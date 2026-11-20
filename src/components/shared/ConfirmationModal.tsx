"use client";

import { useEffect } from "react";
import { AlertCircle, AlertTriangle, Loader2, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
  isLoading?: boolean;
  error?: string | null;
  variant?: "danger" | "warning";
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loadingText = "Processing...",
  isLoading = false,
  error = null,
  variant = "danger",
}: ConfirmationModalProps) {
  // Handle escape key to close safely
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm transition-opacity"
      onClick={(e) => {
        // Clicking backdrop cancels/closes without triggering the action
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-950/40 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Variant Accent Bar */}
        <div
          className={`h-1.5 w-full ${
            isDanger
              ? "bg-gradient-to-r from-rose-600 via-red-500 to-rose-600"
              : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500"
          }`}
        />

        <div className="p-6 sm:p-7">
          {/* Close icon button */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close dialog"
            className="absolute top-5 right-5 rounded-xl border border-slate-200/80 bg-slate-50 p-2 text-slate-400 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} />
          </button>

          <div className="flex items-start gap-4">
            {/* Warning / Danger Icon */}
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-4 ${
                isDanger
                  ? "bg-rose-50 text-rose-600 ring-rose-50/70"
                  : "bg-amber-50 text-amber-600 ring-amber-50/70"
              }`}
            >
              <AlertTriangle size={23} strokeWidth={2.2} />
            </div>

            <div className="flex-1 pr-6">
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                  isDanger
                    ? "bg-rose-50 text-rose-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {isDanger ? "Confirm Action" : "Please Confirm"}
              </span>

              <h3
                id="modal-title"
                className="mt-1.5 text-lg font-extrabold leading-snug text-slate-900"
              >
                {title}
              </h3>

              <p
                id="modal-description"
                className="mt-2 text-sm leading-relaxed text-slate-600"
              >
                {description}
              </p>
            </div>
          </div>

          {/* Error message banner if action failed */}
          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs font-semibold text-rose-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${
                isDanger
                  ? "bg-rose-600 shadow-rose-600/25 hover:bg-rose-700 focus:ring-rose-400"
                  : "bg-amber-600 shadow-amber-600/25 hover:bg-amber-700 focus:ring-amber-400"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{loadingText}</span>
                </>
              ) : (
                <span>{confirmText}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}