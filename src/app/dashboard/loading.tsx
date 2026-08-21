export default function DashboardLoading() {
  return (
    <div className="min-h-screen pt-28 tablet:pt-30 pb-24 aurora-bg">
      <div className="container-app max-w-5xl space-y-6">
        {/* Top Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-44 rounded-3xl bg-card/60 border border-border/60 animate-pulse p-6" />
          <div className="h-44 rounded-3xl bg-card/60 border border-border/60 animate-pulse p-6" />
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-card/50 border border-border/50 animate-pulse" />
          ))}
        </div>

        {/* Recent Transactions Table Skeleton */}
        <div className="h-64 rounded-3xl bg-card/60 border border-border/60 animate-pulse" />
      </div>
    </div>
  );
}
