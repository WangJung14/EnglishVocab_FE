'use client';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Streak Card Skeleton */}
      <div className="w-full h-28 rounded-xl animate-pulse bg-muted" />

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="h-32 rounded-xl animate-pulse bg-muted" />
        <div className="h-32 rounded-xl animate-pulse bg-muted" />
        <div className="h-32 rounded-xl animate-pulse bg-muted" />
        <div className="h-32 rounded-xl animate-pulse bg-muted" />
      </div>

      {/* Chart Skeleton */}
      <div className="w-full h-64 rounded-xl animate-pulse bg-muted" />
    </div>
  );
}
