export default function Loading() {
  return (
    <main className="min-h-[60vh] bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mx-auto h-9 w-64 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mx-auto mt-4 h-4 w-80 max-w-full rounded bg-slate-200 dark:bg-slate-800" />

        <div className="mx-auto mt-8 h-12 max-w-xl rounded-xl bg-slate-200 dark:bg-slate-800" />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="h-44 w-full bg-slate-200 dark:bg-slate-800" />

              <div className="space-y-3 p-5">
                <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-5 h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
