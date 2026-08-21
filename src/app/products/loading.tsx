export default function ProductsLoading() {
  return (
    <div className="min-h-screen pt-24 tablet:pt-28 pb-24 aurora-bg">
      <div className="container-app">
        {/* Header Skeleton */}
        <div className="mb-8 tablet:mb-10 text-center tablet:text-left">
          <div className="h-6 w-36 bg-muted/60 rounded-full animate-pulse mb-4 mx-auto tablet:mx-0" />
          <div className="h-9 w-64 bg-muted/60 rounded-xl animate-pulse mb-2 mx-auto tablet:mx-0" />
          <div className="h-4 w-96 max-w-full bg-muted/50 rounded animate-pulse mx-auto tablet:mx-0" />
        </div>

        {/* Search & Tabs Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-12 w-full bg-card/60 rounded-2xl animate-pulse border border-border/50" />
          <div className="flex gap-2.5 overflow-hidden pb-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-9 w-28 bg-card/60 rounded-full animate-pulse flex-shrink-0 border border-border/40" />
            ))}
          </div>
        </div>

        {/* Grid Skeleton (6 Cols) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 tablet:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 tablet:gap-4 pb-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-card/50 border border-border/60 overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted/40" />
              <div className="p-3.5 space-y-2">
                <div className="h-4 w-3/4 bg-muted/60 rounded" />
                <div className="h-3 w-1/2 bg-muted/40 rounded" />
                <div className="h-4 w-2/3 bg-primary/20 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
