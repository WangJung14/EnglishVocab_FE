import { Skeleton } from "@/components/ui/skeleton";

export default function SyllabusLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-12 animate-pulse">
      <Skeleton className="h-4 w-48 rounded-lg mx-auto" />

      <div className="space-y-4 text-center">
        <Skeleton className="h-10 w-2/3 mx-auto rounded-xl" />
        <Skeleton className="h-6 w-1/3 mx-auto rounded-xl" />
      </div>

      <div className="space-y-8 pl-8 border-l-4 border-muted/50">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="relative">
            <div className="absolute -left-[42px] top-1 h-8 w-8 rounded-full bg-muted shadow-lg" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
