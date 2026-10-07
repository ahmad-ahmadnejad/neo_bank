export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse w-full">
      {/* Header Skeleton */}
      <header className="space-y-3">
        <div className="h-10 w-64 bg-white/10 rounded-xl"></div>
        <div className="h-4 w-48 bg-white/5 rounded-lg"></div>
      </header>

      {/* KPIs Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-white/5 p-6 rounded-3xl h-[170px] flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/5"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-white/5 rounded-lg"></div>
              <div className="h-8 w-40 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-white/5 p-6 rounded-3xl h-[450px] flex flex-col gap-6">
          <div className="h-6 w-40 bg-white/10 rounded-xl"></div>
          <div className="flex-1 w-full bg-white/5 rounded-full mt-4 mx-auto max-w-[260px] aspect-square"></div>
        </div>
        <div className="bg-surface border border-white/5 p-6 rounded-3xl h-[450px] flex flex-col gap-6">
          <div className="h-6 w-40 bg-white/10 rounded-xl"></div>
          <div className="flex-1 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full h-16 bg-white/5 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
