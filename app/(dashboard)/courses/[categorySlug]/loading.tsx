import { Skeleton } from "@/components/ui/skeleton";

export default function TopicsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <Skeleton className="h-4 w-48 rounded-lg" />

      {/* Header skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4 rounded-xl" />
        <Skeleton className="h-6 w-1/2 rounded-xl" />
      </div>

      {/* List skeleton */}
      <div className="space-y-4 mt-8">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
