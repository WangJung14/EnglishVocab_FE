import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function LessonLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <Skeleton className="h-4 w-64 rounded-xl" />

      {/* Header Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4 rounded-xl" />
        <Skeleton className="h-6 w-32 rounded-xl" />
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Content Skeleton (simulate Vocab Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i} className="border shadow-none">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="space-y-2 w-full">
                   <Skeleton className="h-6 w-24" />
                   <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0 ml-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
