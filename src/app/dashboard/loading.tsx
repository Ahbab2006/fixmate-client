export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8 pb-10">
      {/* ================= TOP DARK BANNER SKELETON ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-blue-600/20 blur-[90px]" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="h-6 w-32 rounded-full bg-white/10" />
            <div className="h-8 w-60 rounded-xl bg-white/15 sm:w-72" />
            <div className="h-4 w-80 max-w-full rounded-lg bg-white/10" />
          </div>

          <div className="h-10 w-28 rounded-xl bg-white/10" />
        </div>
      </div>

      {/* ================= 4 KPI CARDS SKELETON ================= */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
            </div>
            <div className="mt-4 h-8 w-16 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-3 w-28 rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
        ))}
      </div>

      {/* ================= TABLE / LIST CARD SKELETON ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-5 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="space-y-2">
            <div className="h-5 w-40 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-56 rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
          <div className="h-9 w-32 rounded-xl bg-slate-200/80 dark:bg-slate-800" />
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100 px-6 dark:divide-slate-800">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 py-4">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/5 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-1/4 rounded bg-slate-100 dark:bg-slate-800/60" />
              </div>
              <div className="hidden h-4 w-28 rounded bg-slate-100 dark:bg-slate-800/60 md:block" />
              <div className="hidden h-5 w-16 rounded bg-slate-200 dark:bg-slate-800 sm:block" />
              <div className="h-7 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}