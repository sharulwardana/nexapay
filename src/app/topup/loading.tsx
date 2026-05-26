export default function TopUpLoading() {
  return (
    <div className="container-app pt-24 pb-20">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-4 w-24 bg-muted rounded animate-pulse mb-3" />
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 mb-8 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-24 bg-muted rounded-full animate-pulse flex-shrink-0" />
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-3 tablet:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 tablet:gap-4">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="block">
            <div className="aspect-[3/4] rounded-xl tablet:rounded-2xl bg-muted animate-pulse mb-2.5" />
            <div className="h-3 w-3/4 bg-muted rounded animate-pulse mb-1.5" />
            <div className="h-2 w-1/2 bg-muted rounded animate-pulse mb-2" />
            <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
