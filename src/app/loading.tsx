export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF]">
      {/* Sidebar skeleton */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-[#2B6477] min-h-screen">
        <div className="px-6 py-7">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full border-2 border-white/40" />
            <span className="h-4 w-24 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
        <div className="px-3 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-9 bg-white/10 rounded-lg animate-pulse" />
          ))}
        </div>
      </aside>

      {/* Content skeleton */}
      <div className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-6xl">
        <div className="h-40 w-full bg-gray-100 rounded-3xl animate-pulse mb-6" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
