export function SkeletonBox({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-100 rounded-lg animate-pulse ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
      <SkeletonBox className="h-4 w-2/3" />
      <SkeletonBox className="h-3 w-full" />
      <SkeletonBox className="h-3 w-4/5" />
      <div className="flex gap-2 pt-2">
        <SkeletonBox className="h-8 w-20" />
        <SkeletonBox className="h-8 w-16" />
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return <SkeletonBox className="h-40 w-full rounded-3xl mb-6" />;
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
