export default function AdminLoading() {
  return (
    <>
      {/* Header skeleton */}
      <header className="sticky top-0 z-30 h-16 sm:h-20 bg-black/20 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="lg:hidden w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
          <div className="hidden lg:block space-y-2">
            <div className="h-5 w-32 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-3 w-56 bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="h-9 w-48 bg-white/5 rounded-full animate-pulse" />
      </header>

      {/* Content skeleton */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 mobile-l:grid-cols-2 laptop-l:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-5 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/5" />
                  <div className="w-16 h-6 rounded-full bg-white/5" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-white/5 rounded" />
                  <div className="h-7 w-32 bg-white/10 rounded-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Chart + Table skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 h-72 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="h-72 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>

          {/* Table skeleton */}
          <div className="rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden animate-pulse" style={{ animationDelay: '400ms' }}>
            <div className="h-14 border-b border-white/5 bg-white/[0.02]" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 border-b border-white/5 flex items-center px-4 gap-4">
                <div className="h-3 w-24 bg-white/5 rounded" />
                <div className="h-3 w-32 bg-white/5 rounded" />
                <div className="h-3 w-20 bg-white/5 rounded flex-1" />
                <div className="h-5 w-16 bg-white/5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
