export default function SkeletonCard() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="h-48 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
        <div className="h-3 skeleton rounded w-2/3" />
        <div className="h-1 skeleton rounded" />
        <div className="flex justify-between items-center">
          <div className="h-6 skeleton rounded w-24" />
          <div className="h-9 skeleton rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
