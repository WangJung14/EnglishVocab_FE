import { Skeleton } from "@/components/ui/skeleton";

export default function ExerciseLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-32">
      {/* Progress placeholder */}
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-pulse">
        {/* Header Header */}
        <div className="text-center space-y-4">
          <Skeleton className="h-6 w-32 mx-auto rounded-md" />
          <Skeleton className="h-10 w-3/4 mx-auto rounded-xl" />
          <Skeleton className="h-5 w-1/2 mx-auto rounded-md" />
        </div>

        {/* Card Placeholder */}
        <div className="bg-white dark:bg-card border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
           <Skeleton className="h-6 w-24 rounded-md" />
           <Skeleton className="h-8 w-full rounded-md" />
           
           <div className="space-y-4 pt-6">
             {[1, 2, 3, 4].map(i => (
               <Skeleton key={i} className="h-16 w-full rounded-2xl" />
             ))}
           </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4">
           <Skeleton className="h-12 w-32 rounded-xl" />
           <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
