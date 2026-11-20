export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6 p-4 sm:p-6">
      <div>
        <div className="h-8 w-56 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-gray-200" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-100 bg-white p-5"
          >
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="mt-4 h-8 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="h-5 w-40 rounded bg-gray-200" />

        <div className="mt-6 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />
              <div className="h-4 flex-1 rounded bg-gray-200" />
              <div className="hidden h-4 w-24 rounded bg-gray-200 sm:block" />
              <div className="h-6 w-20 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
